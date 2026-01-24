FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy project definition
COPY pyproject.toml .

# Install dependencies
RUN uv sync --frozen --no-install-project

# Copy source code
COPY src/ .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uv", "run", "uvicorn", "muscle.main:app", "--host", "0.0.0.0", "--port", "8000"]
