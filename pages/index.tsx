import Image from "next/image";
import localFont from "next/font/local";
import { useState, useEffect } from "react";
import { downloadReadme } from "@/utils/downloadReadme";
import { parseCookies, setCookie } from "nookies";
import promptFormat from "@/utils/promptFormat";
import Head from "next/head";
import fetchGeminiResponse from "@/utils/fetch";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");
  const [tecnologias, setTecnologias] = useState("");
  const [emojiTopic, setEmojiTopic] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Mensagem de erro

  // Estados de erro para os inputs
  const [errorLimit, setErrorLimit] = useState(false);
  const [errorTitulo, setErrorTitulo] = useState(false);
  const [quantidade, setquantidade] = useState(20);
  const [errorCaracteristicas, setErrorCaracteristicas] = useState(false);
  const [errorTecnologias, setErrorTecnologias] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(matchDark.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    matchDark.addEventListener("change", handleChange);

    return () => matchDark.removeEventListener("change", handleChange);
  }, []);

  // Função para validar os campos antes da geração do README
  const validateFields = () => {
    let isValid = true;

    if (!titulo.trim()) {
      setErrorTitulo(true);
      isValid = false;
    } else {
      setErrorTitulo(false);
    }

    if (!caracteristicas.trim()) {
      setErrorCaracteristicas(true);
      isValid = false;
    } else {
      setErrorCaracteristicas(false);
    }

    if (!tecnologias.trim()) {
      setErrorTecnologias(true);
      isValid = false;
    } else {
      setErrorTecnologias(false);
    }

    return isValid;
  };

  // Função para verificar se o usuário atingiu o limite de gerações
  const checkGenerationLimit = () => {
    const cookies = parseCookies();
    const generationData = cookies.generationData ? JSON.parse(cookies.generationData) : { count: 0, lastGeneration: null };
    const currentTime = Date.now();
    const oneHour = 1 * 60 * 1000; // 1 hora em milissegundos
    if (generationData.count >= quantidade) {
      const timeRemaining = oneHour - (currentTime - generationData.lastGeneration);
      if (timeRemaining > 0) {
        const minutesRemaining = Math.ceil(timeRemaining / (60 * 1000)); // Converte para minutos
        setErrorMessage(`⚠️ Você atingiu o limite de ${quantidade} gerações. Tente novamente em ${minutesRemaining} minutos.`);
        return false;
      } else {
        // Resetar o cookie após 1 hora
        setCookie(null, "generationData", JSON.stringify({ count: 0, lastGeneration: null }), { maxAge: oneHour, path: "/" });
      }
    }
    return true;
  };

  const handleGerarReadme = async () => {
    if (!validateFields()) {
      return; // Se houver erros nos campos, não faz o fetch
    }

    if (!checkGenerationLimit()) {
      setErrorLimit(true)
      return; 
    }else{
      setErrorLimit(false)
    }

    setLoading(true);
    setErrorMessage(""); // Reseta a mensagem de erro

    // Atualiza o cookie de geração
    const cookies = parseCookies();
    const generationData = cookies.generationData ? JSON.parse(cookies.generationData) : { count: 0, lastGeneration: null };
    generationData.count += 1;
    generationData.lastGeneration = Date.now();
    setCookie(null, "generationData", JSON.stringify(generationData), { maxAge: 60 * 60, path: "/" });

    var prompt = promptFormat({titulo,caracteristicas,tecnologias,emoji,emojiTopic})


    try {
      const response = await fetchGeminiResponse(prompt);

      if (!response) {
        throw new Error("Resposta vazia ou erro na requisição.");
      }

      const e = typeof response === "string" ? JSON.parse(response) : response;

      if (e?.candidates?.length > 0) {
        let textResponse = e.candidates[0].content.parts[0].text;
        textResponse = textResponse.replace(/^```markdown\s*/, "").replace(/```$/, "");
        downloadReadme(textResponse);
      } else {
        throw new Error("Nenhuma resposta válida recebida da IA.");
      }
    } catch (error) {
      alert("Erro ao processar a resposta da IA. Tente novamente mais tarde.");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };
  return (
<>
          {/* 🔹 Meta Tags para SEO */}
          <Head>
          <title>Gerador de README | IA para Documentação de Projetos</title>
          <meta name="description" content="Crie READMEs incríveis e bem estruturados com IA. Gerador de README para projetos usando inteligência artificial." />
          <meta name="keywords" content="Gerador de README, Documentação, Markdown, Inteligência Artificial, Projetos, Open Source" />
          <meta name="author" content="Marco Antônio" />
          <meta name="robots" content="index, follow" />
  
          {/* 🔹 Open Graph (Facebook, LinkedIn, WhatsApp) */}
          <meta property="og:title" content="Gerador de README com IA 🚀" />
          <meta property="og:description" content="Crie READMEs bonitos e bem estruturados com inteligência artificial! Basta preencher algumas informações e obter um README profissional." />
          <meta property="og:image" content="/logo.png" />
          <meta property="og:url" content="https://seusite.com" />
          <meta property="og:type" content="website" />
  
          {/* 🔹 Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Gerador de README com IA 🚀" />
          <meta name="twitter:description" content="Crie READMEs incríveis e bem estruturados com inteligência artificial. Fácil, rápido e profissional!" />
          <meta name="twitter:image" content="/logo.png" />
  
          {/* 🔹 Favicon */}
          <link rel="icon" href="/favicon.ico" />
        </Head>
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start m-auto max-w-[500px]">
      <img className="w-[300px] h-auto dark:invert" src="/logo.svg" alt="Logo" style={!isDarkMode?{filter:'invert(1)'}:{filter:'invert(0)'}}/>

        <span className="text-justify">
          Esta aplicação web permite que você crie READMEs bonitos e bem estruturados com a ajuda da IA, preenchendo apenas algumas informações sobre o seu projeto. Com poucos cliques, você terá uma documentação profissional, pronta para ser usada no seu repositório. Ganhe tempo e melhore a apresentação dos seus projetos!
        </span>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] w-full space-y-2">
          <li className="mb-2">Qual título do seu projeto?</li>
          <textarea
            className={`w-full p-2 border rounded-md resize-none dark:bg-black/[.08] focus:outline-none focus:ring-2 ${
              errorTitulo ? "border-red-500" : "focus:ring-gray-400"
            }`}
            rows={1}
            placeholder="Digite o título do seu projeto..."
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value);
              setErrorTitulo(false);
            }}
          />

          <li className="mb-2">Quais características do projeto?</li>
          <textarea
            className={`w-full p-2 border rounded-md resize-none dark:bg-black/[.08] focus:outline-none focus:ring-2 ${
              errorCaracteristicas ? "border-red-500" : "focus:ring-gray-400"
            }`}
            rows={3}
            placeholder="Descreva as principais características..."
            value={caracteristicas}
            onChange={(e) => {
              setCaracteristicas(e.target.value);
              setErrorCaracteristicas(false);
            }}
          />

          <li className="mb-2">Digite as tecnologias utilizadas</li>
          <textarea
            className={`w-full p-2 border rounded-md resize-none dark:bg-black/[.08] focus:outline-none focus:ring-2 ${
              errorTecnologias ? "border-red-500" : "focus:ring-gray-400"
            }`}
            rows={3}
            placeholder="Exemplo: React, Next.js, Tailwind CSS..."
            value={tecnologias}
            onChange={(e) => {
              setTecnologias(e.target.value);
              setErrorTecnologias(false);
            }}
          />

          <li className="mb-2 flex items-center justify-between">
            Deseja adicionar emojis no README?
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emoji}
                onChange={() => setEmoji(!emoji)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-gray-500 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:bg-white peer-checked:bg-gray-800 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-gray-500 after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </li>
          <li className="mb-2 flex items-center justify-between">
            Deseja adicionar emojis destacar topicos no README?
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emojiTopic}
                onChange={() => setEmojiTopic(!emojiTopic)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-gray-500 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:bg-white peer-checked:bg-gray-800 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-gray-500 after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </li>
          {errorLimit?<li className="mb-2 flex items-center justify-between text-red-500">
            Foi atingido o limite de {quantidade} gerações de readme, aguarde 1 hora para poder gerar novamente
          </li>:null}
          </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
        <button
            onClick={handleGerarReadme}
            className="relative rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-[150px]"
            disabled={loading}
          >
            {loading ? <div className="animate-spin w-5 h-5 border-4 border-black border-t-transparent rounded-full"></div> : "Gerar README"}
          </button>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://github.com/marco0antonio0/GENReadme.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            Saiba mais sobre
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/marco0antonio0/GENReadme.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Saiba mais
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/marco0antonio0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Veja quem criou →
        </a>
      </footer>
    </div>
</>
  );
}
