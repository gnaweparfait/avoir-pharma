"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

const navBase =
  "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300";

function navClass(pathname: string, href: string, startsWith?: boolean) {
  const active = startsWith
    ? pathname === href || pathname.startsWith(`${href}/`)
    : pathname === href;
  return `${navBase} ${
    active
      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
      : "text-zinc-600 dark:text-zinc-400"
  }`;
}

function LogoMark() {
  return (
    <svg
      className="h-9 w-9 shrink-0 text-emerald-600 dark:text-emerald-400"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        width="40"
        height="40"
        rx="12"
        className="fill-emerald-600/10 dark:fill-emerald-400/15"
      />
      <path
        d="M20 11v18M11 20h18"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 rounded-lg"
        >
          <LogoMark />
          <div className="leading-tight">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              AvoirPharma
            </span>
            <span className="hidden text-sm font-semibold text-zinc-900 sm:block dark:text-zinc-50">
              Espace pharmacie
            </span>
          </div>
        </Link>

        <nav
          className="flex flex-wrap items-center justify-end gap-1 sm:gap-2"
          aria-label="Navigation principale"
        >
          <Link href="/" className={navClass(pathname, "/")}>
            Accueil
          </Link>
          <Link href="/avoirs" className={navClass(pathname, "/avoirs", true)}>
            Avoirs
          </Link>
          <Link
            href="/verifier"
            className={navClass(pathname, "/verifier")}
          >
            Vérifier
          </Link>
          <Link
            href="/dashboard"
            className={navClass(pathname, "/dashboard")}
          >
            Dashboard
          </Link>
          <Link
            href="/avoirs/nouveau"
            className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:shadow-emerald-900/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Nouvel avoir</span>
            <span className="sm:hidden">Créer</span>
          </Link>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
