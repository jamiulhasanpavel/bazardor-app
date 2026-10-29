"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { SocialSignInButtons } from "@/components/social-sign-in-buttons";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function signUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await authClient.signUp.email({ name, email, password });
      if (result.error) throw new Error(result.error.message ?? "অ্যাকাউন্ট তৈরি করা যায়নি");
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন");
      router.push("/signin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "অ্যাকাউন্ট তৈরি করা যায়নি");
    } finally {
      setBusy(false);
    }
  }

  return <main className="auth-page"><section className="auth-card"><Link className="auth-brand" href="/">🛒 বাজার দর</Link><span className="eyebrow">আজই যুক্ত হোন</span><h1>নতুন অ্যাকাউন্ট</h1><p className="auth-intro">বাজারদর জানতে আপনার অ্যাকাউন্ট তৈরি করুন</p><form onSubmit={signUp} onInvalidCapture={() => toast.error("নাম, সঠিক ইমেইল ও অন্তত ৮ অক্ষরের পাসওয়ার্ড দিন")} className="auth-form"><label>আপনার নাম<input type="text" autoComplete="name" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} placeholder="পুরো নাম" /></label><label>ইমেইল<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="আপনার ইমেইল" /></label><label>পাসওয়ার্ড<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="কমপক্ষে ৮ অক্ষর" /></label><button className="button auth-submit" disabled={busy}>{busy ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "সাইন আপ"}</button></form><div className="auth-divider"><span>অথবা</span></div><SocialSignInButtons /><p className="auth-switch">আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/signin">সাইন ইন করুন</Link></p></section></main>;
}
