# 1. Usa uma versão estável do Node.js
FROM node:20-slim

# 2. Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# 3. Copia apenas os arquivos de dependências primeiro (otimiza o cache)
COPY package*.json ./

# 4. Instala as dependências
RUN npm install

# 5. Copia o restante dos arquivos do projeto (incluindo o src)
COPY . .

# 6. Expõe a porta que a sua API usa (geralmente 3000 ou 3333)
EXPOSE 3000

# 7. Comando para iniciar o servidor
CMD ["npm", "start"]