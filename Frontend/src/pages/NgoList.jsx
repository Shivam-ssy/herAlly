import { useContext } from "react";
import NgoCard from "../components/NgoCard";
import ShowContext from "../context/ShowContext";

function NgoList() {
  const { ngoList, userData } = useContext(ShowContext);
  
  return (
    <>
      <section
        data-scroll-section
        className="
          px-10 py-10 
          grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
          gap-6
          min-h-screen
          place-items-center
          max-w-7xl
          mx-auto
        "
      >
        {ngoList.length ? (
          ngoList.map((list, index) => (
            <NgoCard
              key={index}
              isUser={userData?.role==="user"}
              id={list._id}
              user={userData._id}
              title={list.name}
              details={list?.ngoDetails?.details || "No details found. Contact for more info."}
              image={list?.image || "/login2.jpeg"}
            />
          ))
        ) : (
          <div>No NGO found...</div>
        )}
      </section>
    </>
  );
}

export default NgoList;
