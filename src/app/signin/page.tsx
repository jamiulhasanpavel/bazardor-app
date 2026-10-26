"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message ?? "সাইন ইন করা যায়নি");
      toast.success("স্বাগতম! সফলভাবে সাইন ইন হয়েছে");
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "সাইন ইন করা যায়নি");
    } finally {
      setBusy(false);
    }
  }

  async function socialSignIn(provider: "google" | "github") {
    try {
      const result = await authClient.signIn.social({ provider, callbackURL: "/" });
      if (result.error) toast.error(result.error.message ?? `${provider} দিয়ে সাইন ইন করা যায়নি`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `${provider} দিয়ে সাইন ইন করা যায়নি`);
    }
  }

  return <main className="auth-page"><section className="auth-card"><Link className="auth-brand" href="/">🛒 বাজার দর</Link><span className="eyebrow">আপনার বাজার, আপনার হাতেই</span><h1>আবার স্বাগতম</h1><p className="auth-intro">আপনার অ্যাকাউন্টে সাইন ইন করুন</p><form onSubmit={signIn} onInvalidCapture={() => toast.error("ইমেইল ও পাসওয়ার্ড সঠিকভাবে পূরণ করুন")} className="auth-form"><label>ইমেইল<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="আপনার ইমেইল" /></label><label>পাসওয়ার্ড<input type="password" autoComplete="current-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="কমপক্ষে ৮ অক্ষর" /></label><button className="button auth-submit" disabled={busy}>{busy ? "সাইন ইন হচ্ছে…" : "সাইন ইন"}</button></form><div className="auth-divider"><span>অথবা</span></div><div className="social-buttons"><button onClick={() => socialSignIn("google")} type="button">G&nbsp; Google দিয়ে চালিয়ে যান</button><button onClick={() => socialSignIn("github")} type="button">⌘&nbsp; GitHub দিয়ে চালিয়ে যান</button></div><p className="auth-switch">অ্যাকাউন্ট নেই? <Link href="/signup">সাইন আপ করুন</Link></p></section></main>;
}

export default function SignInPage() {
  return <Suspense fallback={<main className="auth-page"><div className="skeleton auth-skeleton" /></main>}><SignInForm /></Suspense>;
}
