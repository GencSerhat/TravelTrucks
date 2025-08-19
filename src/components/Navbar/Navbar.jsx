import styles from "./Navbar.module.css";
function Navbar() {
  return (
    <>
      <nav className={styles.Navbar}>
        <div className={styles.logoDiv}>
          <img
            src="../../../public/Logo.png"
            alt="TravelTrucks"
            className={styles.LogoNavbar}
          />
        </div>
        <div className={styles.NavbarCenter}>
          <ul className={styles.NavbarList}>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/catalog">Catalog</a>
            </li>
          </ul>
        </div>
        <div className={styles.NavbarRight}></div>
      </nav>
    </>
  );
}
export default Navbar;
