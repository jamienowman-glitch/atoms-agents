# Modes Snapshot
Total count: 41

- path: registry/framework_modes/adk/sessions_memory.yaml
  framework: adk
  mode_id: ADK.Sessions.Memory
  invoke_entrypoint: runtime.adk.modes.sessions_memory.run
  supports_streaming: none
  required_params: ['session_id', 'facts']
  pinned_version_ref: UNKNOWN
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/adk/simulation.yaml
  framework: adk
  mode_id: ADK.Simulation
  invoke_entrypoint: runtime.adk.modes.simulation.run
  supports_streaming: none
  required_params: ['prompt', 'num_turns']
  pinned_version_ref: UNKNOWN
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/adk/tools_custom.yaml
  framework: adk
  mode_id: ADK.Tools.Custom
  invoke_entrypoint: runtime.adk.modes.tools_custom.run
  supports_streaming: none
  required_params: ['action']
  pinned_version_ref: UNKNOWN
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/autogen/code_execution.yaml
  framework: autogen
  mode_id: AutoGen.CodeExecution
  invoke_entrypoint: runtime.autogen.modes.code_execution.run
  supports_streaming: none
  required_params: ['code_task']
  pinned_version_ref: integration/autogen/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/autogen/handoff_swarm.yaml
  framework: autogen
  mode_id: handoff_swarm
  invoke_entrypoint: runtime.autogen.modes.handoff_swarm:run
  supports_streaming: token
  required_params: []
  pinned_version_ref: integration/autogen/PINNED_VERSION.md
  notes: Agents use HandoffMessage to transfer control. Decentralized coordination.
  used_by: []

- path: registry/framework_modes/autogen/human_input.yaml
  framework: autogen
  mode_id: AutoGen.HumanInput
  invoke_entrypoint: runtime.autogen.modes.human_input.run
  supports_streaming: none
  required_params: ['ask_user']
  pinned_version_ref: integration/autogen/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/autogen/rag_retrieval.yaml
  framework: autogen
  mode_id: AutoGen.RAG
  invoke_entrypoint: runtime.autogen.modes.rag_retrieval.run
  supports_streaming: none
  required_params: ['docs_path', 'query']
  pinned_version_ref: integration/autogen/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/autogen/round_robin_groupchat.yaml
  framework: autogen
  mode_id: round_robin_groupchat
  invoke_entrypoint: runtime.autogen.modes.round_robin:run
  supports_streaming: token
  required_params: []
  pinned_version_ref: integration/autogen/PINNED_VERSION.md
  notes: Cycles through agents in fixed order.
  used_by: []

- path: registry/framework_modes/autogen/selector_groupchat.yaml
  framework: autogen
  mode_id: selector_groupchat
  invoke_entrypoint: runtime.autogen.modes.selector:run
  supports_streaming: token
  required_params: []
  pinned_version_ref: integration/autogen/PINNED_VERSION.md
  notes: LLM selects the next speaker based on context.
  used_by: []

- path: registry/framework_modes/autogen/stub_control.yaml
  framework: autogen
  mode_id: stub_control
  invoke_entrypoint: runtime.autogen.modes.stub_control:run
  supports_streaming: none
  required_params: []
  pinned_version_ref: integration/autogen/PINNED_VERSION.md
  notes: Mode designed to fail loudly for smoke verification.
  used_by: []

- path: registry/framework_modes/autogen/teachable_agent.yaml
  framework: autogen
  mode_id: AutoGen.Teachable
  invoke_entrypoint: runtime.autogen.modes.teachable_agent.run
  supports_streaming: none
  required_params: ['fact']
  pinned_version_ref: integration/autogen/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/autogen/tools_function.yaml
  framework: autogen
  mode_id: AutoGen.Tools.Function
  invoke_entrypoint: runtime.autogen.modes.tools_function.run
  supports_streaming: none
  required_params: ['input_text']
  pinned_version_ref: integration/autogen/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/autogen/two_agent_chat.yaml
  framework: autogen
  mode_id: AutoGen.TwoAgent
  invoke_entrypoint: runtime.autogen.modes.two_agent_chat.run
  supports_streaming: none
  required_params: ['message']
  pinned_version_ref: integration/autogen/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/bedrock/action_groups.yaml
  framework: bedrock
  mode_id: Bedrock.ActionGroups
  invoke_entrypoint: runtime.bedrock.modes.action_groups.run
  supports_streaming: none
  required_params: ['action']
  pinned_version_ref: integration/bedrock/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/bedrock/agent_orchestration.yaml
  framework: bedrock
  mode_id: Bedrock.Agent.Orchestration
  invoke_entrypoint: runtime.bedrock.modes.agent_orchestration.run
  supports_streaming: none
  required_params: ['agent_id', 'agent_alias_id', 'input_text']
  pinned_version_ref: integration/bedrock/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/bedrock/guardrails.yaml
  framework: bedrock
  mode_id: Bedrock.Guardrails
  invoke_entrypoint: runtime.bedrock.modes.guardrails.run
  supports_streaming: none
  required_params: ['input_text', 'guardrail_id']
  pinned_version_ref: integration/bedrock/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/bedrock/knowledge_bases.yaml
  framework: bedrock
  mode_id: Bedrock.KnowledgeBases
  invoke_entrypoint: runtime.bedrock.modes.knowledge_bases.run
  supports_streaming: none
  required_params: ['kb_id', 'query']
  pinned_version_ref: integration/bedrock/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/bedrock/token_stream_converse.yaml
  framework: bedrock
  mode_id: token_stream_converse
  invoke_entrypoint: runtime.bedrock.modes.converse_stream:run
  supports_streaming: token
  required_params: []
  pinned_version_ref: integration/bedrock/PINNED_VERSION.md
  notes: Direct invocation of Bedrock ConverseStream API.
  used_by: []

- path: registry/framework_modes/crewai/crew_hierarchical.yaml
  framework: crewai
  mode_id: CrewAI.Crew.Hierarchical
  invoke_entrypoint: runtime.crewai.modes.crew_hierarchical.run
  supports_streaming: none
  required_params: ['topic', 'manager_model']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/crew_sequential.yaml
  framework: crewai
  mode_id: CrewAI.Crew.Sequential
  invoke_entrypoint: runtime.crewai.modes.crew_sequential.run
  supports_streaming: none
  required_params: ['topic']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/flow_basic.yaml
  framework: crewai
  mode_id: CrewAI.Flow.Basic
  invoke_entrypoint: runtime.crewai.modes.flow_basic.run
  supports_streaming: none
  required_params: ['initial_city']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/flow_hybrid.yaml
  framework: crewai
  mode_id: CrewAI.Flow.Hybrid
  invoke_entrypoint: runtime.crewai.modes.flow_hybrid.run
  supports_streaming: none
  required_params: ['topic']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/flow_persistence.yaml
  framework: crewai
  mode_id: CrewAI.Flow.Persistence
  invoke_entrypoint: runtime.crewai.modes.flow_persistence.run
  supports_streaming: none
  required_params: ['reset']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/flow_router.yaml
  framework: crewai
  mode_id: CrewAI.Flow.Router
  invoke_entrypoint: runtime.crewai.modes.flow_router.run
  supports_streaming: none
  required_params: ['outcome']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/hierarchical.yaml
  framework: crewai
  mode_id: hierarchical
  invoke_entrypoint: runtime.crewai.modes.hierarchical:run
  supports_streaming: event
  required_params: []
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: Manager agent coordinates execution and delegates tasks.
  used_by: []

- path: registry/framework_modes/crewai/knowledge_file.yaml
  framework: crewai
  mode_id: CrewAI.Knowledge.File
  invoke_entrypoint: runtime.crewai.modes.knowledge_file.run
  supports_streaming: none
  required_params: ['question', 'file_path']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/knowledge_string.yaml
  framework: crewai
  mode_id: CrewAI.Knowledge.String
  invoke_entrypoint: runtime.crewai.modes.knowledge_string.run
  supports_streaming: none
  required_params: ['question']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/knowledge_web.yaml
  framework: crewai
  mode_id: CrewAI.Knowledge.Web
  invoke_entrypoint: runtime.crewai.modes.knowledge_web.run
  supports_streaming: none
  required_params: ['question', 'urls']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/memory_demo.yaml
  framework: crewai
  mode_id: CrewAI.Memory.Demo
  invoke_entrypoint: runtime.crewai.modes.memory_demo.run
  supports_streaming: none
  required_params: ['topic']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/planning_demo.yaml
  framework: crewai
  mode_id: CrewAI.Planning.Demo
  invoke_entrypoint: runtime.crewai.modes.planning_demo.run
  supports_streaming: none
  required_params: ['objective']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/crewai/sequential.yaml
  framework: crewai
  mode_id: sequential
  invoke_entrypoint: runtime.crewai.modes.sequential:run
  supports_streaming: event
  required_params: []
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: Default mode. Tasks run one after another.
  used_by: []

- path: registry/framework_modes/crewai/tools_custom.yaml
  framework: crewai
  mode_id: CrewAI.Tools.Custom
  invoke_entrypoint: runtime.crewai.modes.tools_custom.run
  supports_streaming: none
  required_params: ['text_input']
  pinned_version_ref: integration/crewai/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/langgraph/conditional_router.yaml
  framework: langgraph
  mode_id: LangGraph.ConditionalRouter
  invoke_entrypoint: runtime.langgraph.modes.conditional_router.run
  supports_streaming: none
  required_params: ['decision']
  pinned_version_ref: integration/langgraph/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/langgraph/human_approval.yaml
  framework: langgraph
  mode_id: human_approval
  invoke_entrypoint: runtime.langgraph.modes.human_approval:run
  supports_streaming: token
  required_params: []
  pinned_version_ref: integration/langgraph/PINNED_VERSION.md
  notes: Demonstrates interrupt() for human-in-the-loop approval. Requires resumption with same thread_id.
  used_by: []

- path: registry/framework_modes/langgraph/map_reduce.yaml
  framework: langgraph
  mode_id: map_reduce
  invoke_entrypoint: runtime.langgraph.modes.map_reduce:run
  supports_streaming: event
  required_params: []
  pinned_version_ref: integration/langgraph/PINNED_VERSION.md
  notes: Parellel processing of list items using Send API.
  used_by: []

- path: registry/framework_modes/langgraph/memory.yaml
  framework: langgraph
  mode_id: LangGraph.Memory
  invoke_entrypoint: runtime.langgraph.modes.memory.run
  supports_streaming: none
  required_params: ['user_id', 'input_text']
  pinned_version_ref: integration/langgraph/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/langgraph/sequential_chain.yaml
  framework: langgraph
  mode_id: sequential_chain
  invoke_entrypoint: runtime.langgraph.modes.sequential:run
  supports_streaming: event
  required_params: []
  pinned_version_ref: integration/langgraph/PINNED_VERSION.md
  notes: Simple linear chain of nodes.
  used_by: []

- path: registry/framework_modes/langgraph/streaming_astream.yaml
  framework: langgraph
  mode_id: LangGraph.Streaming.Astream
  invoke_entrypoint: runtime.langgraph.modes.streaming_astream.run
  supports_streaming: event
  required_params: ['count_to']
  pinned_version_ref: integration/langgraph/PINNED_VERSION.md
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/strands/dag_parallel.yaml
  framework: strands
  mode_id: Strands.DAG
  invoke_entrypoint: runtime.strands.modes.dag_parallel.run
  supports_streaming: none
  required_params: ['branches']
  pinned_version_ref: UNKNOWN
  notes: UNKNOWN
  used_by: []

- path: registry/framework_modes/strands/default.yaml
  framework: strands
  mode_id: default
  invoke_entrypoint: runtime.strands.modes.default_sequence:run
  supports_streaming: event
  required_params: []
  pinned_version_ref: integration/strands/PINNED_VERSION.md
  notes: Standard Strands agent sequence execution.
  used_by: []

- path: registry/framework_modes/strands/linear_sequence.yaml
  framework: strands
  mode_id: Strands.Linear
  invoke_entrypoint: runtime.strands.modes.linear_sequence.run
  supports_streaming: none
  required_params: ['steps']
  pinned_version_ref: UNKNOWN
  notes: UNKNOWN
  used_by: []
