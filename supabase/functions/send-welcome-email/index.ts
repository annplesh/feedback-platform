import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
    const userEmail = parsed.email;

    if (!userEmail) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "FeedbackHub <onboarding@resend.dev>",
        to: userEmail,
        subject: "Welcome to FeedbackHub!",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
            <h1 style="font-size: 24px; color: #1a1714;">Welcome to FeedbackHub!</h1>
            <p style="color: #6b6660; line-height: 1.6;">
              Thank you for joining. We're glad to have you here.
              Share your experience and help others make better decisions.
            </p>
            <a href="https://feedback-hub-fullstack-portfolio-pr.vercel.app"
               style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #1a1714; color: #f7f4ef; border-radius: 8px; text-decoration: none; font-size: 14px;">
              Leave a Review
            </a>
            <p style="margin-top: 32px; font-size: 12px; color: #9e9890;">
              FeedbackHub · Frontend portfolio project
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Send welcome email failed:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
