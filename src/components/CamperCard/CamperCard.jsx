import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CamperCard.module.css";

const formatPrice = (value) => `€${Number(value).toFixed(2)}`;
function CamperCard({ camper, appliedFilters }) {
  const [showAllFilters, setShowAllFilters] = useState(false);
const navigate = useNavigate();
  const {
    id,
    name = "Unknown",
    price = 0,
    location = "-",
    rating,
    reviews,
    image,
    features = [],
    description,
  } = camper || {};


  const handleToggleFilters = () => {
    setShowAllFilters(!showAllFilters);
  };


const goDetails = () => {
    navigate(`/campers/${camper.id}`, {
      state: {
        camper,          // isim, fiyat, rating, görseller vb. anında gösterim için
        appliedFilters,  // kullanıcı katalogta ne seçtiyse göstermek için
      },
    });
  };


  return (
    <>
      <article className={styles.CamperCard}>
        {/* sol taraf görsel */}
        <figure className={styles.ImageWrap}>
          <img
            src={image || "/Pic.png"}
            alt={name}
            loading="lazy"
            onError={(e) => (e.target.src = "/Pic.png")}
          />
        </figure>
        {/* sağ taraf detaylar */}
        <div className={styles.CamperCardDetails}>
          <div className={styles.CamperTitleAndPrice}>
            <div className={styles.CamperCardTitle}>
              <h2>{name}</h2>
            </div>
            <div className={styles.PriceAndLike}>
              <span>{formatPrice(price)}</span>
              <button
                type="button"
                className={styles.LikeBtn}
                aria-label="Add to favorites"
              >
                <img src="/kalp.png" alt="" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className={styles.RatingCountsAndLocation}>
            <p className={styles.Reviews}>
              {typeof rating === "number" ? `★ ${rating}` : "★ —"}
              {typeof reviews === "number" ? ` (${reviews} reviews)` : ""}
            </p>
            <p>{location}</p>
          </div>
          <div className={styles.CardDescription}>
            <p>{camper?.description || "No description provided."}</p>
          </div>
          {/* özellikler bölümü */}
          <div className={styles.CardFeatures}>
            {features.length > 0 && (
              <ul className={styles.Features}>
                {(showAllFilters ? features : features.slice(0, 4)).map((f, label) => (
                  <li key={f} className={styles.FeaturesList} >
                     <img
                                          src={`/icons/${f.toLowerCase()}.png`}
                                          alt={`${label}`}
                                          className={styles.icon}
                                        />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* yeni sekmedem detay aç */}

          <div className={styles.ShowMore}>
            <button
              type="button"
              className={styles.ShowMoreButton}
              onClick={goDetails}
            >
              Show More
            </button>
          </div>
        </div>
      </article>
    </>
  );
}

export default CamperCard;
