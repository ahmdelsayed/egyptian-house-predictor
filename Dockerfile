FROM node:20-alpine AS frontend-build

WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim

WORKDIR /app
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend/ ./backend/
COPY --from=frontend-build /build/frontend/dist ./backend/static

ENV PORT=7860
EXPOSE 7860

CMD sh -c 'gunicorn --bind 0.0.0.0:${PORT} --workers 1 --threads 2 app:app --chdir backend'