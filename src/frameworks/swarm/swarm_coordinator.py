"""Swarm Coordinator mode."""
from atoms_agents.src.frameworks.swarm.swarm_base import SwarmBaseFramework


class SwarmCoordinatorFramework(SwarmBaseFramework):
    MODE_ID = "coordinator"
    NAME = "Swarm Coordinator"
    DESCRIPTION = "Swarm coordinator mode."
