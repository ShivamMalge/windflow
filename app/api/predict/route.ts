// app/api/predict/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("https://cypher-hackathon-beta.vercel.app/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    // ✅ Log everything for debugging
    console.log("🔍 Remote /predict response:", response.status, text);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Upstream API error",
          status: response.status,
          details: text,
        }),
        { status: response.status }
      );
    }

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("❌ Proxy error:", err);
    return new Response(
      JSON.stringify({ error: "Proxy failed", details: err.message }),
      { status: 500 }
    );
  }
}
