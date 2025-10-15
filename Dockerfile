# 1️⃣ Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# 2️⃣ Build backend + copy frontend build
FROM python:3.11-slim
WORKDIR /app

# Install backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy frontend build into backend static folder
COPY --from=frontend-build /app/frontend/build ./static

# Expose Flask port
EXPOSE 5000

CMD ["python", "app.py"]
