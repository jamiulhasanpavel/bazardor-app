"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("প্রোফাইল দেখতে সাইন ইন করুন");
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) return <main className="container loading-main"><div className="skeleton auth-skeleton" /></main>;
  return <main className="container profile-page"><p className="eyebrow">আপনার অ্যাকাউন্ট</p><h1>আমার প্রোফাইল</h1><section className="profile-card"><div className="profile-avatar">{session.user.name?.charAt(0) || "👤"}</div><div><span className="eyebrow">নাম</span><strong>{session.user.name}</strong><span className="eyebrow">ইমেইল</span><strong>{session.user.email}</strong></div><Link href="/profile/update" className="button">তথ্য আপডেট করুন</Link></section></main>;
}
