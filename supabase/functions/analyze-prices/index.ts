import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entries, averagePrice, totalWeight, totalValue } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare data for AI analysis
    const priceList = entries.map((e: any) => `₹${e.price}/kg (${e.weight}kg)`).join(", ");
    const priceRange = {
      min: Math.min(...entries.map((e: any) => e.price)),
      max: Math.max(...entries.map((e: any) => e.price))
    };
    const variance = entries.reduce((sum: number, e: any) => {
      return sum + Math.pow(e.price - averagePrice, 2);
    }, 0) / entries.length;
    const stdDev = Math.sqrt(variance);

    const prompt = `You are a pricing analyst expert. Analyze this purchase data and provide actionable insights:

Data Summary:
- Number of purchases: ${entries.length}
- Price range: ₹${priceRange.min} - ₹${priceRange.max} per kg
- Average price: ₹${averagePrice.toFixed(2)} per kg
- Total weight: ${totalWeight} kg
- Total value: ₹${totalValue.toLocaleString('en-IN')}
- Price variance: ₹${stdDev.toFixed(2)}

Individual entries: ${priceList}

Provide a brief analysis (max 150 words) covering:
1. Price consistency assessment
2. Value-for-money insights
3. One specific actionable recommendation
4. Market positioning (if prices suggest premium/budget tier)

Be concise, specific, and actionable. Use Indian Rupee context.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a professional pricing analyst. Provide clear, actionable insights in a friendly but professional tone."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Analysis unavailable";

    return new Response(
      JSON.stringify({ 
        analysis,
        stats: {
          priceRange,
          standardDeviation: stdDev.toFixed(2),
          coefficient: (stdDev / averagePrice * 100).toFixed(2) + "%"
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
