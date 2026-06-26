import type { ClassificationResult } from "./types";

export async function classifyLead(
  requirement: string
): Promise<ClassificationResult | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY not set, skipping classification");
    return null;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a lead classification assistant. Respond only in valid JSON with no extra text.",
            },
            {
              role: "user",
              content: `Classify this lead requirement into a category and priority. Requirement: "${requirement}". Respond with this exact JSON format: { "category": "string", "priority": "High" | "Medium" | "Low" }`,
            },
          ],
          temperature: 0.3,
          max_tokens: 100,
        }),
      }
    );

    if (!response.ok) {
      console.error("Groq API error:", await response.text());
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    try {
      const parsed = JSON.parse(content) as ClassificationResult;
      if (!parsed.category || !parsed.priority) return null;
      return parsed;
    } catch (parseError) {
      console.error("Failed to parse Groq response:", content, parseError);
      return null;
    }
  } catch (error) {
    console.error("Lead classification failed:", error);
    return null;
  }
}
