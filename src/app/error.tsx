"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">
        The page failed to render. Details below.
      </p>

      <div className="mt-6 rounded-lg border border-border bg-surface p-4">
        <div className="text-xs uppercase tracking-wider text-muted">Message</div>
        <pre className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">
          {error.message || "Unknown error"}
        </pre>
        {error.digest && (
          <>
            <div className="mt-4 text-xs uppercase tracking-wider text-muted">Digest</div>
            <pre className="mt-1 text-sm text-foreground">{error.digest}</pre>
          </>
        )}
      </div>

      <button
        onClick={() => reset()}
        className="mt-6 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:bg-surface-light hover:text-foreground transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
