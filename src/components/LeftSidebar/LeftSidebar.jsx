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
  { key: "panelTruck", label: "van" },
  { key: "integrated", label: "Fully Integrated" },
  { key: "alcove", label: "Alcove" },
];


function LeftSidebar({onApply}) {
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
    const params = {
        location:location||undefined,
        form:vehicleType||undefined,
        //ekipmanlar
        AC:selectedEquip.has("AC")||undefined,
        kitchen:selectedEquip.has("kitchen")||undefined,
        bathroom:selectedEquip.has("bathroom")||undefined,
        TV:selectedEquip.has("TV")||undefined,
        //Automatic 
        transmission: selectedEquip.has("automatic") ?  "automatic" : undefined,
    };
    onApply?.(params);

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
              <button className={styles.SearchBtn} onClick={handleApply}>Search</button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default LeftSidebar;
