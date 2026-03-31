export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200/80 bg-white/60 py-8 dark:border-zinc-800/80 dark:bg-zinc-950/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center text-xs text-zinc-500 sm:flex-row sm:text-left dark:text-zinc-500">
        <p>
          <span className="font-medium text-zinc-700 dark:text-zinc-400">AvoirPharma</span>
          {" — "}gestion locale des avoirs pour officine.
        </p>
        <p className="tabular-nums text-zinc-400">Interface dédiée pharmacie</p>
      </div>
    </footer>
  );
}
