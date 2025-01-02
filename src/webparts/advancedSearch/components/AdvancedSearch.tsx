import * as React from 'react';
import styles from './AdvancedSearch.module.scss';
import type { IAdvancedSearchProps } from './IAdvancedSearchProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "bootstrap/dist/css/bootstrap.min.css";
import { GraphSearchHelper } from '../../../Shared/SearchHelper1';
import { BaseWebPartContext } from '@microsoft/sp-webpart-base';
import { IDocumentDisplayFields } from '../../dmsMusaib/components/DMSSearch/Interfaces';
import { ISearchHitResource } from '../../../Shared/SearchHelperInterfaces';
// import { DMSEntityConfigurationHelper } from '../../../Shared/DMSEntityConfigurationHelper';
import { SearchAggregation } from '@microsoft/microsoft-graph-types';
import { DMSEntityConfigurationHelper } from '../../../Shared/DMSEntityConfigurationHelper';
import { DateRangeFilter } from './DateRangeFilter';
import { DMSEntitySearchTreeView } from './DMSEntitySearchFilter';
// import { DateRangeFilter } from './DateRangeFilter';

export interface IAdvancedSearchState {   
    searchtext: string;
    searchfilter:string;
    searchpath:string;
    searchresult: IDocumentDisplayFields[];
    searchqueryRefiners?:string[],
    searchRefiners?:SearchAggregation[],
    searchRefinerFilters?:string[]
}

export const getUrlParameter=(name:string)=>{
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

export default class AdvancedSearch extends React.Component<IAdvancedSearchProps,IAdvancedSearchState> {
  
  public constructor(props: IAdvancedSearchProps) {
    super(props);
    this.state = {
      searchtext: "",
      searchfilter: "",
      searchpath: props.context.pageContext.site.absoluteUrl, //"https://officeindia.sharepoint.com/sites/AlRostmani",
      searchresult: [],
      searchqueryRefiners:[],
      searchRefiners:[],
      searchRefinerFilters:[]
    };

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

   componentDidMount(): void {
   
    let _searchquery:string,_searchpath:string;
    let searchqueryfromurl=getUrlParameter("searchquery");
    let searchpathfromurl=getUrlParameter("searchpath");
    _searchquery=(searchqueryfromurl)?decodeURIComponent(searchqueryfromurl):this.state.searchfilter;
    _searchpath=(searchpathfromurl)?decodeURIComponent(searchpathfromurl):this.state.searchpath;
    //let dmsentityconfig=new DMSEntityConfigurationHelper(this.props.context);
    //let props=await dmsentityconfig.GetActiveEntityListsAndColumns();
    // dmsentityconfig.GetActiveEntityListsAndColumns().then(props=>{
    //   let qrefiners=props.map(prp=>prp.SearchMappedManagedProperty);
    //     this.setState({searchqueryRefiners:qrefiners})
    //     this.runSearch(_searchquery,"",_searchpath,qrefiners,this.state.searchRefinerFilters);

    // })
    this.runSearch(_searchquery,"",_searchpath,this.state.searchqueryRefiners,this.state.searchRefinerFilters);
      
   }

  runSearch=async (searchtext:string,searchFilters:string,searchPath:string,refiners:string[]=[],refinerfilters:string[]=[])=>{

    let qyerytext=`${searchtext} IsDocument:True ${searchFilters} Path:"${searchPath}"`;
    //let dmsentityconfig=new DMSEntityConfigurationHelper(this.props.context);
    //let props=await dmsentityconfig.GetActiveEntityListsAndColumns();
    
    //let qyerytext=`${searchtext} IsDocument:True ${searchFilters} Path:"https://officeindia.sharepoint.com/sites/AlRostmani/TestHub"`;
    let graphcl=await (this.props.context as BaseWebPartContext).msGraphClientFactory.getClient("3");
    let mssearch=new GraphSearchHelper(graphcl);
    // let searchres=await mssearch.searchFiles("IsDocument:True Path:https://officeindia.sharepoint.com/sites/AlRostmani/TestHub",100);
    let hitcont=await mssearch.searchAll(qyerytext,500,refiners,refinerfilters);  
    //hitcont.aggregations
    const searchres=(hitcont.hits)?hitcont.hits:[]
      const results: Partial<ISearchHitResource>[] = (hitcont.hits)?hitcont.hits.map((hit) => {
        const resource:Partial<ISearchHitResource> = hit.resource as ISearchHitResource;   
             
        return resource;
        // return {
        //   name: resource.name,
        //   webUrl: resource.webUrl,
        //   lastModifiedDateTime: resource.lastModifiedDateTime,
        //   createdBy: resource.createdBy?.user?.displayName || 'Unknown'
        // };
      }):[];


    let resultsdoc: IDocumentDisplayFields[] = searchres.map(filehit => {
      let file:Partial<ISearchHitResource>=filehit.resource;
      let tRes: IDocumentDisplayFields = {
        Title: file.name,
        Size: file.size,
        Extension: file.name.split('.').pop(),
        Path:file.webUrl,
        Summary:filehit.summary
      }
      return tRes;
    })

    this.setState({searchresult:resultsdoc});
    this.setState({searchRefiners:hitcont.aggregations});

  } 

  SearchClickHandler:React.MouseEventHandler=(ev)=>{

    ev.preventDefault();
    //this.setState({searchtext:(ev.target as HTMLInputElement).value});
    // this.runSearch(this.state.searchtext,this.state.searchfilter,this.state.searchpath);
    this.runSearch(this.state.searchtext,this.state.searchfilter,this.state.searchpath,this.state.searchqueryRefiners,this.state.searchRefinerFilters);



  }

  SearchTextChangeHandler:React.ChangeEventHandler=(ev)=>
  {
    this.setState({searchtext:(ev.target as HTMLInputElement).value});

  }

  handleDateTimeFilter=(filter:string)=>{
  
     this.setState({searchfilter:filter });
     this.runSearch(this.state.searchtext,filter,this.state.searchpath,this.state.searchqueryRefiners,this.state.searchRefinerFilters);
    

  }

  handleCheckboxChange = (refinerName: string, value: string, checked: boolean) => {
    console.log(refinerName);
    let refinementfilterstring=`${refinerName}:${value}`;
    let updatedFilters = this.state.searchRefinerFilters ;
    
    if (checked) {
        if (!updatedFilters.includes(refinementfilterstring)) {
            updatedFilters.push(refinementfilterstring);
        }
    } else {
        const index = updatedFilters.indexOf(refinementfilterstring);

        // Remove the item if found
        if (index > -1) {
          updatedFilters.splice(index, 1);
        }        
    }

    this.setState({searchRefinerFilters:updatedFilters});
    //this.runSearch(_searchquery,"",_searchpath,qrefiners,this.state.searchRefinerFilters);
    this.runSearch(this.state.searchtext,this.state.searchfilter,this.state.searchpath,this.state.searchqueryRefiners,updatedFilters);


    //setSelectedFilters(updatedFilters);
    //onRefinerChange(updatedFilters); // Send selected refiners to parent
};
  public render(): React.ReactElement<IAdvancedSearchProps> {
    

    return (
      <section className='container-fluid'>
        <header className="bg-light p-3">
          <h1>Search</h1>
          <form>
              <div className="input-group">
                  <input type="search" className="form-control" placeholder="Search..." onChange={this.SearchTextChangeHandler}/>
                  <button className="btn btn-primary" type="button" onClick={this.SearchClickHandler}>Search</button>
              </div>
          </form>
        </header>
        <section>
          <DateRangeFilter onFilterChange={(e)=>this.handleDateTimeFilter(e)}></DateRangeFilter>
        </section>
        <main className="container mt-3">
          <section className="row">

          <section className="col-4">
          <DMSEntitySearchTreeView context={this.props.context} onFieldSelect={(fld)=>{ let selfld=this.state.searchqueryRefiners;selfld.push(fld);this.setState({searchqueryRefiners:selfld}); this.runSearch(this.state.searchtext,this.state.searchfilter,this.state.searchpath,selfld,this.state.searchRefinerFilters); }}> </DMSEntitySearchTreeView> 

          <div>
            <h5>Refiners</h5>
            {this.state.searchRefiners?.map(refiner => (
                <div key={refiner.field} className="card mb-3 p-2">
                    <h6>{refiner.field}</h6>
                    <div className="form-check">
                        {refiner.buckets.map(value => (
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    id={`${refiner.field}-${value.key}`}
                                    data-field={refiner.field}
                                    data-token={`${value.aggregationFilterToken}`}
                                    checked={this.state.searchRefinerFilters.includes(`${refiner.field}:${value.aggregationFilterToken}`)}
                                    // data-refinerquery={`${refiner.field}:${value.aggregationFilterToken}`}
                                    className="form-check-input"
                                    onChange={(e) => this.handleCheckboxChange(refiner.field, value.aggregationFilterToken, e.target.checked)}
                                />
                                <label htmlFor={`${refiner.field}-${value.key}`} className="form-check-label">
                                    {value.key}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>        

          </section>
          <section className="col-8">
            {
              this.state.searchresult.map(res=>
                <div className="col mb-4">
                    <div className="card h-100">                        
                        <div className="card-body">
                            <h5 className="card-title">{res.Title}</h5>
                            <p className="card-text">{res.Summary}</p>
                        </div>
                    </div>
                </div>
              )
            }
            </section>

          </section>
            
        </main>
      </section>
      
    );
  }
}
