import CamperCard from "../components/CamperCard/CamperCard";
function CatalogPage() {
  const dummyCamper = {
    id: 1,
    name: "Mavericks",
    price: 8000,
    description:
      "Embrace simplicity and freedom with the Mavericks panel truck...",
    location: "Berlin",
    likes: 120,
  };
  return (
    <>
      <CamperCard camper={dummyCamper}/>
    </>
  );
}

export default CatalogPage;
