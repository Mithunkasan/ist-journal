# Base image for building
FROM node:20 as builder



WORKDIR /app



# Copy package.json and package-lock.json (or yarn.lock)


COPY package.json package-lock.json ./

# Install dependencies including legacy peer dependencies
RUN npm install --legacy-peer-deps


# Install any necessary system dependencies
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    openssl \
    libssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json ./




# Install  Prisma CLI globally
RUN npm install -g  prisma

# Copy project files
COPY . .



# Optionally, run Prisma generate here to ensure Prisma Client is generated
RUN npx prisma generate


# Build the app
RUN npm run build



# Start of the second stage: the production image
FROM node:20-slim


WORKDIR /app

# Install OpenSSL in the production image if Prisma requires it
RUN apt-get update && apt-get install -y openssl libssl-dev

# Copy runtime dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# COPY --from=builder /app/dist/apps/source-toolkit ./

# Copy Prisma schema and generated Prisma Client to the production image
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]

