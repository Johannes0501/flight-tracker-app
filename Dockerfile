FROM node:20-alpine

WORKDIR /app

# Install dependencies
# Using npm install instead of npm ci to work without package-lock.json
COPY package*.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

# Build if needed
RUN npm run build --if-present

EXPOSE 80
ENV PORT=80
ENV NODE_ENV=production

CMD ["npm", "start"]
