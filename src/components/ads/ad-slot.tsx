"use client";
import { useEffect, useRef } from "react";
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}
/** consentGranted must come from the operator's region-appropriate CMP, never a default value. */
export function AdSlot({
  consentGranted = false,
  slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT,
}: {
  consentGranted?: boolean;
  slot?: string;
}) {
  const requested = useRef(false),
    element = useRef<HTMLModElement>(null);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const configured =
    process.env.NEXT_PUBLIC_ADS_ENABLED === "true" &&
    !!client &&
    /^ca-pub-\d+$/.test(client) &&
    !!slot &&
    /^\d+$/.test(slot);
  useEffect(() => {
    if (!configured || !consentGranted || requested.current) return;
    let cancelled = false;
    const request = () => {
      if (cancelled || requested.current || !element.current) return;
      requested.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* An ad blocker must not affect the calculator. */
      }
    };
    let script = document.querySelector<HTMLScriptElement>(
      "script[data-cml-ads]",
    );
    if (!script) {
      script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.cmlAds = "true";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.addEventListener("load", request, { once: true });
      document.head.appendChild(script);
    } else if (window.adsbygoogle) {
      request();
    } else {
      script.addEventListener("load", request, { once: true });
    }
    return () => {
      cancelled = true;
    };
  }, [configured, consentGranted, client]);
  if (!configured) return null;
  return (
    <aside className="ad-slot" aria-label="Advertisement">
      <small>ADVERTISEMENT</small>
      {consentGranted ? (
        <ins
          ref={element}
          className="adsbygoogle"
          style={{ display: "block", height: 250 }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="rectangle"
        />
      ) : (
        <p>Advertising is disabled until appropriate consent is granted.</p>
      )}
    </aside>
  );
}
