# syntax=docker/dockerfile:1

FROM node:16

WORKDIR /app

# Install backend dependencies
COPY ["backend/package.json", "backend/package-lock.json*", "./backend/"]
RUN cd backend && npm ci --omit-dev && cd ..

# Copy backend source
COPY backend ./backend

# Compile backend
RUN cd backend && npm run compile && cd ..

# Remove source code
RUN rm -rf backend/src

WORKDIR /app/backend
ENV NODE_ENV=production
CMD [ "npm", "start" ]
