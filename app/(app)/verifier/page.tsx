"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AvoirDTO } from "@/lib/types/avoir";
import { QrScanner } from "@/components/avoirs/QrScanner";
import Link from "next/link";

function normalizeInputCode(raw: string): string {
  return raw.trim().replace(/\s/g, "");
}

function extractCodeFromQr(text: string): string | null {
  const t = text.trim();
  if (!t) return null;
  try {
    if (t.startsWith("http://") || t.startsWith("https://")) {
      const url = new URL(t);
      return url.searchParams.get("code");
    }
  } catch {
    // ignore
  }
  const m = t.match(/(?:[?&]code=)([^&]+)/i);
  if (m?.[1]) {
    try {
      return decodeURIComponent(m[1]);
    } catch {
      return m[1];
    }
  }
  return t;
}

function statusFromAvoir(avoir: AvoirDTO): {
  key: "VALID" | "EXPIRED" | "USED";
  label: string;
  message: string;
} {
  if (avoir.utilise) {
    return {
      key: "USED",
      label: "Déjà utilisé",
      message: "Cet avoir a déjà été utilisé.",
    };
  }

  const expired = new Date(avoir.dateExpiration).getTime() < Date.now();
  if (expired) {
    return {
      key: "EXPIRED",
      label: "Avoir expiré",
      message: "Cet avoir est expiré et ne peut plus être accepté.",
    };
  }

  return {
    key: "VALID",
    label: "Avoir valide",
    message: "Cet avoir est valide. Vous pouvez l’accepter.",
  };
}

function StatusBadge({ status }: { status: "VALID" | "EXPIRED" | "USED" }) {
  const cls =
    status === "VALID"
      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
      : status === "EXPIRED"
        ? "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
        : "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {status === "VALID"
        ? "VALIDE"
        : status === "EXPIRED"
          ? "EXPIRÉ"
          : "UTILISÉ"}
    </span>
  );
}

export default function VerifierPage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [activeScanner, setActiveScanner] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avoir, setAvoir] = useState<AvoirDTO | null>(null);
  const hasScannedRef = useRef(false);

  const computed = useMemo(() => {
    if (!avoir) return null;
    return statusFromAvoir(avoir);
  }, [avoir]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromQuery = params.get("code") ?? "";
    if (!codeFromQuery) return;
    const normalized = normalizeInputCode(codeFromQuery);
    setCode(normalized);
    void verify(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeScanner) hasScannedRef.current = false;
  }, [activeScanner]);

  async function verify(codeToCheck: string) {
    const cleaned = normalizeInputCode(codeToCheck);
    if (!cleaned) return;

    setError(null);
    setVerifying(true);
    setAvoir(null);

    try {
      const res = await fetch(
        `/api/avoirs/by-code?code=${encodeURIComponent(cleaned)}`,
        { cache: "no-store" }
      );

      if (res.status === 404) {
        setError("Avoir introuvable.");
        return;
      }

      if (!res.ok) {
        setError("Impossible de verifier l’avoir.");
        return;
      }

      const data = (await res.json()) as AvoirDTO;
      setAvoir(data);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setVerifying(false);
      setActiveScanner(false);
    }
  }

  async function markUsed() {
    if (!avoir) return;
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch(`/api/avoirs/${avoir.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utilise: true }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(typeof data?.error === "string" ? data.error : "Échec.");
        return;
      }

      await verify(avoir.code);
    } finally {
      setVerifying(false);
    }
  }

  function handleQrDetected(text: string) {
    if (hasScannedRef.current) return;
    const extracted = extractCodeFromQr(text);
    if (!extracted) return;
    hasScannedRef.current = true;
    setCode(extracted);
    void verify(extracted);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/70 pb-5 dark:border-zinc-800/70">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
              Vérification
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Vérifier un avoir
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Entrez le code ou scannez le QR pour obtenir immédiatement le
              statut.
            </p>
          </div>
          <Link
            href="/avoirs"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200"
          >
            Retour liste
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="code"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500"
              >
                Code unique
              </label>
              <input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="AV-XXXX..."
                className="input-pro"
              />
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                Astuce : le QR du ticket contient un lien direct vers cette
                page.
              </p>
            </div>

            <button
              type="button"
              disabled={verifying || !normalizeInputCode(code)}
              onClick={() => void verify(code)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {verifying ? "Vérification…" : "Vérifier"}
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            {error ? (
              <div className="text-sm font-semibold text-red-700 dark:text-red-300">
                {error}
              </div>
            ) : computed ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={computed.key} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {computed.label}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {computed.message}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-zinc-950">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Client
                    </p>
                    <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">
                      {avoir?.prenom} {avoir?.nom}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-zinc-950">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Montant
                    </p>
                    <p className="mt-1 font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                      {avoir?.montant.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-zinc-950">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Expiration
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {new Date(avoir?.dateExpiration ?? Date.now()).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-zinc-950">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Code
                    </p>
                    <p className="mt-1 font-mono text-xs font-medium text-zinc-900 dark:text-zinc-50">
                      {avoir?.code}
                    </p>
                  </div>
                </div>

                {computed.key === "VALID" && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      disabled={verifying}
                      onClick={() => void markUsed()}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-black disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                    >
                      Marquer comme utilisé
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/avoirs")}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200"
                    >
                      Ouvrir la liste
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Saisissez un code ou scannez le QR pour afficher le statut.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
              QR scanner
            </p>
            <h2 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Scanner le ticket
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Activez la caméra, puis pointez le QR.
            </p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setActiveScanner((v) => !v)}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200"
              >
                {activeScanner ? "Arrêter" : "Activer caméra"}
              </button>
            </div>

            <div className="mt-4">
              <QrScanner
                active={activeScanner}
                onDetected={(text) => handleQrDetected(text)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

