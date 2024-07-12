# Utiliza a imagem base do Nginx com Alpine Linux
FROM nginx:alpine

# Remove o site padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todos os arquivos estáticos HTML, CSS e JavaScript para o diretório raiz da web do Nginx
COPY ./src /usr/share/nginx/html

# Copia a configuração customizada do Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# O Nginx expõe a porta 80 por padrão
EXPOSE 80

# Comando para iniciar o Nginx (normalmente não necessário pois o entrypoint da imagem do nginx já faz isso)
CMD ["nginx", "-g", "daemon off;"]
