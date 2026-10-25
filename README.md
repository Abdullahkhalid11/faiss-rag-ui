# CiteCraft UI — React Frontend

The conversational interface for CiteCraft document research.

**[Live Demo](https://citecraft-ui.vercel.app)** | **[Backend API](https://github.com/Abdullahkhalid11/faiss-pdf-rag)** | **[Built by Abdullah Khalid](https://github.com/Abdullahkhalid11)**

---

## Features

✅ **Drag & Drop PDF Upload** — Seamless file selection with progress tracking
✅ **Real-Time Indexing Status** — Visual feedback while processing documents
✅ **Conversational Q&A** — Natural language questions with AI answers
✅ **Source Citations** — Expandable panels showing exact document chunks
✅ **Markdown Rendering** — Formatted answers with emphasis, lists, tables
✅ **Dark Theme** — Professional, eye-friendly interface
✅ **Responsive Design** — Works on desktop, tablet, mobile
✅ **About Page** — Developer bio and project information

---

## Tech Stack

| Component             | Technology             |
| --------------------- | ---------------------- |
| **Framework**   | React 18               |
| **Build Tool**  | Vite                   |
| **HTTP Client** | Axios                  |
| **Markdown**    | react-markdown         |
| **Styling**     | CSS with CSS variables |
| **Icons**       | Unicode emoji          |
| **Deployment**  | Vercel                 |

---

## Local Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
git clone https://github.com/Abdullahkhalid11/faiss-rag-ui.git
cd faiss-rag-ui

npm install
npm install react-markdown
```

### Configure Backend

Create `.env.local`:

VITE_API_URL=http://localhost:8000
VITE_API_KEY=your_api_key

For production, update with your Render backend URL:

VITE_API_URL=https://faiss-pdf-rag.onrender.com
VITE_API_KEY=your_api_key

### Run Locally

```bash
npm run dev
```

Open http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

src/
├── App.jsx # Main chat interface + navigation
├── About.jsx # About page with developer info
├── App.css # Styles (dark theme, responsive)
├── About.css # About page styles
├── api.js # Axios client with API integration
├── main.jsx # React entry point
└── index.html # HTML template

---

## Key Components

### App.jsx

- **Chat Interface** — Message history with timestamps
- **Upload Panel** — Drag-drop or browse PDF files
- **Typing Indicator** — Animated dots while waiting
- **Sources Panel** — Expandable document chunks
- **Status Pill** — Index readiness indicator
- **Footer** — Copyright and GitHub link

### About.jsx

- Developer bio and professional info
- Project explanation and architecture
- Technology stack showcase
- Links to GitHub and contact

### api.js

- `uploadPDFs(files)` — Upload and index documents
- `queryRAG(question)` — Send question to API
- `checkHealth()` — Verify backend availability
- Automatic `X-API-Key` header injection

---

## API Integration

The frontend calls the backend with these endpoints:

| Method | Endpoint    | Purpose                     |
| ------ | ----------- | --------------------------- |
| GET    | `/health` | Check if backend is running |
| POST   | `/upload` | Upload PDFs for indexing    |
| POST   | `/chat`   | Query the RAG system        |

**Response format:**

```json
{
  "answer": "Answer text with markdown...",
  "sources_count": 3,
  "sources": [
    {
      "content": "Relevant chunk from document",
      "page": 0
    }
  ]
}
```

---

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git push origin master
```

### Step 2: Connect Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import `faiss-rag-ui` repository

### Step 3: Set Environment Variables

In Vercel dashboard:

- `VITE_API_URL` = `https://faiss-pdf-rag.onrender.com`
- `VITE_API_KEY` = (same API_KEY as backend)

### Step 4: Deploy

Click "Deploy" — builds in ~2 minutes

---

## Customization

### Change Product Name

Edit `App.jsx`:

```jsx
<span className="brand-name">YourAppName</span>
```

### Change Theme Colors

Edit `App.css`:

```css
:root {
  --accent: #4f7cff;      /* Change primary color */
  --bg: #0d0f14;          /* Change background */
  --text: #e8eaf0;        /* Change text color */
  /* ... */
}
```

### Modify Suggestions

Edit `App.jsx`:

```jsx
const suggestions = [
  'Your suggestion 1',
  'Your suggestion 2',
  'Your suggestion 3',
];
```

### Change About Page Content

Edit `About.jsx`:

```jsx
<p>Your custom bio and description...</p>
```

---

## Performance Optimization

- **Lazy loading** — Message components render on demand
- **Memoization** — Prevents unnecessary re-renders
- **Event debouncing** — Smooth scrolling and input
- **CSS variables** — Minimal repaints on theme changes

### Page Load Metrics

- Initial HTML: ~5 KB
- JavaScript bundle: ~150 KB (after minify)
- CSS: ~20 KB
- Total time to interactive: ~2 seconds

---

## Browser Support

| Browser | Min Version |
| ------- | ----------- |
| Chrome  | 90+         |
| Firefox | 88+         |
| Safari  | 14+         |
| Edge    | 90+         |

---

## Troubleshooting

**"Failed to fetch" error**

- Check if backend URL is correct in `.env.local`
- Verify backend is running and accessible
- Check browser console for detailed error

**"Invalid API key" error**

- Confirm `VITE_API_KEY` matches backend `API_KEY`
- Verify header is being sent: check Network tab in DevTools

**"Index not found"**

- Upload a PDF first
- Wait for indexing to complete (status changes to green)
- Then ask a question

**Markdown not rendering**

- Ensure `react-markdown` is installed: `npm install react-markdown`
- Clear browser cache and rebuild: `npm run build`

**CORS errors**

- Backend must have CORS enabled (already configured)
- Check backend logs for details

---

## Keyboard Shortcuts

| Shortcut    | Action                   |
| ----------- | ------------------------ |
| Enter       | Send message             |
| Shift+Enter | New line (in text input) |
| Cmd/Ctrl+K  | Focus input (future)     |

---

## What This Demonstrates

✅ **React Best Practices** — Functional components, Hooks, state management
✅ **API Integration** — Axios with error handling and loading states
✅ **UI/UX Design** — Dark theme, responsive layout, accessibility
✅ **Markdown Rendering** — Rich text output formatting
✅ **Full-Stack Integration** — Seamless frontend-backend communication

---

## About the Developer

**Abdullah Khalid** — AI Engineer

I build full-stack AI applications from research to production. CiteCraft combines FastAPI, FAISS vector search, and React to create an intuitive document research interface.

**Skills:** React • Node.js • JavaScript • Python • System Design • UI/UX

**Links:** [GitHub](https://github.com/Abdullahkhalid11) | [Email](mailto:msabdullah2024@gmail.com)

---

## License

© 2026 Abdullah Khalid. All rights reserved.

CiteCraft is an independent portfolio project. Not affiliated with third-party libraries or AI providers.

---

## Questions?

- 📧 Email: [abdullahkhalid482@gmail.com](mailto:msabdullah2024@gmail.com)
- 💬 GitHub Issues: [faiss-rag-ui](https://github.com/Abdullahkhalid11/faiss-rag-ui/issues)
- 🔗 Backend: [faiss-pdf-rag](https://github.com/Abdullahkhalid11/faiss-pdf-rag)
