# Dokploy & Production Container for TradingAgents
FROM node:22-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Build Vite client assets
RUN npm run build

# Default runtime environment
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Dokploy will supply GEMINI_API_KEY via its Environment / Secrets settings
# ENV GEMINI_API_KEY=""

EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]
