import Link from "next/link";
import { formatPercent, formatPrice, unitLabel, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const direction = product.change.dir;
  return (
    <Link href={`/product/${product.slug}`} className="product-card">
      <div className="product-art"><span>{product.image}</span><span className="product-category">{product.categoryNameBn}</span></div>
      <div className="product-card-body">
        <div className="product-title-row"><h3>{product.nameBn}</h3><span aria-hidden="true">↗</span></div>
        <p className="unit-label">{unitLabel(product.unit)}</p>
        <div className="price-line"><span>আজকের দাম</span><strong>{formatPrice(product.today)} <small>টাকা</small></strong></div>
        <div className={`change-badge ${direction}`}>
          {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"}
          {formatPercent(Math.abs(product.change.pct))}% {direction === "up" ? "বেড়েছে" : direction === "down" ? "কমেছে" : "অপরিবর্তিত"}
        </div>
      </div>
    </Link>
  );
}
