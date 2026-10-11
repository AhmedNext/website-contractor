"use client";
import { useEffect, useState } from "react";
import type { ZodType } from "zod";
export function useLocalDraft<T>(key: string, schema: ZodType<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Loading saved work…");
  // Hydrate browser-only saved records after static HTML hydration; storage errors are user-visible.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setData(schema.parse(JSON.parse(saved)));
      setMessage(
        saved
          ? "Saved work restored on this device."
          : "Your work saves automatically on this device.",
      );
    } catch {
      setMessage(
        "Saved work could not be loaded. Import a backup or start again.",
      );
    }
    setReady(true);
  }, [key, schema]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      setMessage(
        "Browser storage is unavailable or full. Download a backup before leaving.",
      );
    }
  }, [data, ready, key]);
  /* eslint-enable react-hooks/set-state-in-effect */
  return { data, setData, ready, message, setMessage };
}
export function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      aria-label={label}
      type="number"
      min="0"
      max="1000000000000"
      step="0.01"
      value={value}
      onChange={(e) => {
        const n = e.target.valueAsNumber;
        if (Number.isFinite(n) && n >= 0 && n <= 1e12) onChange(n);
      }}
    />
  );
}
