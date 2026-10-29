export type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
  description?: string | null;
  markets: Market[];
};

export type Category = { id: string; slug: string; nameBn: string; icon: string };

const API_BASES = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export const fallbackCategories: Category[] = [
  { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", nameBn: "তেল", icon: "🫙" },
  { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥚" },
  { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

const fallbackProducts: Product[] = [
  { id: 1, slug: "sorno-machi-chal", nameBn: "স্বর্ণমাছি চাল", category: "chal", categoryNameBn: "চাল", categoryIcon: "🍚", unit: "kg", image: "🍚", today: 148, yesterday: 145, lastWeek: 142, lastMonth: 138, change: { dir: "up", pct: 2.1 }, markets: [{ market: "কারওয়ান বাজার", division: "ঢাকা", min: 146, max: 165 }, { market: "সদর বাজার", division: "রাজশাহী", min: 134, max: 148 }] },
  { id: 2, slug: "miniket-chal", nameBn: "মিনিকেট চাল", category: "chal", categoryNameBn: "চাল", categoryIcon: "🍚", unit: "kg", image: "🍚", today: 99, yesterday: 102, lastWeek: 105, lastMonth: 100, change: { dir: "down", pct: -2.9 }, markets: [{ market: "কারওয়ান বাজার", division: "ঢাকা", min: 95, max: 108 }] },
  { id: 3, slug: "mosur-dal", nameBn: "মসুর ডাল", category: "dal", categoryNameBn: "ডাল", categoryIcon: "🫘", unit: "kg", image: "🫘", today: 132, yesterday: 129, lastWeek: 125, lastMonth: 122, change: { dir: "up", pct: 2.3 }, markets: [{ market: "কারওয়ান বাজার", division: "ঢাকা", min: 128, max: 140 }] },
  { id: 4, slug: "soybean-oil", nameBn: "সয়াবিন তেল", category: "tel", categoryNameBn: "তেল", categoryIcon: "🫙", unit: "liter", image: "🫙", today: 172, yesterday: 172, lastWeek: 174, lastMonth: 175, change: { dir: "flat", pct: 0 }, markets: [{ market: "কারওয়ান বাজার", division: "ঢাকা", min: 168, max: 178 }] },
  { id: 5, slug: "potato", nameBn: "আলু", category: "sobji", categoryNameBn: "সবজি", categoryIcon: "🥬", unit: "kg", image: "🥔", today: 35, yesterday: 38, lastWeek: 42, lastMonth: 40, change: { dir: "down", pct: -7.9 }, markets: [{ market: "কারওয়ান বাজার", division: "ঢাকা", min: 32, max: 40 }] },
  { id: 6, slug: "onion", nameBn: "পেঁয়াজ", category: "sobji", categoryNameBn: "সবজি", categoryIcon: "🥬", unit: "kg", image: "🧅", today: 68, yesterday: 65, lastWeek: 62, lastMonth: 58, change: { dir: "up", pct: 4.6 }, markets: [{ market: "কারওয়ান বাজার", division: "ঢাকা", min: 64, max: 76 }] },
  { id: 7, slug: "ilish", nameBn: "ইলিশ মাছ", category: "mach", categoryNameBn: "মাছ", categoryIcon: "🐟", unit: "kg", image: "🐟", today: 1850, yesterday: 1800, lastWeek: 1750, lastMonth: 1700, change: { dir: "up", pct: 2.8 }, markets: [{ market: "কারওয়ান বাজার", division: "ঢাকা", min: 1800, max: 2200 }] },
  { id: 8, slug: "eggs", nameBn: "ডিম", category: "dim-dui", categoryNameBn: "ডিম-দুধ", categoryIcon: "🥚", unit: "dozen", image: "🥚", today: 145, yesterday: 150, lastWeek: 148, lastMonth: 152, change: { dir: "down", pct: -3.3 }, markets: [{ market: "কারওয়ান বাজার", division: "ঢাকা", min: 140, max: 155 }] },
];

async function fetchFromApi<T>(path: string): Promise<T | null> {
  if (typeof window !== "undefined") {
    try {
      const response = await fetch(path.startsWith("/products") ? `/api${path}` : `/api${path}`, { cache: "no-store" });
      if (response.ok) return (await response.json()) as T;
    } catch (error) {
      console.error(`BazarDor catalog request failed for ${path}`, error);
    }
    return null;
  }
  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${path}`, { cache: "no-store", signal: AbortSignal.timeout(7000) });
      if (response.ok) return (await response.json()) as T;
    } catch (error) {
      console.error(`BazarDor API request failed for ${base}${path}`, error);
    }
  }
  return null;
}

export async function getProducts(category?: string): Promise<Product[]> {
  const path = category ? `/products?category=${encodeURIComponent(category)}` : "/products";
  const result = await fetchFromApi<Product[]>(path);
  if (Array.isArray(result)) return result;
  return category ? fallbackProducts.filter((product) => product.category === category) : fallbackProducts;
}

export async function getCategories(): Promise<Category[]> {
  const result = await fetchFromApi<Category[]>("/categories");
  return Array.isArray(result) ? result : fallbackCategories;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  const bySlug = products.find((product) => product.slug === slug);
  if (bySlug) return bySlug;

  const match = slug.match(/^\d+$/);
  if (!match) return undefined;
  const result = await fetchFromApi<Product>(`/products/${slug}`);
  return result && typeof result.id === "number" ? result : undefined;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  const bySlug = categories.find((category) => category.slug === slug);
  if (bySlug) return bySlug;
  const result = await fetchFromApi<Category>(`/categories/${slug}`);
  return result && typeof result.slug === "string" ? result : undefined;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("bn-BD", { minimumFractionDigits: value === 0 ? 1 : value % 1 === 0 ? 0 : 1, maximumFractionDigits: 1 }).format(value);
}

export function unitLabel(unit: string): string {
  const labels: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
  };
  return labels[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}
