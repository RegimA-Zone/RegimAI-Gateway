---
title: RegimAI Gateway
description: AI Gateway for dermatology and skincare cognitive services - unified interface for AI models, agents, and tools powered by SkinTwin architecture
schemaType: WebSite
path: /
---

<section class="hero">
    <div class="hero-container">
        <h1>RegimAI Gateway</h1>
        <p>AI Gateway for dermatology and skincare cognitive services</p>
        <div class="knowledge-graph">
            <h4>🚀 Gateway Architecture</h4>
            <div class="knowledge-nodes">
                <span class="knowledge-node">AI Models</span>
                <span class="knowledge-node">AI Agents</span>
                <span class="knowledge-node">Data Services</span>
                <span class="knowledge-node">Tools & Functions</span>
                <span class="knowledge-node">SkinTwin Cognitive</span>
            </div>
        </div>
    </div>
</section>

<section class="content-section">
    <div class="gateway-intro">
        <p>The RegimAI Gateway provides a unified interface for AI services, agents, and tools specifically designed for dermatology and skincare applications. Built on the SkinTwin cognitive architecture, it enables intelligent routing, policy enforcement, and seamless integration of AI capabilities.</p>
        
        <p>Our gateway ensures control and governance over AI service consumption while accelerating the development of intelligent dermatology applications. From personalized skincare consultations to professional diagnostic support, the RegimAI Gateway powers the next generation of AI-driven healthcare solutions.</p>
        
        <p>With comprehensive policy management, content safety filtering, and domain-specific validation, healthcare providers and skincare professionals can confidently deploy AI services while maintaining compliance and ensuring patient safety.</p>
    </div>

    <h2>🏗️ Gateway Services</h2>
    <div class="service-grid">
        <div class="service-card" data-category="ai-models">
            <div class="service-icon">🤖</div>
            <div class="service-card-content">
                <h3>AI Models & Services</h3>
                <p class="service-category">Foundation AI</p>
                <p>Access to OpenAI, Azure OpenAI, and Cognitive Services with dermatology-specific optimization and safety policies.</p>
                <div class="service-endpoints">
                    <code>/v1/openai</code>
                    <code>/v1/azure-openai</code>
                    <code>/v1/cognitive</code>
                </div>
            </div>
        </div>

        <div class="service-card" data-category="ai-agents">
            <div class="service-icon">👥</div>
            <div class="service-card-content">
                <h3>AI Agents</h3>
                <p class="service-category">Specialized Assistants</p>
                <p>Intelligent agents for skincare consultation, dermatology assistance, and product recommendations with domain expertise.</p>
                <div class="service-endpoints">
                    <code>/agents/skincare-consultant</code>
                    <code>/agents/dermatology-assistant</code>
                    <code>/agents/product-advisor</code>
                </div>
            </div>
        </div>

        <div class="service-card" data-category="data-services">
            <div class="service-icon">💾</div>
            <div class="service-card-content">
                <h3>Data Services</h3>
                <p class="service-category">Knowledge & Storage</p>
                <p>Vector databases and knowledge graphs powered by the SkinTwin cognitive architecture for intelligent data retrieval.</p>
                <div class="service-endpoints">
                    <code>/data/vectors</code>
                    <code>/data/knowledge</code>
                </div>
            </div>
        </div>

        <div class="service-card" data-category="tools">
            <div class="service-icon">🔧</div>
            <div class="service-card-content">
                <h3>Tools & Functions</h3>
                <p class="service-category">Specialized Tools</p>
                <p>Advanced image analysis, routine generation, and other dermatology-specific tools with medical compliance.</p>
                <div class="service-endpoints">
                    <code>/tools/image-analysis</code>
                    <code>/tools/routine-generator</code>
                </div>
            </div>
        </div>

        <div class="service-card" data-category="cognitive">
            <div class="service-icon">🧠</div>
            <div class="service-card-content">
                <h3>Cognitive Architecture</h3>
                <p class="service-category">SkinTwin Integration</p>
                <p>Direct access to AtomSpace, PLN reasoning, pattern mining, and temporal prediction capabilities.</p>
                <div class="service-endpoints">
                    <code>/cognitive/atomspace</code>
                    <code>/cognitive/reasoning</code>
                    <code>/cognitive/patterns</code>
                </div>
            </div>
        </div>

        <div class="service-card" data-category="monitoring">
            <div class="service-icon">📊</div>
            <div class="service-card-content">
                <h3>Monitoring & Governance</h3>
                <p class="service-category">Operations</p>
                <p>Real-time metrics, policy enforcement, health monitoring, and comprehensive audit trails for all services.</p>
                <div class="service-endpoints">
                    <code>/metrics</code>
                    <code>/health</code>
                    <code>/policies</code>
                </div>
            </div>
        </div>
    </div>

    <div class="knowledge-graph">
        <h4>🧠 SkinTwin Cognitive Analysis - Service Relationships</h4>
        <div class="cognitive-insights">
            <p><strong>Intelligent Routing:</strong> Requests automatically routed to most appropriate AI service based on complexity</p>
            <p><strong>Policy Enforcement:</strong> All services protected by medical compliance and content safety policies</p>
            <p><strong>Load Balancing:</strong> Cognitive-aware distribution optimizes performance and accuracy</p>
        </div>
        <div class="knowledge-nodes">
            <!-- Dynamic nodes populated by cognitive-layer.js -->
        </div>
    </div>
</section>

<section class="content-section">
    <h2>🚀 Quick Start</h2>
    <div class="quick-start-steps">
        <div class="step">
            <div class="step-number">1</div>
            <h3>Get API Key</h3>
            <p>Obtain your RegimA API key from the platform dashboard</p>
        </div>
        <div class="step">
            <div class="step-number">2</div>
            <h3>Choose Service</h3>
            <p>Select from AI models, agents, data services, or tools</p>
        </div>
        <div class="step">
            <div class="step-number">3</div>
            <h3>Make Request</h3>
            <p>Include your API key and start building intelligent applications</p>
        </div>
    </div>
    
    <div class="api-example">
        <h3>Example Request</h3>
        <pre><code>curl -X POST https://gateway.regima.ai/agents/skincare-consultant \
  -H "X-API-Key: regima_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "skinType": "combination",
    "concerns": ["acne", "dark-spots"],
    "goals": ["clear-skin", "even-tone"]
  }'</code></pre>
    </div>
</section>

<!-- Gateway Discovery -->
<section class="content-section">
    <h2>🔍 Service Discovery</h2>
    <div class="service-discovery">
        <input type="text" id="service-search" placeholder="Search for AI services, agents, or tools..." class="service-search-input">
        <div id="service-results" class="service-results"></div>
    </div>
    <p class="discovery-help">Try searching for "skincare consultation", "image analysis", "product recommendation", or "cognitive reasoning"</p>
</section>