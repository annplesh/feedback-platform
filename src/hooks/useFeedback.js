import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useFeedback() {
  const [approvedItems, setApprovedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load approved feedback on mount + subscribe to realtime updates
  useEffect(() => {
    fetchFeedback();

    const channel = supabase
      .channel("feedback-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback" },
        () => fetchFeedback(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch approved feedback sorted by date
  async function fetchFeedback() {
    setLoading(true);

    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("approved", true)
      .order("date", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setApprovedItems(data);
    }

    setLoading(false);
  }

  // Submit new feedback (auto-approved)
  async function submitFeedback({ name, message, rating }) {
    const { error } = await supabase.from("feedback").insert([
      {
        name,
        message,
        rating,
        approved: true,
      },
    ]);

    if (error) throw new Error(error.message);

    await fetchFeedback();
  }

  return { approvedItems, submitFeedback, loading, error };
}
