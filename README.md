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

## Supabase Integration

### 1. Install dependency

```bash
npm install @supabase/supabase-js
```

### 2. Environment variables

Create `.env` in project root:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> `.env` is listed in `.gitignore` and never committed.

---

### 3. Supabase client

**`src/supabaseClient.js`**

```js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
```

---

### 4. Data hook — `useFeedback.js`

Replaced mock state with real Supabase queries:

- **Load** — fetches rows where `approved = true`, ordered by `date DESC`
- **Submit** — inserts new row with `name`, `message`, `rating` and a UTC timestamp (`new Date().toISOString()`)
- **Realtime** — subscribes to `postgres_changes` on `INSERT` and `UPDATE`; refreshes list automatically when a review is approved
- **State** — exposes `approvedItems`, `submitFeedback`, `loading`, `error`

---

### 5. Mock data removed

`src/data/mockFeedback.js` deleted.
`MOCK_FEEDBACK` import removed from `useFeedback.js`.

---

### 6. App.jsx

Destructures `loading` and `error` from `useFeedback`:

```jsx
const { approvedItems, submitFeedback, loading, error } = useFeedback();
```

Passes `loading` to `WallPage` as prop.

---

### 7. WallPage + FeedbackCard

**WallPage** — renders a centered spinner while `loading === true`, then displays the sorted grid.

**FeedbackCard** — formats ISO date string to locale-friendly display:

```js
new Date(item.date).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
```

### 8. Data Persistence

The application does not store any data locally.

All feedback entries are persisted in Supabase.

No sessions, cookies, or localStorage are used.

The frontend retrieves data on demand and receives realtime updates through Supabase channels.
