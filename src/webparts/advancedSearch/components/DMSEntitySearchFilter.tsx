import * as React from 'react';
import { useState, useEffect } from 'react';
// import { getSP } from "../loc/pnpjsConfig";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/sites";
import "bootstrap/dist/css/bootstrap.min.css";
import { BaseWebPartContext, WebPartContext } from '@microsoft/sp-webpart-base';
import { getSP } from '../../dmsMusaib/loc/pnpjsConfig';
import { DMSEntityConfigurationHelper } from '../../../Shared/DMSEntityConfigurationHelper';
import { IContextInfo } from '@pnp/sp/context-info';
// import { IContextInfo } from "@pnp/sp/sites";

export interface TreeNode {
  key: string;
  text: string;
  children?: TreeNode[];
  checked?: boolean;
}

export interface ITreeViewProps
{
  context:BaseWebPartContext
  onFieldSelect?: (field: string) => void;

}

export const DMSEntitySearchTreeView: React.FC<ITreeViewProps> = (props:ITreeViewProps) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null);
  const [fields, setFields] = useState<{ key: string; text: string }[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);


  const sp: SPFI = getSP(props.context as WebPartContext);
  const confighelper=new DMSEntityConfigurationHelper(props.context);
  useEffect(() => {
    // Fetch sites as top-level nodes
    // let confighelper=new DMSEntityConfigurationHelper(props.context);
    confighelper.GetActivEnitities().then(items => {
        const sites = items.map(item => ({ key: ''+item.SiteID, text: item.Title, children: [], checked: false }));
        setTreeData(sites);
    });
  }, []);

  const fetchDocumentLibraries = async (siteId: string):Promise<any[]> => {
    console.log("siteId",siteId);   
    let  libs=await confighelper.GetActiveEntityDocLibsBySiteId(siteId);
    return libs.map(lib => ({ key: lib.ID, text: lib.DocumentLibraryName, children: [], checked: false }));
  };

  // const fetchFields = async (siteid:string,libraryId: string) => {
  //   let web1=await sp.site.openWebById(siteid);
  //   const fields = await web1.web.lists.getById(libraryId).fields.filter("Hidden eq false").select('InternalName', 'Title')();
  //   setFields(fields.map(field => ({ key: field.InternalName, text: field.Title })));
  // };
  const fetchFields = async (siteid:string,libraryId: string) => {
   
    const fields = await confighelper.GetActiveEntityDocLibsSearchFields(siteid,libraryId);
    setFields(fields.map(field => ({ key: field.SearchMappedManagedProperty, text: field.ColumnName })));
  };

  const handleFieldSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(event.target.value);
  };

  const handleButtonClick = () => {
    let fielddrpdonw=document.getElementById('FieldSelectDropdown') as HTMLSelectElement;
    if (fielddrpdonw.value) {
      if(props.onFieldSelect) props.onFieldSelect(fielddrpdonw.value);
    }
  };

//   const handleLibrarySelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const libraryId = event.target.value;
//     setSelectedLibrary(libraryId);

//     if (libraryId) {
//       await fetchFields(libraryId);
//     } else {
//       setFields([]);
//     }
//   };

  
//   const fetchFolders = async (libraryId: string) => {
//     const folders = await sp.web.lists.getById(libraryId).items.filter("FSObjType eq 1").select('ID', 'Title').get();
//     return folders.map(folder => ({ key: folder.ID, text: folder.Title, checked: false }));
//   };

  const handleSiteCheck = async (siteIndex: number) => {
    const updatedTree = [...treeData];
    const site = updatedTree[siteIndex];
    site.checked = !site.checked;

    if (site.checked && site.children && site.children.length === 0) {
      site.children = await fetchDocumentLibraries(site.text);
    }

    setTreeData(updatedTree);
  };

  

  const handleLibraryCheck = async (siteIndex: number, libraryIndex: number,siteid:string,libraryid:string) => {
     const updatedTree = [...treeData];
     console.log(siteid,libraryid);
    const library = updatedTree[siteIndex].children![libraryIndex];
    library.checked = !library.checked;

    if (library.checked && library.children && library.children.length === 0) {
      //library.children = await fetchFolders(library.key);
    }

     setTreeData(updatedTree);
     if (libraryid) {
        await fetchFields(siteid,libraryid);
      } else {
        setFields([]);
      }
  };

  return (
    <div className="container">
      {treeData.map((site, siteIndex) => (
        // <div key={site.key} className="form-check">
        <div key={site.text} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={site.checked}
            onChange={() => handleSiteCheck(siteIndex)}
          />
          <label className="form-check-label">{site.text}</label>
          {site.children && site.children.map((library, libraryIndex) => (
            <div key={library.key} className="ms-3 form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={library.checked}
                onChange={() => handleLibraryCheck(siteIndex, libraryIndex,site.text,library.text)}
              />
              <label className="form-check-label">{library.text}</label>
              {library.children && library.children.map(folder => (
                <div key={folder.key} className="ms-4 form-check">
                  <input className="form-check-input" type="checkbox" checked={folder.checked} readOnly />
                  <label className="form-check-label">{folder.text}</label>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}     
      <div className="mb-3">
        <label className="form-label">Fields</label>
        <select id='FieldSelectDropdown' className="form-select" onChange={handleFieldSelect} value={selectedField || ''}>
          {fields.map(field => (
            <option key={field.key} value={field.key}>{field.text}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" onClick={handleButtonClick}>Submit Field</button>
    </div>
  );
};

