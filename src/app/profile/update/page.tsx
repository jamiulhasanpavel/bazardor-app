"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const currentName = session?.user.name ?? "";
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("তথ্য আপডেট করতে সাইন ইন করুন");
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  async function updateName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await authClient.updateUser({ name: name ?? currentName });
      if (result.error) throw new Error(result.error.message ?? "তথ্য আপডেট করা যায়নি");
      toast.success("আপনার তথ্য আপডেট হয়েছে");
      router.push("/profile");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "তথ্য আপডেট করা যায়নি");
    } finally {
      setBusy(false);
    }
  }

  if (isPending || !session?.user) return <main className="container loading-main"><div className="skeleton auth-skeleton" /></main>;
  return <main className="auth-page"><section className="auth-card"><Link className="breadcrumb" href="/profile">← প্রোফাইলে ফিরে যান</Link><span className="eyebrow">অ্যাকাউন্ট সেটিংস</span><h1>তথ্য আপডেট</h1><p className="auth-intro">আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন</p><form onSubmit={updateName} onInvalidCapture={() => toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে")} className="auth-form"><label>নাম<input required minLength={2} value={name ?? session.user.name ?? ""} onChange={(event) => setName(event.target.value)} /></label><button className="button auth-submit" disabled={busy}>{busy ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}</button></form></section></main>;
}
