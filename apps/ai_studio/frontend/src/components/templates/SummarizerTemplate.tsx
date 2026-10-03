import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { useAsk } from "../../api/useAsk";
import { SectionHeading } from "../atoms";
import { SummaryResultPanel, WebsiteUrlForm } from "../molecules";

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

export function SummarizerTemplate() {
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
      <SectionHeading
        description="Paste a website URL to generate a focused summary."
        eyebrow="Website analysis"
        title="Summerizer"
      />

      <WebsiteUrlForm
        loading={loading}
        onBlur={() => setHasSubmitted(true)}
        onChange={setWebsiteUrl}
        onClear={handleClear}
        onSubmit={handleSubmit}
        showError={showError}
        urlError={urlError}
        value={websiteUrl}
      />

      <SummaryResultPanel answer={response?.answer} onClear={handleClear} />
    </section>
  );
}
