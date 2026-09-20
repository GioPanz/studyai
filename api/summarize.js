export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { text } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://studyai-three-pink.vercel.app",
        "X-Title": "StudyAI"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Riassumi il testo in italiano in modo chiaro, semplice e con punti elenco se utile."
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    const summary =
      data.choices?.[0]?.message?.content || "Errore nel riassunto.";

    return res.status(200).json({ summary });
  } catch (error) {
    return res.status(500).json({ summary: "Errore di connessione all'IA." });
  }
}
