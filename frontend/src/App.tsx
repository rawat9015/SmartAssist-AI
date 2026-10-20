
import { useState } from "react";
import "./App.css";
import { loginUser, generateAIResponse } from "./services/api";


const actions = [
  { id: "rewrite", label: "Rewrite" },
  { id: "summarize", label: "Summarize" },
  { id: "reply", label: "Reply" },
  { id: "translate", label: "Translate" },
  { id: "grammar", label: "Fix grammar" },
  { id: "explain", label: "Explain" },
  { id: "action-items", label: "Action items" },
  { id: "meeting-notes", label: "Meeting notes" },
  { id: "generate-sql", label: "Generate SQL" },
  { id: "generate-regex", label: "Generate Regex" },
  { id: "jira-ticket", label: "Jira ticket" },
];

function App() {
  const [action, setAction] = useState("rewrite");
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("English");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");


  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await loginUser(email, password);

      setAccessToken(result.data.accessToken);
      setUserName(result.data.user.name);
      setPassword("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }


  const handleGenerate = async () => {
    if (!accessToken) {
      setError("Please log in first.");
      return;
    }

    if (!input.trim()) {
      setError("Please enter some text.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResponse("");

      const result = await generateAIResponse(
        {
          action: action,
          input: input,
          options: {
            tone: tone,
            language: language,
          },
        },
        accessToken
      );

      setResponse(result.data.response);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate AI response."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="app">
      {!accessToken ? (
        <div className="login-container">
          <h2>Login to SmartAssist AI</h2>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      ) : (
        <div>
          <p>Welcome, {userName}!</p>
          <button onClick={() => {
            setAccessToken(null);
            setUserName("");
          }}>
            Logout
          </button>
        </div>
      )}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h1>SmartAssist AI</h1>
            <p>Your AI writing assistant</p>
          </div>
        </div>
        <span className="status-dot" title="Interface ready" />
      </header>

      <section className="content">
        <div className="section-heading">
          <h2>What can I help with?</h2>
          <span>11 tools</span>
        </div>

        <div className="actions">
          {actions.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`action-button ${action === item.id ? "selected" : ""
                }`}
              onClick={() => setAction(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="field-label" htmlFor="ai-input">
          Your text or instructions
        </label>

        <textarea
          id="ai-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste text or describe what you need..."
          rows={5}
        />

        <div className="settings">
          <div className="setting">
            <label className="field-label" htmlFor="tone">
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(event) => setTone(event.target.value)}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="concise">Concise</option>
            </select>
          </div>

          <div className="setting">
            <label className="field-label" htmlFor="language">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>



        <button className="generate-button"
          onClick={handleGenerate}
          disabled={loading || !accessToken}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <section className="response-section">
          <div className="response-heading">
            <h2>Response</h2>
            <span>AI output will appear here</span>
          </div>

          <div className="response-box">
            <h3>AI Response</h3>

            {response ? (
              <p>{response}</p>
            ) : (
              <p>Your generated response will appear here.</p>
            )}

            {response && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(response);
                }}
              >
                Copy Response
              </button>
            )}
          </div>
        </section>
      </section>

      <footer>
        <span>SMARTASSIST AI</span>
        <span>Built for your workflow</span>
      </footer>
    </main>
  );
}

export default App;
