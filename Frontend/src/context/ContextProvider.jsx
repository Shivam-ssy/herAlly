import React from "react";
import ShowContext from "./ShowContext.js";
import { useState,useEffect } from "react";
import config from "../Conf/cofig.js";
const ShowContextProvider = ({children}) => {
    const [userData,setUserData]=useState(null)
    const [ngoList,setNgoList]=useState([])
    const [stylesChange, setStyleChange] = useState(true);
    const [loader,setloader]=useState(false)
    const [connectedUser,setConnectedUser]=useState([])

  useEffect(()=>{
    const fetchdata=async()=>{
      const user = await fetch(config.getCurrentUser, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());      
      setUserData(user.data)
      if(userData?.email){
        setStyleChange(false)
      }
      const ngoData = await fetch(config.getNgoList, {
        method: "GET",
      }).then((res) => res.json());
      setNgoList(ngoData.data)
    }
    fetchdata()
  },[loader])
  useEffect(() => {
    const fetchUser = async () => {
      const ngoData = await fetch(config.connectedUser, {
        method: "GET",
        credentials:"include"
      }).then((res) => res.json());
      setConnectedUser(ngoData.data)
    };
    
    fetchUser();
  }, [location]);  
    return(
        <ShowContext.Provider value={{userData,ngoList,stylesChange, setStyleChange,loader,connectedUser,setloader}}>    
        {children}
        </ShowContext.Provider>
    )
   
}
export default ShowContextProvider