export default function Loading() {
  return <main className="container loading-main" aria-label="লোড হচ্ছে"><div className="loading-title skeleton" /><div className="product-grid">{Array.from({ length: 8 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton skeleton-art" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line short" /></div>)}</div></main>;
}
