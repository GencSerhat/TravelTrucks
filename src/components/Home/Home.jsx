import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
const navigate = useNavigate();
const handleViewClick = () => {
  navigate("/catalog");
}
  return (
    <>
      <Navbar />
      <section className={styles.HomeBanner}>
        <div className={styles.HomeTextContainer}>
          <h1 className={styles.HomeTextH1}>Campers of your dreams</h1>
          <h2 className={styles.HomeTextH2}>
            You can find everything you want in our catalog
          </h2>

          <button className={styles.ViewButton} type="button" onClick={handleViewClick}>View Now</button>
        </div>
      </section>
    </>
  );
}
export default Home;
