import Navbar from "../Navbar/Navbar";
import styles from "./Home.module.css";

function Home() {
  return (
    <>
      <Navbar />
      <section className={styles.HomeBanner}>
        <div className={styles.HomeTextContainer}>
          <h1 className={styles.HomeTextH1}>Campers of your dreams</h1>
          <h2 className={styles.HomeTextH2}>
            You can find everything you want in our catalog
          </h2>

          <button className={styles.ViewButton}>View Now</button>
        </div>
      </section>
    </>
  );
}
export default Home;
