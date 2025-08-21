import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampers, resetCampers } from "../features/campers/campersSlice";
import CamperList from "../components/CamperList/CamperList";

function CatalogPage() {
  const dispatch = useDispatch();
  const { items, isLoading, error, hasMore } = useSelector((s) => s.campers);
  const [page, setPage] = useState(1);
  const limit = 4;

  useEffect(() => {
    dispatch(resetCampers());
    dispatch(fetchCampers({ page: 1, limit, append: false }));
    setPage(1);
    
  }, [dispatch]);

  const loadMore = () => {
    const next = page + 1;
    dispatch(fetchCampers({ page: next, limit, append: true }));
    setPage(next);
  };
  if (isLoading && items.length === 0) return <p>Loading...</p>;
  if (error) return <p>Hata : {error}</p>;

  return (
    <>
      <div>
        <CamperList campers={items} page={1} perPage={items.length} />
        {hasMore && (
          <button onClick={loadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </>
  );
}

export default CatalogPage;



// const dummyCampers = [
//     {
//       id: 1,
//       name: "Mavericks",
//       price: 8000,
//       description: "Embrace simplicity...",
//       location: "Berlin",
//       rating: 4.5,
//       reviews: 120,
//       features: ["Automatic", "AC", "Kitchen"],
//     },
//     {
//       id: 2,
//       name: "Explorer",
//       price: 95200,
//       description: "Perfect for long trips...",
//       location: "Hamburg",
//       rating: 4.8,
//       reviews: 200,
//       features: ["Manual", "Petrol", "TV"],
//     },
//     {
//       id: 3,
//       name: "Karavan",
//       price: 91500,
//       description: "Perfect for long trips...",
//       location: "Hamburg",
//       rating: 4.8,
//       reviews: 200,
//       features: ["Manual", "Petrol", "TV"],
//     },
//     {
//       id: 4,
//       name: "Kamyon",
//       price: 19000,
//       description: "Perfect for long trips...",
//       location: "Hamburg",
//       rating: 4.8,
//       reviews: 200,
//       features: ["Manual", "Petrol", "TV"],
//     },
//         {
//       id: 5,
//       name: "araba",
//       price: 19000,
//       description: "Perfect for long trips...",
//       location: "Hamburg",
//       rating: 4.8,
//       reviews: 200,
//       features: ["Manual", "Petrol", "TV"],
//     },
//   ];
