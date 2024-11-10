import NgoCard from "../components/NgoCard"

function NgoList() {
  return (
    <>
    <section data-scroll-section className="px-10 py-10 gap-5 justify-center flex flex-wrap min-h-screen" >
      <NgoCard title="Jagori" image="/login2.jpeg" time="4 Jan"  details="violence, harrasement, Dalit women confronting caste violence," />
      <NgoCard title="Apne Aap Women Worldwide" image="/login2.jpeg" time="4 Jan"  details="sex trafficking, prostitution, and sexual exploitation" />
      <NgoCard title="My Choices Foundation" image="/login2.jpeg" time="4 Jan"  details="Domestic violence, sex trafficking" />
      {/* <NgoCard title="give me " image="/login2.jpeg" time="4 Jan"  details="sometigng" />
      <NgoCard title="give me " image="/login2.jpeg" time="4 Jan"  details="sometigng" />
      <NgoCard title="give me " image="/login2.jpeg" time="4 Jan"  details="sometigng" />
      <NgoCard title="give me " image="/login2.jpeg" time="4 Jan"  details="sometigng" /> */}
    </section>
    {/* <section data-scroll-section className="h-50"></section> */}
    </>
  )
}

export default NgoList
