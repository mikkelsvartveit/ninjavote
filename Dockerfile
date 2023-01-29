# syntax=docker/dockerfile:1

FROM node:16

WORKDIR /app

# Install backend dependencies
COPY ["backend/package.json", "backend/package-lock.json*", "./backend/"]
RUN cd backend && npm ci --omit-dev && cd ..

# Install frontend dependencies
COPY ["frontend/package.json", "frontend/package-lock.json*", "./frontend/"]
RUN cd frontend && npm ci && cd ..

# Copy backend source
COPY backend ./backend

# Compile backend
RUN cd backend && npm run compile && cd ..

# Copy frontend source
COPY frontend ./frontend

# Build frontend
RUN cd frontend && npm run build && mkdir ../backend/public && cp -r build/* ../backend/public && cd ..

# Remove source code
RUN rm -rf frontend backend/src

WORKDIR /app/backend
ENV NODE_ENV=production
CMD [ "npm", "start" ]