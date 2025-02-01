import dotenv from "dotenv";

dotenv.config(); // Carregar variáveis de ambiente do arquivo .env

export default function fetchGeminiResponse(userText: string): Promise<string | null> {
  return new Promise(async (resolve, reject) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("Erro: API Key não encontrada no .env");
      return resolve(null);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: userText }]
        }
      ],
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
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      resolve(data ? JSON.stringify(data, null, 2) : null);
    } catch (error) {
      console.error("Erro ao buscar resposta da API:", error);
      reject(error);
    }
  });
}
