import { useState } from "react";
import { supabase } from "../supabaseClient";

// RegisterPage — email + password registration form.
//
// Props:
//   onRegister {function} receives { email, password }
//   setPage    {function} navigate to a page

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function RegisterPage({ onRegister, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'error'
  const [authError, setAuthError] = useState("");

  function validateAll() {
    const e = {};
    if (!email.trim()) e.email = "Please enter your email.";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email.";
    if (!password.trim()) e.password = "Please enter your password.";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;
    setStatus("submitting");
    setAuthError("");
    try {
      await onRegister({ email: email.trim(), password });
    } catch (err) {
      setAuthError(err.message);
      setStatus("error");
    }
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  return (
    <main className="page-enter max-w-sm mx-auto px-3 py-16">
      <div className="mb-7">
        <p className="text-[11px] uppercase tracking-widest text-accent font-semibold mb-1.5">
          Join us
        </p>
        <h1 className="font-display text-4xl text-ink mb-2.5">Sign Up</h1>
        <p className="text-muted text-sm leading-relaxed">
          Create an account to leave a review.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl border border-cream shadow-sm p-5 space-y-5"
      >
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: "" }));
            }}
            placeholder="jane@example.com"
            className={[
              "field-input w-full px-3 py-2 rounded-lg border text-sm text-ink placeholder-muted bg-paper transition-colors",
              errors.email ? "border-red-400 bg-red-50" : "border-cream",
            ].join(" ")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-ink"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((p) => ({ ...p, password: "" }));
              }}
              placeholder="••••••"
              className={[
                "field-input w-full px-3 py-2 pr-10 rounded-lg border text-sm text-ink placeholder-muted bg-paper transition-colors",
                errors.password ? "border-red-400 bg-red-50" : "border-cream",
              ].join(" ")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors focus:outline-none focus:ring-0"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Auth error */}
        {authError && <p className="text-red-500 text-xs">{authError}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-ink text-paper hover:bg-accent active:scale-95 focus:outline-none focus:ring-0"
        >
          {status === "submitting" ? "Creating account…" : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-cream" />
          <span className="text-xs text-muted">or</span>
          <div className="flex-1 h-px bg-cream" />
        </div>

        {/* Google sign in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2 rounded-lg text-xs font-semibold border border-cream bg-white text-ink hover:bg-cream transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Link to login */}
        <p className="text-center text-xs text-muted">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setPage("login")}
            className="text-ink font-medium hover:text-accent transition-colors focus:outline-none focus:ring-0"
          >
            Sign in
          </button>
        </p>
      </form>
    </main>
  );
}
