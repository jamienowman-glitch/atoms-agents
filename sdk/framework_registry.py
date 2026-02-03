"""
Framework Registry SDK for agent framework management.
Provides tools for discovering, validating, and registering agent frameworks.
Prevents hallucination by enforcing real validation of framework configurations.
"""

import os
import json
import requests
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from datetime import datetime
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class ModeCategory(Enum):
    """Execution mode categories."""
    GOVERNANCE = "governance"
    HIERARCHY = "hierarchy"
    EXECUTION = "execution"
    CONVERSATION = "conversation"


@dataclass
class Mode:
    """Represents an execution mode."""
    id: str
    name: str
    category: ModeCategory
    description: str
    frameworks: List[str]  # Framework names that support this mode


@dataclass
class Framework:
    """Represents a registered framework."""
    id: str
    name: str
    python_class: str
    repo_url: str
    documentation_url: str
    description: str
    requires_api_key: bool = False


class FrameworkRegistry:
    """
    Main SDK class for framework management.
    All agents should use this to discover and validate frameworks.
    """

    def __init__(self, api_base_url: Optional[str] = None):
        """
        Initialize the registry.
        
        Args:
            api_base_url: Base URL for API endpoints (defaults to localhost)
        """
        self.api_base_url = api_base_url or os.getenv(
            "FRAMEWORK_API_URL", 
            "http://localhost:3000/api"
        )
        self.session = requests.Session()
        self._frameworks_cache: Dict[str, Framework] = {}
        self._modes_cache: Dict[str, Mode] = {}

    def register_framework(
        self,
        name: str,
        python_class: str,
        repo_url: str,
        documentation_url: str,
        description: str,
        requires_api_key: bool = False,
        validate: bool = True
    ) -> Tuple[bool, Framework, str]:
        """
        Register a new framework in the system.
        
        This is the validation gate that prevents agents from hallucinating.
        Agents must provide real repo_url that can be verified.
        
        Args:
            name: Human-readable framework name
            python_class: Python import path (e.g., 'autogen.GroupChat')
            repo_url: GitHub/GitLab URL for verification
            documentation_url: Documentation link
            description: What this framework does
            requires_api_key: Whether this framework needs API credentials
            validate: Whether to validate against real repo
            
        Returns:
            Tuple of (success, Framework, error_message)
        """
        try:
            # If validation enabled, check the repo actually exists
            if validate:
                success, error = self._validate_repo(repo_url)
                if not success:
                    logger.warning(f"Repo validation failed for {repo_url}: {error}")
                    return False, None, f"Repo validation failed: {error}"
            
            # Make API request to register
            payload = {
                "name": name,
                "python_class": python_class,
                "repo_url": repo_url,
                "documentation_url": documentation_url,
                "description": description,
                "requires_api_key": requires_api_key,
                "validated": validate,
            }
            
            response = self.session.post(
                f"{self.api_base_url}/frameworks",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 201:
                framework_data = response.json()
                framework = Framework(**framework_data)
                self._frameworks_cache[framework.name] = framework
                logger.info(f"Successfully registered framework: {name}")
                return True, framework, ""
            elif response.status_code == 409:
                return False, None, f"Framework '{name}' already registered"
            else:
                return False, None, f"API error: {response.status_code} - {response.text}"
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error registering framework: {e}")
            return False, None, str(e)
        except Exception as e:
            logger.error(f"Unexpected error registering framework: {e}")
            return False, None, str(e)

    def validate_modes(
        self,
        framework_name: str,
        mode_names: List[str]
    ) -> Tuple[bool, List[str]]:
        """
        Validate that a set of modes are compatible for a framework.
        
        Critical for preventing agent misconfiguration.
        
        Args:
            framework_name: Name of the framework
            mode_names: List of mode names to validate
            
        Returns:
            Tuple of (is_valid, conflicts) where conflicts is list of incompatible pairs
        """
        try:
            # Get framework
            framework = self.get_framework(framework_name)
            if not framework:
                return False, [f"Framework '{framework_name}' not found"]
            
            # Get modes
            modes = [self.get_mode(m) for m in mode_names]
            if any(m is None for m in modes):
                missing = [m for m in mode_names if self.get_mode(m) is None]
                return False, [f"Modes not found: {missing}"]
            
            # Call validation API
            response = self.session.post(
                f"{self.api_base_url}/validate-modes",
                json={
                    "framework_id": framework.id,
                    "mode_ids": [m.id for m in modes]
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["is_valid"], data.get("conflicts", [])
            else:
                logger.error(f"Validation API error: {response.status_code}")
                return False, ["Validation service error"]
                
        except Exception as e:
            logger.error(f"Error validating modes: {e}")
            return False, [str(e)]

    def get_framework(self, name: str) -> Optional[Framework]:
        """
        Get a framework by name.
        
        Args:
            name: Framework name
            
        Returns:
            Framework object or None if not found
        """
        # Check cache first
        if name in self._frameworks_cache:
            return self._frameworks_cache[name]
        
        try:
            response = self.session.get(
                f"{self.api_base_url}/frameworks/by-name/{name}",
                timeout=10
            )
            
            if response.status_code == 200:
                framework_data = response.json()
                framework = Framework(**framework_data)
                self._frameworks_cache[name] = framework
                return framework
            else:
                return None
                
        except Exception as e:
            logger.error(f"Error fetching framework {name}: {e}")
            return None

    def get_mode(self, name: str) -> Optional[Mode]:
        """
        Get a mode by name.
        
        Args:
            name: Mode name
            
        Returns:
            Mode object or None if not found
        """
        if name in self._modes_cache:
            return self._modes_cache[name]
        
        try:
            response = self.session.get(
                f"{self.api_base_url}/modes/by-name/{name}",
                timeout=10
            )
            
            if response.status_code == 200:
                mode_data = response.json()
                mode = Mode(
                    id=mode_data["id"],
                    name=mode_data["name"],
                    category=ModeCategory(mode_data["category"]),
                    description=mode_data["description"],
                    frameworks=mode_data["frameworks"]
                )
                self._modes_cache[name] = mode
                return mode
            else:
                return None
                
        except Exception as e:
            logger.error(f"Error fetching mode {name}: {e}")
            return None

    def list_frameworks(self) -> List[Framework]:
        """
        List all registered frameworks.
        
        Returns:
            List of all frameworks
        """
        try:
            response = self.session.get(
                f"{self.api_base_url}/frameworks",
                timeout=10
            )
            
            if response.status_code == 200:
                frameworks = [Framework(**f) for f in response.json()]
                return frameworks
            else:
                logger.error(f"Error listing frameworks: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error listing frameworks: {e}")
            return []

    def list_modes(self) -> List[Mode]:
        """
        List all available modes.
        
        Returns:
            List of all modes
        """
        try:
            response = self.session.get(
                f"{self.api_base_url}/modes",
                timeout=10
            )
            
            if response.status_code == 200:
                modes = []
                for m in response.json():
                    mode = Mode(
                        id=m["id"],
                        name=m["name"],
                        category=ModeCategory(m["category"]),
                        description=m["description"],
                        frameworks=m["frameworks"]
                    )
                    modes.append(mode)
                return modes
            else:
                logger.error(f"Error listing modes: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error listing modes: {e}")
            return []

    def list_modes_for_framework(self, framework_name: str) -> List[Mode]:
        """
        List all modes compatible with a framework.
        
        Args:
            framework_name: Name of the framework
            
        Returns:
            List of compatible modes
        """
        framework = self.get_framework(framework_name)
        if not framework:
            return []
        
        try:
            response = self.session.get(
                f"{self.api_base_url}/frameworks/{framework.id}/modes",
                timeout=10
            )
            
            if response.status_code == 200:
                modes = []
                for m in response.json():
                    mode = Mode(
                        id=m["id"],
                        name=m["name"],
                        category=ModeCategory(m["category"]),
                        description=m["description"],
                        frameworks=m["frameworks"]
                    )
                    modes.append(mode)
                return modes
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error fetching modes for {framework_name}: {e}")
            return []

    def _validate_repo(self, repo_url: str) -> Tuple[bool, str]:
        """
        Validate that a repository URL is real and accessible.
        
        This prevents agents from hallucinating frameworks.
        
        Args:
            repo_url: Repository URL to check
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            # Normalize URL (remove .git suffix)
            check_url = repo_url.rstrip(".git")
            
            # For GitHub, check API endpoint
            if "github.com" in check_url:
                # Convert to API URL
                parts = check_url.replace("https://github.com/", "").split("/")
                if len(parts) >= 2:
                    api_url = f"https://api.github.com/repos/{parts[0]}/{parts[1]}"
                    response = requests.head(api_url, timeout=5)
                    return response.status_code == 200, "" if response.status_code == 200 else f"Repo not found (status {response.status_code})"
            
            # For other repos, do a basic HEAD request
            response = requests.head(check_url, timeout=5, allow_redirects=True)
            return response.status_code < 400, "" if response.status_code < 400 else f"URL not accessible (status {response.status_code})"
            
        except requests.exceptions.Timeout:
            return False, "Request timeout"
        except requests.exceptions.ConnectionError:
            return False, "Connection error"
        except Exception as e:
            return False, str(e)

    def create_config_for_framework(
        self,
        framework_name: str,
        modes: List[str],
        **kwargs
    ) -> Dict[str, Any]:
        """
        Create a validated configuration for a framework.
        
        This is used when building agent graphs - ensures modes are compatible.
        
        Args:
            framework_name: Name of the framework
            modes: List of mode names to enable
            **kwargs: Additional framework-specific config
            
        Returns:
            Configuration dict ready for use
        """
        # Validate modes
        is_valid, conflicts = self.validate_modes(framework_name, modes)
        if not is_valid:
            raise ValueError(f"Invalid mode combination: {conflicts}")
        
        # Get framework
        framework = self.get_framework(framework_name)
        if not framework:
            raise ValueError(f"Framework '{framework_name}' not found")
        
        # Build config
        return {
            "framework": framework.name,
            "python_class": framework.python_class,
            "modes": modes,
            "repository": framework.repo_url,
            "documentation": framework.documentation_url,
            "validated": True,
            "created_at": datetime.now().isoformat(),
            "custom_config": kwargs
        }


# Convenience functions for agent use

def discover_frameworks(category: Optional[str] = None) -> List[Framework]:
    """Quick discovery of available frameworks."""
    registry = FrameworkRegistry()
    frameworks = registry.list_frameworks()
    return frameworks


def get_framework_modes(framework_name: str) -> List[Mode]:
    """Quick lookup of modes for a framework."""
    registry = FrameworkRegistry()
    return registry.list_modes_for_framework(framework_name)


def validate_config(framework_name: str, modes: List[str]) -> Tuple[bool, List[str]]:
    """Quick validation of a configuration."""
    registry = FrameworkRegistry()
    return registry.validate_modes(framework_name, modes)
