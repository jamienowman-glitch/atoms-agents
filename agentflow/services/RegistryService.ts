// Service to interact with the Atomic Registry (Northstar Agents)
// In a real scenario, this would call the Python API.
// For the Wireframe Builder, we might mock or read static JSON if available via an API route.

export interface ModelFamily {
  family_id: string;
  name: string;
  description: string;
  provider_ids: string[];
}

export interface ModelCard {
    model_id: string;
    family_id: string;
    version: string;
    variant: string;
    provider_id: string;
}

export interface FrameworkCard {
    framework_id: string;
    name: string;
    description: string;
    supported_modes: string[];
}

class RegistryService {
    // Base URL for the Northstar Agents API (proxied via Next.js or direct)
    // For local dev, we assume localhost:8000
    private baseUrl = "http://localhost:8000/api/registry";

    async listFamilies(): Promise<ModelFamily[]> {
        // Mocking for Wireframe Prep until API is live
        return [
            { family_id: "anthropic.claude", name: "Claude", description: "Reasoning models", provider_ids: ["aws_bedrock"] },
            { family_id: "openai.gpt", name: "GPT", description: "General purpose", provider_ids: ["azure_openai"] },
            { family_id: "google.gemini", name: "Gemini", description: "Multimodal", provider_ids: ["gcp_vertex"] }
        ];
    }

    async listFrameworks(): Promise<FrameworkCard[]> {
        return [
            { framework_id: "crewai", name: "CrewAI", description: "Role-playing agents", supported_modes: ["hierarchical", "sequential"] },
            { framework_id: "autogen", name: "AutoGen", description: "Conversational agents", supported_modes: ["group_chat"] }
        ];
    }

    async listModels(familyId?: string): Promise<ModelCard[]> {
        // This would filter by familyId on the server
        const allModels: ModelCard[] = [
             { model_id: "claude-3-5-sonnet", family_id: "anthropic.claude", version: "3.5", variant: "sonnet", provider_id: "aws_bedrock" },
             { model_id: "gpt-4o", family_id: "openai.gpt", version: "4o", variant: "default", provider_id: "azure_openai" }
        ];
        if (familyId) {
            return allModels.filter(m => m.family_id === familyId);
        }
        return allModels;
    }
}

export const registryService = new RegistryService();
