import Link from "next/link";
import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className="bg-mesh min-h-[calc(100vh-8rem)]">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-28 sm:pt-10">
        <div className="mb-10 flex items-center justify-between gap-4 border-b border-zinc-200/70 pb-6 dark:border-zinc-800/80">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200">
            Accueil
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
              AvoirPharma
            </p>
            <h1 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.1] dark:text-white">
              Tous vos avoirs, centralisés et accessibles.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Création, liste et ticket PDF : tout depuis cette interface, pour
              l&apos;officine.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/avoirs"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 sm:min-w-[220px] sm:flex-none"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
                </svg>
                Liste des avoirs
              </Link>
              <Link
                href="/avoirs/nouveau"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/60 sm:flex-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-emerald-800"
              >
                <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouvel avoir
              </Link>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              <div className="flex gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
                <Icon>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </Icon>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Code auto</p>
                  <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">Identifiant unique par avoir</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
                <Icon>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </Icon>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">+221</p>
                  <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">Téléphone client</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
                <Icon>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </Icon>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Ticket PDF</p>
                  <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">À l&apos;impression</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-px rounded-[1.65rem] bg-gradient-to-br from-emerald-400/15 via-transparent to-teal-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.65rem] border border-zinc-200/90 bg-white p-6 shadow-xl shadow-zinc-900/[0.06] dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                    Aperçu
                  </p>
                  <p className="mt-1.5 text-lg font-semibold text-zinc-900 dark:text-white">
                    Fiche avoir
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300">
                  Actif
                </span>
              </div>
              <dl className="mt-6 space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-3.5 py-2.5 dark:bg-zinc-800/70">
                  <dt className="text-zinc-500 dark:text-zinc-400">Code</dt>
                  <dd className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">AV-…</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-3.5 py-2.5 dark:bg-zinc-800/70">
                  <dt className="text-zinc-500 dark:text-zinc-400">Tél.</dt>
                  <dd className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">+221 …</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-3.5 py-2.5 dark:bg-zinc-800/70">
                  <dt className="text-zinc-500 dark:text-zinc-400">Montant</dt>
                  <dd className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">25&nbsp;000 FCFA</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-2.5 dark:border-emerald-900/50 dark:bg-emerald-950/35">
                  <dt className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Expire</dt>
                  <dd className="text-sm font-medium tabular-nums text-emerald-900 dark:text-emerald-200">30 mars 2027</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
