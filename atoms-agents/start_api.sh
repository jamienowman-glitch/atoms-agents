#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)/src
python3 src/atoms_agents/server/main.py
