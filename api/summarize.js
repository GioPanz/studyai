export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { text } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Riassumi questo testo in italiano in modo chiaro:\n\n${text}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: JSON.stringify(data),
      });
    }

    return res.status(200).json({
      summary: data.choices[0].message.content,
    });

  } catch (err) {
    console.error("ERRORE OPENROUTER:", err);
    return res.status(500).json({
      error: String(err),
    });
  }
}
