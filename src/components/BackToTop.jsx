import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show the button only when the user has scrolled down
      setVisible(window.scrollY > 150);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={[
        "fixed bottom-6 right-6 z-50",
        "w-10 h-10 rounded-full bg-ink text-paper text-base",
        "flex items-center justify-center",
        "shadow-md hover:bg-accent",
        "active:bg-accent/80 active:scale-95",
        "[touch-action:manipulation]",
        "focus:outline-none focus:ring-0",
        "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none",
      ].join(" ")}
    >
      ↑
    </button>
  );
}
