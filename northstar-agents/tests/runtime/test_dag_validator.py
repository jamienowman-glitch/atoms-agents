
import pytest
from northstar.runtime.dag_validator import DAGValidator

def test_dag_cycle_detection():
    nodes = ["A", "B", "C"]
    # A -> B -> C -> A
    edges = [
        {"from": "A", "to": "B"},
        {"from": "B", "to": "C"},
        {"from": "C", "to": "A"},
    ]
    with pytest.raises(ValueError, match="Cycle detected"):
        DAGValidator.validate_dag(nodes, edges, "A", ["C"])

def test_dag_topo_sort():
    nodes = ["A", "B", "C"]
    # A -> B -> C
    edges = [
        {"from": "A", "to": "B"},
        {"from": "B", "to": "C"},
    ]
    order = DAGValidator.validate_dag(nodes, edges, "A", ["C"])
    assert order == ["A", "B", "C"]

def test_invalid_nodes():
    nodes = ["A"]
    edges = []
    with pytest.raises(ValueError, match="Exit node 'B' not found"):
        DAGValidator.validate_dag(nodes, edges, "A", ["B"])
