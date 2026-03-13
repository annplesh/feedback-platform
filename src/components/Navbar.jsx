// Navbar — shared top bar for all public pages.
// Props:
//   page    {string}   current active page id
//   setPage {function} navigate to a page

export default function Navbar({ page, setPage }) {
  const links = [
    { id: "submit", label: "Leave a Review" },
    { id: "wall", label: "All Reviews" },
  ];

  return (
    <header className="bg-paper border-b border-cream sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand mark */}
        <button
          onClick={() => setPage("submit")}
          className="flex items-center gap-2.5"
          aria-label="Go to home"
        >
          <div className="w-8 h-8 bg-ink rounded flex items-center justify-center">
            <span className="text-paper text-xs font-semibold tracking-tight">
              FB
            </span>
          </div>
          <span className="font-display text-xl text-ink font-semibold leading-none pt-0.5">
            FeedbackHub
          </span>
        </button>

        {/* Nav links */}
        <ul className="flex items-center gap-1">
          {links.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => setPage(link.id)}
                className={[
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  page === link.id
                    ? "bg-ink text-paper"
                    : "text-muted hover:text-ink hover:bg-cream",
                ].join(" ")}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
