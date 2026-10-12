"use client";
import { useCallback, useEffect, useId, useState } from "react";
import type { ZodType } from "zod";
export function useLocalDraft<T>(key: string, schema: ZodType<T>, initial: T) {
  const [data, setStoredData] = useState<T>(initial);
  const [canSave, setCanSave] = useState(false);
  const setData = useCallback((value: T) => {
    setStoredData(value);
    setCanSave(true);
  }, []);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Loading saved work…");
  // Hydrate browser-only saved records after static HTML hydration; storage errors are user-visible.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setStoredData(schema.parse(JSON.parse(saved)));
      setCanSave(true);
      setMessage(
        saved
          ? "Saved work restored on this device."
          : "Your work saves automatically on this device.",
      );
    } catch {
      setMessage(
        "Saved work could not be loaded. Original storage is preserved until you edit or restore a backup.",
      );
    }
    setReady(true);
  }, [key, schema]);
  useEffect(() => {
    if (!ready || !canSave) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      setMessage(
        "Browser storage is unavailable or full. Download a backup before leaving.",
      );
    }
  }, [data, ready, canSave, key]);
  /* eslint-enable react-hooks/set-state-in-effect */
  return { data, setData, ready, message, setMessage };
}
export function MoneyInput({
  label,
  value,
  onChange,
  max = 1e12,
  step = 0.01,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  max?: number;
  step?: number;
}) {
  const [notice, setNotice] = useState("");
  const noticeId = useId();
  return (
    <>
    <input
      aria-label={label}
      type="number"
      min="0"
      max={max}
      step={step}
      value={value}
      aria-describedby={notice ? noticeId : undefined}
      onChange={(e) => {
        const n = e.target.valueAsNumber;
        if (Number.isFinite(n) && n >= 0 && n <= max) {
          setNotice("");
          onChange(n);
        } else {
          setNotice(`Value not applied. Enter a number from 0 to ${max.toLocaleString("en-US")}. Your previous value was kept.`);
        }
      }}
    />
    {notice && <small id={noticeId} className="field-error no-print" role="alert">{notice}</small>}
    </>
  );
}
