# Stage 1: Build React App
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
# Install dependencies
RUN npm install
COPY . .
# Build with CI=false to ignore warnings
RUN CI=false npm run build
# Debug: List build directory to verify output in logs
RUN ls -la build/

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*
# Copy build artifacts
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Debug: List final html directory
RUN ls -la /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
