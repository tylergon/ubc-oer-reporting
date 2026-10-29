
# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY ./web/package*.json ./
RUN npm ci
COPY ./web .
COPY ./crawler/output ./static/data
RUN npm run build
RUN npm prune --omit=dev

# Runtime stage

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

COPY --from=build /app/build build
COPY --from=build /app/node_modules node_modules
COPY ./web/package.json .

USER node
EXPOSE 3000
CMD ["node", "build"]
