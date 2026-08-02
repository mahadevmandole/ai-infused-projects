import { useState } from "react";

import { useAsk } from "../../api/useAsk";

export function App() {
  const [prompt, setPrompt] = useState("What can this starter app do?");
  const { askBackend, response, loading } = useAsk();

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

        <button type="button" onClick={() => void askBackend(prompt)} disabled={loading || !prompt.trim()}>
          {loading ? "Asking..." : "Ask"}
        </button>

        {response ? (
          <div className="result-panel">
            <h2>Answer</h2>
            <p>{response.answer}</p>
            <h2>Model</h2>
            <p>
              {response.provider} / {response.model}
            </p>
            <h2>Retrieved context</h2>
            <p>{response.context}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
