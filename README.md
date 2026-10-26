# বাজার দর — BazarDor

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের প্রতিদিনের দাম, বাজারভিত্তিক তুলনা এবং দামের ওঠানামা এক জায়গায় দেখার responsive বাংলা ওয়েব অ্যাপ।

## প্রযুক্তি

- Next.js App Router ও React
- TypeScript
- Tailwind CSS 4 এবং responsive custom CSS
- Better Auth (ইমেইল/পাসওয়ার্ড, Google ও GitHub OAuth)
- PostgreSQL
- React Hot Toast
- Programming Hero BazarDor API; বিকল্প API fallback

## প্রধান ফিচার

1. চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলার বিভাগসহ বাংলা responsive নেভিগেশন।
2. আজ দাম বেড়েছে/কমেছে তালিকা, চলমান বাজার ticker এবং সব পণ্যের গ্রিড।
3. পণ্য ও বিভাগভিত্তিক API data, skeleton loading, API fallback এবং অনুপস্থিত পণ্যের friendly 404।
4. সংখ্যাভিত্তিক দাম সাজানো এবং পণ্যের detail page-এ সর্বনিম্ন, সর্বোচ্চ, গড় ও বাজারভিত্তিক দাম।
5. Better Auth ইমেইল/পাসওয়ার্ড এবং Google/GitHub sign-in, protected product/profile pages, sign-out ও toast feedback।
6. প্রোফাইল নাম আপডেট, মোবাইল থেকে ডেস্কটপ পর্যন্ত responsive layout এবং সরাসরি route refresh support।

## চালানো

Node.js 20+ এবং PostgreSQL database ব্যবহার করুন।

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

`.env.local`-এ `DATABASE_URL` ও একটি দীর্ঘ random `BETTER_AUTH_SECRET` বসান। Google/GitHub login চালু করতে সংশ্লিষ্ট OAuth client ID/secret এবং callback URL-ও সেট করুন। OAuth callback URL হবে `https://<your-domain>/api/auth/callback/google` অথবা `/api/auth/callback/github`।

Better Auth-এর database schema PostgreSQL-এ তৈরি করুন:

```bash
npx auth@latest migrate
```

CLI project-এর Better Auth config থেকে প্রয়োজনীয় core tables তৈরি করে। এটি শুধু trusted local/deployment setup থেকে চালান। Local বা deployed environment-এ auth-এর জন্য PostgreSQL এবং production-এর জন্য নিজস্ব `BETTER_AUTH_SECRET` অবশ্যই প্রয়োজন। OAuth credentials না থাকলেও email/password flow চালু থাকবে।

## API

প্রধান উৎস: `https://openapi.programming-hero.com/api/bazardor`

- `GET /products`
- `GET /products?category=chal`
- `GET /products/1`
- `GET /categories`
- `GET /categories/chal`

প্রধান API ব্যর্থ হলে `api.api-store.workers.dev` এবং `api.abcz.workers.dev` fallback হিসেবে চেষ্টা করা হয়। সব remote API ব্যর্থ হলে UI সচল রাখতে ছোট স্থানীয় fallback catalog ব্যবহৃত হয়। API handlers browser-এর জন্য একই-সাইট `/api/products` ও `/api/categories` endpoint দেয়।

## Build ও deployment

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

Vercel-এ Next.js project import করে `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` এবং ব্যবহৃত OAuth credentials environment variables হিসেবে যোগ করুন। Database schema আগে apply করুন। Dynamic `/category/[slug]` ও `/product/[slug]` route App Router দ্বারা handle হয় এবং deploy-এর পর refresh করা যায়। এই repository-তে deployment credentials নেই; তাই production deployment provider-এ publish করা এই codebase থেকে করা হয়নি।
