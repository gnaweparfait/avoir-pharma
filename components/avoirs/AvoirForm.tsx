"use client";

import { useState, type ReactNode } from "react";
import { digitsFromSenegalE164, toSenegalE164 } from "@/lib/phone-sn";
import type { AvoirDTO } from "@/lib/types/avoir";

type Mode = "create" | "edit";

type AvoirFormProps = {
  mode: Mode;
  initialAvoir?: AvoirDTO | null;
  onSuccess?: (avoir: AvoirDTO) => void;
  cancelHref?: string;
};

function toDateInputValue(iso: string): string {
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
      {children}
    </span>
  );
}

export function AvoirForm({
  mode,
  initialAvoir,
  onSuccess,
  cancelHref = "/avoirs",
}: AvoirFormProps) {
  const [nom, setNom] = useState(initialAvoir?.nom ?? "");
  const [prenom, setPrenom] = useState(initialAvoir?.prenom ?? "");
  const [phoneDigits, setPhoneDigits] = useState(() =>
    digitsFromSenegalE164(initialAvoir?.telephone)
  );
  const [montant, setMontant] = useState(
    initialAvoir != null ? String(initialAvoir.montant) : ""
  );
  const [dateExpiration, setDateExpiration] = useState(
    initialAvoir
      ? toDateInputValue(initialAvoir.dateExpiration)
      : toDateInputValue(
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        )
  );
  const [utilise, setUtilise] = useState(initialAvoir?.utilise ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "create") {
        const res = await fetch("/api/avoirs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom,
            prenom,
            telephone: toSenegalE164(phoneDigits),
            montant: Number(montant),
            dateExpiration: dateExpiration || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(typeof data.error === "string" ? data.error : "Échec");
          return;
        }
        onSuccess?.(data as AvoirDTO);
        return;
      }

      if (!initialAvoir) return;

      const res = await fetch(`/api/avoirs/${initialAvoir.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: initialAvoir.code,
          nom,
          prenom,
          telephone: toSenegalE164(phoneDigits),
          montant: Number(montant),
          dateExpiration: new Date(dateExpiration).toISOString(),
          utilise,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Échec");
        return;
      }
      onSuccess?.(data as AvoirDTO);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-8 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-900/[0.02] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40 sm:p-8"
    >
      {error && (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
        >
          <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {mode === "edit" && initialAvoir && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
            Code avoir
          </label>
          <div className="relative">
            <FieldIcon>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </FieldIcon>
            <input
              type="text"
              value={initialAvoir.code}
              readOnly
              className="input-pro cursor-default bg-zinc-50 pl-10 dark:bg-zinc-900/80"
            />
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          Bénéficiaire
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="nom"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500"
            >
              Nom
            </label>
            <div className="relative">
              <FieldIcon>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </FieldIcon>
              <input
                id="nom"
                type="text"
                required
                autoComplete="family-name"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="input-pro pl-10"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="prenom"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500"
            >
              Prénom
            </label>
            <div className="relative">
              <FieldIcon>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </FieldIcon>
              <input
                id="prenom"
                type="text"
                required
                autoComplete="given-name"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="input-pro pl-10"
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="telephone"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500"
          >
            Téléphone (Sénégal)
          </label>
          <div className="flex gap-2 sm:max-w-md">
            <span
              className="flex shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              aria-hidden
            >
              +221
            </span>
            <input
              id="telephone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              maxLength={9}
              placeholder="77 123 45 67"
              value={phoneDigits}
              onChange={(e) =>
                setPhoneDigits(e.target.value.replace(/\D/g, "").slice(0, 9))
              }
              className="input-pro min-w-0 flex-1 tabular-nums tracking-wide"
              aria-describedby="telephone-hint"
            />
          </div>
          <p id="telephone-hint" className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-500">
            Saisissez 9 chiffres après l&apos;indicatif +221.
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Montant & validité
        </h2>
        <div className="space-y-5">
          <div>
            <label
              htmlFor="montant"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500"
            >
              Montant (FCFA)
            </label>
            <input
              id="montant"
              type="number"
              required
              min={0}
              step="0.01"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="input-pro tabular-nums"
            />
          </div>

          <div>
            <label
              htmlFor="dateExpiration"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500"
            >
              Date d&apos;expiration
            </label>
            <div className="relative">
              <FieldIcon>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </FieldIcon>
              <input
                id="dateExpiration"
                type="date"
                required
                value={dateExpiration}
                onChange={(e) => setDateExpiration(e.target.value)}
                className="input-pro pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {mode === "edit" && (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 transition hover:border-emerald-200 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-emerald-900">
          <input
            type="checkbox"
            checked={utilise}
            onChange={(e) => setUtilise(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600"
          />
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Marquer comme utilisé
          </span>
        </label>
      )}

      <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enregistrement…
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {mode === "create" ? "Créer l'avoir" : "Enregistrer"}
            </>
          )}
        </button>
        <a
          href={cancelHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Annuler
        </a>
      </div>
    </form>
  );
}
