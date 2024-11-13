import { useState,useEffect, useContext } from "react";
import NgoCard from "../components/NgoCard"
import config from "../Conf/cofig";
import ShowContext from "../context/ShowContext";

function NgoHome() { 
    const {userData,connectedUser}=useContext(ShowContext)
 
console.log(connectedUser);

  return (
    <>
    <section data-scroll-section className="px-10 py-10 gap-5 justify-center flex flex-wrap min-h-screen" >
      {/* <NgoCard title="Jagori" image="/login2.jpeg" time="4 Jan"  details="violence, harrasement, Dalit women confronting caste violence," />
      <NgoCard title="Apne Aap Women Worldwide" image="/login2.jpeg" time="4 Jan"  details="sex trafficking, prostitution, and sexual exploitation" />
      <NgoCard title="My Choices Foundation" image="/login2.jpeg" time="4 Jan"  details="Domestic violence, sex trafficking" />
      {/* <NgoCard title="give me " image="/login2.jpeg" time="4 Jan"  details="sometigng" />
      <NgoCard title="give me " image="/login2.jpeg" time="4 Jan"  details="sometigng" />
      <NgoCard title="give me " image="/login2.jpeg" time="4 Jan"  details="sometigng" />
      <NgoCard title="give me " image="/login2.jpeg" time="4 Jan"  details="sometigng" /> */} 
      {
        connectedUser.length>0? connectedUser.map((list,index)=>(
          <NgoCard  key={index} id={list._id} user={userData._id} title={list.name} details={list?.details || "No Details found Conctact for details"} image={list?.image || "/login2.jpeg"}/>
        )):<div>No connected user found...</div>
      }
    </section>
    {/* <section data-scroll-section className="h-50"></section> */}
    </>
  )
}

export default NgoHome
