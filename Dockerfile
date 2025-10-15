# Imagen base
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copia package.json e instala dependencias
COPY package*.json ./
RUN npm install --production

# Copia el resto del código
COPY . .

# Expone el puerto
EXPOSE 4000

# Comando por defecto
CMD ["node", "server.js"]
