import styles from "./CamperCard.module.css";
const formatPrice = (value) => `€${Number(value).toFixed(2)}`;
function CamperCard({ camper }) {
  const {
    id,
    name = "Unknown",
    price = 0,
    image,
    location = "-",
    rating,
    reviews,
    features = [],
  } = camper || {};
  return (
    <>
      <article className={styles.CamperCard}>
        {/* sol taraf görsel */}
        <figure className={styles.ImageWrap}>
          <img src={image || "/Pic.png"} alt={name} loading="lazy" />
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
                {features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
          </div>
          {/* yeni sekmedem detay aç */}

          <div className={styles.ShowMore}>
            <button
              type="button"
              className={styles.ShowMoreButton}
              onClick={() =>
                window.open(`/catalog/${id}`, "_blank", "noopener,noreferrer")
              }
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
