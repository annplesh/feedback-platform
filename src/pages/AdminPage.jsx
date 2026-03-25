import { useState } from "react";
import FeedbackCard from "../components/FeedbackCard";

// AdminPage — all feedback with delete controls for moderation.
//
// Props:
//   items     {Array}    all feedback entries
//   onDelete  {function} receives item id

export default function AdminPage({ items, onDelete }) {
  const [toast, setToast] = useState("");

  async function handleDelete(id) {
    await onDelete(id);
    setToast("Review deleted successfully.");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <main className="page-enter max-w-5xl mx-auto px-3 xs:px-2 py-8 xs:py-6">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-widest text-accent font-semibold mb-1.5">
          Admin
        </p>
        <h1 className="font-display text-4xl text-ink">Moderation</h1>
      </div>

      {/* Toast */}
      {toast && (
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-paper rounded-full text-xs font-medium shadow-sm">
            ✓ {toast}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6">
        <p className="text-sm text-muted">
          Total reviews:{" "}
          <span className="text-ink font-medium">{items.length}</span>
        </p>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="text-center py-14 text-muted">
          <p className="text-3xl mb-3">✓</p>
          <p className="font-medium text-ink">No reviews yet</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{ gridAutoRows: "1fr" }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="flex-1 h-full">
                <FeedbackCard item={item} index={index} isAdmin={false} />
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="w-full py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors focus:outline-none focus:ring-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
