import { useState } from "react";
import { MOCK_FEEDBACK } from "../data/mockFeedback";

// Custom hook — owns all feedback state and actions.
// Consumed in App.jsx and passed down to pages as props.
export function useFeedback() {
  const [items, setItems] = useState(MOCK_FEEDBACK);

  // Add a new submission. approved: false means it won't
  // appear on the public wall until an admin approves it.
  function submitFeedback({ name, message, rating }) {
    const newEntry = {
      id: Date.now(),
      name,
      message,
      rating,
      date: new Date().toISOString().split("T")[0],
      approved: false,
    };
    setItems((prev) => [newEntry, ...prev]);
  }

  // Only approved items are shown on the public wall
  const approvedItems = items.filter((f) => f.approved);

  return { approvedItems, submitFeedback };
}
