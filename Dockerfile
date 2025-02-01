# Segunda fase: use uma imagem nginx leve para servir a aplicação
FROM nginx:alpine

# Copie a configuração do Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copie os arquivos de build do Flutter para o diretório padrão do Nginx
COPY --from=build /build/web /usr/share/nginx/html

# Exponha a porta onde o Nginx servirá a aplicação
EXPOSE 80

# Inicie o Nginx
CMD ["nginx", "-g", "daemon off;"]