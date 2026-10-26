"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { getCategories, getProducts, type Category, type Product } from "@/lib/products";

type SortOrder = "default" | "asc" | "desc";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");

  useEffect(() => {
    Promise.all([getCategories(), getProducts(slug)]).then(([categories, categoryProducts]) => {
      setCategory(categories.find((item) => item.slug === slug));
      setProducts(categoryProducts);
    }).finally(() => setLoading(false));
  }, [slug]);

  const sortedProducts = useMemo(() => {
    if (sortOrder === "default") return products;
    return [...products].sort((a, b) => sortOrder === "asc" ? a.today - b.today : b.today - a.today);
  }, [products, sortOrder]);

  if (loading) return <main className="container loading-main"><div className="category-heading skeleton" /><div className="product-grid">{Array.from({ length: 6 }, (_, i) => <div className="skeleton-card" key={i}><div className="skeleton skeleton-art" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line short" /></div>)}</div></main>;
  if (!category || products.length === 0) return <main className="empty-page"><span className="empty-icon">🧺</span><p className="eyebrow">বিভাগটি পাওয়া যায়নি</p><h1>এই বিভাগে কোনো পণ্য নেই</h1><p>অন্য বিভাগ থেকে আপনার প্রয়োজনীয় পণ্যটি খুঁজে নিন।</p><Link href="/" className="button">হোম পেজে ফিরে যান</Link></main>;

  return <main className="container category-page"><div className="category-heading"><div><div className="breadcrumb"><Link href="/">হোম</Link><span>/</span><span>{category.nameBn}</span></div><div className="category-title"><span>{category.icon}</span><div><p className="eyebrow">বাজারদর বিভাগ</p><h1>{category.nameBn}</h1></div></div><p className="category-description">{category.nameBn} বিভাগের আজকের বাজারদর ও পরিবর্তনের হালনাগাদ তালিকা।</p></div><label className="sort-control">সাজান:
      <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} aria-label="দামের ক্রমে সাজান">
        <option value="default">ডিফল্ট</option><option value="asc">দাম: কম থেকে বেশি</option><option value="desc">দাম: বেশি থেকে কম</option>
      </select><span aria-hidden="true">⌄</span>
    </label></div><p className="results-count">{products.length}টি পণ্য পাওয়া গেছে</p><ProductGrid products={sortedProducts} /></main>;
}
