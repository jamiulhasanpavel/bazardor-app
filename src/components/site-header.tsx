"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { formatPercent, formatPrice, getCategories, getProducts, type Category, type Product, unitLabel } from "@/lib/products";
import toast from "react-hot-toast";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [date, setDate] = useState("");
  const { data: session } = authClient.useSession();

  useEffect(() => {
    getCategories().then(setCategories);
    getProducts().then(setProducts);
    const timer = window.setTimeout(() => {
      setDate(new Intl.DateTimeFormat("bn-BD", { weekday: "long", day: "numeric", month: "long" }).format(new Date()));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function signOut() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message ?? "সাইন আউট করা যায়নি");
        return;
      }
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "সাইন আউট করা যায়নি");
    }
  }

  return (
    <header className="site-header">
      <div className="container header-main">
        <Link href="/" className="brand" aria-label="বাজার দর হোম">
          <span className="brand-mark">🛒</span>
          <span><strong>বাজার দর</strong><small>{date}</small></span>
        </Link>
        <nav className="category-nav" aria-label="পণ্যের বিভাগ">
          <Link className={pathname === "/" ? "nav-link active" : "nav-link"} href="/">সব পণ্য</Link>
          {categories.map((category) => (
            <Link className={pathname === `/category/${category.slug}` ? "nav-link active" : "nav-link"} href={`/category/${category.slug}`} key={category.slug}>
              <span>{category.icon}</span> {category.nameBn}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {session?.user ? (
            <>
              <Link href="/profile" className="profile-link">{session.user.name || "আমার প্রোফাইল"}</Link>
              <button className="button button-outline button-small" onClick={signOut}>সাইন আউট</button>
            </>
          ) : (
            <>
              <Link className="signin-link" href="/signin">সাইন ইন</Link>
              <Link className="button button-small" href="/signup">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>
      <div className="ticker" aria-label="আজকের বাজারদর">
        <div className="ticker-track">
          {[...products, ...products].map((product, index) => (
            <span className="ticker-item" key={`${product.id}-${index}`}>
              <span>{product.image}</span> {product.nameBn} <b>{formatPrice(product.today)} টাকা/{unitLabel(product.unit)}</b>
              <em className={product.change.dir}>{product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—"} {formatPercent(Math.abs(product.change.pct))}%
              </em>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
