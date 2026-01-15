import pytest
from engines.tokens.schema import validate_token_value, get_token_def

def test_schema_valid_paths():
    assert get_token_def("page.id")
    assert get_token_def("layout.width")
    assert get_token_def("text.font.size")
    assert get_token_def("unknown.path") is None

def test_validation_logic():
    # String
    assert validate_token_value("page.id", "home-123")
    assert not validate_token_value("page.id", 123)
    
    # Number
    assert validate_token_value("page.grid.columns", 12)
    assert not validate_token_value("page.grid.columns", "twelve")
    
    # Enum
    assert validate_token_value("layout.position.mode", "absolute")
    assert not validate_token_value("layout.position.mode", "floating") # Invalid enum
    
    # Color (String)
    assert validate_token_value("style.background.color", "#fff")
    assert not validate_token_value("style.background.color", 123)
    
    # Boolean
    assert validate_token_value("media.autoplay", True)
    assert not validate_token_value("media.autoplay", "yes")

def test_wildcard_matching():
    # responsive.mobile.*
    assert get_token_def("responsive.mobile.width")
    assert get_token_def("responsive.mobile.display")
