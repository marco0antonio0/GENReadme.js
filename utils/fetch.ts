export default async function fetchGeminiResponse(userText: string): Promise<string | null> {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userText })
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar resposta");
    }

    const data = await response.json();
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Erro ao chamar API interna:", error);
    return null;
  }
}
