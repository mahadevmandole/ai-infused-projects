import { useState } from "react";

type AskResponse = {
  answer: string;
  context: string;
};

export function App() {
  const [prompt, setPrompt] = useState("What can this starter app do?");
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function askBackend() {
    setLoading(true);
    try {
      const result = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      setResponse(await result.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="header-row">
          <div>
            <p className="eyebrow">AI Project Starter</p>
            <h1>Demo App</h1>
          </div>
          <span className="status-pill">FastAPI + React</span>
        </div>

        <label htmlFor="prompt">Prompt</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={5}
        />

        <button type="button" onClick={askBackend} disabled={loading || !prompt.trim()}>
          {loading ? "Asking..." : "Ask"}
        </button>

        {response ? (
          <div className="result-panel">
            <h2>Answer</h2>
            <p>{response.answer}</p>
            <h2>Retrieved context</h2>
            <p>{response.context}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
