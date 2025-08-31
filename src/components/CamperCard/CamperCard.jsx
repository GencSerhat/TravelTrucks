import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CamperCard.module.css";

const LS_KEY = "favCamperIds";

const formatPrice = (value) => `€${Number(value).toFixed(2)}`;
function CamperCard({ camper, appliedFilters }) {
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [favIds, setFavIds] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return new Set((raw ? JSON.parse(raw) : []).map(String));
    } catch (error) {
      return new Set();
    }
  });

  const isFav = favIds.has(String(camper?.id));
  const likeBtn = () => {
    setFavIds((prev) => {
      const next = new Set(prev);
      const key = String(camper.id);
      next.has(key) ? next.delete(key) : next.add(key);
      localStorage.setItem(LS_KEY, JSON.stringify([...next]));
      // aynı sekmede diğer kartları tetikle
      window.dispatchEvent(new Event("favorites-changed"));
      return next;
    });
  };

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
        camper, // isim, fiyat, rating, görseller vb. anında gösterim için
        appliedFilters, // kullanıcı katalogta ne seçtiyse göstermek için
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
                className={`${styles.LikeBtn} ${isFav ? styles.Liked : ""}`}
                aria-label={
                  isFav ? "Remove from favorites" : "Add to favorites"
                }
                aria-pressed={isFav}
                onClick={likeBtn}
                title={isFav ? "Remove from favorites" : "Add to favorites"}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={styles.HeartIcon}
                  aria-hidden="true"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-2.64 2.14-4.5 5.35-4.5 1.76 0 3.32.86 4.17 2.18.85-1.32 2.41-2.18 4.18-2.18 3.21 0 5.35 1.86 5.35 4.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill={isFav ? "#E44848" : "none"}
                    stroke={isFav ? "#E44848" : "#101828"}
                    strokeWidth="2"
                  />
                </svg>
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
                {(showAllFilters ? features : features.slice(0, 4)).map(
                  (f, label) => (
                    <li key={f} className={styles.FeaturesList}>
                      <img
                        src={`/icons/${f.toLowerCase()}.png`}
                        alt={`${label}`}
                        className={styles.icon}
                      />
                      {f}
                    </li>
                  )
                )}
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
