import Link from "next/link";

export default function NotFound() {
  return <main className="empty-page"><span className="empty-icon">🧺</span><p className="eyebrow">পৃষ্ঠা খুঁজে পাওয়া যায়নি</p><h1>দুঃখিত, এই পৃষ্ঠাটি নেই</h1><p>ঠিকানাটি পরিবর্তিত বা সরানো হয়ে থাকতে পারে।</p><Link href="/" className="button">হোম পেজে ফিরে যান</Link></main>;
}
