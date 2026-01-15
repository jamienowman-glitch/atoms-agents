from northstar.registry.schemas import RunProfileCard
from northstar.runtime.profiles import PersistenceFactory, PassthroughPII
from northstar.core.artifacts import LocalArtifactStore
import pytest

def test_run_profile_card():
    profile = RunProfileCard(
        profile_id="test",
        name="Test",
        persistence_backend="local",
        blackboard_backend="local",
        pii_strategy="passthrough",
        nexus_strategy="disabled",
        allow_local_fallback=True
    )
    assert profile.profile_id == "test"

def test_persistence_factory_local():
    profile = RunProfileCard(
        profile_id="dev",
        name="Dev",
        persistence_backend="local",
        blackboard_backend="local",
        pii_strategy="passthrough",
        nexus_strategy="disabled",
        allow_local_fallback=True
    )
    
    store = PersistenceFactory.get_artifact_store(profile, "/tmp")
    assert isinstance(store, LocalArtifactStore)
    
    pii = PersistenceFactory.get_pii_strategy(profile)
    assert isinstance(pii, PassthroughPII)

def test_persistence_factory_infra_no_fallback():
    profile = RunProfileCard(
        profile_id="prod",
        name="Prod",
        persistence_backend="infra",  # Requires infra
        blackboard_backend="infra",
        pii_strategy="infra",
        nexus_strategy="infra",
        allow_local_fallback=False    # Strict
    )
    
    with pytest.raises(RuntimeError, match="Infra persistence requested but not available"):
        PersistenceFactory.get_artifact_store(profile, "/tmp")

def test_persistence_factory_infra_with_fallback():
    profile = RunProfileCard(
        profile_id="staging",
        name="Staging",
        persistence_backend="infra",
        blackboard_backend="infra",
        pii_strategy="infra",
        nexus_strategy="infra",
        allow_local_fallback=True     # Permissive
    )
    
    # Should fall back to local
    store = PersistenceFactory.get_artifact_store(profile, "/tmp")
    assert isinstance(store, LocalArtifactStore)
