import pytest
from engines.budget.token_accounting import TokenAccountingService

def test_token_accounting_calculation():
    # Use defaults if file not found, but we expect file to be found in tests if environment is right
    service = TokenAccountingService()

    # Test known rate (from price_book.json we wrote)
    # openai/gpt-4o: input 2.50, output 10.00 per 1M
    usage = {"input_tokens": 1_000_000, "output_tokens": 1_000_000}
    cost = service.calculate_cost("openai", "gpt-4o", usage)
    assert cost == 12.50

    # Test normalization
    # azure_openai + gpt-4o -> openai/gpt-4o
    cost_azure = service.calculate_cost("azure_openai", "gpt-4o", usage)
    assert cost_azure == 12.50

    # Test Bedrock Claude 3.5 Sonnet
    # anthropic/claude-3-5-sonnet: 3.00 / 15.00
    usage_claude = {"input_tokens": 1_000_000, "output_tokens": 1_000_000}
    cost_claude = service.calculate_cost("aws_bedrock", "anthropic.claude-3-5-sonnet-20240620-v1:0", usage_claude)
    assert cost_claude == 18.00

    # Test unknown model (Defaults: 1.0/1.0 usually, but let's see what I put in code)
    # I put defaults 1.0/1.0 in code if not in file defaults
    cost_unknown = service.calculate_cost("unknown", "model", {"input_tokens": 1_000_000, "output_tokens": 0})
    # If default is 1.0
    assert cost_unknown == 1.0

if __name__ == "__main__":
    test_token_accounting_calculation()
