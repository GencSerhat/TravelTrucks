// components/CamperDetails/CamperDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./CamperDetails.module.css";

// API base:
const API_BASE = "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io";

function CamperDetails() {
  const { id } = useParams();
  const location = useLocation();

  // Katalogdan "Show more" ile gelen ön veriler (optimistic render için):
  const preloadedCamper = location.state?.camper || null;
  const preloadedFilters = location.state?.appliedFilters || null;

  // Ekran durumları:
  const [camper, setCamper] = useState(preloadedCamper);
  const [appliedFilters, setAppliedFilters] = useState(preloadedFilters);
  const [loading, setLoading] = useState(!preloadedCamper); // preload varsa direkt göster, yoksa yükleniyor
  const [error, setError] = useState(null);

  // Sekmeler: features | reviews
  const [activeTab, setActiveTab] = useState("features");

  // Form durumları (basit – uncontrolled da yapabilirdik; burada controlled kullandım)
  const [form, setForm] = useState({
    name: "",
    email: "",
    bookingDate: "",
    comment: "",
  });

  // ID değişince veriyi çek
  useEffect(() => {
    let isMounted = true;

    async function fetchCamperDetails() {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/campers/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setCamper(data);
          // Not: filtreler sadece katalogta anlamlı; ama state ile geldiyse göstermek için saklıyoruz
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Detaylar yüklenemedi. Lütfen tekrar deneyin.");
          setLoading(false);
        }
      }
    }

    // preload varsa yine de tazele (katalogtan farklı olabilir)
    fetchCamperDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Güvenli alan okumaları (null guard)
  const title = camper?.name || camper?.title || "Camper";
  const price = camper?.price ?? null;
  const rating = camper?.rating ?? null;
  const locationText = camper?.location || camper?.address || null;

  // Görseller: gallery (dizi) varsayımı
  const images = useMemo(() => {
    const g = camper?.gallery || camper?.images || [];
    return Array.isArray(g) ? g.filter(Boolean) : [];
  }, [camper]);

  // Özellikler/teknikler için esnek okuma
  const featuresList = useMemo(() => {
    // Ör: camper.features = ["Automatic","AC","Petrol","Kitchen","Radio"]
    if (Array.isArray(camper?.features)) return camper.features;

    // Alternatif: boolean/nitelik map’inden rozet üret
    const flags = [];
    if (camper?.transmission) flags.push(camper.transmission);
    if (camper?.AC || camper?.ac) flags.push("AC");
    if (camper?.engine) flags.push(camper.engine);
    if (camper?.kitchen) flags.push("Kitchen");
    if (camper?.radio) flags.push("Radio");
    if (camper?.bathroom) flags.push("Bathroom");
    return flags;
  }, [camper]);

  // Araç detay ölçüleri/teknik veriler
  const vehicleDetails = useMemo(() => {
    // Ör: camper.details = { form, length, width, height, tank, consumption }
    const d = camper?.details || camper?.specs || {};
    const pairs = [
      ["Form", d.form ?? camper?.vehicleType ?? camper?.type],
      ["Length", d.length],
      ["Width", d.width],
      ["Height", d.height],
      ["Tank", d.tank],
      ["Consumption", d.consumption],
      ["Seats", camper?.seats],
      ["Beds", camper?.beds],
      ["Transmission", camper?.transmission],
      ["Engine", camper?.engine],
    ].filter(([, v]) => v !== undefined && v !== null && v !== "");
    return pairs;
  }, [camper]);

  // Yorumlar
  const reviews = useMemo(() => {
    // Ör: camper.reviews = [{author, rating, date, text}, ...]
    if (Array.isArray(camper?.reviews)) return camper.reviews;
    // Yoksa boş
    return [];
  }, [camper]);

  // Filtrelerin görünmesi (katalogtan geldiyse)
  const hasIncomingFilters = !!appliedFilters && Object.keys(appliedFilters).length > 0;

  // Form helpers
  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    // Basit doğrulama
    if (!form.name.trim() || !form.email.trim() || !form.bookingDate.trim()) {
      alert("Lütfen zorunlu alanları doldurun (Name, Email, Booking date).");
      return;
    }
    // Burada backend’e gönderim yapılabilir
    console.log("[Reservation submit]:", form, { camperId: id, title });
    alert("Talebiniz alındı! En kısa sürede dönüş yapacağız.");
    // Temizle
    setForm({ name: "", email: "", bookingDate: "", comment: "" });
  }

  // Yükleniyor / Hata
  if (loading) {
    return (
      <div className={styles.CamperDetails}>
        <p>Yükleniyor…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.CamperDetails}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.CamperDetails}>
      {/* Üst Başlık Alanı */}
      <div className={styles.TitleAndReviewsAndPrice}>
        <h1>{title}</h1>

        <div className={styles.ReviewsAndLocation}>
          {/* Puan + yorum sayısı */}
          <span>
            {typeof rating === "number" ? `⭐ ${rating}` : "⭐—"}
            {Array.isArray(reviews) ? ` (${reviews.length} reviews)` : ""}
          </span>
          {/* Konum */}
          {locationText ? <span> • 📍 {locationText}</span> : null}
        </div>

        {/* Fiyat */}
        {price != null ? <div className={styles.Price}>€{price}/day</div> : null}

        {/* Katalogdan gelen filtreleri göster (geldiyse) */}
        {hasIncomingFilters && (
          <div className={styles.AppliedFiltersBar}>
            <strong>Applied filters: </strong>
            {Object.entries(appliedFilters).map(([k, v]) => (
              <span key={k} className={styles.FilterPill}>
                {k}: {String(v)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Galeri */}
      <div className={styles.GalleryGrid}>
        {images.length > 0 ? (
          <ul className={styles.GalleryList}>
            {images.slice(0, 6).map((src, idx) => (
              <li key={idx}>
                <img src={src} alt={`${title} image ${idx + 1}`} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.GalleryEmpty}>No images available</div>
        )}
      </div>

      {/* Ana içerik: Sol içerik + Sağ aside */}
      <div className={styles.FeaturesReviewsAndContact}>
        {/* SOL: Sekmeler ve içerik */}
        <div className={styles.Features}>
          {/* Description */}
          {camper?.description ? (
            <>
              <h2>Description</h2>
              <p className={styles.Description}>{camper.description}</p>
            </>
          ) : null}

          {/* Tabs */}
          <div className={styles.FeaturesAndReviewsBtn}>
            <button
              aria-pressed={activeTab === "features"}
              onClick={() => setActiveTab("features")}
            >
              Features
            </button>
            <button
              aria-pressed={activeTab === "reviews"}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>

          {/* Tab İçerikleri */}
          {activeTab === "features" && (
            <>
              {/* Rozet/Özellikler */}
              {featuresList?.length ? (
                <div className={styles.FeaturesList}>
                  <ul>
                    {featuresList.map((f, i) => (
                      <li key={`${f}-${i}`}>{f}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No features listed.</p>
              )}

              {/* Teknik Detaylar */}
              {vehicleDetails?.length ? (
                <div className={styles.VehicleDetails}>
                  <h3>Vehicle details</h3>
                  <dl>
                    {vehicleDetails.map(([k, v]) => (
                      <div key={k} className={styles.DetailRow}>
                        <dt>{k}</dt>
                        <dd>{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </>
          )}

          {activeTab === "reviews" && (
            <div className={styles.ReviewsList}>
              {reviews.length ? (
                <ul>
                  {reviews.map((r, i) => (
                    <li key={i}>
                      <div className={styles.ReviewHead}>
                        <strong>{r.author || "Anonymous"}</strong>{" "}
                        <span>• {typeof r.rating === "number" ? `⭐ ${r.rating}` : "⭐—"}</span>
                        {r.date ? <span> • {r.date}</span> : null}
                      </div>
                      {r.text ? <p>{r.text}</p> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Henüz yorum yok.</p>
              )}
            </div>
          )}
        </div>

        {/* SAĞ: Rezervasyon/İletişim Kartı */}
        <aside className={styles.Contact}>
          <div className={styles.ContactCard}>
            <h3>Book your campervan now</h3>
            <p>Stay connected! We are always ready to help you.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.FormGroup}>
                <label htmlFor="name">Name*</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.FormGroup}>
                <label htmlFor="email">Email*</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.FormGroup}>
                <label htmlFor="bookingDate">Booking date*</label>
                <input
                  id="bookingDate"
                  name="bookingDate"
                  type="date"
                  value={form.bookingDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.FormGroup}>
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  name="comment"
                  placeholder="Your message"
                  rows={4}
                  value={form.comment}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className={styles.SubmitBtn}>
                Send
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CamperDetails;
