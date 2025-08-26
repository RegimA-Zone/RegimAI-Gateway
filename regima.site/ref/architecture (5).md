# SkinTwin Architecture

This document provides an overview of the SkinTwin architecture, explaining how different components interact to create a comprehensive dermatological cognitive system.

## System Overview

SkinTwin is built on a hybrid architecture that combines symbolic AI (through OpenCog) with statistical learning and neural approaches. This hybridization allows the system to represent explicit knowledge while also learning from patterns in data.

![SkinTwin Architecture Overview](images/architecture-overview.png)

### Core Design Principles

1. **Modular Design**: Components are decoupled and can be developed independently
2. **Hybrid Cognition**: Combines symbolic, statistical, and neural approaches
3. **Progressive Migration**: Gradual transition path from Elisp to C++ implementation
4. **Multi-Scale Representation**: Handles knowledge from molecular to clinical levels
5. **Cognitive Integration**: Components interact to simulate cognitive processes

## Layer Architecture

SkinTwin is organized into several layers, each with specific responsibilities:

### 1. Interface Layer
- **Emacs Integration**: User interfaces built on Emacs
- **External APIs**: Interfaces for third-party integration
- **Visualization Tools**: Interactive visualization components

### 2. Control Layer
- **Cognitive Cycle Manager**: Orchestrates information flow
- **Attention Allocation**: Routes computational resources
- **Task Priority Manager**: Handles prioritization of cognitive tasks

### 3. Reasoning Layer
- **PLN Engine**: Probabilistic logic reasoning
- **Pattern Mining**: Statistical pattern discovery
- **Prediction Systems**: Temporal progression forecasting

### 4. Knowledge Layer
- **AtomSpace**: Core knowledge representation
- **Truth Value Management**: Uncertainty handling
- **Storage and Persistence**: Knowledge persistence mechanisms

### 5. Bridge Layer
- **C++/Elisp Communication**: Interfaces between implementation languages
- **Data Marshalling**: Converting between different data formats
- **Function Mapping**: Mapping between Elisp and C++ functions

## Component Architecture

### Knowledge Representation (DermatoGraph)

The knowledge representation system is based on OpenCog's AtomSpace, extended with domain-specific representations for dermatology:

```
DermatoGraph
├── AtomSpace (Core storage)
├── Domain Ontologies
│   ├── Skin Anatomy Ontology
│   ├── Dermatological Conditions Ontology
│   └── Treatment Ontology
├── Truth Value System
│   ├── Simple Truth Values (strength, confidence)
│   └── Indefinite Truth Values (for uncertain reasoning)
└── Persistence Layer
    ├── In-memory Storage
    └── Database Backends
```

### Attention Allocation (SensoryFocus)

The attention allocation system is based on ECAN (Economic Attention Allocation Network):

```
SensoryFocus
├── Attention Values
│   ├── STI (Short Term Importance)
│   ├── LTI (Long Term Importance)
│   └── VLTI (Very Long Term Importance)
├── Attention Dynamics
│   ├── Importance Spreading
│   ├── Importance Decay
│   └── Hebbian Learning
└── Forgetting Mechanisms
    ├── Importance Threshold Filtering
    └── Memory Management
```

### Probabilistic Reasoning (DermatoLogic)

The reasoning system is based on PLN (Probabilistic Logic Networks):

```
DermatoLogic
├── Rule Engine
│   ├── Forward Chainer
│   ├── Backward Chainer
│   └── Meta-Rule Selection
├── Rule Library
│   ├── Deduction Rules
│   ├── Abduction Rules
│   ├── Induction Rules
│   └── Domain-Specific Clinical Rules
└── Truth Value Calculation
    ├── Strength Formulas
    └── Confidence Formulas
```

### Pattern Mining (EpidermiLearn)

The pattern mining system is based on MOSES (Meta-Optimizing Semantic Evolutionary Search):

```
EpidermiLearn
├── Program Representation
│   ├── Combo Programs
│   └── Program Trees
├── Optimization Engine
│   ├── Evolutionary Algorithm
│   ├── Hill Climbing
│   └── Fitness Evaluation
└── Feature Selection
    ├── Mutual Information Analysis
    └── Dimensionality Reduction
```

### Temporal Prediction (TimeSkin)

The temporal prediction system is based on ESN (Echo State Networks):

```
TimeSkin
├── Reservoir Computing
│   ├── Echo State Network
│   └── Reservoir Dynamics
├── Sequence Learning
│   ├── Time Series Prediction
│   └── Pattern Recognition
└── Progression Models
    ├── Disease Progression
    └── Treatment Response
```

### Bridge Technology

The bridge technology connects Elisp and C++ implementations:

```
Bridge
├── Command Interface
│   ├── JSON Protocol
│   └── Function Mapping
├── Data Marshalling
│   ├── Atom Serialization
│   └── Truth Value Conversion
└── Runtime Integration
    ├── C++ Library Loading
    └── Error Handling
```

## Communication Flows

### 1. User Interaction Flow

```
User -> Emacs Interface -> Command Processing -> Cognitive Cycle -> Results -> Visualization -> User
```

### 2. Knowledge Processing Flow

```
Input Knowledge -> AtomSpace Storage -> Attention Allocation -> 
                -> Cognitive Processing -> Knowledge Update -> Persistence
```

### 3. Reasoning Flow

```
Query -> Pattern Matching -> Rule Selection -> 
      -> Forward/Backward Chaining -> Truth Value Calculation -> Response
```

### 4. Learning Flow

```
Training Data -> Feature Extraction -> MOSES Program Evolution -> 
               -> Program Evaluation -> Model Selection -> Knowledge Integration
```

## Implementation Architecture

SkinTwin is implemented using two primary languages, with a migration path from Elisp to C++:

### Elisp Implementation

The Elisp implementation provides the user interface, initial functionality, and integration with Emacs:

```
Elisp Components
├── User Interface (skintwin-mode.el)
├── Integration (skintwin-integration.el)
├── API (skintwin-api.el)
├── Database (skintwin-db.el)
├── Visualization (skintwin-visualization.el)
└── Bridge (skintwin-bridge.el)
```

### C++ Implementation

The C++ implementation provides performance-critical components and OpenCog integration:

```
C++ Components
├── Core
│   ├── Types
│   └── Utilities
├── Knowledge Representation
│   ├── AtomSpace Integration
│   └── Domain-Specific Atoms
├── Attention Allocation
│   ├── AttentionValue
│   └── AttentionAllocationManager
├── Bridge
│   ├── ElispBridge
│   └── CommandProcessor
└── Reasoning
    ├── PLN Rules
    └── Pattern Matching
```

## Build and Deployment Architecture

SkinTwin uses a modular build system based on CMake:

```
Build System
├── CMake Configuration
│   ├── Core Library
│   ├── Component Libraries
│   └── Tests
├── Dependencies
│   ├── OpenCog Libraries
│   ├── Boost
│   └── Other Dependencies
└── Package Structure
    ├── Source Code
    ├── Headers
    ├── Tests
    └── Examples
```

## Testing Architecture

The testing architecture includes various test types:

```
Testing
├── Unit Tests
│   ├── C++ Component Tests
│   └── Elisp Function Tests
├── Integration Tests
│   ├── Component Interaction Tests
│   └── Bridge Communication Tests
└── System Tests
    ├── End-to-End Workflows
    └── Performance Tests
```

## Extending SkinTwin

SkinTwin is designed to be extensible in several ways:

1. **New Domain Knowledge**: Adding knowledge through Org files and ontologies
2. **Custom PLN Rules**: Extending reasoning with domain-specific rules
3. **New MOSES Representations**: Creating task-specific program representations
4. **Additional Visualizations**: Implementing new visualization techniques
5. **External Integrations**: Connecting to other systems through the API

## References

- [OpenCog AtomSpace Documentation](https://wiki.opencog.org/w/AtomSpace)
- [ECAN Technical Details](https://wiki.opencog.org/w/ECAN)
- [PLN Framework](https://wiki.opencog.org/w/PLN)
- [MOSES Documentation](https://wiki.opencog.org/w/MOSES)
- [Echo State Networks Overview](https://en.wikipedia.org/wiki/Echo_state_network) 