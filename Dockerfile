# Define a versão específica do Node.js
FROM node:24.13.0-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de gerenciamento de pacotes primeiro
# Isso otimiza o cache do Docker, evitando reinstalar pacotes se o código mudar
COPY package.json package-lock.json ./

# Instala as dependências via npm
RUN npm install

# Copia todo o restante do código fonte do gateway
COPY . .

# ---------------------------------------------------
# PASSO DE PRODUÇÃO 1: Compilar o código TypeScript
# Isso vai gerar a pasta 'dist' contendo o JavaScript otimizado
# ---------------------------------------------------
RUN npm run build

# Define as variáveis de ambiente de fallback (serão sobrescritas pelo docker-compose)
ENV AUTH_MICROSERVICE_URL="http://localhost:3000"
ENV LOCADORES_MICROSERVICE_URL="http://localhost:3001"
ENV LOCATARIOS_MICROSERVICE_URL="http://localhost:3002"
ENV IMOVEIS_MICROSERVICE_URL="http://localhost:3003"
ENV AGENDAMENTOS_MICROSERVICE_URL="http://localhost:3004"

# Expõe a porta definida para o gateway
EXPOSE 4000

# ---------------------------------------------------
# PASSO DE PRODUÇÃO 2: Rodar o JavaScript puro
# ---------------------------------------------------
CMD ["node", "dist/main"]