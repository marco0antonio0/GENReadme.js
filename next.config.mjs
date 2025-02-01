/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Habilita a exportação estática
  trailingSlash: true, // Garante que todas as rotas tenham uma barra final (importante para exportação)

};

export default nextConfig;
