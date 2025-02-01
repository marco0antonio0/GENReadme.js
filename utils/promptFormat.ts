export default function promptFormat({titulo,caracteristicas,tecnologias,emoji,emojiTopic}:{titulo:string,caracteristicas:string,tecnologias:string,emoji:boolean,emojiTopic:boolean}){
   return `
    Crie um README completo e detalhado para meu projeto com base nas seguintes informações:
    
    ## 🔹 Informações básicas do projeto:
    - **Título do projeto:** ${titulo}
    - **Descrição do projeto:** Explique claramente o que o projeto faz, seu objetivo e como ele pode ser útil para outras pessoas.
    - **Principais características:** ${caracteristicas}
    - **Tecnologias utilizadas:** ${tecnologias}
    
    ## 🔹 Instruções detalhadas para o README:
    1️⃣ **Introdução**  
       - Explique o propósito do projeto.  
       - Diga para quem ele foi feito e qual problema resolve.  
       - Use uma linguagem clara e acessível.  
    
    2️⃣ **Recursos e funcionalidades**  
       - Liste os principais recursos que fazem parte do projeto.  
       - Dê exemplos práticos de como eles funcionam.  
    
    3️⃣ **Tecnologias utilizadas**  
       - Liste todas as tecnologias, frameworks, bibliotecas e linguagens utilizadas.  
       - Para cada uma, explique brevemente o motivo da escolha e sua função no projeto.  
    
    4️⃣ **Pré-requisitos e instalação**  
       - Informe se há alguma tecnologia ou ferramenta que precisa estar instalada antes de rodar o projeto.  
       - Explique como instalar e configurar todas as dependências necessárias.  
       - Inclua instruções detalhadas sobre como clonar o repositório e iniciar o projeto.  
       - Forneça exemplos de comandos para instalar pacotes e rodar a aplicação.  
    
    5️⃣ **Como usar**  
       - Explique passo a passo como utilizar o projeto.  
       - Se houver interface, descreva o fluxo de navegação.  
       - Se for uma API, forneça exemplos de chamadas HTTP e respostas esperadas.  
       - Use exemplos de código sempre que necessário.  
    
    6️⃣ **Exemplos de código**  
       - Inclua trechos de código que ajudem os usuários a entender como usar o projeto.  
       - Adicione exemplos comentados para facilitar a compreensão.  
    
    7️⃣ **Estrutura de diretórios (se aplicável)**  
       - Liste as principais pastas e arquivos do projeto, explicando a função de cada um.  
    
    8️⃣ **Contribuição**  
       - Explique como outras pessoas podem contribuir para o projeto.  
       - Forneça diretrizes para abrir issues e fazer pull requests.  
    
    9️⃣ **Licença**  
       - Se houver uma licença (MIT, Apache, GPL, etc.), informe qual é e forneça o link para mais detalhes.  
    
    🔹 **IMPORTANTE**:  
    - O README deve estar em **formato Markdown**.  
    - Ele **deve ser bem estruturado**, com títulos, subtítulos e listas bem organizadas.  
    ${emojiTopic?'- Sempre que possível, utilize **emojis** para destacar seções (📌, ⚡, ✅, 🚀, etc.).  ':''}
    - Para fazer o README do projeto utilize emojis:** ${emoji ? "Sim" : "Não"}
    - NÃO inclua nada além do Markdown gerado.  
    `;
}