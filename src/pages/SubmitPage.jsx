import { useState } from "react";
import StarRating from "../components/StarRating";

// SubmitPage — public feedback submission form.
//
// Form states: idle → submitting → success
// Success shows a thank-you screen with a reset option.
//
// Props:
//   onSubmit {function}  receives { name, message, rating }

const MAX_MESSAGE = 300;

export default function SubmitPage({ onSubmit }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success'

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    if (rating === 0) e.rating = "Please select a star rating.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    // Simulate async — swap for a real fetch() when backend is ready
    setTimeout(() => {
      onSubmit({ name: name.trim(), message: message.trim(), rating });
      setStatus("success");
    }, 700);
  }

  function handleReset() {
    setName("");
    setMessage("");
    setRating(0);
    setErrors({});
    setStatus("idle");
  }

  // ── Success screen ──────────────────────────────────────
  if (status === "success") {
    return (
      <div className="page-enter min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6 text-2xl">
            ✓
          </div>
          <h2 className="font-display text-3xl text-ink mb-3">Thank you!</h2>
          <p className="text-muted text-sm leading-relaxed mb-8">
            Your feedback has been submitted and is pending review. We really
            appreciate you taking the time.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-ink text-paper rounded-lg text-sm font-medium hover:bg-accent transition-colors"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────
  return (
    <main className="page-enter max-w-xl mx-auto px-4 py-14">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
          Share your experience
        </p>
        <h1 className="font-display text-5xl text-ink mb-3">Leave a Review</h1>
        <p className="text-muted text-sm">
          Your thoughts help us improve. Honest feedback, however critical, is
          always welcome.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl border border-cream shadow-sm p-8 space-y-7"
      >
        {/* Name field */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-ink">
            Your name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: "" }));
            }}
            placeholder="e.g. Jane Doe"
            className={[
              "field-input w-full px-4 py-2.5 rounded-lg border text-sm text-ink placeholder-muted bg-paper transition-colors",
              errors.name ? "border-red-400 bg-red-50" : "border-cream",
            ].join(" ")}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        {/* Message field */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-ink"
            >
              Your message
            </label>
            <span className="text-xs text-muted">
              {message.length}/{MAX_MESSAGE}
            </span>
          </div>
          <textarea
            id="message"
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_MESSAGE) {
                setMessage(e.target.value);
                setErrors((p) => ({ ...p, message: "" }));
              }
            }}
            placeholder="Tell us what you think…"
            rows={4}
            className={[
              "field-input w-full px-4 py-2.5 rounded-lg border text-sm text-ink placeholder-muted bg-paper resize-none transition-colors",
              errors.message ? "border-red-400 bg-red-50" : "border-cream",
            ].join(" ")}
          />
          {errors.message && (
            <p className="text-red-500 text-xs">{errors.message}</p>
          )}
        </div>

        {/* Star rating */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">Rating</p>
          <StarRating
            value={rating}
            onChange={(v) => {
              setRating(v);
              setErrors((p) => ({ ...p, rating: "" }));
            }}
          />
          {errors.rating && (
            <p className="text-red-500 text-xs">{errors.rating}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-3 bg-ink text-paper rounded-lg text-sm font-semibold hover:bg-accent active:scale-95 disabled:opacity-50 transition-all"
        >
          {status === "submitting" ? "Submitting…" : "Submit Feedback"}
        </button>
      </form>
    </main>
  );
}
