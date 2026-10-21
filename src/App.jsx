import { useState, useRef, useEffect } from 'react';
import './App.css';
import { uploadPDFs, queryRAG, checkHealth } from './api';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [indexReady, setIndexReady] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Check health on mount
  useEffect(() => {
    checkHealth()
      .then(r => setIndexReady(r.data.index_ready))
      .catch(() => setIndexReady(false));
  }, []);

  const handleFileSelect = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setLoading(true);
    try {
      const response = await uploadPDFs(files);
      setMessages([...messages, {
        role: 'system',
        content: `✅ ${response.data.message}`
      }]);
      setIndexReady(true);
      setFiles([]);
      fileInputRef.current.value = '';
    } catch (error) {
      setMessages([...messages, {
        role: 'system',
        content: `❌ Upload failed: ${error.response?.data?.detail || error.message}`
      }]);
    }
    setLoading(false);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const userMsg = { role: 'user', content: question };
    setMessages([...messages, userMsg]);
    setQuestion('');
    
    setLoading(true);
    try {
      const response = await queryRAG(question);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources_count
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'error',
        content: `Error: ${error.response?.data?.detail || error.message}`
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 AI Knowledge Assistant</h1>
        <p>RAG Chatbot with LangChain + FAISS + LLM</p>
      </header>

      <div className="container">
        {/* Upload Section */}
        <div className="upload-section">
          <h2>📄 Upload Documents</h2>
          <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <p>📁 Drag & drop PDFs here or click to browse</p>
            {files.length > 0 && <p className="file-count">Selected: {files.length} file(s)</p>}
          </div>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || loading}
            className="btn-primary"
          >
            {loading ? '⏳ Uploading...' : '📤 Upload & Index'}
          </button>
          {indexReady && <p className="status-ok">✅ Index Ready</p>}
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          <h2>💬 Ask Questions</h2>
          <div className="chat-box">
            {messages.length === 0 && (
              <p className="placeholder">Upload PDFs and ask questions to get started...</p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'Assistant' : 'System'}:</strong>
                <p>{msg.content}</p>
                {msg.sources && <p className="sources">📚 Sources: {msg.sources}</p>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleAsk} className="input-form">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your documents..."
              disabled={!indexReady || loading}
            />
            <button type="submit" disabled={!indexReady || loading} className="btn-primary">
              {loading ? '⏳' : '➤'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;