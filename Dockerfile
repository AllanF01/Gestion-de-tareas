# Usar una imagen base de Node.js
FROM node:16

# Crear un directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar las dependencias de Node.js
RUN npm install

# Copiar todo el código de tu aplicación al contenedor
COPY . .

# Exponer el puerto que la aplicación usará (puerto 3000 por defecto en tu código)
EXPOSE 3000

# Definir el comando para ejecutar tu aplicación
CMD ["node", "app.js"]
