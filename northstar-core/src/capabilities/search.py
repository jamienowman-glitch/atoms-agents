import os
import json

class SearchTool:
    def run(self, query: str) -> str:
        raise NotImplementedError

class DuckDuckGoSearchTool(SearchTool):
    def run(self, query: str) -> str:
        try:
            from duckduckgo_search import DDGS
            results = DDGS().text(query, max_results=3)
            return json.dumps(results, indent=2)
        except ImportError:
            return "Error: duckduckgo-search not installed. Run `pip install duckduckgo-search`."
        except Exception as e:
            return f"Error performing DDG search: {e}"

class TavilySearchTool(SearchTool):
    def __init__(self, api_key):
        self.api_key = api_key
        
    def run(self, query: str) -> str:
        try:
            from tavily import TavilyClient
            client = TavilyClient(api_key=self.api_key)
            # Basic search
            results = client.search(query=query, search_depth="basic")
            return json.dumps(results.get("results", []), indent=2)
        except ImportError:
            return "Error: tavily-python not installed. Run `pip install tavily-python`."
        except Exception as e:
             return f"Error performing Tavily search: {e}"

def get_search_tool():
    """Factory to get the best available search tool."""
    tavily_key = os.environ.get("TAVILY_API_KEY")
    if tavily_key:
        return TavilySearchTool(tavily_key)
    return DuckDuckGoSearchTool()

def web_search(query: str):
    """Function entrypoint for Agents to call."""
    tool = get_search_tool()
    return tool.run(query)
