import * as React from "react";
// import Provider from '../../../GlobalContext/provider';
import "bootstrap/dist/css/bootstrap.min.css";
// import './SideBar';
import { useRef, useState } from "react";
import { getSP } from "../loc/pnpjsConfig";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/site-groups"
import "@pnp/sp/folders"; 
import "@pnp/sp/webs"; 
import "./CreateFoldercss";
import Select from "react-select";
import Swal from "sweetalert2";
// import Form from "react-bootstrap/Form";

// let selectedArrayForUserPermission:{
//   userId:number,
//   value: String,
//   label: String,
//   email:String
// }[];

// let selectedPermissionValue:String;

interface CreateFolderProps {
  OthProps: { [key: string]: string };
  onReturnToMain: () => void;
  // myRequest: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

let togglecolumneDetails=true;
let toggleaddFieldsButton=true;
let togglefolderPrivacy=true;
// let toggleApprovalForFolder=true;

const CreateFolder: React.FC<CreateFolderProps> = ({
  OthProps,
  onReturnToMain,
}) => {
  console.log(OthProps, "oth props");
  const sp: SPFI = getSP();
  const [toggleApproval, setToggleApproval] = React.useState(false);
  const [approvalOption, setApprovalOption]=useState("");
  console.log("Approval option",approvalOption);

  


  let locationPath=window.location.pathname.match(/\/sites\/[^\/]+/)[0];
  // new code for permission.
  // const [permission, setPermission]=React.useState(false);

  // const handlePermissionToggle=(set:any)=>{
  //   console.log("Set permission called");
  //   console.log(set);
  //   setPermission(set);
  // }

  const permissionArray:{value:string,label:string}[]=[
    {value:"Full Control",label:"Full Control"},
    {value:"Contribute",label:"Contribute"},
    {value:"Edit",label:"Edit"},
    {value:"Read",label:"Read"},
    {value:"View",label:"View"}
  ];
  //new code end 
// New Code for Adding permission dynamically on click of + button.
  const [rowsForPermission, setRowsForPermission] = React.useState<
        { id: number; selectedUserForPermission: string[]; selectedPermission:String }[]
        >([{ id: 0, selectedUserForPermission: [],selectedPermission:"" }]);
  console.log("rowsForPermission",rowsForPermission);
  // Add new row for permission
  const handleAddRowForPermission=(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>)=>{
    event.preventDefault();
    const newId = rowsForPermission.length ? rowsForPermission[rowsForPermission.length - 1].id + 1 : 0;
    setRowsForPermission([
      ...rowsForPermission,
      { id: newId, selectedUserForPermission: [], selectedPermission:"" },
    ]);
  }

  // Remove new row for permission
  const handleRemoveRowForPermission = (
    id: number,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    setRowsForPermission(rowsForPermission.filter((row) => row.id !== id));
  };
  
  const handleUserSelectForPermission=(selectedUser:any, id:any)=>{
    // console.log("selectedArrayForUserPermission",selectedArrayForUserPermission)
    console.log("Selected user for permission",selectedUser);
    // selectedArrayForUserPermission=selectedUser;
    const newRows = rowsForPermission.map((row) =>
      row.id === id ? { ...row, selectedUserForPermission: selectedUser } : row
    );
    setRowsForPermission(newRows);
  }

  const handlePermissionSelect=(selectedPermission:any,id:any)=>{
    // console.log("Before selectedPermissionValue",selectedPermissionValue)
    console.log("Selected Permission",selectedPermission)
    // selectedPermissionValue=selectedPermission.value;
    const newRows = rowsForPermission.map((row) =>
      row.id === id ? { ...row, selectedPermission: selectedPermission.value } : row
    );
    setRowsForPermission(newRows);
  }

  // new code end

  // Toggle the Folder Privacy and Column details
  if(OthProps.DocumentLibrary !==""){
    togglecolumneDetails=false;
    toggleaddFieldsButton=false;
    togglefolderPrivacy=false;
    // toggleApprovalForFolder=false;

  }else{
    togglecolumneDetails=true;
    toggleaddFieldsButton=true;
    togglefolderPrivacy=true;
    // toggleApprovalForFolder=true;
  }


  const currentUserEmailRef = useRef('');


  const getcurrentuseremail = async()=>{
    const userdata = await sp.web.currentUser();
    currentUserEmailRef.current = userdata.Email;
    const groups = await sp.web.siteGroups();

    console.log("All Groups:", groups);
    const allusers = await sp.web.siteUsers();

    console.log("All allusers:", allusers);

    // const groups = await sp.web.siteGroups();

    // console.log("All Groups:", groups);

    // Get all site users
    const users = await sp.web.siteUsers();

    console.log("All Users:", users);
   }

  const [users, setUsers] = React.useState<any[]>([]);
  console.log("Users Array", users);

  const handleToggleApproval = (event:any) => {
    // event.preventDefault();
    setApprovalOption(event.target.value);
    setToggleApproval(true);
  };

  const handleToggleRemove = (event:any) => {
    setApprovalOption(event.target.value);
    setToggleApproval(false);
    
  };
  const [rows, setRows] = React.useState<
    { id: number; selectionType: "All" | "One"; approvedUserList: string[] }[]
  >([{ id: 0, selectionType: "One", approvedUserList: [] }]);
  // end

//   Errors for field selection
  const [errors1, setErrors1] = useState<{ [key: number]: { fieldName?: string; selectField?: string } }>({});

  // erroe for user selection
  const [errorsForUserSelection,setErrorsForUserSelection]=useState<{ [key: number]: { userSelect?: string} }>({});
  

  const validateUsersSelect = () => {
    let isValid = true;
    const newErrors: { [key: number]: { userSelect?: string} } = {};

    rows.forEach((row) => {
      if (row.approvedUserList.length === 0) {
        newErrors[row.id] = {userSelect: 'Please select at least one user.' };
        isValid = false;
      }
    });

    setErrorsForUserSelection(newErrors);
    return isValid;
  };

  //start
//   store the form field and its type.
  const [formFields, setFormFields] = useState([
    { id:0, fieldName: '', selectField: ''}
  ]);

//   add field in the formField arry
  const handleInputChange = (id:number, event:any) => {
    const values = formFields.map(field =>
        field.id === id
          ? { ...field, fieldName: event.target.value } 
          : field
      );
      setFormFields(values);

        // Reset error when user enters a value
    if (event.target.value.trim() !== '') {
        setErrors1((prevErrors) => ({
          ...prevErrors,
          [id]: { ...prevErrors[id], [event.target.name]: '' }
        }));
      }
  };

//   add type in the formField array
  const handleSelectedType=(id:number,event:any)=>{

    const values = formFields.map(field =>
        field.id === id
          ? { ...field, selectField: event.target.value } 
          : field
      );
      setFormFields(values);

      // Reset error when user selects a value
    if (event.target.value !== '') {
        setErrors1((prevErrors) => ({
          ...prevErrors,
          [id]: { ...prevErrors[id], selectField: '' }
        }));
      }
  }
//   add new field row
  const handleAddFields = () => {
    const newId = formFields.length ? formFields[formFields.length - 1].id + 1 : 0;
    setFormFields([
      ...formFields,
      { id: newId, fieldName: "", selectField:"" },
    ]);
  };
  console.log("FormsField Array",formFields);

//   remove field row
  const handleRemoveField=(id:number,event:any)=>{
    event.preventDefault();
    // console.log("index",id);
    // console.log("Remove Field Called");

    setFormFields(formFields.filter((field) => field.id !== id));
    
  }

// Handle validation and error state update
   const validateFields = () => {
    
    let isValid = true;
    const newErrors: { [key: number]: { fieldName?: string; selectField?: string } } = {};

    formFields.forEach((field) => {
      if (!field.fieldName.trim()) {
        newErrors[field.id] = { ...newErrors[field.id], fieldName: 'Field Name is required' };
        isValid = false;
      }
      if (!field.selectField) {
        newErrors[field.id] = { ...newErrors[field.id], selectField: 'Field Type is required' };
        isValid = false;
      }
    });

    setErrors1(newErrors);
    return isValid;
  };
  const [siteUsers,setSiteUsers]=React.useState<any[]>([]);
  console.log("siteUsers --> ",siteUsers)
  React.useEffect(()=>{

    const fetchUserFromSitLevel=async()=>{
        // start
        // const siteContext = await sp.site.openWebById(OthProps.siteID);
        // const user0 = await siteContext.web.siteUsers();

        // const combineUsersArray=user0.map((user)=>(
        //       {
        //       userId:user.Id,
        //       value: user.Title,
        //       label: user.Title,
        //       email: user.Email,
        //   }
        // ))
        // console.log("Site Users",combineUsersArray);
        // setSiteUsers(combineUsersArray);

        // fetch the data from site Gropus
          const [
          users,
          users1,
          users2,
          users3,
          users4,
        ] = await Promise.all([
          sp.web.siteGroups.getByName(`${OthProps.Entity}_Read`).users(),
          sp.web.siteGroups.getByName(`${OthProps.Entity}_Initiator`).users(),
          sp.web.siteGroups.getByName(`${OthProps.Entity}_Contribute`).users(),
          sp.web.siteGroups.getByName(`${OthProps.Entity}_Admin`).users(),
          sp.web.siteGroups.getByName(`${OthProps.Entity}_View`).users(),
        ]);

        const combineArray = [
          ...(users || []),
          ...(users1 || []),
          ...(users2 || []),
          ...(users3 || []),
          ...(users4 || []),
        ];
        setSiteUsers(
          combineArray.map((user) => ( 
          {
            userId:user.Id,
            value: user.Title,
            label: user.Title,
            email: user.Email,
          }
        ))
        );
        console.log("combineArray", combineArray);

    }
    fetchUserFromSitLevel();
  },[]);

  //end   

  // Fetch users from SharePoint
  React.useEffect(() => {
    getcurrentuseremail();
    console.log(currentUserEmailRef.current ,"my current id")
    const fetchUsers = async () => {
      try {
        // start
        const siteContext = await sp.site.openWebById(OthProps.siteID);
        // const user0 = await siteContext.web.siteUsers();
        const approvalGroupUsers=await siteContext.web.siteGroups.getByName(`${OthProps.Entity}_Approval`).users();
        // console.log("approvalGroupUsers",approvalGroupUsers);
        const finalArray=approvalGroupUsers.map((user)=>(
                {
                    userId:user.Id,
                    value: user.Title,
                    label: user.Title,
                    email: user.Email,
                }
        ));
        console.log("finalArray",finalArray);
        setUsers(finalArray);
        // const combineUsersArray=user0.map((user)=>(
        //       {
        //       userId:user.Id,
        //       value: user.Title,
        //       label: user.Title,
        //       email: user.Email,
        //   }
        // ))
        // setUsers(combineUsersArray);
        // console.log("Sub site users",combineUsersArray);

        // const [
        //   users,
        //   users1,
        //   users2,
        //   users3,
        //   users4,
        // ] = await Promise.all([
        //   sp.web.siteGroups.getByName(`${OthProps.Entity}_Read`).users(),
        //   sp.web.siteGroups.getByName(`${OthProps.Entity}_Initiator`).users(),
        //   sp.web.siteGroups.getByName(`${OthProps.Entity}_Contribute`).users(),
        //   sp.web.siteGroups.getByName(`${OthProps.Entity}_Admin`).users(),
        //   sp.web.siteGroups.getByName(`${OthProps.Entity}_View`).users(),
        // ]);
          
        // const users=await sp.web.siteGroups.getByName(`${OthProps.Entity}_Read`).users();
        // const users1=await sp.web.siteGroups.getByName(`${OthProps.Entity}_Initiator`).users();
        // const users2 =await sp.web.siteGroups.getByName(`${OthProps.Entity}_Contribute`).users();
        // const users3=await sp.web.siteGroups.getByName(`${OthProps.Entity}_Admin`).users();
        // const users4=await sp.web.siteGroups.getByName(`${OthProps.Entity}_View`).users();
        // console.log(users, "users ", users1,users2,users3,users4);

        // const combineArray = [
        //   ...(users || []),
        //   ...(users1 || []),
        //   ...(users2 || []),
        //   ...(users3 || []),
        //   ...(users4 || []),
        // ];
        // setUsers(
        //   combineArray.map((user) => ( 
        //   {
        //     userId:user.Id,
        //     value: user.Title,
        //     label: user.Title,
        //     email: user.Email,
        //   }
        // ))
        // );
        // console.log("combineArray", combineArray);
        // end
      } catch (error) {
        console.error("Error fetching site users:", error);
      }
    };

    fetchUsers();
  }, []);

  const userOptions = users.map((user: any) => ({
    label: user.Title, // Display name
    value: user.Email, // Value for selection
  }));
  console.log(userOptions, "userOptions");

  console.log("component rendered", rows);

  const handleUserSelect = (selected: any, id: any) => {
    console.log(selectedUsers, "selectedUsers");
    console.log(selectedUsers, "selectedUsers");
    setSelectedUsers(selected || []);
    console.log(selected, "selected ");
    const newRows = rows.map((row) =>
      row.id === id ? { ...row, approvedUserList: selected } : row
    );
    console.log("Selected items", selected, id);
    // console.log(rows.length);
    setRows(newRows);
  };

  const handleAddRow = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    const newId = rows.length ? rows[rows.length - 1].id + 1 : 0;
    // setRows([...rows, { id: newId, approvedUser: "", searchTerm: "", filteredUsers: [] }]);

    // start
    setRows([
      ...rows,
      { id: newId, selectionType: "One", approvedUserList: [] },
    ]);
    //end
  };

//   remove new row
  const handleRemoveRow = (
    id: number,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    setRows(rows.filter((row) => row.id !== id));
  };

  // start
  const handleSelectionModeChange = (id: number, type: "All" | "One") => {
    const newRows = rows.map((row) =>
      row.id === id ? { ...row, selectionType: type } : row
    );
    setRows(newRows);
  };
  // end

  ///////////////////// form validation //////////////////////////////////////
  type FormErrors = {
    folderName?: string;
    folderPrivacy?: string;
    folderOverview?: string;
    selectedUsers?: any;
    fieldName? : any
    selectField? : any
    approvalOption?:any
  };
  // Define state variables to manage form input
  const [folderName, setFolderName] = useState("");
//   const [fieldName, setFieldName] = useState("");
  const [folderPrivacy, setFolderPrivacy] = useState("");
  console.log("Folder Privacy",folderPrivacy);
  const [folderOverview, setFolderOverview] = useState("");
  const [Approver, setApprover] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]); // Assuming multiple users
//   const [selectField, setSelectField] = useState(""); // For dropdown selection
  const [errors, setErrors] = useState<FormErrors>({}); // For validation errors

  // select the delete option
  // const [deleteOption, setDeleteOption]=useState("");

  // const handleDeleteOption=(event:any)=>{
  //     event.preventDefault();
  //     console.log("Target value of delete option", event.target.value);
  //     setDeleteOption(event.target.value);
  // }

  // Handle form submission (Create button click)
  const handleCreate = async(e: any) => {
    e.preventDefault();

    let validateColumns=false;
    let validateUser=false;
    // console.log("Handcreate called");

    // Validate the form
    let validationErrors: FormErrors = {};

    if(OthProps.DocumentLibrary !== ""){
      console.log("create Folder");
      if (!folderName.trim()) {
        validationErrors.folderName = "Folder Name is required.";
      }
      if (!folderOverview.trim()) {
        validationErrors.folderOverview = "Folder Overview is required.";
      }

    }else{
      console.log("create document library");
      if (!folderName.trim()) {
        validationErrors.folderName = "Folder Name is required.";
      }
      if(!approvalOption.trim()){
        validationErrors.approvalOption = "Approval Option is required.";
      }
      if (!folderPrivacy) {
        validationErrors.folderPrivacy = "Please select folder privacy.";
      }
      if (!folderOverview.trim()) {
        validationErrors.folderOverview = "Folder Overview is required.";
      }
      if(!validateUsersSelect() && toggleApproval){
        console.log("User errors checks called");
        validateUser=true;
      }
      if(!validateFields()){
          // console.log("select the fiels or type");
          validateColumns=true
      }
    }
    

    // If errors exist, set them to the state and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    }else if(validateColumns){
        
    }else if(validateUser){
        // alert("Please select at least one user");
    }
    else {
      
      const payloadForFolderMaster={
        SiteTitle:OthProps.Entity,
        CurrentUser:currentUserEmailRef.current
      }

      if(OthProps.DocumentLibrary === ""){
        (payloadForFolderMaster as any).DocumentLibraryName=folderName;
        //  (payloadForFolderMaster as any).FolderPath=`/sites/IntranetUAT/${OthProps.Entity}/${folderName}`;
         (payloadForFolderMaster as any).FolderPath=`${locationPath}/${OthProps.Entity}/${folderName}`;
        // (payloadForFolderMaster as any).FolderPath=`/sites/AlRostmani/${OthProps.Entity}/${folderName}`;
        (payloadForFolderMaster as any).IsLibrary=true;

      }else{
        (payloadForFolderMaster as any).DocumentLibraryName=OthProps.DocumentLibrary;
        (payloadForFolderMaster as any).FolderPath=`${OthProps.folderpath}/${folderName}`;
        (payloadForFolderMaster as any).IsFolder=true;

        if(OthProps.Folder ===  ""){
            (payloadForFolderMaster as any).FolderName=folderName;
        }else{
            (payloadForFolderMaster as any).FolderName=folderName;
            (payloadForFolderMaster as any).ParentFolderId=OthProps.Folder;
            
        }
        if(folderPrivacy === "private"){
          (payloadForFolderMaster as any).IsPrivate=true;
        }else if(folderPrivacy === "public"){
          (payloadForFolderMaster as any).IsPrivate=false;
        }
      }

      if(OthProps.Department !== ""){
        (payloadForFolderMaster as any).Department=OthProps.Department
      }
      if(OthProps.Devision !== ""){
        (payloadForFolderMaster as any).Devision=OthProps.Devision
      }

      console.log("payloadForFolderMaster",payloadForFolderMaster);
      console.log("Approved User list",rows);

      

      const addedItem = await sp.web.lists.getByTitle("DMSFolderMaster").items.add(payloadForFolderMaster);
      console.log("Item added successfully in the DMSFolderMaster", addedItem);


      // new code for Creating Folder inside the document library
      if(OthProps.DocumentLibrary !== ""){

          try {
          
            console.log("Create Folder Inside this Document Library -",OthProps.DocumentLibraryName);
            const {web}=await sp.site.openWebById(OthProps.siteID);
            const folderAddResult = await web.folders.addUsingPath(`${OthProps.folderpath}/${folderName}`);
            console.log("Folder created successfully -",folderAddResult);
          } catch (error) {
            console.log("Error In creating Folder Inside the Document Library",error);
          }
        
      
      }
      // END NEW CODE

      if(OthProps.DocumentLibrary === "" && toggleApproval){

            let payloadForFolderPermissionMaster={
              SiteName:OthProps.Entity,
              DocumentLibraryName:folderName,
              CurrentUser:currentUserEmailRef.current,
            }

            rows.forEach((row)=>{

              payloadForFolderPermissionMaster={
                SiteName:OthProps.Entity,
                DocumentLibraryName:folderName,
                CurrentUser:currentUserEmailRef.current,
  
              }

              row.approvedUserList.forEach(async(user:any)=>{
                // (payloadForFolderPermissionMaster as any).ApprovalUser=user.value
                console.log("user",user.value);
                console.log("userID",user.userId);
                console.log("id",row.id);

                
                if(row.selectionType === "All"){
                  (payloadForFolderPermissionMaster as any).ApprovalType=1;
                }else if(row.selectionType === "One"){
                  (payloadForFolderPermissionMaster as any).ApprovalType=0;
                };


                // (payloadForFolderPermissionMaster as any).ApprovalUser={
                //   "__metadata": {"type": "SP.FieldUserValue" },
                //   LookupId: user.userId
                // };

                // const ensureUser=await sp.web.ensureUser(user.email);  
                // console.log("user to update",ensureUser);

                (payloadForFolderPermissionMaster as any).ApprovalUserId=user.userId;

                (payloadForFolderPermissionMaster as any).Level=row.id + 1;
                console.log("payloadForFolderPermissionMaster",payloadForFolderPermissionMaster);

                // Add the payload DMSFolderPermissionMaster
                try {
                  const addedItem = await sp.web.lists.getByTitle("DMSFolderPermissionMaster").items.add(payloadForFolderPermissionMaster);
                  console.log("Item added successfully in the payloadForFolderPermissionMaster", addedItem);
                } catch (error) {
                  console.log("Error adding items to DMSFolderPermissionMaster",error);
                }
               
              })
              

            })
      }
      

    if(OthProps.DocumentLibrary === ""){

          console.log("Add the Columns when create document library");
          const payloadForPreviewFormMaster={
            SiteName:OthProps.Entity,
            DocumentLibraryName:folderName,
            IsRequired:true,
            AddorRemoveThisColumn:"Add To Library"
          }

          // console.log("payloadForPreviewFormMaster",payloadForPreviewFormMaster)
          
          let optionSelectedForPrivacy:boolean;
          if(folderPrivacy === "private"){
            optionSelectedForPrivacy=true;
          }else if(folderPrivacy === "public"){
            optionSelectedForPrivacy=false;
          }
          let optionSelectedForApprovals:boolean;
          if(approvalOption === "Yes"){
            optionSelectedForApprovals=true;
          }else if(approvalOption === "No"){
            optionSelectedForApprovals=false;
          }

          const payload={
            SiteName:OthProps.Entity,
            DocumentLibraryName:folderName,
            IsDocumentLibrary:true,
            IsPrivate:optionSelectedForPrivacy,
            IsHardDelete:false,
            IsApproval:optionSelectedForApprovals
          }
          console.log("payload for DMSPreviewFormField for IsDocumentLibrary",payload)
          const addedItem = await sp.web.lists.getByTitle("DMSPreviewFormMaster").items.add(payload);
          console.log("Item added successfully in the DMSPreviewFormField for IsDocumentLibrary", addedItem);

          formFields.forEach(async(field)=>{
            // type.replace(/\s+/g, '').toLowerCase();
                (payloadForPreviewFormMaster as any).ColumnName=field.fieldName.replace(/\s+/g,'');
                (payloadForPreviewFormMaster as any).ColumnType=field.selectField
                console.log("Call the Api with this payload",payloadForPreviewFormMaster)

                const addedItem = await sp.web.lists.getByTitle("DMSPreviewFormMaster").items.add(payloadForPreviewFormMaster);
                console.log("Item added successfully in the DMSPreviewFormField", addedItem);
                
          })
    }

    // new code  creating payload for DMSFolderPrivacy and add the data
      // if(OthProps.DocumentLibrary === "" && permission === true){
        // if(permission === true){

    // Add permission  to all whetehr its document library folder or subfolder
          const payloadForDMSFolderPrivacy={
            SiteName:OthProps.Entity,
            CurrentUser:currentUserEmailRef.current,
            IsModified:false,
            // DocumentLibraryName:folderName
          }
          if(OthProps.DocumentLibrary === ""){
            (payloadForDMSFolderPrivacy as any).DocumentLibraryName=folderName;
          }else{
            (payloadForDMSFolderPrivacy as any).DocumentLibraryName=OthProps.DocumentLibrary;
            (payloadForDMSFolderPrivacy as any).FolderName=folderName;
          }

          if(folderPrivacy === "private"){
            (payloadForDMSFolderPrivacy as any).PublicFolderPermission=false;
          }else if(folderPrivacy === "public"){
            (payloadForDMSFolderPrivacy as any).PublicFolderPermission=true;
          }

          console.log("Payload for DMSFolderPrivacy without selected field",payloadForDMSFolderPrivacy);
          const addedItem1 = await sp.web.lists.getByTitle("DMSFolderPrivacy").items.add(payloadForDMSFolderPrivacy);
          console.log("Added data to DMSFolderPrivacy without selected field",addedItem1);

          rowsForPermission.forEach((row)=>{
              console.log("row",row.selectedPermission);
              row.selectedUserForPermission.forEach(async(user:any)=>{
                (payloadForDMSFolderPrivacy as any).User=user.value;
                (payloadForDMSFolderPrivacy as any).UserID=user.userId;
                (payloadForDMSFolderPrivacy as any).UserPermission=row.selectedPermission;
                payloadForDMSFolderPrivacy.IsModified=false;
                console.log("Payload for DMSFolderPrivacy after slecetd value",payloadForDMSFolderPrivacy);
                try {
                  const addedItem = await sp.web.lists.getByTitle("DMSFolderPrivacy").items.add(payloadForDMSFolderPrivacy);
                  console.log("Item added to the list DMSFolderPrivacy after selected value ",addedItem);
                } catch (error) {
                  console.log("Erroe in adding items in the DMSFolderPrivacy after selected value",error);
                }
              })
          })
          // selectedArrayForUserPermission.forEach(async(user)=>{
          //   (payloadForDMSFolderPrivacy as any).User=user.value;
          //   (payloadForDMSFolderPrivacy as any).UserID=user.userId;
          //   (payloadForDMSFolderPrivacy as any).UserPermission=selectedPermissionValue;
          //   payloadForDMSFolderPrivacy.IsModified=false;

          //   console.log("Payload for DMSFolderPrivacy after slecetd value",payloadForDMSFolderPrivacy);

          //   try {
          //     const addedItem = await sp.web.lists.getByTitle("DMSFolderPrivacy").items.add(payloadForDMSFolderPrivacy);
          //     console.log("Item added to the list DMSFolderPrivacy after selected value ",addedItem);
          //   } catch (error) {
          //     console.log("Erroe in adding items in the DMSFolderPrivacy after selected value",error);
          //   }
            
          // })

      // }
    // new code end
            
      // Clear form on successful submission
      Swal.fire({
        title: "Folder Created Successfully",
        text: "Folder Created Successfully. It will reflect after a few seconds as we set up everything for the folder.",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(); // This will reload the page
          onReturnToMain()
        }
        if(result.isDismissed){
          location.reload();
          onReturnToMain()
        }
      });
      
      //  setTimeout(() => {
      //     Swal.close(); // Close the pop-up
      //     onReturnToMain(); // Call onReturnToMain if needed
      //   }, 3000); // 3000 milliseconds = 3 seconds
      
      clearForm();
    }
  };
  // Handle form reset (Cancel button click)
  const clearForm = () => {
    setFolderName("");
    setFolderPrivacy("");
    setFolderOverview("");
    // setSelectField("");
    setApprover("");
    setErrors({});
    // setFormFields([{ id:0, fieldName: '', selectField: ''}]);
    // setRows([{ id: 0, selectionType: "One", approvedUserList: [] }])
  };

  // Handle radio button change for folder privacy
  const handlePrivacyChange = (e: any) => {
    setFolderPrivacy(e.target.value);
  };

  return (
    <>
      <button className="BackButton me-3 mb-3"
         onClick={()=>{location.reload() ;onReturnToMain()}}
      >
 
        Back
      </button>
      <div className="container mt-3">
        <div className="card cardborder p-3" style={{
          
        }}>
          <form>
            <div className="row mt-3">
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label htmlFor="folderName" className="headerfont">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    className="form-control fieldmargin"
                    id="folderName"
                    placeholder="Enter project name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                  />
                  {errors.folderName && (
                    <span className="text-danger">{errors.folderName}</span>
                  )}
                </div>
              </div>
              {/* {togglefolderPrivacy &&  ( */}
                  <div className="col-12 col-md-6" id="folderPrivacy" style={{
                      width:"25%"
                  }}>
                        <div className="form-group">
                          <label htmlFor="folderPrivacy" className="headerfont">
                            Folder Privacy
                          </label>
                        <div>
                        <div className="form-check form-check-inline fieldmargin">
                          <input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              handlePrivacyChange(e);
                              // handleToggleApproval();
                              // handlePermissionToggle(true);
                            }}
                            className="form-check-input"
                            type="radio"
                            name="folderPrivacy"
                            id="private"
                            value="private"
                            checked={folderPrivacy === "private"}
                          />
                          <label className="form-check-label" htmlFor="private">
                            Private
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              handlePrivacyChange(e);
                              // handleToggleRemove();
                              // handlePermissionToggle(false);
                            }}
                            className="form-check-input"
                            type="radio"
                            name="folderPrivacy"
                            id="public"
                            value="public"
                            checked={folderPrivacy === "public"}
                          />
                          <label className="form-check-label" htmlFor="public">
                            Public
                          </label>
                        </div>
                      </div>
                      {errors.folderPrivacy && (
                        <span className="text-danger">{errors.folderPrivacy}</span>
                      )}
                        </div>
                  </div>
              {/* )} */}

              {togglefolderPrivacy &&  (
              <div className="col-12 col-md-6" id="approvalOption" style={{
                   width:"25%"
              }}>
                <div className="form-group">
                          <label htmlFor="approvalOption" className="headerfont">
                            Approval
                          </label>
                        <div>
                        <div className="form-check form-check-inline fieldmargin">
                          <input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              // handleDeleteOption(e);
                              handleToggleApproval(e);
                            }}
                            className="form-check-input"
                            type="radio"
                            name="approvalOption"
                            id="Yes"
                            value="Yes"
                            checked={approvalOption === "Yes"}
                          />
                          <label className="form-check-label" htmlFor="Yes">
                            Yes
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              // handleDeleteOption(e);
                              handleToggleRemove(e);
                            }}
                            className="form-check-input"
                            type="radio"
                            name="approvalOption"
                            id="No"
                            value="No"
                            checked={approvalOption === "No"}
                          />
                          <label className="form-check-label" htmlFor="No">
                              No
                          </label>
                        </div>
                      </div>
                      {errors.approvalOption && (
                        <span className="text-danger">{errors.approvalOption}</span>
                      )}
                </div>
              </div>
             )}
            </div>

            <div className="form-group mt-3">
                  <label htmlFor="folderOverview" className="headerfont">
                    Folder Overview
                  </label>
                  <textarea
                    className="form-control fieldmargin multilinetextWidth"
                    id="folderOverview"
                    placeholder="Enter some brief about project"
                    value={folderOverview}
                    onChange={(e) => setFolderOverview(e.target.value)}
                  />
                  {errors.folderOverview && (
                    <span className="text-danger">{errors.folderOverview}</span>
                  )}
            </div>


            {toggleaddFieldsButton && ( 
                <div className="row mt-3" id="addFieldsButton">
                  <div className="col-md-6"></div>
                  <div className="col-md-5"></div>
                  <div style={{position:'relative'}} className="col-md-1">
                  <div className="mb-3">
                    <div className="col-12 d-flex justify-content-end">
                        <a onClick={handleAddFields}>
                        <img 
                              className="bi bi-plus"
                              src={require("../assets/plus.png")}
                              alt="add"
                              style={{ width: "50px", top:'46px', marginLeft:'16px', position:'absolute', height: "50px" }}
                            />
                       
                        </a>
                    </div>
                    </div>
                  </div>
                    
                </div>
            )}
            {/* <div className="row mt-3">
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label htmlFor="fieldName" className="headerfont">
                    Field Name
                  </label>
                  <input
                    type="text"
                    className="form-control fieldmargin"
                    id="fieldName"
                    placeholder="Enter field name"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                  />
                    <span className="text-danger">{errors.fieldName}</span>
                </div>
            </div>

            <div className="col-12 col-md-6">
                <div className="form-group">
                  <label htmlFor="selectField" className="headerfont">
                    Select Field Type
                  </label>
                  <select
                    className="form-control"
                    value={selectField}
                    onChange={(e) => setSelectField(e.target.value)}
                  >
                    <option value="">Open this select menu</option>
                    <option value="Single Line of Text">Single Line of Text</option>
                    <option value="Multiple Line of Text">Multiple Line of Text</option>
                    <option value="Yes or No">Yes or No</option>
                    <option value="Date & Time">Date & Time</option>
                    <option value="Number">Number</option>
                  </select>
                  <span className="text-danger">{errors.selectField}</span>
                </div>
            </div>
            </div> */}
    
    {togglecolumneDetails && formFields.map((formField) => (
        <div className="row mt-3" key={formField.id} id="columnDetail">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor={`fieldName-${formField.id}`} className="headerfont">
                Field Name
              </label>
              <input
                type="text"
                className="form-control fieldmargin"
                id={`fieldName-${formField.id}`}
                name="fieldName"
                placeholder="Enter field name"
                value={formField.fieldName}
                onChange={(e) => handleInputChange(formField.id, e)}
              />
              {/* <span className="text-danger">{errors.fieldName}</span> */}
              {errors1[formField.id]?.fieldName && (
                <span className="text-danger">{errors1[formField.id].fieldName}</span>
              )}
            </div>
          </div>

          <div className="col-12 col-md-5">
            <div className="form-group">
              <label htmlFor={`selectField-${formField.id}`} className="headerfont">
                Select Field Type
              </label>
              <select
                className="form-control"
                id={`selectField-${formField.id}`}
                name="selectField"
                value={formField.selectField}
                onChange={(e) => handleSelectedType(formField.id, e)}
              >
                <option value="">Open this select menu</option>
                <option value="Single Line of Text">Single Line of Text</option>
                <option value="Multiple Line of Text">Multiple Line of Text</option>
                <option value="Yes or No">Yes or No</option>
                <option value="Date & Time">Date & Time</option>
                <option value="Number">Number</option>
              </select>
              {/* <span className="text-danger">{errors.selectField}</span> */}
              
                  {errors1[formField.id]?.selectField && (
                <span className="text-danger">{errors1[formField.id].selectField}</span>
              )}
            </div>
          </div>

          {formField.id === 0 ? (
                  <></>
                ) : (
                  <div className="col-12 col-md-1 d-flex align-items-end">
                    <a
                      onClick={(e) => handleRemoveField(formField.id, e)}
                      style={{
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                      }}
                    >
                      <img style={{marginTop:'14px'}}
                        className="fas fa-trash"
                        src={require("../assets/del.png")}
                        alt="delete"
                      />
                    </a>
                  </div>
                )}
        </div>
        
      ))}

          </form>
        </div>
      </div>
      {toggleApproval ? (
        <div className="container mt-3">
          <div className="card cardborder marginleftcard" style={{
            
        }}>
            <h5 className="mb-3 Permissionsectionstyle">
              <strong>Approval Hierarchy</strong>
            </h5>
            <p className="subheadernew">
              Define approval hierarchy for the documents submitted by Team
              members in this folder.
            </p>
            <div className="mb-3">
              <div className="col-12 d-flex justify-content-end">
                <a onClick={handleAddRow}>
                  <img
                    className="bi bi-plus"
                    src={require("../assets/plus.png")}
                    alt="add"
                    style={{ width: "50px", height: "50px" }}
                  />
                </a>
              </div>
            </div>
            <div className="row mb-3 approvalheirarcystyle">
              <div className="col-12 col-md-4">
                <label
                  htmlFor="level"
                  className="form-label approvalhierarcyfont"
                >
                  Level
                </label>
              </div>
              <div className="col-12 col-md-6">
                <label
                  htmlFor="approver"
                  className="form-label approvalhierarcyfont"
                >
                  Approver
                </label>
              </div>
            </div>
            {rows.map((row) => (
              <div className="row mb-3 approvalheirarchyfield" key={row.id}>
                <div className="col-12 col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    id={`level-${row.id}`}
                    value={`Level ${row.id + 1}`}
                    disabled
                  />
                </div>
                <div className="col-12 col-md-6">
                  {/* start */}
                  <Select
                    isMulti
                    options={users}
                    // value={Approver}
                    onChange={(selected: any) =>
                      handleUserSelect(selected, row.id)
                    }
                    placeholder="Enter names or email addresses..."
                    noOptionsMessage={() => "No User Found..."}
                  />
                  {/* {errors.selectedUsers && (
                    <span className="text-danger">{errors.selectedUsers}</span>
                  )} */}
                  {errorsForUserSelection[row.id]?.userSelect && (
                      <span className="text-danger">{errorsForUserSelection[row.id].userSelect}</span>
                  )}
                  {/* end */}
                </div>
                {/* start */}
                <div className="col-12 col-md-2 d-flex">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`selection-${row.id}`}
                      id={`all-${row.id}`}
                      value="all"
                      checked={row.selectionType === "All"}
                      onChange={() => handleSelectionModeChange(row.id, "All")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`all-${row.id}`}
                    >
                      All
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`selection-${row.id}`}
                      id={`one-${row.id}`}
                      value="one"
                      checked={row.selectionType === "One"}
                      onChange={() => handleSelectionModeChange(row.id, "One")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`one-${row.id}`}
                    >
                      One
                    </label>
                  </div>
                </div>
                {/* end */}

                {row.id === 0 ? (
                  <></>
                ) : (
                  <div className="col-12 col-md-2 d-flex align-items-end">
                    <a
                      onClick={(e) => handleRemoveRow(row.id, e)}
                      style={{
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        className="fas fa-trash"
                        src={require("../assets/del.png")}
                        alt="delete"
                      />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h1></h1>
      )}
      
      {/* {permission && ( */}
        <div className="container mt-3">
                <div className="card cardborder marginleftcard" style={{
               
                  }}>
                      <h5 className="mb-3 Permissionsectionstyle">
                          <strong>Permission</strong>
                      </h5>
                      <div className="row">
                        <div className="col-md-6"></div>
                        <div className="col-md-5"></div>
                        <div className="col-md-1">
                        <div style={{position:'relative'}} className="mb-3">
                        <div className="col-12  d-flex justify-content-end">
                          <a onClick={handleAddRowForPermission}>
                            <img 
                              className="bi bi-plus"
                              src={require("../assets/plus.png")}
                              alt="add"
                              style={{ width: "50px", top:'10px', marginLeft:'10px', position:'absolute', height: "50px" }}
                            />
                          </a>
                        </div>
                      </div>
                        </div>

                      </div>
                      
                      {rowsForPermission.map((rowForPermission)=>(
                          <div className="row mb-3 approvalheirarcystyle" key={rowForPermission.id}>
                              <div className="col-12 col-md-6">
                                  <Select
                                      isMulti
                                      options={siteUsers}
                                      onChange={(selected: any) =>
                                        handleUserSelectForPermission(selected,rowForPermission.id)
                                      }
                                      placeholder="Enter names or email addresses..."
                                      noOptionsMessage={() => "No User Found..."}
                                  />
                              </div>
                              <div className="col-12 col-md-5" 
                              
                              >
                                  <Select
                                      options={permissionArray}
                                      onChange={(selected: any) =>
                                        handlePermissionSelect(selected,rowForPermission.id)
                                      }
                                      placeholder="Select Permission"
                                      noOptionsMessage={() => "No Such Permission Find"}
                                  />
                              </div>
                              {rowForPermission.id === 0 ? (
                                  <></>
                                ) : (
                                  <div className="col-12 col-md-1 d-flex align-items-end">
                                    <a
                                      onClick={(e) => handleRemoveRowForPermission(rowForPermission.id, e)}
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <img
                                        className="fas fa-trash"
                                        src={require("../assets/del.png")}
                                        alt="delete"
                                      />
                                    </a>
                                  </div>
                                )}
                          </div>
                      ))}
                      {/* <div className="row mb-3 approvalheirarcystyle">
                            <div className="col-12 col-md-6">
                                <Select
                                    isMulti
                                    options={users}
                                    onChange={(selected: any) =>
                                      handleUserSelectForPermission(selected,0)
                                    }
                                    placeholder="Enter names or email addresses..."
                                    noOptionsMessage={() => "No User Found..."}
                                />
                            </div>
                            <div className="col-12 col-md-6" style={{
                              width:"auto"
                            }}>
                                <Select
                                    options={permissionArray}
                                    onChange={(selected: any) =>
                                      handlePermissionSelect(selected,0)
                                    }
                                    placeholder="Select Permission"
                                    noOptionsMessage={() => "No Such Permission Find"}
                                />
                            </div>

                      </div> */}
                      <div className="d-flex mt-3 justify-content-center buttonstyle">
        <button
          className="btn btn-create me-2 mt-0 btncolorCreate"
          onClick={handleCreate}
        >
          <img
            className="bi"
            src={require("../assets/checkmark2.png")}
            alt="Create"
          />
          Create
        </button>
        <button className="btn btn-cancel btncolorcancel" onClick={clearForm}>
          <img
            className="bi"
            src={require("../assets/cross.png")}
            alt="Cancel"
          />
          Cancel
        </button>
      </div>
                </div>
        </div>
      {/* ) */}
      {/* } */}
      <br/>
      
    </>
  );
};

export default CreateFolder;
