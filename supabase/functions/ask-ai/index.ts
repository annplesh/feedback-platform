import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const allowedOrigins = [
  "https://feedback-hub-fullstack-portfolio-pr.vercel.app",
  "http://localhost:5173",
];

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0],
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers":
      "authorization, content-type, x-client-info, apikey",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const parsed = body ? JSON.parse(body) : {};
    const question = parsed.question;

    if (!question || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (question.length > 200) {
      return new Response(JSON.stringify({ error: "Question is too long" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Fetch approved feedback from Supabase
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { data: feedback, error: dbError } = await supabase
      .from("feedback")
      .select("name, message, rating, date")
      .eq("approved", true)
      .order("date", { ascending: false });

    if (dbError) throw new Error(dbError.message);

    if (!feedback || feedback.length === 0) {
      return new Response(
        JSON.stringify({ answer: "No reviews to analyze yet." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Format reviews for prompt
    const reviewsText = feedback
      .map(
        (r, i) =>
          `Review ${i + 1}: "${r.message}" — Rating: ${r.rating}/5 by ${r.name}`,
      )
      .join("\n");

    // Call Groq API
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that analyzes customer reviews for FeedbackHub. 
            Answer questions about the reviews concisely and helpfully. 
            Base your answers only on the provided reviews. 
            Keep responses under 150 words.`,
          },
          {
            role: "user",
            content: `Here are the customer reviews:\n\n${reviewsText}\n\nQuestion: ${question}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Groq error:", error);
      return new Response(
        JSON.stringify({ error: "AI is unavailable, please try again." }),
        { status: 500, headers: corsHeaders },
      );
    }

    const data = await res.json();
    const answer = data.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Ask AI failed:", err.message);
    return new Response(
      JSON.stringify({ error: "AI is unavailable, please try again." }),
      { status: 500, headers: corsHeaders },
    );
  }
});
