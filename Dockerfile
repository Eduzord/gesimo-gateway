# Define a versão específica do Node.js
FROM node:24.13.0-alpine


# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de gerenciamento de pacotes primeiro
# Isso otimiza o cache do Docker, evitando reinstalar pacotes se o código mudar, mas as dependências não
COPY package.json package-lock.json ./

# Instala as dependências via npm
RUN npm install


# Copia todo o restante do código fonte do gateway
COPY . .

# Define as variáveis de ambiente (podem ser sobrescritas via docker-compose ou runtime)
ENV AUTH_MICROSERVICE_URL="http://localhost:3000"
ENV LOCADORES_MICROSERVICE_URL="http://localhost:3001"
ENV IMOVEIS_MICROSERVICE_URL="http://localhost:3002"

# Expõe a porta definida para o gateway
EXPOSE 4000

# Comando para iniciar a aplicação em modo de desenvolvimento (com hot-reload)
CMD ["npm", "run", "start:dev"]