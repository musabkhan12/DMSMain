import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFile, faImage, faClipboard, faSun, faBell, faMoon } from '@fortawesome/free-regular-svg-icons';
import "../components/VerticalSidebar.scss";
import "../../horizontalNavBar/components/horizontalNavbar.scss";
import UserContext from '../../../GlobalContext/context';
import { faBars, faChevronRight, faChevronUp, faExpand, faGear, faHome, faMicrochip, faUserGroup, faWaveSquare, faWifi } from '@fortawesome/free-solid-svg-icons';

import { SPFI } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf"
import { Airplay, Calendar, File, Image, Clipboard, Bell, Users, Activity, Sun, Moon, Cpu, Rss, Maximize, Settings, Search, ChevronsDown, ChevronDown, Menu, User, Codepen, Command } from 'react-feather';
import classNames from 'classnames'; // Assuming you use this for class management
import { getCurrentUserName } from '../../../APISearvice/CustomService';
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/photos";
import { getSP } from '../loc/pnpjsConfig';
import { FontSizes } from '@fluentui/react';
interface NavItem {
  Title: string;
  Url: string;
  Icon: string;
  ParentId?: number;
  ID: number;
}

const VerticalContext = ({ _context }: any) => {
  console.log(_context , "_context is here");
  // const graph = graphfi(...);
  const sp: SPFI = getSP();
  console.log(sp, 'sp');
  // const imgLogo = require("../assets/logoImgsm.png");
  const imgBigLogo = require("../assets/logodarkBig.png")
  // const imgLogo = require("../../../Assets/ExtraImage/logosm.png");
  const imgSMLogo = require("../assets/logoImgsm.png");
  // const useimg = require("../assets/useimg.png");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [submenuOpen, setSubmenuOpen] = React.useState<number | null>(null);
  const [navItems, setNavItems] = React.useState<NavItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const context = React.useContext(UserContext);
  const { setHide, useHide, setuseActive, useActive }: any = context;
  const { useFullscreen, toggleHide, toggleFullscreen }: any = React.useContext(UserContext);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [issearchOpen, setIsSearchOpen] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState("")
  const [currentUserProfile, setCurrentUserProfile] = React.useState("")

  const [bigLogo, setBigLogo] = React.useState("")
  const [smaalLogo, setSmallLogo] = React.useState("")
  console.log(useActive, 'useActive');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleSearchDropdown = () => {
    setIsSearchOpen(!issearchOpen);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };
  const closeDropdown = (event: any) => {
    if (!event.target.matches('.dropbtn')) {
      setIsOpen(false);
    }
  };
  const handleWindowResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  const fetchNavItems = async () => {
    if (localStorage.getItem("NavId") != null && localStorage.getItem("NavId") != undefined && localStorage.getItem("NavId") != "") {
      setuseActive(Number(localStorage.getItem("NavId")))
    }
    setCurrentUser(await getCurrentUserName(_context))
    // if (localStorage.getItem("bigLogo") != null && localStorage.getItem("bigLogo") != undefined && localStorage.getItem("bigLogo") != "" || localStorage.getItem("SmallLogo") != null
    //   && localStorage.getItem("SmallLogo") != undefined && localStorage.getItem("SmallLogo") != "") {
    //   setBigLogo(localStorage.getItem('bigLogo'))
    //   setSmallLogo(localStorage.getItem('SmallLogo'))
    // }
    // else {
    await _context.web.lists.getByTitle("UtilitySettings").items.getAll().then((res: any) => {
      console.log(res, 'res');
      const ImageUrl = res[0].LogoImage == undefined || res[0].LogoImage == null ? "" : JSON.parse(res[0].LogoImage);
      console.log(ImageUrl.serverUrl + ImageUrl.serverRelativeUrl, 'imgBigLogo');
      setBigLogo(ImageUrl.serverUrl + ImageUrl.serverRelativeUrl)
      const ImagesmUrl = res[0].SmallLogo == undefined || res[0].SmallLogo == null ? "" : JSON.parse(res[0].SmallLogo);
      console.log(ImagesmUrl.serverUrl + ImagesmUrl.serverRelativeUrl, 'imgBigLogo');
      setSmallLogo(ImagesmUrl.serverUrl + ImagesmUrl.serverRelativeUrl)
      // localStorage.setItem("bigLogo", ImageUrl.serverUrl + ImageUrl.serverRelativeUrl)
      // localStorage.setItem("SmallLogo", ImagesmUrl.serverUrl + ImagesmUrl.serverRelativeUrl)
    });
    // }
    // if (localStorage.getItem('Navitems') != undefined && localStorage.getItem('Navitems') != null && localStorage.getItem('Navitems') != "") {
    //   const arr = JSON.parse(localStorage.getItem('Navitems'))
    //   setNavItems(arr);
    // }
    // else {
      const currentUser = await _context.web.currentUser();

      // Get groups for the current user
      const userGroups = await _context.web.currentUser.groups();
  
      console.log("userGroups",userGroups);
      let grptitle:String[]=[];
      for(var i=0;i<userGroups.length;i++)
      {
        grptitle.push(userGroups[i].Title.toLowerCase());
      }
  
      console.log('%c Start',"background-color:red");
  
      await _context.web.lists.getByTitle("ARGSidebarNavigation").items.select("Title,Url,Icon,ParentId,ID,EnableAudienceTargeting,Audience/Title").expand("Audience").orderBy("Order0", true).getAll().then((res: any) => {
      console.log('%c res',"background-color:red",res);
      const items: NavItem[] = res.map((item: any) => {
        return {
          Title: item.Title,
          Url: item.Url,
          Icon: item.Icon,
          ParentId: item.ParentId,
          ID: item.ID
        };
      });
      // localStorage.setItem('Navitems', JSON.stringify(items))
     // setNavItems(res);
      let securednavitems= res.filter((nav:any)=>
        {
           return (!nav.EnableAudienceTargeting || ( nav.EnableAudienceTargeting && nav.Audience && nav.Audience.some((nv1:any)=>{  return grptitle.includes(nv1.Title.toLowerCase()); }  ) )  )
        } 
      )

      // setNavItems(res);
      setNavItems(securednavitems);
      return items;
    });
    // }
  };
  console.log(currentUser);

  React.useEffect(() => {
    fetchNavItems();

    const handleMouseEnter = () => {
      if (sidebar?.classList.contains("hoverable")) {
        sidebar.classList.remove("close");
        setIsSidebarOpen(true);
      }
    };
    const handleMouseLeave = () => {
      if (sidebar?.classList.contains("hoverable")) {
        sidebar.classList.add("close");
        setIsSidebarOpen(false);
      }
    };
    const sidebar = document.querySelector(".sidebar");
    const submenuItems = document.querySelectorAll(".submenu_item");

    sidebar?.addEventListener("mouseenter", handleMouseEnter);
    sidebar?.addEventListener("mouseleave", handleMouseLeave);

    if (window.innerWidth < 768) {
      sidebar?.classList.add("close");
    } else {
      sidebar?.classList.remove("close");
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
    };
    window.addEventListener('click', closeDropdown);
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleWindowResize);
    return () => {
      sidebar?.removeEventListener("mouseenter", handleMouseEnter);
      sidebar?.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('click', closeDropdown);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [_context]);

  const handleSidebarToggle = (bol: boolean) => {
    setIsSidebarOpen((prevState: any) => !prevState);
    setHide(!bol);
    document.querySelector(".sidebar")?.classList.toggle("close");
  };

  const handleThemeToggle = () => {
    setIsDarkMode((prevState: any) => !prevState);
    document.querySelector("body")?.classList.toggle("dark");
  };
  const dynamicStyle = {
    // backgroundColor: isSidebarOpen ? 'lightblue' : 'lightgray',
    color: isSidebarOpen ? '' : 'white',
    display: isSidebarOpen ? 'block' : 'none',
    cursor: 'pointer'
  };
  const dynamicStylecss = {
    // backgroundColor: isSidebarOpen ? 'lightblue' : 'lightgray',
    color: isSidebarOpen ? '' : '#6c757d',
    display: isSidebarOpen ? 'block' : 'none',
    cursor: 'pointer',
  };
  const handleSubmenuToggle = (index: number) => {
    // setSubmenuOpen((prevIndex: number) => (prevIndex === index ? index : index));
    setSubmenuOpen(prevIndex => (prevIndex === index ? null : index));
  };
  const gotoPage = (url: string, Id: number) => {
    
    localStorage.setItem("NavId", "")
    if (url != null) {
      localStorage.setItem("NavId", String(Id))
      setuseActive(Id)
      window.location.href = url
      console.log(url);
    }

  }
  React.useEffect(()=>{
    highlightbackground()
  },[])
  const highlightbackground = () =>{

   const url = window.location.href; 
   const matches = url.match(/\/([^\/]+)\.aspx/); 
  
   if (matches) {
    const pageName = matches[1]; // Get the matched page name
    // alert(pageName); // Alert the matched page name

    if (pageName === 'workbench') {
        // alert("set workbench");
        localStorage.setItem("NavId", String(1));
        setuseActive(1)
    } else if (pageName === "Dashboard" ) {
        // alert("set MediaGallery/Mediadetails");
        localStorage.setItem("NavId", String(1));
        setuseActive(1)
    } 
    else if (pageName === "MediaGallery" || pageName === "Mediadetails") {
        // alert("set MediaGallery/Mediadetails");
        localStorage.setItem("NavId", String(2));
        setuseActive(2)
    } 
    
    else if (pageName === "EventCalendar" || pageName === "EventDetailsCalendar") {
        // alert("set Event");
        localStorage.setItem("NavId", String(3));
        setuseActive(3)
    } 
    else if (pageName === "News" || pageName === "NewsDetails") {
        // alert("set News");
        localStorage.setItem("NavId", String(4));
        setuseActive(4)
    } 
    else if (pageName === "Announcements" || pageName === "AnnouncementDetails") {
        // alert("set Announcement");
        localStorage.setItem("NavId", String(5));
        setuseActive(5)
    } 
    else if (pageName === "CorporateDirectory" ) {
        // alert("set MediaGallery/Mediadetails");
        localStorage.setItem("NavId", String(6));
        setuseActive(6)
    } 
    else if (pageName === "SocialFeed") {
        // alert("set MediaGallery/Mediadetails");
        localStorage.setItem("NavId", String(8));

    } 
    else if (pageName === "DiscussionForum" || pageName === "DiscussionForumDetail") {
        // alert("set MediaGallery/Mediadetails");
        localStorage.setItem("NavId", String(9));
        setuseActive(9)
    } 
    else if (pageName === "Blogs" || pageName === "BlogDetails") {
        // alert("set MediaGallery/Mediadetails");
        localStorage.setItem("NavId", String(10));
        setuseActive(10)
    } 
    else if (pageName === "GroupandTeam" || pageName === "GroupandTeamDetails") {
        // alert("set MediaGallery/Mediadetails");
        localStorage.setItem("NavId", String(11));
        setuseActive(11)
    } 
    else if (pageName === "Project" || pageName === "ProjectDetails") {
      //alert(`useactive : ${useActive} `)
        // alert("set MediaGallery/Mediadetails");
        localStorage.setItem("NavId", String(12));
        setuseActive(12)
    } 
    else if (
   
      pageName === "MediaGalleryMaster" || 
      pageName === "MediaGalleryForm" || 
      pageName === "EventMaster" || 
      pageName === "EventMasterForm" || 
      pageName === "announcementmaster" || 
      pageName === "AddAnnouncement" || 
      pageName === "BannerMaster" || 
      pageName === "BannerForm"
  ) {
      localStorage.setItem("NavId",  String(0));
      setuseActive(0);
  } else {
      localStorage.setItem("NavId", ""); // Clear the NavId if no match is found
  }
} else {
    // alert("No matches found in the URL");
}

}
  const renderNavItems = (items: NavItem[], parentId: number | null = null) => {
    return items
      .filter(item => item.ParentId === parentId)
      .map(item => {
        const IconComponent = getIcon(item.Icon); // Get the icon component dynamically
        return (
          <li
            key={item.ID}
            className={classNames('item', { active: submenuOpen === item.ID && !useHide })}
          >
            <div
              className={classNames('nav_link submenu_item', {
                active: item.ID == useActive && !useHide

              })}
              onClick={() => handleSubmenuToggle(item.ID)}
            >
              {/* <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => gotoPage(item.Url,item.ID)}> */}

              <div style={{ display: 'flex', alignItems: 'center' ,lineHeight: '25px'}} onClick={() => gotoPage(item.Url, item.ID)} >
                <span className="navlink_icon">
                  {/* Render the Feather Icon component if it exists */}
                  {IconComponent && <IconComponent size={18} />}
                  {/* <Airplay color="blue" size={48} />
              <FontAwesomeIcon icon={getIcon(item.Icon)} /> */}
                </span>
                <a className="link_name1" style={{ textDecoration: 'unset', paddingLeft: '1rem' }} target=''
                >  
                 <span 
                //  className={classNames('navlink', {
                //   active: item.ID == useActive && !useHide

                // })}
                 style={dynamicStyle}>{item.Title}</span>

                </a>

                {!useHide ? items.some(subItem => subItem.ParentId === item.ID) && (
                  <FontAwesomeIcon
                    className="arrow-left"
                    icon={submenuOpen === item.ID ? faChevronUp : faChevronRight}
                  />
                ) : ""}
              </div>

              {!useHide ? (
                <>
                  {submenuOpen === item.ID && (
                    <ul className="menu_items nav_link submenu_item" style={{
                      background: '#fff', borderRadius: 'unset', display: 'block', paddingTop: '.25rem'
                    }}>
                      {renderNavItems(items, item.ID)}

                    </ul>
                  )}
                </>
              ) : (

                <ul className="sub-menu blank navlinkcss" style={{ background: 'transparent', padding: 'unset', alignItems: 'start', boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)' }}>
                  <div style={{
                    color: '#fff', textDecoration: 'none', background: '#1fb0e5', paddingLeft: '0.6rem',
                    display: 'flex', height: '40px', alignItems: 'center'
                  }} >
                    <li className='' style={{ background: '#1fb0e5', color: 'white' }} >
                      <a className="link_name" style={{ textDecoration: 'unset', color: 'white' }}>
                        <span className={classNames('navlink ', {
                          active: item.ID == useActive

                        })} style={dynamicStyle}>{item.Title}</span></a>
                    </li>
                  </div>
                  <div style={{ background: 'white' }} >
                    {items.filter(x => x.ParentId === item.ID).map(item => (
                      <li className='test' style={{ paddingBottom: '0.5rem', paddingTop: '0.5rem' }} key={item.ID} >

                        {/* <li className='test' style={{ paddingBottom: '0.5rem', paddingTop: '0.5rem' }} key={item.ID} onClick={() => gotoPage(item.Url,item.ID)}> */}
                        <a className={classNames('link_name1 ', {
                          active: item.ID == useActive
                        })} style={{ textDecoration: 'none', paddingLeft: '1rem' }} onClick={() => gotoPage(item.Url, item.ID)} >
                          <span style={dynamicStylecss}>{item.Title}</span>
                        </a>
                      </li>
                    ))}
                  </div>
                </ul>
              )}
            </div>
          </li>
        )
      }

      );
  };

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      home: Airplay,
      calendar: Calendar,
      file: File,
      image: Image,
      clipboard: Clipboard,
      bell: Bell,
      userGroup: Users,
      wifi: Rss,
      waveSquare: Activity,
      sun: Sun,
      moon: Moon,
      approval: Activity,
      gear: Cpu,
      codepen: Codepen,
      command:Command
    };
    return iconMap[iconName] || null; // Return null if icon is not found
  };

  // const renderNavItems = (items: NavItem[], parentId: number | null = null) => {
  //   return items
  //     .filter(item => item.ParentId === parentId)
  //     .map(item => (
  //       <li key={item.ID} className="item">
  //         <div  className={classNames('nav_link submenu_item', { active: isSidebarOpen })} onClick={() => handleSubmenuToggle(item.ID)}>
  //           <span className="navlink_icon">
  //             <FontAwesomeIcon icon={getIcon(item.Icon)} />
  //           </span>
  //           {isSidebarOpen ? (
  //             <>
  //               <span className="navlink ">{item.Title}</span>
  //               {items.some(subItem => subItem.ParentId === item.ID) && (
  //                 <FontAwesomeIcon className="arrow-left" icon={submenuOpen === item.ID ? faChevronUp : faChevronRight} style={{top:'0.8rem'}}/>
  //               )}
  //               {submenuOpen === item.ID && (
  //                 <ul className="menu_items submenu">
  //                   {renderNavItems(items, item.ID)}
  //                 </ul>
  //               )}
  //             </>
  //           ) : (
  //             <ul className="sub-menu blank navlinkcss">
  //               <li>
  //                 <a className="link_name"  style={{ color: '#fff', textDecoration: 'none' }}>
  //                   {item.Title}
  //                 </a>
  //               </li>
  //               {renderNavItems(items, item.ID)}
  //             </ul>
  //           )}
  //         </div>
  //       </li>
  //     ));
  // };


  // const renderNavItems = (items: NavItem[], parentId: number | null = null) => {
  //   return items.filter(item => item.ParentId === parentId).map(item => (
  //     <li key={item.ID} className="item">
  //       <div className="nav_link submenu_item" onClick={() => handleSubmenuToggle(item.ID)}>
  //         <span className="navlink_icon">
  //           <FontAwesomeIcon icon={getIcon(item.Icon)} />
  //         </span>
  //         {isSidebarOpen ?
  //           <>
  //             <span className="navlink">{item.Title}</span>
  //             {items.some(subItem => subItem.ParentId === item.ID) && (
  //               <FontAwesomeIcon className="arrow-left" icon={submenuOpen === item.ID ? faChevronUp : faChevronRight} />
  //             )}
  //             {submenuOpen === item.ID && (
  //               <ul className="menu_items submenu">
  //                 {renderNavItems(items, item.ID)}
  //               </ul>
  //             )}
  //           </>
  //           : <ul className="sub-menu blank navlinkcss">
  //             <li><a className="link_name"  style={{ color: '#fff', textDecoration: 'none' }}>{item.Title}</a></li>
  //             {renderNavItems(items, item.ID)}
  //           </ul>}
  //       </div>
  //     </li>
  //   ));
  // };

  // const getIcon = (iconName: string) => {
  //   const iconMap: { [key: string]: any } = {
  //     home: faHome,
  //     calendar: faCalendar,
  //     file: faFile,
  //     image: faImage,
  //     clipboard: faClipboard,
  //     bell: faBell,
  //     userGroup: faUserGroup,
  //     wifi: faWifi,
  //     waveSquare: faWaveSquare,
  //     sun: faSun,
  //     moon: faMoon,
  //     approval: faWaveSquare,
  //     gear: faMicrochip
  //   };
  //   return iconMap[iconName] || "";
  // };

  return (
    <>
      {/* <div className='row'> */}
      {/* <div className="col-md-4"> */}
      <div className={classNames("sidebar", { open: !useHide && isMobile, close: useHide })}>
        {/* style={{ zIndex: '100' }}> */}
        <div className="menu_content">
          <ul className="menu_items">
            <li className="item mt-1 mb-0 pt-0">
              <div className="logo_item">
                <span>
                  <img src={useHide ? smaalLogo != undefined && smaalLogo != "" && smaalLogo != null ? smaalLogo : imgSMLogo : bigLogo != undefined && bigLogo != "" && bigLogo != null ? bigLogo : imgBigLogo} alt="Logo" style={{ objectFit: 'cover', width: '100%' }} />
                </span>
              </div>
            </li>
            {renderNavItems(navItems)}
          </ul>
        </div>
      </div>
      {/* </div> */}
      {/* <div className="col-md-8"> */}
      {/* <nav className="navbar" style={{ zIndex: '99' }}>
          <div className='navcss' >


            <div className="logo_item" onClick={() => handleSidebarToggle(useHide)}>
              <div className={`bottom_content ${useHide ? 'sidebar-closedBar' : 'sidebar-openBa'}`} onClick={() => handleSidebarToggle(useHide)}>
                <div className="bottom expand_sidebar" onClick={() => handleSidebarToggle(useHide)}>
                  <Menu size={22} className='desktoView' />
                  <Menu size={80} className='searchcssmobile' />
                </div>
              </div>
            </div>

            <div className={`navbar_content ${useHide ? 'searchcssmobile sidebar-closedBar' : 'searchcssmobile sidebar-openBa'}`} onClick={() => handleSidebarToggle(useHide)}>
              <div className="search_bar">
                <input type="text" placeholder="Search.." className='searchcss desktoView' />

              </div>

              <div className="dropdown">
                <Search className='searchcssmobile' size='80' onClick={toggleSearchDropdown} />
                <div id="myDropdown" className={`dropdown-content ${issearchOpen ? 'show' : ''}`}>
                  <input type="text" placeholder="Search.." className='searchcss searchcssmobile' />
                </div>

              </div>

              <Maximize className='bx bx-bell desktoView' size='22' onClick={toggleFullscreen} />
              <Bell className='bx bx-bell desktoView' size='22' />
              <Moon size='22' className={isDarkMode ? 'bx bx-moon desktoView' : 'bx bx-sun desktoView'} onClick={handleThemeToggle} />
              <Bell className='bx bx-bell searchcssmobile' size='80' />
              <div className="dropdown">
                <div className='d-flex' onClick={toggleDropdown} style={{ gap: '10px', cursor: 'pointer' }}>
                  <div className='rounded-circle'>
                    <User className='desktoView' size='22' />
                    <User className='searchcssmobile' size='80' />
                  
                  </div>
                  <div className='dropcssUser desktoView'>
                    <div>{currentUser}</div>
                    <div><ChevronDown size={12} /></div>
                  </div>
                </div>

            
                <div id="myDropdown" className={`dropdown-content ${isOpen ? 'show' : ''}`}>
                  <a href="#home">Home</a>
                  <a href="#about">About</a>
                  <a href="#contact">Contact</a>
                </div>
              </div>
              <Settings className='bx bx-user desktoView' size='22' />
              <Settings className='bx bx-user searchcssmobile' size='80' />

             
            </div>
          </div>
        </nav> */}
      {/* </div>
       
       
      </div> */}


    </>
  );
};


const VerticalSideBar = ({ _context }: any) => {
  return (
    // <UserContext.Provider value={{ setHide: () => { }, useHide: true }}>
    <VerticalContext _context={_context} />
    // </UserContext.Provider>
  );
};
export default VerticalSideBar;
// import * as React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendar, faFile, faImage, faClipboard, faSun, faBell, faMoon } from '@fortawesome/free-regular-svg-icons';
// // import "../components/VerticalSidebar.scss";
// import "../../horizontalNavBar/components/horizontalNavbar.scss";
// import UserContext from '../../../GlobalContext/context';
// import { faBars, faChevronRight, faChevronUp, faExpand, faGear, faHome, faMicrochip, faUserGroup, faWaveSquare, faWifi } from '@fortawesome/free-solid-svg-icons';

// import { SPFI } from '@pnp/sp';
// import "@pnp/sp/webs";
// import "@pnp/sp/lists";
// import "@pnp/sp/webs";
// import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf"
// import { Airplay, Calendar, File, Image, Clipboard, Bell, Users, Activity, Sun, Moon, Cpu, Rss, Maximize, Settings, Search, ChevronsDown, ChevronDown, Menu, User } from 'react-feather';
// import classNames from 'classnames'; // Assuming you use this for class management
// import { getCurrentUserName } from '../../../APISearvice/CustomService';
// import { graphfi } from "@pnp/graph";
// import "@pnp/graph/users";
// import "@pnp/graph/photos";
// import { getSP } from '../loc/pnpjsConfig';
// interface NavItem {
//   Title: string;
//   Url: string;
//   Icon: string;
//   ParentId?: number;
//   ID: number;
// }

// const VerticalContext = ({ _context }: any) => {
//   console.log(_context);
//   // const graph = graphfi(...);
//   const sp: SPFI = getSP();
//   console.log(sp, 'sp');
//   // const imgLogo = require("../assets/logoImgsm.png");
//   const imgBigLogo = require("../assets/logodarkBig.png")
//   // const imgLogo = require("../../../Assets/ExtraImage/logosm.png");
//   const imgSMLogo = require("../assets/logoImgsm.png");
//   // const useimg = require("../assets/useimg.png");
//   const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
//   const [isDarkMode, setIsDarkMode] = React.useState(false);
//   const [submenuOpen, setSubmenuOpen] = React.useState<number | null>(null);
//   const [navItems, setNavItems] = React.useState<NavItem[]>([]);
//   const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
//   const context = React.useContext(UserContext);
//   const { setHide, useHide,setuseActive,useActive }: any = context;
//   const { useFullscreen, toggleHide, toggleFullscreen }: any = React.useContext(UserContext);
//   const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
//   const elementRef = React.useRef<HTMLDivElement>(null);
//   const [isOpen, setIsOpen] = React.useState(false);
//   const [issearchOpen, setIsSearchOpen] = React.useState(false);

//   const [currentUser, setCurrentUser] = React.useState("")
//   const [currentUserProfile, setCurrentUserProfile] = React.useState("")

//   const [bigLogo, setBigLogo] = React.useState("")
//   const [smaalLogo, setSmallLogo] = React.useState("")
// console.log(useActive,'useActive');

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };
//   const toggleSearchDropdown = () => {
//     setIsSearchOpen(!issearchOpen);
//   };
//   const toggleSidebar = () => {
//     setIsSidebarOpen(prevState => !prevState);
//   };
//   const closeDropdown = (event: any) => {
//     if (!event.target.matches('.dropbtn')) {
//       setIsOpen(false);
//     }
//   };
//   const handleWindowResize = () => {
//     setIsMobile(window.innerWidth < 768);
//   };
//   const fetchNavItems = async () => {
//     if(localStorage.getItem("NavId") != null&&localStorage.getItem("NavId")!= undefined&&localStorage.getItem("NavId")!= "")
//     {
//       setuseActive(Number(localStorage.getItem("NavId")))
//     }
//     setCurrentUser(await getCurrentUserName(_context))
//     // if (localStorage.getItem("bigLogo") != null && localStorage.getItem("bigLogo") != undefined && localStorage.getItem("bigLogo") != "" || localStorage.getItem("SmallLogo") != null
//     //   && localStorage.getItem("SmallLogo") != undefined && localStorage.getItem("SmallLogo") != "") {
//     //   setBigLogo(localStorage.getItem('bigLogo'))
//     //   setSmallLogo(localStorage.getItem('SmallLogo'))
//     // }
//     // else {
//       await _context.web.lists.getByTitle("UtilitySettings").items.getAll().then((res: any) => {
//         console.log(res, 'res');
//         const ImageUrl = res[0].LogoImage == undefined || res[0].LogoImage == null ? "" : JSON.parse(res[0].LogoImage);
//         console.log(ImageUrl.serverUrl + ImageUrl.serverRelativeUrl, 'imgBigLogo');
//         setBigLogo(ImageUrl.serverUrl + ImageUrl.serverRelativeUrl)
//         const ImagesmUrl = res[0].SmallLogo == undefined || res[0].SmallLogo == null ? "" : JSON.parse(res[0].SmallLogo);
//         console.log(ImagesmUrl.serverUrl + ImagesmUrl.serverRelativeUrl, 'imgBigLogo');
//         setSmallLogo(ImagesmUrl.serverUrl + ImagesmUrl.serverRelativeUrl)
//         // localStorage.setItem("bigLogo", ImageUrl.serverUrl + ImageUrl.serverRelativeUrl)
//         // localStorage.setItem("SmallLogo", ImagesmUrl.serverUrl + ImagesmUrl.serverRelativeUrl)
//       });
//     // }
//     // if (localStorage.getItem('Navitems') != undefined && localStorage.getItem('Navitems') != null && localStorage.getItem('Navitems') != "") {
//     //   const arr = JSON.parse(localStorage.getItem('Navitems'))
//     //   setNavItems(arr);
//     // }
//     // else {
//       await _context.web.lists.getByTitle("ARGSidebarNavigation").items.getAll().then((res: any) => {
//         console.log(res, 'res');
//         const items: NavItem[] = res.map((item: any) => {
//           return {
//             Title: item.Title,
//             Url: item.Url,
//             Icon: item.Icon,
//             ParentId: item.ParentId,
//             ID: item.ID
//           };
//         });
//         // localStorage.setItem('Navitems', JSON.stringify(items))
//         setNavItems(res);
//         return items;
//       });
//     // }
//   };
//   console.log(currentUser);

//   React.useEffect(() => {
//     fetchNavItems();
    
//     const handleMouseEnter = () => {
//       if (sidebar?.classList.contains("hoverable")) {
//         sidebar.classList.remove("close");
//         setIsSidebarOpen(true);
//       }
//     };
//     const handleMouseLeave = () => {
//       if (sidebar?.classList.contains("hoverable")) {
//         sidebar.classList.add("close");
//         setIsSidebarOpen(false);
//       }
//     };
//     const sidebar = document.querySelector(".sidebar");
//     const submenuItems = document.querySelectorAll(".submenu_item");

//     sidebar?.addEventListener("mouseenter", handleMouseEnter);
//     sidebar?.addEventListener("mouseleave", handleMouseLeave);

//     if (window.innerWidth < 768) {
//       sidebar?.classList.add("close");
//     } else {
//       sidebar?.classList.remove("close");
//     }
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         if (document.fullscreenElement) {
//           document.exitFullscreen();
//         }
//       }
//     };
//     window.addEventListener('click', closeDropdown);
//     window.addEventListener('keydown', handleEscape);
//     window.addEventListener('resize', handleWindowResize);
//     return () => {
//       sidebar?.removeEventListener("mouseenter", handleMouseEnter);
//       sidebar?.removeEventListener("mouseleave", handleMouseLeave);
//       window.removeEventListener('keydown', handleEscape);
//       window.removeEventListener('click', closeDropdown);
//       window.removeEventListener('resize', handleWindowResize);
//     };
//   }, []);

//   const handleSidebarToggle = (bol: boolean) => {
//     setIsSidebarOpen((prevState: any) => !prevState);
//     setHide(!bol);
//     document.querySelector(".sidebar")?.classList.toggle("close");
//   };

//   const handleThemeToggle = () => {
//     setIsDarkMode((prevState: any) => !prevState);
//     document.querySelector("body")?.classList.toggle("dark");
//   };
//   const dynamicStyle = {
//     // backgroundColor: isSidebarOpen ? 'lightblue' : 'lightgray',
//     color: isSidebarOpen ? '' : 'white',
//     display: isSidebarOpen ? 'block' : 'none',
//     cursor: 'pointer',
//   };
//   const dynamicStylecss = {
//     // backgroundColor: isSidebarOpen ? 'lightblue' : 'lightgray',
//     color: isSidebarOpen ? '' : '#6c757d',
//     display: isSidebarOpen ? 'block' : 'none',
//     cursor: 'pointer',
//   };
//   const handleSubmenuToggle = (index: number) => {
//     // setSubmenuOpen((prevIndex: number) => (prevIndex === index ? index : index));
//     setSubmenuOpen(prevIndex => (prevIndex === index ? null : index));
//   };
//   const gotoPage = (url: string,Id:number) => {
//     debugger
//     if(url!=null)
//     {
//       window.location.href = url
//       console.log(url);
//     }
//     localStorage.setItem("NavId",String(Id))
//     setuseActive(Id)
//   }
//   const renderNavItems = (items: NavItem[], parentId: number | null = null) => {
//     return items
//       .filter(item => item.ParentId === parentId)
//       .map(item => {
//         const IconComponent = getIcon(item.Icon); // Get the icon component dynamically
//         return (
//           <li
//             key={item.ID}
//             className={classNames('item', { active: submenuOpen === item.ID && !useHide })}
//           >
//             <div
//               className={classNames('nav_link submenu_item', {
//                 active: item.ID ==useActive && !useHide

//               })}
//               onClick={() => handleSubmenuToggle(item.ID)}
//             >
//               {/* <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => gotoPage(item.Url,item.ID)}> */}

//               <div  style={{ display: 'flex', alignItems: 'center' }} onClick={() => gotoPage(item.Url,item.ID)} >
//                 <span className="navlink_icon">
//                   {/* Render the Feather Icon component if it exists */}
//                   {IconComponent && <IconComponent size={18} />}
//                   {/* <Airplay color="blue" size={48} />
//               <FontAwesomeIcon icon={getIcon(item.Icon)} /> */}
//                 </span>
//                 <a className="link_name1" href={item.Url} style={{ textDecoration: 'none', paddingLeft: '0.5rem' }}  target='' 
//                >   <span className={classNames('navlink', {
//                     active: item.ID ==useActive && !useHide
    
//                   })}>{item.Title}</span>
                  
//                    </a>

//                 {!useHide ? items.some(subItem => subItem.ParentId === item.ID) && (
//                   <FontAwesomeIcon
//                     className="arrow-left"
//                     icon={submenuOpen === item.ID ? faChevronUp : faChevronRight}
//                   />
//                 ) : ""}
//               </div>

//               {!useHide ? (
//                 <>
//                   {submenuOpen === item.ID && (
//                     <ul className="menu_items nav_link submenu_item" style={{
//                       background: '#fff', borderRadius: 'unset', display: 'block', paddingTop: '.25rem'
//                     }}>
//                       {renderNavItems(items, item.ID)}

//                     </ul>
//                   )}
//                 </>
//               ) : (

//                 <ul className="sub-menu blank navlinkcss" style={{ background: 'transparent', padding: 'unset', alignItems: 'start', boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)' }}>
//                   <div style={{
//                     color: '#fff', textDecoration: 'none', background: '#1fb0e5', paddingLeft: '0.5rem',
//                     display: 'flex', height: '40px', alignItems: 'center'
//                   }} >
//                     <li className='' style={{ background: '#1fb0e5', color: 'white' }} >
//                       <a className="link_name" href={item.Url} style={{ textDecoration: 'unset', color: 'white' }}>
//                         <span className={classNames('navlink ', {
//                     active: item.ID ==useActive 
    
//                   })} style={dynamicStyle}>{item.Title}</span></a>
//                     </li>
//                   </div>
//                   <div style={{ background: 'white' }} >
//                     {items.filter(x => x.ParentId === item.ID).map(item => (
//                       <li className='test' style={{ paddingBottom: '0.5rem', paddingTop: '0.5rem' }} key={item.ID} >

//                      {/* <li className='test' style={{ paddingBottom: '0.5rem', paddingTop: '0.5rem' }} key={item.ID} onClick={() => gotoPage(item.Url,item.ID)}> */}
//                         <a className="link_name1" href={item.Url} style={{ textDecoration: 'none', paddingLeft: '0.5rem' }} onClick={() => gotoPage(item.Url,item.ID)} >
//                        <span style={dynamicStylecss}>{item.Title}</span>   
//                         </a>
//                       </li>
//                     ))}
//                   </div>
//                 </ul>
//               )}
//             </div>
//           </li>
//         )
//       }

//       );
//   };

//   const getIcon = (iconName: string) => {
//     const iconMap: { [key: string]: any } = {
//       home: Airplay,
//       calendar: Calendar,
//       file: File,
//       image: Image,
//       clipboard: Clipboard,
//       bell: Bell,
//       userGroup: Users,
//       wifi: Rss,
//       waveSquare: Activity,
//       sun: Sun,
//       moon: Moon,
//       approval: Activity,
//       gear: Cpu
//     };
//     return iconMap[iconName] || null; // Return null if icon is not found
//   };

//   // const renderNavItems = (items: NavItem[], parentId: number | null = null) => {
//   //   return items
//   //     .filter(item => item.ParentId === parentId)
//   //     .map(item => (
//   //       <li key={item.ID} className="item">
//   //         <div  className={classNames('nav_link submenu_item', { active: isSidebarOpen })} onClick={() => handleSubmenuToggle(item.ID)}>
//   //           <span className="navlink_icon">
//   //             <FontAwesomeIcon icon={getIcon(item.Icon)} />
//   //           </span>
//   //           {isSidebarOpen ? (
//   //             <>
//   //               <span className="navlink ">{item.Title}</span>
//   //               {items.some(subItem => subItem.ParentId === item.ID) && (
//   //                 <FontAwesomeIcon className="arrow-left" icon={submenuOpen === item.ID ? faChevronUp : faChevronRight} style={{top:'0.8rem'}}/>
//   //               )}
//   //               {submenuOpen === item.ID && (
//   //                 <ul className="menu_items submenu">
//   //                   {renderNavItems(items, item.ID)}
//   //                 </ul>
//   //               )}
//   //             </>
//   //           ) : (
//   //             <ul className="sub-menu blank navlinkcss">
//   //               <li>
//   //                 <a className="link_name" href={item.Url} style={{ color: '#fff', textDecoration: 'none' }}>
//   //                   {item.Title}
//   //                 </a>
//   //               </li>
//   //               {renderNavItems(items, item.ID)}
//   //             </ul>
//   //           )}
//   //         </div>
//   //       </li>
//   //     ));
//   // };


//   // const renderNavItems = (items: NavItem[], parentId: number | null = null) => {
//   //   return items.filter(item => item.ParentId === parentId).map(item => (
//   //     <li key={item.ID} className="item">
//   //       <div className="nav_link submenu_item" onClick={() => handleSubmenuToggle(item.ID)}>
//   //         <span className="navlink_icon">
//   //           <FontAwesomeIcon icon={getIcon(item.Icon)} />
//   //         </span>
//   //         {isSidebarOpen ?
//   //           <>
//   //             <span className="navlink">{item.Title}</span>
//   //             {items.some(subItem => subItem.ParentId === item.ID) && (
//   //               <FontAwesomeIcon className="arrow-left" icon={submenuOpen === item.ID ? faChevronUp : faChevronRight} />
//   //             )}
//   //             {submenuOpen === item.ID && (
//   //               <ul className="menu_items submenu">
//   //                 {renderNavItems(items, item.ID)}
//   //               </ul>
//   //             )}
//   //           </>
//   //           : <ul className="sub-menu blank navlinkcss">
//   //             <li><a className="link_name" href={item.Url} style={{ color: '#fff', textDecoration: 'none' }}>{item.Title}</a></li>
//   //             {renderNavItems(items, item.ID)}
//   //           </ul>}
//   //       </div>
//   //     </li>
//   //   ));
//   // };

//   // const getIcon = (iconName: string) => {
//   //   const iconMap: { [key: string]: any } = {
//   //     home: faHome,
//   //     calendar: faCalendar,
//   //     file: faFile,
//   //     image: faImage,
//   //     clipboard: faClipboard,
//   //     bell: faBell,
//   //     userGroup: faUserGroup,
//   //     wifi: faWifi,
//   //     waveSquare: faWaveSquare,
//   //     sun: faSun,
//   //     moon: faMoon,
//   //     approval: faWaveSquare,
//   //     gear: faMicrochip
//   //   };
//   //   return iconMap[iconName] || "";
//   // };

//   return (
//     <>
//       {/* <div className='row'> */}
//       {/* <div className="col-md-4"> */}
//       <div className={classNames("sidebar", { open: !useHide && isMobile, close: useHide })}>
//         {/* style={{ zIndex: '100' }}> */}
//         <div className="menu_content">
//           <ul className="menu_items">
//             <li className="item mt-1 mb-0 pt-0">
//               <div className="logo_item">
//                 <span>
//                   <img src={useHide ? smaalLogo!=undefined&&smaalLogo!=""&&smaalLogo!=null?smaalLogo:imgSMLogo  : bigLogo!=undefined&&bigLogo!=""&&bigLogo!=null?bigLogo:imgBigLogo } alt="Logo" style={{ objectFit: 'cover', width: '100%' }} />
//                 </span>
//               </div>
//             </li>
//             {renderNavItems(navItems)}
//           </ul>
//         </div>
//       </div>
//       {/* </div> */}
//       {/* <div className="col-md-8"> */}
//       {/* <nav className="navbar" style={{ zIndex: '99' }}>
//           <div className='navcss' >


//             <div className="logo_item" onClick={() => handleSidebarToggle(useHide)}>
//               <div className={`bottom_content ${useHide ? 'sidebar-closedBar' : 'sidebar-openBa'}`} onClick={() => handleSidebarToggle(useHide)}>
//                 <div className="bottom expand_sidebar" onClick={() => handleSidebarToggle(useHide)}>
//                   <Menu size={22} className='desktoView' />
//                   <Menu size={80} className='searchcssmobile' />
//                 </div>
//               </div>
//             </div>

//             <div className={`navbar_content ${useHide ? 'searchcssmobile sidebar-closedBar' : 'searchcssmobile sidebar-openBa'}`} onClick={() => handleSidebarToggle(useHide)}>
//               <div className="search_bar">
//                 <input type="text" placeholder="Search.." className='searchcss desktoView' />

//               </div>

//               <div className="dropdown">
//                 <Search className='searchcssmobile' size='80' onClick={toggleSearchDropdown} />
//                 <div id="myDropdown" className={`dropdown-content ${issearchOpen ? 'show' : ''}`}>
//                   <input type="text" placeholder="Search.." className='searchcss searchcssmobile' />
//                 </div>

//               </div>

//               <Maximize className='bx bx-bell desktoView' size='22' onClick={toggleFullscreen} />
//               <Bell className='bx bx-bell desktoView' size='22' />
//               <Moon size='22' className={isDarkMode ? 'bx bx-moon desktoView' : 'bx bx-sun desktoView'} onClick={handleThemeToggle} />
//               <Bell className='bx bx-bell searchcssmobile' size='80' />
//               <div className="dropdown">
//                 <div className='d-flex' onClick={toggleDropdown} style={{ gap: '10px', cursor: 'pointer' }}>
//                   <div className='rounded-circle'>
//                     <User className='desktoView' size='22' />
//                     <User className='searchcssmobile' size='80' />
                  
//                   </div>
//                   <div className='dropcssUser desktoView'>
//                     <div>{currentUser}</div>
//                     <div><ChevronDown size={12} /></div>
//                   </div>
//                 </div>

            
//                 <div id="myDropdown" className={`dropdown-content ${isOpen ? 'show' : ''}`}>
//                   <a href="#home">Home</a>
//                   <a href="#about">About</a>
//                   <a href="#contact">Contact</a>
//                 </div>
//               </div>
//               <Settings className='bx bx-user desktoView' size='22' />
//               <Settings className='bx bx-user searchcssmobile' size='80' />

             
//             </div>
//           </div>
//         </nav> */}
//       {/* </div>
       
       
//       </div> */}


//     </>
//   );
// };


// const VerticalSideBar = ({ _context }: any) => {
//   return (
//     // <UserContext.Provider value={{ setHide: () => { }, useHide: true }}>
//     <VerticalContext _context={_context} />
//     // </UserContext.Provider>
//   );
// };
// export default VerticalSideBar;