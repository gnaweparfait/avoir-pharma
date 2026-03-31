import Link from "next/link";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Fil d’Ariane personnalisé (sinon Accueil → Avoirs) */
  crumbs?: Crumb[];
};

const defaultCrumbs: Crumb[] = [
  { label: "Accueil", href: "/" },
  { label: "Avoirs" },
];

export function PageHeader({
  title,
  description,
  actions,
  crumbs = defaultCrumbs,
}: PageHeaderProps) {
  return (
    <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <nav
          className="mb-4 flex flex-wrap items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-500"
          aria-label="Fil d’Ariane"
        >
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-zinc-300 dark:text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {c.href ? (
                <Link
                  href={c.href}
                  className="rounded-md px-2 py-1 text-zinc-600 transition hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
