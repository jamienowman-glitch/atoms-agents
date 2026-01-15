.PHONY: setup lint test guardrails

# Variables
VENV := .venv
PY := $(VENV)/bin/python
RUFF := $(PY) -m ruff
MYPY := $(PY) -m mypy
PYTEST := $(PY) -m pytest
PIP := $(PY) -m pip

setup:
	python3 -m venv $(VENV)
	$(PIP) install -U pip
	$(PIP) install -e ".[dev]"

setup-bedrock:
	$(PIP) install -e ".[dev,bedrock]"

setup-adk:
	$(PIP) install -e ".[dev,adk]"

setup-vertex:
	$(PIP) install -e ".[dev,adk]"

setup-autogen:
	$(PIP) install -e ".[dev,autogen]"

setup-crewai:
	$(PIP) install -e ".[dev,crewai]"

setup-langgraph:
	$(PIP) install -e ".[dev,langgraph]"

setup-azure:
	$(PIP) install -e ".[dev,azure]"

setup-strands:
	$(PIP) install -e ".[dev,strands]"

setup-all:
	$(PIP) install -e ".[dev,bedrock,adk,autogen,crewai,langgraph,strands]"

lint:
	$(RUFF) check .
	$(RUFF) format --check .
	$(MYPY) src/northstar

test:
	$(PYTEST) tests

guardrails:
	$(PY) scripts/guardrails/run_all.py
