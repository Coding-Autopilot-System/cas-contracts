# CAS Contracts Architecture

The **CAS Contracts** architecture is designed to govern and trace the interactions of AI-native engineering systems. It provides a formal definition of every state transition in the system, ensuring that autonomous agents execute safely, deterministically, and with full observability.

## System Architecture

The lifecycle operates strictly sequentially for every given unit of work. Below is a rich architectural visualization of how data flows through the lifecycle from the initial prompt to final evaluation.

```mermaid
graph TD
    %% Core Entities
    Client[Client / User]
    PolicyEngine[Policy Engine]
    AgentRunner[Agent Execution Runtime]
    Verification[Verification Sandbox]
    Evaluation[Evaluation Service]

    %% Lifecycle State Transitions
    subgraph CAS Lifecycle Transitions
        direction TB
        A(PromptEnvelope):::state
        B(PolicyDecision):::state
        C(WorkRequest):::state
        D(RunEvent[]):::state
        E(ArtifactManifest):::state
        F(VerificationResult):::state
        G(EvaluationResult):::state
    end

    %% Flow
    Client -->|Submits Intent| A
    A -->|Evaluated by| PolicyEngine
    PolicyEngine -->|Applies Guardrails| B
    B -->|Triggers| C
    
    C -->|Consumed by| AgentRunner
    AgentRunner -->|Emits Stream| D
    AgentRunner -->|Produces| E
    
    E -->|Sent to| Verification
    Verification -->|Returns| F
    
    F -->|Analyzed by| Evaluation
    Evaluation -->|Yields| G

    %% Telemetry and Metadata
    Telemetry[(Telemetry & Tracing Database)]
    A -.->|traceparent, promptId| Telemetry
    B -.->|traceparent| Telemetry
    C -.->|correlationId, limits| Telemetry
    D -.->|runId| Telemetry
    E -.->|runId| Telemetry
    F -.->|correlationId| Telemetry
    G -.->|correlationId| Telemetry

    %% Styles
    classDef state fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px;
```

## Bounded Execution & Guardrails

The architecture explicitly rejects unbounded AI loops. The `WorkRequest` schema mandates strict limits:
- **Constraints & Risks**: Explicit identification of prohibited actions and potential failure modes.
- **Limits**: Configurable boundaries (e.g., maximum runtime of 1800s, max 20 model calls, fan-out limits).
- **Stop Policy**: Clear conditions for when an agent should halt execution.

## Distributed Tracing

Every event in the pipeline carries a W3C `traceparent` and `tracestate`. This enables cross-service observability. For instance, an `EvaluationResult` can be perfectly traced back through the `VerificationResult`, `ArtifactManifest`, and `RunEvent[]` to the exact `PromptEnvelope` that initiated it.

## Schema Versioning & Distribution

Schemas are immutably distributed (see [DISTRIBUTION.md](DISTRIBUTION.md)). The Agent Runtime and Policy Engines download and cache schemas from the stable registry to validate the structure of every payload at their respective trust boundaries.
