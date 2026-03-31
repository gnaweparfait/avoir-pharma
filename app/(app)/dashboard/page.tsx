"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AvoirDTO } from "@/lib/types/avoir";

function isExpired(iso: string): boolean {
  try {
    return new Date(iso).getTime() < Date.now();
  } catch {
    return false;
  }
}

export default function DashboardPage() {
  const [avoirs, setAvoirs] = useState<AvoirDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/avoirs", { cache: "no-store" });
        if (!res.ok) {
          setError("Impossible de charger le dashboard.");
          return;
        }
        const data = (await res.json()) as AvoirDTO[];
        if (!cancelled) setAvoirs(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError("Erreur réseau.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const total = avoirs.length;
    const used = avoirs.filter((a) => a.utilise).length;
    const expired = avoirs.filter((a) => !a.utilise && isExpired(a.dateExpiration)).length;
    const active = total - used - expired;
    return { total, used, expired, active };
  }, [avoirs]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/70 pb-5 dark:border-zinc-800/70">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Résumé des avoirs
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/verifier"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
          >
            Vérifier
          </Link>
          <Link
            href="/avoirs"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200"
          >
            Liste
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Chargement…</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              {stats.total}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Actifs</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-700 dark:text-emerald-300">
              {stats.active}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Expirés</p>
            <p className="mt-2 text-3xl font-semibold text-amber-700 dark:text-amber-300">
              {stats.expired}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Utilisés</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-700 dark:text-zinc-200">
              {stats.used}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

