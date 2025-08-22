import { useState } from "react";
import styles from "./LeftSidebar.module.css";

const EQUIPMENT = [
  { key: "AC", label: "AC" },
  { key: "automatic", label: "Automatic" },
  { key: "kitchen", label: "Kitchen" },
  { key: "TV", label: "TV" },
  { key: "bathroom", label: "Bathroom" },
];

const VEHICLE_TYPES = [
  { key: "van", label: "van" },
  { key: "integrated", label: "Fully Integrated" },
  { key: "alcove", label: "Alcove" },
];
/**
 * onApply(filters) üst bileşenden verilecek.
 * Örn CatalogPage: <LeftSidebar onApply={(f)=> dispatch(fetchCampers({...f, page:1, limit:4}))} />
 */

function LeftSidebar() {
  const [location, setLocation] = useState("");
  const [selectedEquip, setSelectedEquip] = useState(new Set()); // Çoklu seçim
  const [vehicleType, setVehicleType] = useState(""); // tek seçim

  const toggleEquip = (key) => {
    setSelectedEquip((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  const handleApply = () => {
    //seçilen ekipmanları objeye çevirdim
    const equipmentFlags = {};

    EQUIPMENT.forEach(({ key }) => {
      equipmentFlags[key] = selectedEquip.has(key) ? true : undefined;
    });
    const filters = {
      location: location || undefined,
      type: vehicleType || undefined,
      ...equipmentFlags,
    };
    onApply?.(filters); //üst bileşene verecek
  };
  const handleReset = () => {
    setLocation("");
    setSelectedEquip(new Set());
    setVehicleType("");
    onApply?.({}); // filtrleeri temizletip çağırmak
  };

  return (
    <>
      <aside className={styles.LeftSidebar}>
        <div className={styles.Location}>
          <label className={styles.LocationLabel} htmlFor="location">
            Location
          </label>
          <input
            id="location"
            type="text"
            className={styles.LocationInput}
            placeholder="Kyiv, Ukraine"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className={styles.Filters}>
          <label htmlFor="">Filters</label>
          <h3>Vehicle equipment</h3>
          <div className={styles.EquipmentList}>
            {EQUIPMENT.map(({ key, label }) => {
              const active = selectedEquip.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  className={styles.chip}
                  data-active={active}
                  aria-pressed={active}
                  onClick={() => toggleEquip(key)}
                >
                  {/* burada ikon koyabilirsin */}
                  <span>{label}</span>
                </button>
              );
            })}
            <h2>Vehicle type</h2>
            <div className={styles.TypeList}>
              {VEHICLE_TYPES.map(({ key, label }) => {
                const active = vehicleType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={styles.chip}
                    data-active={active}
                    aria-pressed={active}
                    onClick={() => setVehicleType(key)}
                  >
                    {/* burada ikon koyabilirsin */}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            <div className={styles.Search}>
              <button className={styles.SearchBtn}>Search</button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default LeftSidebar;
