import { FormEvent, useMemo, useState } from "react";
import { Button, Input, MessageResponse } from "@ai-infused-projects/frontend";

import { useAsk } from "../api/useAsk";

function getUrlError(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Website URL is required.";
  }

  try {
    const url = new URL(trimmed);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "URL must start with http:// or https://.";
    }

    if (!url.hostname.includes(".")) {
      return "Enter a complete website URL.";
    }

    return "";
  } catch {
    return "Enter a valid website URL.";
  }
}

export function SummarizerPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { askBackend, clearResponse, response, loading } = useAsk();
  const urlError = useMemo(() => getUrlError(websiteUrl), [websiteUrl]);
  const showError = hasSubmitted && Boolean(urlError);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (urlError) {
      return;
    }

    void askBackend(websiteUrl.trim());
  };

  const handleClear = () => {
    setWebsiteUrl("");
    setHasSubmitted(false);
    clearResponse();
  };

  return (
    <section className="grid gap-5">
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase text-accent-foreground">Website analysis</p>
        <h1 className="text-3xl font-bold tracking-normal">Summerizer</h1>
        <p className="text-sm text-muted-foreground">Paste a website URL to generate a focused summary.</p>
      </div>

      <form className="grid gap-3 rounded-lg border border-border bg-card p-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium" htmlFor="website-url">
          Website URL
          <Input
            aria-invalid={showError}
            id="website-url"
            onBlur={() => setHasSubmitted(true)}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            placeholder="https://example.com"
            type="url"
            value={websiteUrl}
          />
        </label>

        {showError ? <p className="text-sm text-destructive">{urlError}</p> : null}

        <div className="flex flex-wrap gap-2">
          <Button disabled={loading} type="submit">
            {loading ? "Summarizing..." : "Summarize"}
          </Button>
          <Button onClick={handleClear} type="button" variant="outline">
            Clear
          </Button>
        </div>
      </form>

      <section className="min-h-64 rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Summary</h2>
          <Button onClick={handleClear} size="sm" type="button" variant="ghost">
            Clear
          </Button>
        </div>

        {response ? (
          <MessageResponse>{response.answer}</MessageResponse>
        ) : (
          <p className="text-sm text-muted-foreground">The summary response will appear here.</p>
        )}
      </section>
    </section>
  );
}
