"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { formatPercent, formatPrice, unitLabel, type Product } from "@/lib/products";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    fetch(`/api/products/${encodeURIComponent(slug)}`).then(async (response) => {
      if (response.status === 404) return undefined;
      if (!response.ok) throw new Error("পণ্যের তথ্য লোড করা যায়নি");
      return response.json() as Promise<Product>;
    }).then((foundProduct) => {
      setProduct(foundProduct);
      if (foundProduct && !session?.user) {
        toast.error("পণ্যের বিস্তারিত দেখতে সাইন ইন করুন");
        router.replace(`/signin?callbackUrl=${encodeURIComponent(`/product/${slug}`)}`);
      }
    }).catch((error: unknown) => {
      console.error("Failed to load product details", error);
      toast.error("পণ্যের তথ্য লোড করা যায়নি");
    }).finally(() => setLoading(false));
  }, [isPending, session, router, slug]);

  if (isPending || loading) return <main className="container loading-main"><div className="skeleton category-heading" /><div className="skeleton-card detail-skeleton" /></main>;
  if (!product) return <main className="empty-page"><span className="empty-icon">🧺</span><p className="eyebrow">পণ্যটি পাওয়া যায়নি</p><h1>এই পণ্যটি আর তালিকায় নেই</h1><Link href="/" className="button">হোম পেজে ফিরে যান</Link></main>;
  if (!session?.user) return <main className="loading-main" />;

  const prices = product.markets.flatMap((market) => [market.min, market.max]);
  const minPrice = prices.length ? Math.min(...prices) : product.today;
  const maxPrice = prices.length ? Math.max(...prices) : product.today;
  const averagePrice = prices.length ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) : product.today;
  return <main className="container detail-page">
    <div className="breadcrumb"><Link href="/">হোম</Link><span>/</span><Link href={`/category/${product.category}`}>{product.categoryNameBn}</Link><span>/</span><span>{product.nameBn}</span></div>
    <section className="detail-summary"><div className="detail-emoji">{product.image}</div><div className="detail-copy"><p className="eyebrow">আজকের বাজার প্রতিবেদন</p><h1>{product.nameBn}</h1><p>{product.description || `${product.nameBn} এর আজকের দাম ${product.change.dir === "up" ? "বেড়েছে" : product.change.dir === "down" ? "কমেছে" : "অপরিবর্তিত"}। সারা দেশের বাজারদর দেখে নিন।`}</p><div className="detail-tags"><Link href={`/category/${product.category}`}>{product.categoryIcon} {product.categoryNameBn}</Link><span>{unitLabel(product.unit)}</span></div></div><div className="detail-current-price"><span>আজকের গড় দাম</span><strong>{formatPrice(product.today)}</strong><small>টাকা / {unitLabel(product.unit)}</small><span className={`change-badge ${product.change.dir}`}>{product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—"} {formatPercent(Math.abs(product.change.pct))}%</span></div></section>
    <section className="content-section detail-prices"><div className="section-heading"><div><h2>দামের সারসংক্ষেপ</h2><p>বিভিন্ন বাজারের আজকের দর অনুযায়ী</p></div></div><div className="price-summary-grid"><div><span>সর্বনিম্ন দাম</span><strong>{formatPrice(minPrice)} <small>টাকা</small></strong></div><div><span>সর্বোচ্চ দাম</span><strong>{formatPrice(maxPrice)} <small>টাকা</small></strong></div><div><span>গড় দাম</span><strong>{formatPrice(averagePrice)} <small>টাকা</small></strong></div></div></section>
    <section className="content-section bazaar-section"><div className="section-heading"><div><h2>বাজারভিত্তিক আজকের দাম</h2><p>বিভিন্ন বাজারের দামের তুলনা</p></div><span className="section-pill">{product.markets.length}টি বাজার</span></div><div className="market-table-wrap"><table className="market-table"><thead><tr><th>বাজার</th><th>বিভাগ</th><th>সর্বনিম্ন</th><th>সর্বোচ্চ</th></tr></thead><tbody>{product.markets.map((market) => <tr key={`${market.market}-${market.division}`}><td><span className="market-pin">⌖</span>{market.market}</td><td>{market.division}</td><td>{formatPrice(market.min)} টাকা</td><td><strong>{formatPrice(market.max)} টাকা</strong></td></tr>)}</tbody></table></div></section>
  </main>;
}
