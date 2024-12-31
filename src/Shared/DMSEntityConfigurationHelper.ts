//Declare Imprts

import { BaseWebPartContext, WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import { getSP } from "../webparts/dmsMusaib/loc/pnpjsConfig";


///

//Constants

export const LIST_TITLE_DMSEntitySitesMaster="MasterSiteURL";
export const LIST_TITLE_DMSEntityDocumentLibs="DMSPreviewFormMaster";

//Interface 

export interface IDMSEntity
{
    Title?:string;
    SiteID?:string;
    Active?:string;
    ID?:number;  
    FileMasterList?:string; 
}

export interface IDMSEntityList
{
    ColumnName?:string;
    SearchMappedManagedProperty?:string;
    ID?:number;  
}

export class DMSEntityConfigurationHelper
{
     sp: SPFI;
    constructor(wpcontext?:BaseWebPartContext)
    {
        this.sp=getSP(wpcontext as WebPartContext);
    }

    GetActivEnitities=async():Promise<IDMSEntity[]>=>
    {
        const FilesItems:IDMSEntity[] = await this.sp.web.lists.getByTitle(LIST_TITLE_DMSEntitySitesMaster)
         .items.select("Title", "SiteID", "FileMasterList", "Active")
         .filter(`Active eq 'Yes'`)();

         return FilesItems;

    }

    GetActiveEntityListsAndColumns=async():Promise<IDMSEntityList[]>=>
    {
        let actent=await this.GetActivEnitities();
           // Collect promises for fetching document libraries
        let promises = actent.map(async (ent) => {
            return await this.sp.web.lists
                .getByTitle(LIST_TITLE_DMSEntityDocumentLibs)
                .items.select("ColumnName", "ID", "SearchMappedManagedProperty")
                .filter(`SiteName eq '${ent.Title}'`)();
        });

        // Resolve all promises and flatten the results
        let results = (await Promise.all(promises)).flat();

         // Filter results based on SearchMappedManagedProperty
        return results.filter(ent => ent.SearchMappedManagedProperty);
    }
}



