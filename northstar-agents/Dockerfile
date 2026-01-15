# Use official Python runtime as a parent image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies if needed (e.g. for some pip packages)
# RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

# Copy project configuration
COPY pyproject.toml README.md Makefile ./

# Create virtual environment and install dependencies
# We install directly to system python in docker usually, but to match our Makefile tooling which expects .venv,
# we can use the Makefile or just install to system.
# Better to use the Makefile to ensure consistency with dev, 
# OR install strict for production.
# Let's use pip directly for the container to avoid dev tooling overhead if possible,
# BUT our code expects `make setup` kind of structure? No, code is pure python.
# We will use pip install . to install the package.

RUN pip install --no-cache-dir .

# Copy source code
COPY src/ src/
# Copy scripts if needed for runtime? Guardrails aren't needed at runtime.
# But we might want `northstar` CLI.

# Install the package again to include the source code we just copied (editable or build)
# Actually `pip install .` in step above might fail if src isn't there yet?
# Yes. `pyproject.toml` usually requires src layout presence if it scans.
# Let's copy src first.

# Invalidating cache only when src changes is good, but pyproject.toml changes less often.
# Standard pattern:
# COPY requirements.txt .
# RUN pip install -r requirements.txt
# COPY . .
# We don't have requirements.txt, we have pyproject.toml.

# Installing via pip using pyproject.toml requires build backend.
RUN pip install --no-cache-dir hatchling

# Copy minimal files for install
COPY src/northstar/__init__.py src/northstar/__init__.py
# Actually, just copy everything.
COPY src/ src/

# Install dependencies and the package
RUN pip install --no-cache-dir .

# Create a non-root user for security
RUN useradd -m appuser
USER appuser

# Set environment variables
ENV PYTHONUNBUFFERED=1
# Enforce no .env usage (though code handles it anyway)

# Entrypoint
ENTRYPOINT ["python", "-m", "northstar"]
CMD ["list-modes"]
