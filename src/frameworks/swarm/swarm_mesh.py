"""Swarm Mesh mode."""
from atoms_agents.src.frameworks.swarm.swarm_base import SwarmBaseFramework


class SwarmMeshFramework(SwarmBaseFramework):
    MODE_ID = "mesh"
    NAME = "Swarm Mesh"
    DESCRIPTION = "Mesh agent topology."
