# RegimAI Gateway - Cognitive Architecture Implementation

## 🚀 Overview

The RegimAI Gateway is an AI Gateway specifically designed for dermatology and skincare cognitive services. It adapts the traditional AI Gateway pattern to provide unified access to AI models, agents, and tools while maintaining domain expertise in skincare and dermatology.

Built on the SkinTwin cognitive architecture, it combines the power of AtomSpace, PLN reasoning, MOSES pattern mining, and ESN temporal prediction with modern AI services to create an intelligent gateway for healthcare applications.

## 🏗️ Architecture

### AI Gateway Components

- **🤖 AI Models & Services**: OpenAI, Azure OpenAI, Cognitive Services
- **👥 AI Agents**: Specialized agents for skincare consultation, dermatology assistance, and product recommendation
- **💾 Data Services**: Vector databases and knowledge graphs for intelligent data retrieval
- **🔧 Tools & Functions**: Image analysis, routine generation, and domain-specific tools
- **🧠 Cognitive Integration**: Direct access to SkinTwin cognitive architecture components

### Policy & Governance

- **Content Safety**: Medical accuracy validation and harmful content filtering
- **Privacy Protection**: HIPAA compliance and data anonymization
- **Domain Validation**: Dermatology-specific terminology and evidence-based recommendations
- **Authentication**: API key management and user permissions
- **Medical Compliance**: FDA compliance and regulatory adherence

## 🔧 Technical Implementation

### Gateway Server
```bash
npm run gateway        # Start RegimAI Gateway on port 8080
```

### Website & Documentation
```bash
npm install          # Install dependencies
npm run build        # Build gateway documentation site
npm run dev          # Start development server on port 3000
```

### Architecture Components

#### 1. Gateway Server (`scripts/gateway-server.js`)
- Express.js based AI Gateway with comprehensive service routing
- Policy enforcement and content safety filtering
- Authentication and authorization middleware
- Real-time metrics and health monitoring

#### 2. Static Site Generator (`scripts/build.js`)
- Generates gateway documentation and API portal
- Service catalog and endpoint documentation
- Cognitive architecture status pages

#### 3. Cognitive Layer (`assets/js/cognitive-layer.js`)
- Knowledge extraction from gateway interactions
- AtomSpace simulation for service knowledge storage
- PLN reasoning for intelligent routing decisions
- Pattern recognition for service optimization

#### 4. Gateway Configuration (`config/gateway.json`)
- Comprehensive service definitions and capabilities
- Policy rules and routing strategies
- Integration settings for SkinTwin architecture

## 🌐 API Endpoints

### Gateway Management
- `GET /gateway/info` - Gateway information and statistics
- `GET /health` - Health status of all services
- `GET /metrics` - Performance metrics and usage data
- `GET /docs` - Complete API documentation

### AI Models
- `POST /v1/openai/chat/completions` - OpenAI chat completions
- `POST /v1/azure-openai/chat/completions` - Azure OpenAI services
- `POST /v1/cognitive/analyze` - Cognitive Services integration

### AI Agents
- `POST /agents/skincare-consultant` - Personalized skincare consultations
- `POST /agents/dermatology-assistant` - Professional dermatology support
- `POST /agents/product-advisor` - Product recommendation engine

### Data Services
- `GET /data/vectors/search` - Vector similarity search
- `POST /data/knowledge/query` - Knowledge graph queries

### Tools
- `POST /tools/image-analysis` - Skin image analysis and assessment
- `POST /tools/routine-generator` - Personalized routine creation

### Cognitive Services
- `GET /cognitive/atomspace` - AtomSpace knowledge queries
- `POST /cognitive/reasoning` - PLN reasoning and inference
- `GET /cognitive/patterns` - Pattern mining results

## 🔐 Authentication

All protected endpoints require authentication using API keys:

```bash
curl -X POST https://gateway.regima.ai/agents/skincare-consultant \
  -H "X-API-Key: regima_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"skinType": "combination", "concerns": ["acne"]}'
```

## 📊 Monitoring & Analytics

The gateway provides comprehensive monitoring:

- **Request Analytics**: Track usage patterns and performance metrics
- **Service Health**: Real-time status of all AI services and agents
- **Cognitive Metrics**: AtomSpace node counts, inference accuracy, pattern mining results
- **Policy Compliance**: Audit trails and compliance reporting

## 🧪 Testing

### Gateway Server Testing
```bash
# Test gateway health
curl http://localhost:8080/health

# Test service info
curl http://localhost:8080/gateway/info

# Test AI agent (requires API key)
curl -X POST http://localhost:8080/agents/skincare-consultant \
  -H "X-API-Key: regima_test_api_key_12345" \
  -H "Content-Type: application/json" \
  -d '{"skinType": "combination", "concerns": ["acne"]}'
```

### Website Testing
```bash
# Start development server
npm run dev

# Visit http://localhost:3000 for gateway documentation
# Visit http://localhost:3000/gateway/ for gateway overview
# Visit http://localhost:3000/gateway/api-docs for API documentation
```

## 🔗 Integration Points

### SkinTwin Architecture
- Compatible with OpenCog AtomSpace knowledge representation
- PLN rule integration for intelligent decision making
- MOSES pattern mining for service optimization
- ESN temporal prediction for user journey analysis

### External Systems
- Ready for healthcare platform integration
- API endpoints for mobile and web applications
- Analytics dashboard compatibility
- Compliance reporting systems

## 📱 Features

### Intelligent Routing
- Cognitive-aware load balancing based on request complexity
- Automatic failover to backup services
- Domain-specific model selection

### Content Safety
- Medical accuracy validation
- Harmful content filtering
- Evidence-based recommendation verification

### Scalability
- Horizontal scaling with load balancing
- Circuit breaker patterns for fault tolerance
- Rate limiting and quota management

## 🔒 Security & Compliance

- **HIPAA Compliance**: Privacy protection for health data
- **FDA Regulations**: Medical device compliance checking
- **Data Encryption**: End-to-end encryption for sensitive information
- **Audit Trails**: Comprehensive logging for compliance reporting

## 📚 Documentation

- `/gateway/` - Gateway overview and architecture
- `/gateway/api-docs` - Complete API reference
- `/gateway/services` - Service catalog and capabilities
- `/cognitive/status` - SkinTwin architecture status
- `/docs` - Interactive API documentation

---

This implementation bridges traditional skincare expertise with cutting-edge AI Gateway technology, creating an intelligent platform for healthcare providers, skincare professionals, and application developers to build the next generation of AI-powered dermatology solutions.