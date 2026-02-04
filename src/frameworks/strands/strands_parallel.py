"""Strands Parallel mode."""
from atoms_agents.src.frameworks.strands.strands_base import StrandsBaseFramework


class StrandsParallelFramework(StrandsBaseFramework):
    MODE_ID = "parallel"
    NAME = "Strands Parallel"
    DESCRIPTION = "Parallel strands execution."
