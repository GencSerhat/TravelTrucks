import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCampers,
  resetCampers,
} from "../../features/campers/campersSlice";
import CamperList from "../../components/CamperList/CamperList";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./CatalogPage.module.css";


function CatalogPage() {
  const dispatch = useDispatch();
  const { items, isLoading, error, hasMore } = useSelector((s) => s.campers);
  const [page, setPage] = useState(1);
  const { lastQuery } = useSelector((s) => s.campers);
  const limit = 4;

  useEffect(() => {
    dispatch(resetCampers());
    dispatch(fetchCampers({ page: 1, limit, append: false }));
    setPage(1);
  }, [dispatch]);
  // LeftSidebar'dan gelir
  const handleApply = (filters) => {
    dispatch(resetCampers());
    dispatch(fetchCampers({ page: 1, limit: 4, append: false, ...filters }));
    setPage(1);
  };
  const loadMore = () => {
    const next = page + 1;
    dispatch(
      fetchCampers({ page: next, limit: 4, append: true, ...lastQuery })
    );
    setPage(next);
  };
  if (isLoading && items.length === 0) return <p>Loading...</p>;
  if (error) return <p>Hata : {error}</p>;

  return (
    <>
      <Navbar />
      <div className={styles.CatalogPage}>
        <LeftSidebar onApply={handleApply} />
        <div className={styles.RightSide}>
          <CamperList campers={items} page={1} perPage={items.length} />
          <div className={styles.LoadMoreDiv}>
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={isLoading}
                className={styles.LoadMoreBtn}
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CatalogPage;
