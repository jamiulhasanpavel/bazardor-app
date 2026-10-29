"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type ProviderAvailability = { google: boolean; github: boolean };
type Provider = keyof ProviderAvailability;

export function SocialSignInButtons() {
  const [providers, setProviders] = useState<ProviderAvailability>();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/providers", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load sign-in providers.");
        return (await response.json()) as ProviderAvailability;
      })
      .then((availability) => {
        if (active) setProviders(availability);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  async function signIn(provider: Provider) {
    try {
      const result = await authClient.signIn.social({ provider, callbackURL: "/" });
      if (result.error) {
        toast.error(result.error.message ?? `${provider} দিয়ে সাইন ইন করা যায়নি`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `${provider} দিয়ে সাইন ইন করা যায়নি`);
    }
  }

  const options: { id: Provider; label: string }[] = [
    { id: "google", label: "G  Google দিয়ে চালিয়ে যান" },
    { id: "github", label: "⌘  GitHub দিয়ে চালিয়ে যান" },
  ];
  const unavailableProviders = providers
    ? options.filter(({ id }) => !providers[id]).map(({ id }) => id === "google" ? "Google" : "GitHub")
    : [];

  return (
    <>
      <div className="social-buttons">
        {options.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => signIn(id)}
            type="button"
            disabled={!providers?.[id]}
            title={!providers?.[id] ? `${id} OAuth credentials are not configured` : undefined}
          >
            {label}
          </button>
        ))}
      </div>
      {loadError && <p role="status">সাইন-ইন অপশন লোড করা যায়নি। পৃষ্ঠাটি রিফ্রেশ করে আবার চেষ্টা করুন।</p>}
      {unavailableProviders.length > 0 && (
        <p role="status">
          {unavailableProviders.join(" ও ")} sign-in চালু করতে `.env.local`-এ সংশ্লিষ্ট OAuth Client ID ও Client Secret যোগ করুন।
        </p>
      )}
    </>
  );
}
