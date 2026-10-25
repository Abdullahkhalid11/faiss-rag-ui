import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { uploadPDFs, queryRAG, checkHealth } from './api';
import About from './About';

function TypingIndicator() {
  return (
    <div className="message assistant typing">
      <div className="bubble">
        <span className="dot" /><span className="dot" /><span className="dot" />
      </div>
    </div>
  );
}

function SourcesPanel({ sources }) {
  const [open, setOpen] = useState(false);
  if (!sources || sources.length === 0) return null;
  return (
    <div className="sources-panel">
      <button className="sources-toggle" onClick={() => setOpen(!open)}>
        {open ? '▾' : '▸'} {sources.length} source{sources.length > 1 ? 's' : ''} retrieved
      </button>
      {open && (
        <div className="sources-list">
          {sources.map((s, i) => (
            <div key={i} className="source-chunk">
              <span className="source-label">Page {s.page + 1}</span>
              <p className="source-text">{s.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Message({ msg }) {
  return (
    <div className={`message ${msg.role}`}>
      <div className="bubble">
        {msg.role === 'assistant' ? (
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        ) : (
          <p>{msg.content}</p>
        )}
      </div>
      {msg.role === 'assistant' && msg.sources?.length > 0 && (
        <SourcesPanel sources={msg.sources} />
      )}
      <span className="timestamp">{msg.time}</span>
    </div>
  );
}

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [indexReady, setIndexReady] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [typing, setTyping] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    checkHealth()
      .then(r => setIndexReady(r.data.index_ready))
      .catch(() => setIndexReady(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.pdf'));
    if (dropped.length) setFiles(dropped);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setLoading(true);
    setIndexing(true);
    try {
      const response = await uploadPDFs(files);
      setIndexReady(true);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessages(prev => [...prev, {
        role: 'system',
        content: `${files.length} file${files.length > 1 ? 's' : ''} uploaded. Index is building — ask your first question in a moment.`,
        time: now(),
        sources: []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'error',
        content: err.response?.data?.detail || err.message,
        time: now(),
        sources: []
      }]);
    }
    setLoading(false);
    setIndexing(false);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || typing) return;
    const q = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', content: q, time: now(), sources: [] }]);
    setTyping(true);
    try {
      const res = await queryRAG(q);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.answer,
        time: now(),
        sources: res.data.sources || [],
        sources_count: res.data.sources_count
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'error',
        content: err.response?.data?.detail || 'Something went wrong. Try again.',
        time: now(),
        sources: []
      }]);
    }
    setTyping(false);
  };

  const suggestions = [
    'What is this document about?',
    'Summarise the key points.',
    'What are the main conclusions?',
  ];

  // Show About page if requested
  if (showAbout) {
    return (
      <div>
        <About onClose={() => setShowAbout(false)} />
      </div>
    );
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand" onClick={() => setShowAbout(false)} style={{ cursor: 'pointer' }}>
          <span className="brand-icon">⬡</span>
          <span className="brand-name">CiteCraft</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowAbout(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-2)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-2)'}
          >
            About
          </button>
          <div className={`status-pill ${indexReady ? 'ready' : 'idle'}`}>
            <span className="status-dot" />
            {indexReady ? 'Index ready' : 'No document'}
          </div>
        </div>
      </header>

      <main className="workspace">
        {/* Upload panel */}
        <aside className="upload-panel">
          <h2 className="panel-title">Document</h2>

          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''} ${files.length ? 'has-files' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={e => setFiles(Array.from(e.target.files))}
              style={{ display: 'none' }}
            />
            {files.length ? (
              <div className="file-list">
                {files.map((f, i) => (
                  <div key={i} className="file-item">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{f.name}</span>
                    <span className="file-size">{(f.size / 1024).toFixed(0)} KB</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="drop-prompt">
                <span className="drop-icon">↑</span>
                <p>Drop PDFs here or click to browse</p>
              </div>
            )}
          </div>

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!files.length || loading}
          >
            {indexing ? (
              <><span className="spinner" /> Indexing…</>
            ) : (
              'Upload & Index'
            )}
          </button>

          {indexReady && (
            <div className="index-info">
              <span className="check">✓</span> Ready to answer questions
            </div>
          )}

          <div className="hint-block">
            <p className="hint-title">How it works</p>
            <ol className="hint-list">
              <li>Upload a PDF</li>
              <li>Wait for indexing</li>
              <li>Ask anything about the content</li>
            </ol>
          </div>
        </aside>

        {/* Chat panel */}
        <section className="chat-panel">
          <div className="chat-scroll">
            {messages.length === 0 && (
              <div className="empty-state">
                <p className="empty-title">No conversation yet</p>
                <p className="empty-sub">Upload a document, then try one of these:</p>
                <div className="suggestions">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="suggestion"
                      disabled={!indexReady}
                      onClick={() => { setQuestion(s); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {typing && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <form className="input-row" onSubmit={handleAsk}>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder={indexReady ? 'Ask a question about your document…' : 'Upload a document to start'}
              disabled={!indexReady || typing}
            />
            <button type="submit" disabled={!indexReady || typing || !question.trim()}>
              {typing ? <span className="spinner small" /> : '↑'}
            </button>
          </form>

          <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '12px 40px',
            fontSize: '11px',
            color: 'var(--text-3)',
            textAlign: 'center',
            background: 'var(--surface)'
          }}>
            © 2026 Abdullah Khalid. All rights reserved. | 
            <a 
              href="https://github.com/Abdullahkhalid11" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--accent)', textDecoration: 'none', marginLeft: '4px' }}
            >
              GitHub
            </a>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;