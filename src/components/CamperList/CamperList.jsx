import CamperCard from "../CamperCard/CamperCard";

import styles from "./CamperList.module.css";

function CamperList({ campers }) {
  const list = Array.isArray(campers) ? campers : [];
  return (
    <>
      <div className={styles.CamperList}>
        {list.map((c) => (
          <CamperCard key={c.id} camper={c} />
        ))}
      </div>
    </>
  );
}
export default CamperList;
