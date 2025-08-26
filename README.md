# 🧬 RegimAI Gateway - SkinTwin Cognitive Architecture

[![Open Source Love](https://firstcontributions.github.io/open-source-badges/badges/open-source-v1/open-source.svg)](https://github.com/firstcontributions/open-source-badges)

**An AI Gateway specifically designed for dermatology and skincare cognitive services, built on the SkinTwin cognitive architecture.**

## 🚀 Overview

The RegimAI Gateway combines the power of Azure API Management with SkinTwin's cognitive architecture to create an intelligent gateway for dermatology and skincare applications. It integrates OpenCog AtomSpace, PLN reasoning, MOSES pattern mining, and ESN temporal prediction to provide domain-specific AI services.

## 🧠 SkinTwin Cognitive Architecture Integration

➕ **AtomSpace Knowledge Representation** - Dermatology-specific knowledge graphs with OpenCog integration  
➕ **PLN Reasoning Engine** - Probabilistic logic networks for clinical decision support  
➕ **MOSES Pattern Mining** - Evolutionary search for treatment optimization patterns  
➕ **ESN Temporal Prediction** - Echo state networks for skin condition progression modeling  
➕ **Cognitive-Aware Routing** - Intelligent request routing based on cognitive complexity  
➕ **Domain-Specific Policies** - Medical compliance and dermatology-focused content safety

## 🏥 Domain Specialization

➕ **Dermatology AI Agents** - Specialized agents for skin consultations and medical support  
➕ **Medical Compliance** - HIPAA compliance and FDA regulatory adherence  
➕ **Clinical Integration** - Ready for healthcare platform integration  
➕ **Evidence-Based Recommendations** - Dermatology-validated AI responses  
➕ **Medical Content Safety** - Specialized filtering for healthcare accuracy  

## Contents

1. [🧬 RegimAI Gateway Architecture](#-regimai-gateway-architecture)
1. [🧪 SkinTwin Cognitive Labs](#-skintwin-cognitive-labs)
1. [🏥 Dermatology AI Agents](#-dermatology-ai-agents)
1. [🧠 Cognitive Architecture Labs](#-cognitive-architecture-labs)
1. [⚕️ Medical Compliance Labs](#-medical-compliance-labs)
1. [🚀 Getting started](#-getting-started)
1. [🔨 Supporting tools](#-supporting-tools)
1. [🏛️ Well-Architected Framework](#-well-architected-framework)    <!-- markdownlint-disable-line MD051 -->
1. [🥇 Other Resources](#-other-resources)

The RegimAI Gateway represents a convergence of cutting-edge AI Gateway technology with specialized dermatology expertise. Built on the SkinTwin cognitive architecture, it provides a comprehensive platform for healthcare providers, skincare professionals, and application developers to build the next generation of AI-powered dermatology solutions.

**Cognitive AI services** are accessed through intelligent **APIs** that understand domain context, making robust API management with cognitive reasoning essential. This cognitive approach enables contextual understanding of dermatological **AI models**, clinical **data**, and medical **tools**.

The RegimAI Gateway extends traditional API management with **cognitive architecture principles**, enabling experimentation with advanced dermatology use cases while maintaining medical accuracy and regulatory compliance. The cognitive principles provide a framework for deploying **Intelligent Healthcare Apps** with confidence.

## 🧬 RegimAI Gateway Architecture

![RegimAI Gateway flow](images/ai-gateway.gif)

The RegimAI Gateway integrates [Azure API Management](https://learn.microsoft.com/azure/api-management/api-management-key-concepts) with the SkinTwin cognitive architecture, providing intelligent routing, medical compliance, and cognitive reasoning capabilities. The primary focus is on dermatology-specific [Azure AI Foundry models](https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-azure-ai-foundry) and medical AI services, enhanced with cognitive architecture components.

### Core Cognitive Components

- **🧠 AtomSpace Integration**: OpenCog-based knowledge representation for dermatology domain
- **🔬 PLN Reasoning**: Probabilistic logic networks for clinical decision support  
- **📊 MOSES Pattern Mining**: Evolutionary algorithms for treatment optimization
- **⏱️ ESN Temporal Modeling**: Echo state networks for condition progression prediction
- **🎯 Cognitive Routing**: Intelligent request distribution based on complexity analysis
- **⚕️ Medical Compliance**: HIPAA, FDA, and healthcare regulatory adherence

The following labs demonstrate cognitive architecture integration with practical implementations using Python scripts, [Bicep](https://learn.microsoft.com/azure/azure-resource-manager/bicep/overview?tabs=bicep) templates, and [Azure API Management policies](https://learn.microsoft.com/azure/api-management/api-management-howto-policies):

## 🧪 SkinTwin Cognitive Labs

<!-- Cognitive Architecture Integration -->
### [**🧠 SkinTwin AtomSpace Integration**](labs/skintwin-atomspace/skintwin-atomspace.ipynb)

Explore the integration of OpenCog AtomSpace with Azure API Management for dermatology knowledge representation. Demonstrates how domain-specific ontologies for skin conditions, treatments, and anatomical structures are managed through the gateway.

[<img src="images/skintwin-atomspace-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/skintwin-atomspace/skintwin-atomspace.ipynb)

[🦾 Bicep](labs/skintwin-atomspace/main.bicep) ➕ [⚙️ Policy](labs/skintwin-atomspace/cognitive-policy.xml) ➕ [🧾 Notebook](labs/skintwin-atomspace/skintwin-atomspace.ipynb)

<!-- PLN Reasoning -->
### [**🔬 PLN Clinical Reasoning**](labs/pln-clinical-reasoning/pln-clinical-reasoning.ipynb)

Implement Probabilistic Logic Networks for clinical decision support through the RegimAI Gateway. Shows how medical reasoning and uncertainty handling are integrated into AI service routing and response generation.

[<img src="images/pln-reasoning-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/pln-clinical-reasoning/pln-clinical-reasoning.ipynb)

[🦾 Bicep](labs/pln-clinical-reasoning/main.bicep) ➕ [⚙️ Policy](labs/pln-clinical-reasoning/reasoning-policy.xml) ➕ [🧾 Notebook](labs/pln-clinical-reasoning/pln-clinical-reasoning.ipynb)

## 🏥 Dermatology AI Agents

<!-- Skincare Consultant Agent -->
### [**👩‍⚕️ Skincare Consultant Agent**](labs/skincare-consultant-agent/skincare-consultant-agent.ipynb)

Deploy specialized AI agents for personalized skincare consultations using the SkinTwin cognitive architecture. Integrates pattern recognition, knowledge graphs, and evidence-based recommendations through Azure API Management.

[<img src="images/skincare-consultant-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/skincare-consultant-agent/skincare-consultant-agent.ipynb)

[🦾 Bicep](labs/skincare-consultant-agent/main.bicep) ➕ [⚙️ Policy](labs/skincare-consultant-agent/agent-policy.xml) ➕ [🧾 Notebook](labs/skincare-consultant-agent/skincare-consultant-agent.ipynb)

<!-- Dermatology Assistant -->
### [**🏥 Clinical Dermatology Assistant**](labs/clinical-dermatology-assistant/clinical-dermatology-assistant.ipynb)

Professional dermatology assistant for healthcare providers with medical compliance, audit trails, and clinical decision support through the RegimAI Gateway.

[<img src="images/clinical-assistant-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/clinical-dermatology-assistant/clinical-dermatology-assistant.ipynb)

[🦾 Bicep](labs/clinical-dermatology-assistant/main.bicep) ➕ [⚙️ Policy](labs/clinical-dermatology-assistant/medical-policy.xml) ➕ [🧾 Notebook](labs/clinical-dermatology-assistant/clinical-dermatology-assistant.ipynb)

## 🧠 Cognitive Architecture Labs

<!-- MOSES Pattern Mining -->
### [**📊 MOSES Treatment Optimization**](labs/moses-treatment-optimization/moses-treatment-optimization.ipynb)

Implement MOSES (Meta-Optimizing Semantic Evolutionary Search) for discovering optimal treatment patterns in dermatology through the RegimAI Gateway. Demonstrates evolutionary algorithms for treatment protocol optimization.

[<img src="images/moses-optimization-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/moses-treatment-optimization/moses-treatment-optimization.ipynb)

[🦾 Bicep](labs/moses-treatment-optimization/main.bicep) ➕ [⚙️ Policy](labs/moses-treatment-optimization/optimization-policy.xml) ➕ [🧾 Notebook](labs/moses-treatment-optimization/moses-treatment-optimization.ipynb)

<!-- ESN Temporal Prediction -->
### [**⏱️ ESN Progression Modeling**](labs/esn-progression-modeling/esn-progression-modeling.ipynb)

Deploy Echo State Networks for predicting skin condition progression and treatment response through the RegimAI Gateway. Shows temporal modeling capabilities for clinical decision support.

[<img src="images/esn-modeling-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/esn-progression-modeling/esn-progression-modeling.ipynb)

[🦾 Bicep](labs/esn-progression-modeling/main.bicep) ➕ [⚙️ Policy](labs/esn-progression-modeling/temporal-policy.xml) ➕ [🧾 Notebook](labs/esn-progression-modeling/esn-progression-modeling.ipynb)

<!-- Cognitive Load Balancing -->
### [**🎯 Cognitive-Aware Load Balancing**](labs/cognitive-load-balancing/cognitive-load-balancing.ipynb)

Implement intelligent request routing based on cognitive complexity analysis. Routes simple queries to fast models and complex medical cases to specialized cognitive processing pipelines.

[<img src="images/cognitive-balancing-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/cognitive-load-balancing/cognitive-load-balancing.ipynb)

[🦾 Bicep](labs/cognitive-load-balancing/main.bicep) ➕ [⚙️ Policy](labs/cognitive-load-balancing/cognitive-policy.xml) ➕ [🧾 Notebook](labs/cognitive-load-balancing/cognitive-load-balancing.ipynb)

## ⚕️ Medical Compliance Labs

<!-- Medical Content Safety -->
### [**🛡️ Medical Content Safety**](labs/medical-content-safety/medical-content-safety.ipynb)

Enhanced content safety specifically designed for medical and dermatological content. Validates medical accuracy, filters harmful advice, and ensures evidence-based recommendations through the RegimAI Gateway.

[<img src="images/medical-safety-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/medical-content-safety/medical-content-safety.ipynb)

[🦾 Bicep](labs/medical-content-safety/main.bicep) ➕ [⚙️ Policy](labs/medical-content-safety/medical-safety-policy.xml) ➕ [🧾 Notebook](labs/medical-content-safety/medical-content-safety.ipynb)

<!-- HIPAA Compliance -->
### [**🔒 HIPAA Compliance Framework**](labs/hipaa-compliance/hipaa-compliance.ipynb)

Implement HIPAA compliance for health data protection through the RegimAI Gateway. Includes data anonymization, encryption, audit trails, and access controls for medical AI services.

[<img src="images/hipaa-compliance-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/hipaa-compliance/hipaa-compliance.ipynb)

[🦾 Bicep](labs/hipaa-compliance/main.bicep) ➕ [⚙️ Policy](labs/hipaa-compliance/hipaa-policy.xml) ➕ [🧾 Notebook](labs/hipaa-compliance/hipaa-compliance.ipynb)

## 🏗️ Foundation Labs (Azure AI Integration)

These labs demonstrate the underlying Azure AI infrastructure integration with SkinTwin cognitive architecture:

<!--FinOps framework -->
### [**💰 Medical FinOps Framework**](labs/finops-framework/finops-framework.ipynb)

Healthcare-focused FinOps implementation with medical AI budget management, regulatory compliance cost tracking, and cognitive resource optimization through the RegimAI Gateway.

[<img src="images/finops-framework-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/finops-framework/finops-framework.ipynb)

[🦾 Bicep](labs/finops-framework/main.bicep) ➕ [⚙️ Policy](labs/finops-framework/openai-policy.xml) ➕ [🧾 Notebook](labs/finops-framework/finops-framework.ipynb)

<!-- Backend pool load balancing -->
### [**⚖️ Medical Service Load Balancing**](labs/backend-pool-load-balancing/backend-pool-load-balancing.ipynb)

Intelligent load balancing for medical AI services with failover support and cognitive-aware routing to specialized dermatology endpoints.

[<img src="images/backend-pool-load-balancing-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/backend-pool-load-balancing/backend-pool-load-balancing.ipynb)

[🦾 Bicep](labs/backend-pool-load-balancing/main.bicep) ➕ [⚙️ Policy](labs/backend-pool-load-balancing/policy.xml) ➕ [🧾 Notebook](labs/backend-pool-load-balancing/backend-pool-load-balancing.ipynb)

<!-- Semantic caching -->
### [**🧠 Medical Knowledge Caching**](labs/semantic-caching/semantic-caching.ipynb)

Semantic caching optimized for medical terminology and dermatological knowledge. Uses vector proximity for medical concept similarity and clinical decision caching.

[<img src="images/semantic-caching-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/semantic-caching/semantic-caching.ipynb)

[🦾 Bicep](labs/semantic-caching/main.bicep) ➕ [⚙️ Policy](labs/semantic-caching/policy.xml) ➕ [🧾 Notebook](labs/semantic-caching/semantic-caching.ipynb)

<!-- Vector searching -->
### [**🔍 Dermatology Knowledge Retrieval**](labs/vector-searching/vector-searching.ipynb)

RAG implementation with dermatology-specific knowledge bases, medical literature search, and evidence-based recommendation retrieval through the RegimAI Gateway.

[<img src="images/vector-searching-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/vector-searching/vector-searching.ipynb)

[🦾 Bicep](labs/vector-searching/main.bicep) ➕ [⚙️ Policy](labs/vector-searching/policy.xml) ➕ [🧾 Notebook](labs/vector-searching/vector-searching.ipynb)

<!-- Built-in logging -->
### [**📊 Medical Audit Logging**](labs/built-in-logging/built-in-logging.ipynb)

Healthcare-compliant logging with HIPAA-friendly audit trails, medical decision tracking, and regulatory reporting through Azure Monitor integration.

[<img src="images/built-in-logging-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/built-in-logging/built-in-logging.ipynb)

[🦾 Bicep](labs/built-in-logging/main.bicep) ➕ [⚙️ Policy](labs/built-in-logging/policy.xml) ➕ [🧾 Notebook](labs/built-in-logging/built-in-logging.ipynb)

## 🔬 Advanced Integration Labs

<!-- Model Context Protocol for Medical Tools -->
### [**🔧 Medical MCP Integration**](labs/model-context-protocol/model-context-protocol.ipynb)

Medical tool integration using Model Context Protocol with dermatology-specific instruments, diagnostic tools, and clinical workflow integration through the RegimAI Gateway.

[<img src="images/model-context-protocol-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/model-context-protocol/model-context-protocol.ipynb)

[🦾 Bicep](labs/model-context-protocol/main.bicep) ➕ [⚙️ Policy](labs/model-context-protocol/inference-policy.xml) ➕ [🧾 Notebook](labs/model-context-protocol/model-context-protocol.ipynb)

<!-- OpenAI Agents for Medical Use -->
### [**🤖 Medical OpenAI Agents**](labs/openai-agents/openai-agents.ipynb)

OpenAI Agents specifically configured for medical consultations, diagnostic support, and treatment planning with dermatology specialization through the RegimAI Gateway.

[<img src="images/openai-agents-small.gif" alt="flow" style="width: 437px; display: inline-block;" data-target="animated-image.originalImage">](labs/openai-agents/openai-agents.ipynb)

[🦾 Bicep](labs/openai-agents/main.bicep) ➕ [⚙️ Policy](labs/openai-agents/inference-policy.xml) ➕ [🧾 Notebook](labs/openai-agents/openai-agents.ipynb)

## 🔮 Future SkinTwin Labs

Planned cognitive architecture enhancements for the RegimAI Gateway:

* **Clinical Decision Trees** - Interactive decision support with PLN reasoning
* **Medical Imaging Analysis** - Computer vision for dermatological diagnostics  
* **Treatment Protocol Optimization** - MOSES-driven therapy personalization
* **Temporal Disease Modeling** - ESN-based progression prediction
* **Multi-Modal Fusion** - Combining text, image, and sensor data
* **Federated Learning** - Privacy-preserving model updates across healthcare providers
* **Digital Twin Integration** - Full patient skin health modeling
* **Regulatory Compliance Automation** - Automated FDA and medical device compliance

## 🚀 Getting Started

### Prerequisites

* [Python 3.12 or later version](https://www.python.org/) installed
* [VS Code](https://code.visualstudio.com/) installed with the [Jupyter notebook extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter) enabled
* [Python environment](https://code.visualstudio.com/docs/python/environments#_creating-environments) with the [requirements.txt](requirements.txt) or run `pip install -r requirements.txt` in your terminal
* [An Azure Subscription](https://azure.microsoft.com/free/) with [Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/privileged#contributor) + [RBAC Administrator](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/privileged#role-based-access-control-administrator) or [Owner](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/privileged#owner) roles
* [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) installed and [Signed into your Azure subscription](https://learn.microsoft.com/cli/azure/authenticate-azure-cli-interactively)
* **Healthcare Domain Knowledge** (recommended) - Understanding of dermatology terminology and clinical workflows
* **RegimA API Access** (for production) - Contact RegimA Zone for clinical-grade API credentials

### Quickstart

1. **Clone and Setup**: Clone this repo and configure your local machine with the prerequisites.
2. **Start the Gateway**: Run `npm run gateway` in the `regima.site/` directory to start the RegimAI Gateway server.
3. **Explore Labs**: Navigate through the cognitive architecture labs, starting with [SkinTwin AtomSpace Integration](labs/skintwin-atomspace/skintwin-atomspace.ipynb).
4. **Deploy to Azure**: Use the provided Bicep templates to deploy medical-compliant infrastructure.
5. **Customize for Your Domain**: Adapt the cognitive models and policies for your specific dermatology use case.

### Development Environment

```bash
# Start RegimAI Gateway (port 8080)
cd regima.site/
npm install
npm run gateway

# Start documentation site (port 3000)  
npm run dev

# Build static documentation
npm run build
```

> [!NOTE]
> 🪲 Please feel free to open a new [issue](../../issues/new) if you find something that should be fixed or enhanced.

## 🔨 Supporting Tools

* [**RegimAI Gateway Server**](regima.site/scripts/gateway-server.js) - Complete AI Gateway implementation for dermatology services
* [**Cognitive Architecture Simulator**](regima.site/assets/js/cognitive-layer.js) - SkinTwin cognitive components simulation
* [**Medical Tracing**](tools/tracing.ipynb) - Healthcare-compliant request tracing with HIPAA considerations
* [**Clinical Data Streaming**](tools/streaming.ipynb) - Real-time medical data processing with privacy protection
* [**Medical Mock Server**](tools/mock-server/mock-server.ipynb) - Dermatology-focused mock API server for testing medical scenarios

## 🧬 SkinTwin Cognitive Architecture

The RegimAI Gateway is built on the SkinTwin cognitive architecture, which combines multiple AI paradigms:

### Core Components

1. **AtomSpace Knowledge Representation**: Stores dermatological knowledge in a graph-based format
2. **PLN Reasoning Engine**: Provides probabilistic inference for clinical decisions
3. **MOSES Pattern Mining**: Discovers treatment optimization patterns through evolutionary search
4. **ESN Temporal Modeling**: Predicts skin condition progression using echo state networks
5. **ECAN Attention Allocation**: Manages cognitive resources and attention focus

### Integration Benefits

- **Domain Expertise**: Built-in dermatology knowledge and medical reasoning
- **Uncertainty Handling**: Probabilistic logic for handling medical uncertainty
- **Pattern Discovery**: Automatic discovery of treatment patterns and outcomes
- **Temporal Awareness**: Understanding of disease progression and treatment timelines
- **Cognitive Routing**: Intelligent request routing based on complexity analysis

## 🏛️ Well-Architected Framework for Healthcare

The [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/what-is-well-architected-framework) adapted for healthcare and cognitive architecture. The following table maps RegimAI Gateway labs with Well-Architected pillars enhanced for medical compliance:

| Lab  | Security | Reliability | Performance | Operations | Costs | Medical Compliance |
| -------- | -------- |-------- |-------- |-------- |-------- |-------- |
| [Medical Content Safety](labs/medical-content-safety/medical-content-safety.ipynb) | [⭐](#%EF%B8%8F-well-architected-framework "Medical-grade content filtering with clinical validation") | | | | | [⭐](#%EF%B8%8F-well-architected-framework "FDA and medical accuracy compliance") |
| [HIPAA Compliance](labs/hipaa-compliance/hipaa-compliance.ipynb) | [⭐](#%EF%B8%8F-well-architected-framework "End-to-end health data protection") | | | [⭐](#%EF%B8%8F-well-architected-framework "Audit trails and compliance monitoring") | | [⭐](#%EF%B8%8F-well-architected-framework "HIPAA regulatory adherence") |
| [Cognitive Load Balancing](labs/cognitive-load-balancing/cognitive-load-balancing.ipynb) | [⭐](#%EF%B8%8F-well-architected-framework "Secure cognitive routing") | [⭐](#%EF%B8%8F-well-architected-framework "Intelligent failover based on cognitive analysis") | [⭐](#%EF%B8%8F-well-architected-framework "Cognitive-aware performance optimization") | | | |
| [Medical Knowledge Caching](labs/semantic-caching/semantic-caching.ipynb) | | | [⭐](#%EF%B8%8F-well-architected-framework "Medical knowledge retrieval optimization") | | [⭐](#%EF%B8%8F-well-architected-framework "Reduced API costs through intelligent caching") | |
| [Medical Audit Logging](labs/built-in-logging/built-in-logging.ipynb) | [⭐](#%EF%B8%8F-well-architected-framework "Secure medical data logging") | | | [⭐](#%EF%B8%8F-well-architected-framework "Healthcare compliance monitoring") | | [⭐](#%EF%B8%8F-well-architected-framework "Medical audit requirements") |
| [Medical FinOps Framework](labs/finops-framework/finops-framework.ipynb) | | | | [⭐](#%EF%B8%8F-well-architected-framework "Healthcare cost management dashboard") | [⭐](#%EF%B8%8F-well-architected-framework "Medical AI cost optimization and budget controls") | |

### Healthcare Architecture Principles

1. **Medical Accuracy**: All AI responses validated against clinical evidence
2. **Privacy by Design**: HIPAA compliance built into every component  
3. **Regulatory Compliance**: FDA and medical device regulations integrated
4. **Clinical Workflow**: Designed for healthcare provider integration
5. **Cognitive Reasoning**: Domain-specific intelligence for medical decisions


> [!TIP]
> Check the [Azure Well-Architected Framework perspective on Azure OpenAI Service](https://learn.microsoft.com/azure/well-architected/service-guides/azure-openai) for aditional guidance.

## 🥇 Other Resources

### RegimAI Gateway Resources
* [**RegimAI Gateway Documentation**](regima.site/README-gateway.md) - Complete gateway implementation guide
* [**SkinTwin Architecture**](regima.site/ref/architecture%20(5).md) - Cognitive architecture technical details
* [**Medical API Specifications**](regima.site/config/gateway.json) - Healthcare-specific API configurations

### Azure Integration Resources  
* [**APIM Healthcare Samples**](http://aka.ms/apim/samples) - Extended with medical use cases
* [**Healthcare Landing Zone**](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/app-platform/api-management/landing-zone-accelerator#generative-ai-gateway-scenario) - Medical compliance architecture
* [**Medical AI Learning**](https://learn.microsoft.com/en-us/training/browse/?products=azure-api-management) - Healthcare-focused training modules
* [**Healthcare AI News**](https://techcommunity.microsoft.com/tag/API%20Management?nodeId=board%3AIntegrationsonAzureBlog) - Medical AI announcements and updates

### SkinTwin & OpenCog Resources
* [**OpenCog AtomSpace**](https://wiki.opencog.org/w/AtomSpace) - Core knowledge representation
* [**PLN Framework**](https://wiki.opencog.org/w/PLN) - Probabilistic logic networks  
* [**MOSES Documentation**](https://wiki.opencog.org/w/MOSES) - Meta-optimizing evolutionary search
* [**Echo State Networks**](https://en.wikipedia.org/wiki/Echo_state_network) - Temporal prediction systems

### Medical AI Compliance
* [**FDA AI/ML Guidance**](https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices) - Regulatory compliance for medical AI
* [**HIPAA Compliance**](https://www.hhs.gov/hipaa/index.html) - Health data protection requirements
* [**HL7 FHIR**](https://www.hl7.org/fhir/) - Healthcare data interchange standards

> **Medical Disclaimer**: This platform is designed for healthcare professional use and development purposes. All medical AI outputs require clinical validation and should not replace professional medical judgment.

### Medical & Legal Disclaimer

> [!IMPORTANT]
> **For Healthcare Professional Use Only**: This RegimAI Gateway is designed for healthcare professionals, researchers, and developers working in the medical domain. It provides AI-powered tools and cognitive architecture for dermatology applications but does not replace professional medical diagnosis, treatment, or clinical judgment.
>
> **Medical Accuracy**: While the cognitive architecture includes medical knowledge validation and evidence-based reasoning, all AI-generated recommendations must be reviewed and validated by qualified healthcare professionals before clinical application.
>
> **Regulatory Compliance**: This platform includes HIPAA compliance features and FDA regulatory considerations, but implementers are responsible for ensuring full compliance with all applicable healthcare regulations in their jurisdiction.
>
> **No Medical Liability**: The creators and contributors of this software make no representations or warranties about medical accuracy, clinical effectiveness, or suitability for medical diagnosis or treatment. Any reliance on this software for medical purposes is at the user's own risk and must comply with applicable medical practice standards.
