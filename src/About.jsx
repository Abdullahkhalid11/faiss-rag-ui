import './About.css';

export default function About({ onClose }) {
  return (
    <div className="about-page">
      <div className="about-header">
        <button 
          className="back-btn"
          onClick={onClose}
        >
          ← Back to CiteCraft
        </button>
      </div>

      <div className="about-container">
        <h1>About CiteCraft</h1>
        <p className="tagline">Ask questions. Trace every answer.</p>
        
        <section className="about-section">
          <h2>What is CiteCraft?</h2>
          <p>
            CiteCraft is an AI-powered document research tool that turns your PDFs into a searchable, conversational knowledge base. Every answer is grounded in your document sources—no hallucinations, just facts.
          </p>
        </section>

        <section className="about-section">
          <h2>Built by Abdullah Khalid</h2>
          <p>
            I'm an AI Engineer working across computer vision, machine learning, LLM applications, and AI automation. CiteCraft demonstrates how retrieval-augmented generation (RAG) can make document research fast, accurate, and transparent.
          </p>
          <div className="skills">
            <span className="skill">Python</span>
            <span className="skill">RAG</span>
            <span className="skill">Vector Search</span>
            <span className="skill">LLMs</span>
            <span className="skill">FastAPI</span>
            <span className="skill">React</span>
          </div>
        </section>

        <section className="about-section">
          <h2>How It Works</h2>
          <ol>
            <li><strong>Upload PDFs:</strong> Drop your documents into CiteCraft</li>
            <li><strong>AI Indexing:</strong> Your documents are chunked and embedded into a vector database</li>
            <li><strong>Ask Questions:</strong> Query using natural language</li>
            <li><strong>Trace Answers:</strong> Every response includes the original document chunks it came from</li>
          </ol>
        </section>

        <section className="about-section">
          <h2>Technology Stack</h2>
          <ul>
            <li><strong>Backend:</strong> FastAPI + FAISS + LangChain + Groq LLM</li>
            <li><strong>Frontend:</strong> React + Vite + Markdown rendering</li>
            <li><strong>Embeddings:</strong> Jina Embeddings v2</li>
            <li><strong>Deployment:</strong> Render (backend) + Vercel (frontend)</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Open Source</h2>
          <p>
            View the source code on{' '}
            <a href="https://github.com/Abdullahkhalid11/faiss-pdf-rag" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
        </section>

        <footer className="about-footer">
          <p>© 2026 Abdullah Khalid. All rights reserved.</p>
          <p>CiteCraft is an independent portfolio project. Not affiliated with Groq, Jina, LangChain, or other third-party providers.</p>
          <p>
            Contact: <a href="mailto:msabdullah2024@gmail.com">msabdullah2024@gmail.com</a>
          </p>
        </footer>
      </div>
    </div>
  );
}