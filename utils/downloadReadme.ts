  // Função para baixar o arquivo README.md
  export const downloadReadme = (text:any) => {
    const blob = new Blob([text], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "README.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };