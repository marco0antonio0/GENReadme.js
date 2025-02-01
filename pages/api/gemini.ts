import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Permitir apenas requisições do frontend da aplicação
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const origin = req.headers.origin || "";

  if (!origin.includes(allowedOrigin)) {
    return res.status(403).json({ error: "Acesso negado: Origem não permitida" });
  }

  // A chave API agora é acessível apenas no backend
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key não configurada no servidor" });
  }

  const { userText } = req.body;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{ role: "user", parts: [{ text: userText }] }],
    generationConfig: {
      temperature: 1,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain"
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Erro: ${response.statusText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
