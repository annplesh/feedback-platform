# Feedback Platform

A frontend-only feedback collection app built with React, Vite, and Tailwind CSS. Users can submit feedback with a name, message, and star rating. Approved entries are displayed on a public wall with sorting and summary stats.

Built as a portfolio project to demonstrate component architecture, state management, and UI design without a backend.

---

## Tech Stack

- **React 18** — UI and state
- **Vite** — dev server and build tool
- **Tailwind CSS 3** — utility-first styling
- **Google Fonts** — Cormorant Garamond + Outfit

---

## Features

- Submit feedback form with validation (name, message, star rating)
- Character counter and inline field errors
- Simulated async submit with loading state
- Thank-you confirmation screen after submission
- Public feedback wall showing all approved entries
- Sort by: newest, oldest, highest rated, lowest rated
- Summary stats: total reviews and average rating
- Staggered card reveal animations
- Responsive layout (1 → 2 → 3 column grid)
- Empty state handling

---

## Project Structure

```
feedback-platform/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   └── mockFeedback.js       # Hardcoded seed data
    ├── hooks/
    │   └── useFeedback.js        # Feedback state and actions
    ├── components/
    │   ├── Navbar.jsx
    │   ├── StarRating.jsx        # Shared: input + display modes
    │   └── FeedbackCard.jsx
    └── pages/
        ├── SubmitPage.jsx
        └── WallPage.jsx
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Notes

- No backend or database — all data is hardcoded in `src/data/mockFeedback.js`
- New submissions are added to state with `approved: false` and do not appear on the public wall
- To add backend support, replace the `setTimeout` in `SubmitPage.jsx` with a `fetch()` call and wire up `useFeedback.js` to a real API
