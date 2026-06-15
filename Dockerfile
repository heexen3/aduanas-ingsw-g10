# ==========================================
# Etapa 1: Construcción (Build)
# ==========================================
FROM node:20-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias limpias (producción y desarrollo para construir)
RUN npm ci

# Copiar el código del proyecto
COPY . .

# Compilar la aplicación para producción
RUN npm run build

# ==========================================
# Etapa 2: Servidor de Producción (Serve)
# ==========================================
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto por defecto de Nginx
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
