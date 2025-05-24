# Gunakan image Node.js versi terbaru
FROM node:18

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code
COPY . .

# Tentukan port aplikasi berjalan
EXPOSE 5001

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]