"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { getProducts, type Product } from "@/lib/products";

function ProductSection({ title, subtitle, products, accent }: { title: string; subtitle?: string; products: Product[]; accent?: string }) {
  return <section className="content-section">
    <div className="section-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{accent && <span className="section-pill">{accent}</span>}</div>
    <ProductGrid products={products} />
  </section>;
}

function SkeletonGrid() {
  return <div className="product-grid">{Array.from({ length: 8 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton skeleton-art" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line short" /></div>)}</div>;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  const risers = [...products].filter((product) => product.change.dir === "up").sort((a, b) => b.change.pct - a.change.pct).slice(0, 6);
  const fallers = [...products].filter((product) => product.change.dir === "down").sort((a, b) => a.change.pct - b.change.pct).slice(0, 6);

  return <>
    <main>
      <section className="hero container">
        <div className="hero-copy"><span className="eyebrow"><i /> প্রতিদিনের বাজার, এক নজরে</span><h1>বাজারের সঠিক দাম,<br /><em>সিদ্ধান্ত আপনার।</em></h1><p>বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের হালনাগাদ বাজারদর জানুন সহজেই।</p><a href="#সব-পণ্য" className="button hero-cta">আজকের বাজারদর দেখুন <span>↓</span></a><div className="hero-trust"><span>✓</span> বাজারের হালনাগাদ তথ্য · ৮টি বিভাগ</div></div>
        <div className="hero-visual" aria-label="বাজারের তাজা পণ্য"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><span className="hero-produce produce-rice">🍚</span><span className="hero-produce produce-tomato">🍅</span><span className="hero-produce produce-greens">🥬</span><span className="hero-produce produce-fish">🐟</span><span className="hero-produce produce-onion">🧅</span><div className="hero-sticker">আজকের<br /><b>বাজারদর</b> <span>↓</span></div><div className="hero-caption">তাজা তথ্য, প্রতিদিন</div></div>
      </section>
      <div className="container">
        <section className="market-summary"><div><span className="summary-icon">📍</span><span><strong>বাংলাদেশের বাজার</strong><small>সারা দেশের দৈনিক দামের তুলনা</small></span></div><div className="summary-stat"><strong>৮+</strong><span>বিভাগ</span></div><div className="summary-stat"><strong>{products.length ? `${products.length}+` : "৩৩+"}</strong><span>নিত্যপণ্য</span></div><div className="summary-updated"><span className="live-dot" /> আজকের হালনাগাদ</div></section>
        {loading ? <div className="content-section"><div className="loading-title skeleton" /><SkeletonGrid /></div> : <>
          <ProductSection title="আজ দাম বেড়েছে" subtitle="যেসব পণ্যের দাম আজ ঊর্ধ্বমুখী" products={risers} accent="▲ ঊর্ধ্বমুখী" />
          <ProductSection title="আজ দাম কমেছে" subtitle="যেসব পণ্যে মিলছে স্বস্তির দাম" products={fallers} accent="▼ নিম্নমুখী" />
          <section id="সব-পণ্য" className="content-section all-products"><div className="section-heading"><div><span className="eyebrow">আজকের বাজার তালিকা</span><h2>সব পণ্য</h2><p>আপনার নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ দাম এক জায়গায়।</p></div><span className="section-pill">{products.length}টি পণ্য</span></div><ProductGrid products={products} /></section>
        </>}
      </div>
    </main>
  </>;
}
