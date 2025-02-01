# Usa Node.js otimizado para produção
FROM node:18-alpine

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos essenciais
COPY package.json package-lock.json ./

# Instala as dependências (somente para produção)
RUN npm install --production

# Copia todo o código para o container
COPY . .

# Copia o .env.local para dentro do container
COPY .env .env

# Build da aplicação
RUN npm run build

# Define a porta
EXPOSE 3000

# Inicia o servidor Next.js em modo produção
CMD ["npm", "run", "start"]
