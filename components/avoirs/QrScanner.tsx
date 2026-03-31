"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function QrScanner({
  onDetected,
  active,
}: {
  onDetected: (text: string) => void;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    setError(null);

    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        reader.decodeFromVideoElement(video, (result: any) => {
          const text = result?.getText?.() ?? result?.text;
          if (text) {
            onDetected(String(text));
          }
        });
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Impossible d’acceder a la camera.";
        setError(msg);
      }
    }

    void start();

    return () => {
      cancelled = true;
      try {
        readerRef.current?.reset?.();
      } catch {
        // noop
      }
      try {
        streamRef.current?.getTracks()?.forEach((t) => t.stop());
      } catch {
        // noop
      }
      readerRef.current = null;
      streamRef.current = null;
    };
  }, [active, onDetected]);

  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      {error ? (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      ) : (
        <video
          ref={videoRef}
          className="h-56 w-full rounded-xl bg-zinc-50 object-cover dark:bg-zinc-900"
          playsInline
          muted
        />
      )}
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        Scannez le QR code : l&apos;avoir se verifiera automatiquement.
      </p>
    </div>
  );
}

