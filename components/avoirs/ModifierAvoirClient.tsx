"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AvoirDTO } from "@/lib/types/avoir";
import { AvoirForm } from "./AvoirForm";
import { PageHeader } from "./PageHeader";

export function ModifierAvoirClient({ id }: { id: string }) {
  const router = useRouter();
  const [avoir, setAvoir] = useState<AvoirDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/avoirs/${id}`, { cache: "no-store" });
        const data = (await res.json()) as { error?: string } & Partial<AvoirDTO>;
        if (!res.ok) {
          setError(typeof data.error === "string" ? data.error : "Non trouvé");
          return;
        }
        if (!cancelled) setAvoir(data as AvoirDTO);
      } catch {
        if (!cancelled) setError("Erreur réseau");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-10 h-4 w-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 w-2/3 max-w-md animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="h-10 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-10 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
            <div className="h-10 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
          </div>
          <div className="h-10 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
    );
  }

  if (error || !avoir) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center dark:border-red-900/60 dark:bg-red-950/30">
          <p className="font-medium text-red-800 dark:text-red-200">
            {error ?? "Avoir introuvable."}
          </p>
          <a
            href="/avoirs"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Retour à la liste
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Modifier l'avoir"
        description={`Code ${avoir.code}`}
        crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Avoirs", href: "/avoirs" },
          { label: "Modifier" },
        ]}
      />
      <AvoirForm
        mode="edit"
        initialAvoir={avoir}
        onSuccess={() => router.push("/avoirs")}
        cancelHref="/avoirs"
      />
    </div>
  );
}
