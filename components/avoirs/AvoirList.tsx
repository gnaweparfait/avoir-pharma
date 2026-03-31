"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatSenegalDisplay } from "@/lib/phone-sn";
import { downloadAvoirTicketPdf } from "@/lib/pdf/avoir-ticket";
import type { AvoirDTO } from "@/lib/types/avoir";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function isExpired(iso: string): boolean {
  try {
    return new Date(iso).getTime() < Date.now();
  } catch {
    return false;
  }
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-lg shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="border-b border-zinc-100 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
            <div className="h-4 flex-1 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
            <div className="hidden h-4 w-20 animate-pulse rounded bg-zinc-100 sm:block dark:bg-zinc-900" />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AvoirList() {
  const [avoirs, setAvoirs] = useState<AvoirDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/avoirs", { cache: "no-store" });
      if (!res.ok) {
        setError("Impossible de charger les avoirs.");
        return;
      }
      const data = (await res.json()) as AvoirDTO[];
      setAvoirs(Array.isArray(data) ? data : []);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredAvoirs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return avoirs;

    const qDigits = query.replace(/\D/g, "");

    return avoirs.filter((a) => {
      const fullName = `${a.prenom} ${a.nom}`.toLowerCase();
      const code = a.code.toLowerCase();
      const nom = a.nom.toLowerCase();
      const prenom = a.prenom.toLowerCase();
      const telephoneDigits = a.telephone.replace(/\D/g, "");

      const digitsMatch =
        qDigits.length > 0 &&
        (telephoneDigits.includes(qDigits) ||
          telephoneDigits.endsWith(qDigits));

      return (
        code.includes(q) ||
        fullName.includes(q) ||
        nom.includes(q) ||
        prenom.includes(q) ||
        digitsMatch
      );
    });
  }, [avoirs, query]);

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cet avoir ? Cette action est définitive.")) {
      return;
    }
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/avoirs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Impossible de supprimer.");
        return;
      }
      setAvoirs((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError("Erreur réseau.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDownloadPdf(avoir: AvoirDTO) {
    setDownloadingId(avoir.id);
    try {
      await downloadAvoirTicketPdf(avoir);
    } finally {
      setDownloadingId(null);
    }
  }

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/90 p-8 text-center dark:border-red-900/60 dark:bg-red-950/40">
        <p className="font-medium text-red-800 dark:text-red-200">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (avoirs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-gradient-to-b from-zinc-50/80 to-white px-8 py-16 text-center dark:border-zinc-700 dark:from-zinc-900/40 dark:to-zinc-950">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Aucun avoir enregistré
        </p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Créez votre premier avoir pour qu&apos;il apparaisse ici.
        </p>
        <Link
          href="/avoirs/nouveau"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Créer un avoir
        </Link>
      </div>
    );
  }

  const actifs = avoirs.filter((a) => !a.utilise && !isExpired(a.dateExpiration)).length;
  const expires = avoirs.filter((a) => !a.utilise && isExpired(a.dateExpiration)).length;
  const utilises = avoirs.filter((a) => a.utilise).length;
  const montantTotalActif = avoirs
    .filter((a) => !a.utilise && !isExpired(a.dateExpiration))
    .reduce((acc, a) => acc + a.montant, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Actifs</p>
          <p className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-300">{actifs}</p>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Utilisés</p>
          <p className="mt-1 text-xl font-semibold text-zinc-700 dark:text-zinc-300">{utilises}</p>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Expirés</p>
          <p className="mt-1 text-xl font-semibold text-amber-700 dark:text-amber-300">{expires}</p>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Montant actif</p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
            {montantTotalActif.toLocaleString("fr-FR")} FCFA
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher : code, nom, téléphone"
            className="input-pro pr-10"
          />
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-300"
            >
              Effacer
            </button>
          )}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {filteredAvoirs.length} résultat{filteredAvoirs.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-lg shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-zinc-50/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/80 dark:text-zinc-500">
            <tr>
              <th className="px-5 py-4">Code</th>
              <th className="px-5 py-4">Bénéficiaire</th>
              <th className="px-5 py-4">Téléphone</th>
              <th className="px-5 py-4 text-right">Montant</th>
              <th className="px-5 py-4">Expiration</th>
              <th className="px-5 py-4">Statut</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredAvoirs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  Aucun résultat pour votre recherche.
                </td>
              </tr>
            ) : (
              filteredAvoirs.map((a) => {
              const expired = !a.utilise && isExpired(a.dateExpiration);
              return (
                <tr
                  key={a.id}
                  className="transition hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20"
                >
                  <td className="px-5 py-4 font-mono text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {a.code}
                  </td>
                  <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                    {a.prenom} {a.nom}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                    {formatSenegalDisplay(a.telephone)}
                  </td>
                  <td className="px-5 py-4 text-right text-sm tabular-nums text-zinc-800 dark:text-zinc-200">
                    {a.montant.toLocaleString("fr-FR")}{" "}
                    <span className="text-zinc-500 dark:text-zinc-500">FCFA</span>
                  </td>
                  <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                    {formatDate(a.dateExpiration)}
                  </td>
                  <td className="px-5 py-4">
                    {a.utilise ? (
                      <span className="inline-flex items-center rounded-full bg-zinc-200/90 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Utilisé
                      </span>
                    ) : expired ? (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-950/80 dark:text-amber-200">
                        Expiré
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300">
                        Actif
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => void handleDownloadPdf(a)}
                        disabled={downloadingId === a.id}
                        className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
                      >
                        {downloadingId === a.id ? "PDF…" : "Ticket PDF"}
                      </button>
                      <Link
                        href={`/avoirs/${a.id}/modifier`}
                        className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-800"
                      >
                        Modifier
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === a.id}
                        onClick={() => void handleDelete(a.id)}
                        className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/60 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        {deletingId === a.id ? "…" : "Supprimer"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
