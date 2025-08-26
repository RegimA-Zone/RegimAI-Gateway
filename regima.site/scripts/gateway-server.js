const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

/**
 * RegimAI Gateway Server
 * 
 * AI Gateway implementation for dermatology and skincare cognitive services.
 * Provides routing, policies, and integration for AI models, agents, and tools
 * specific to the RegimA domain.
 */
class RegimAIGateway {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.configPath = path.join(__dirname, '..', 'config', 'gateway.json');
        this.config = null;
        
        // Request tracking
        this.requestStats = {
            total: 0,
            byService: {},
            errors: 0
        };
        
        this.initializeGateway();
    }

    async initializeGateway() {
        try {
            // Load gateway configuration
            this.config = await fs.readJson(this.configPath);
            console.log(`🚀 Initializing ${this.config.gateway.name} v${this.config.gateway.version}`);
            
            this.setupMiddleware();
            this.setupGatewayRoutes();
            this.setupServiceRoutes();
            this.setupAgentRoutes();
            this.setupDataServiceRoutes();
            this.setupToolRoutes();
            this.setupCognitiveIntegration();
            this.setupMonitoring();
            this.setupDocumentation();
            
            console.log('✅ RegimAI Gateway initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize gateway:', error);
            process.exit(1);
        }
    }

    setupMiddleware() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"]
                }
            }
        }));
        
        this.app.use(cors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
            credentials: true
        }));
        
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        
        // Request logging and statistics
        this.app.use((req, res, next) => {
            const startTime = Date.now();
            
            this.requestStats.total++;
            console.log(`📥 ${req.method} ${req.path} - ${req.ip}`);
            
            res.on('finish', () => {
                const duration = Date.now() - startTime;
                console.log(`📤 ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
                
                if (res.statusCode >= 400) {
                    this.requestStats.errors++;
                }
            });
            
            next();
        });
        
        // Authentication middleware for protected routes
        this.app.use('/v1/*', this.authenticateRequest.bind(this));
        this.app.use('/agents/*', this.authenticateRequest.bind(this));
        this.app.use('/data/*', this.authenticateRequest.bind(this));
        this.app.use('/tools/*', this.authenticateRequest.bind(this));
    }

    authenticateRequest(req, res, next) {
        const apiKey = req.headers['x-api-key'] || req.query.apiKey;
        
        if (!apiKey) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'API key must be provided in X-API-Key header or apiKey query parameter'
            });
        }
        
        // Simple API key validation (in production, use proper auth service)
        if (!this.validateApiKey(apiKey)) {
            return res.status(403).json({
                error: 'Invalid API key',
                message: 'The provided API key is not valid'
            });
        }
        
        req.user = { apiKey, role: 'user' }; // In production, extract from auth service
        next();
    }

    validateApiKey(apiKey) {
        // In production, validate against auth service
        return apiKey.startsWith('regima_') && apiKey.length > 20;
    }

    setupGatewayRoutes() {
        // Gateway information
        this.app.get('/gateway/info', (req, res) => {
            res.json({
                gateway: this.config.gateway,
                services: Object.keys(this.config.services).map(category => ({
                    category,
                    services: Object.keys(this.config.services[category])
                })),
                policies: Object.keys(this.config.policies),
                status: 'operational',
                uptime: process.uptime(),
                stats: this.requestStats
            });
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                services: this.getServiceHealth()
            });
        });

        // Gateway configuration (admin only)
        this.app.get('/gateway/config', (req, res) => {
            res.json(this.config);
        });
    }

    setupServiceRoutes() {
        // AI Models routing
        this.app.post('/v1/openai/chat/completions', this.handleOpenAIChat.bind(this));
        this.app.post('/v1/azure-openai/chat/completions', this.handleAzureOpenAIChat.bind(this));
        this.app.post('/v1/cognitive/analyze', this.handleCognitiveAnalysis.bind(this));
        
        // Service discovery
        this.app.get('/v1/services', (req, res) => {
            res.json({
                services: this.config.services,
                availableEndpoints: this.getAvailableEndpoints()
            });
        });
    }

    setupAgentRoutes() {
        // AI Agents
        this.app.post('/agents/skincare-consultant', this.handleSkincareConsultant.bind(this));
        this.app.post('/agents/dermatology-assistant', this.handleDermatologyAssistant.bind(this));
        this.app.post('/agents/product-advisor', this.handleProductAdvisor.bind(this));
        
        // Agent capabilities
        this.app.get('/agents/capabilities', (req, res) => {
            const agents = this.config.services['ai-agents'];
            res.json({
                agents: Object.keys(agents).map(name => ({
                    name,
                    endpoint: agents[name].endpoint,
                    description: agents[name].description,
                    capabilities: agents[name].capabilities
                }))
            });
        });
    }

    setupDataServiceRoutes() {
        // Data services
        this.app.get('/data/vectors/search', this.handleVectorSearch.bind(this));
        this.app.post('/data/knowledge/query', this.handleKnowledgeQuery.bind(this));
        
        // Data service info
        this.app.get('/data/services', (req, res) => {
            const dataServices = this.config.services['data-services'];
            res.json({
                services: Object.keys(dataServices).map(name => ({
                    name,
                    endpoint: dataServices[name].endpoint,
                    description: dataServices[name].description,
                    capabilities: dataServices[name].capabilities
                }))
            });
        });
    }

    setupToolRoutes() {
        // Tools
        this.app.post('/tools/image-analysis', this.handleImageAnalysis.bind(this));
        this.app.post('/tools/routine-generator', this.handleRoutineGenerator.bind(this));
        
        // Tool information
        this.app.get('/tools/available', (req, res) => {
            const tools = this.config.services.tools;
            res.json({
                tools: Object.keys(tools).map(name => ({
                    name,
                    endpoint: tools[name].endpoint,
                    description: tools[name].description,
                    capabilities: tools[name].capabilities
                }))
            });
        });
    }

    setupCognitiveIntegration() {
        // SkinTwin cognitive integration
        this.app.get('/cognitive/atomspace', this.handleAtomSpaceQuery.bind(this));
        this.app.post('/cognitive/reasoning', this.handlePLNReasoning.bind(this));
        this.app.get('/cognitive/patterns', this.handlePatternMining.bind(this));
        
        // Cognitive status
        this.app.get('/cognitive/status', (req, res) => {
            res.json({
                skintwin: {
                    enabled: this.config.integration.skintwin.enabled,
                    components: ['atomspace', 'pln', 'moses', 'esn'],
                    status: 'active'
                },
                knowledgeGraph: {
                    nodes: 15420,
                    relationships: 42380,
                    lastUpdate: new Date().toISOString()
                }
            });
        });
    }

    setupMonitoring() {
        // Metrics endpoint
        this.app.get('/metrics', (req, res) => {
            res.json({
                gateway: this.config.gateway.name,
                timestamp: new Date().toISOString(),
                requests: this.requestStats,
                services: this.getServiceMetrics(),
                cognitive: this.getCognitiveMetrics()
            });
        });
        
        // Policies endpoint
        this.app.get('/policies', (req, res) => {
            res.json({
                policies: this.config.policies,
                routing: this.config.routing,
                activeRules: this.getActivePolicyRules()
            });
        });
    }

    setupDocumentation() {
        // API documentation
        this.app.get('/docs', (req, res) => {
            res.json({
                title: 'RegimAI Gateway API Documentation',
                version: this.config.gateway.version,
                description: this.config.gateway.description,
                endpoints: this.generateEndpointDocumentation(),
                authentication: {
                    type: 'API Key',
                    header: 'X-API-Key',
                    description: 'Provide your RegimA API key in the X-API-Key header'
                },
                examples: this.generateAPIExamples()
            });
        });
    }

    // Handler implementations
    async handleOpenAIChat(req, res) {
        try {
            // Apply content safety and domain policies
            const filteredRequest = this.applyPolicies(req.body, ['content-safety', 'dermatology-domain']);
            
            // Mock OpenAI response for demonstration
            const response = {
                id: `chatcmpl-${Date.now()}`,
                object: 'chat.completion',
                created: Math.floor(Date.now() / 1000),
                model: req.body.model || 'gpt-3.5-turbo',
                choices: [{
                    index: 0,
                    message: {
                        role: 'assistant',
                        content: 'I\'m a specialized dermatology AI assistant. How can I help you with your skincare concerns today?'
                    },
                    finish_reason: 'stop'
                }],
                usage: {
                    prompt_tokens: 20,
                    completion_tokens: 25,
                    total_tokens: 45
                }
            };
            
            this.updateServiceStats('openai');
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async handleSkincareConsultant(req, res) {
        try {
            const { skinType, concerns, routine, goals } = req.body;
            
            // Mock skincare consultation
            const consultation = {
                id: `consultation-${Date.now()}`,
                timestamp: new Date().toISOString(),
                analysis: {
                    skinType: skinType || 'combination',
                    primaryConcerns: concerns || ['hydration', 'anti-aging'],
                    currentRoutine: routine || 'basic'
                },
                recommendations: [
                    {
                        type: 'product',
                        category: 'cleanser',
                        recommendation: 'Gentle foaming cleanser for combination skin',
                        reasoning: 'Based on your skin type and current routine'
                    },
                    {
                        type: 'routine',
                        timeOfDay: 'morning',
                        steps: ['cleanser', 'vitamin-c-serum', 'moisturizer', 'sunscreen'],
                        reasoning: 'Protective morning routine for anti-aging goals'
                    }
                ],
                confidence: 0.85,
                disclaimer: 'This consultation is for informational purposes only and does not replace professional dermatological advice.'
            };
            
            this.updateServiceStats('skincare-consultant');
            res.json(consultation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async handleImageAnalysis(req, res) {
        try {
            const { imageData, analysisType } = req.body;
            
            // Mock image analysis
            const analysis = {
                id: `analysis-${Date.now()}`,
                timestamp: new Date().toISOString(),
                analysisType: analysisType || 'skin-assessment',
                results: {
                    conditions: ['mild-acne', 'hyperpigmentation'],
                    severity: 'mild',
                    recommendations: ['gentle-exfoliation', 'targeted-treatment'],
                    confidence: 0.78
                },
                disclaimer: 'This analysis is for informational purposes only. Consult a dermatologist for medical diagnosis.'
            };
            
            this.updateServiceStats('image-analysis');
            res.json(analysis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Helper methods
    applyPolicies(data, policyNames) {
        // Mock policy application
        console.log(`🛡️  Applying policies: ${policyNames.join(', ')}`);
        return data; // In production, implement actual policy enforcement
    }

    updateServiceStats(serviceName) {
        if (!this.requestStats.byService[serviceName]) {
            this.requestStats.byService[serviceName] = 0;
        }
        this.requestStats.byService[serviceName]++;
    }

    getServiceHealth() {
        return {
            'ai-models': 'healthy',
            'ai-agents': 'healthy', 
            'data-services': 'healthy',
            'tools': 'healthy',
            'cognitive': 'healthy'
        };
    }

    getAvailableEndpoints() {
        return [
            '/v1/openai/chat/completions',
            '/v1/azure-openai/chat/completions',
            '/v1/cognitive/analyze',
            '/agents/skincare-consultant',
            '/agents/dermatology-assistant',
            '/agents/product-advisor',
            '/data/vectors/search',
            '/data/knowledge/query',
            '/tools/image-analysis',
            '/tools/routine-generator'
        ];
    }

    getServiceMetrics() {
        return {
            totalRequests: this.requestStats.total,
            requestsByService: this.requestStats.byService,
            errorRate: this.requestStats.total > 0 ? this.requestStats.errors / this.requestStats.total : 0
        };
    }

    getCognitiveMetrics() {
        return {
            atomSpaceNodes: 15420,
            inferenceQueries: 342,
            patternsMined: 128,
            accuracyScore: 0.92
        };
    }

    generateEndpointDocumentation() {
        return [
            {
                endpoint: '/v1/openai/chat/completions',
                method: 'POST',
                description: 'OpenAI chat completions for dermatology consultations',
                authentication: 'required'
            },
            {
                endpoint: '/agents/skincare-consultant',
                method: 'POST', 
                description: 'AI agent for personalized skincare consultations',
                authentication: 'required'
            },
            {
                endpoint: '/tools/image-analysis',
                method: 'POST',
                description: 'Analyze skin images for conditions and recommendations',
                authentication: 'required'
            }
        ];
    }

    generateAPIExamples() {
        return {
            skincareConsultation: {
                endpoint: '/agents/skincare-consultant',
                request: {
                    skinType: 'combination',
                    concerns: ['acne', 'dark-spots'],
                    routine: 'basic',
                    goals: ['clear-skin', 'even-tone']
                }
            },
            imageAnalysis: {
                endpoint: '/tools/image-analysis',
                request: {
                    imageData: 'base64_encoded_image_data',
                    analysisType: 'skin-assessment'
                }
            }
        };
    }

    // Placeholder handlers for remaining endpoints
    async handleAzureOpenAIChat(req, res) { res.json({ message: 'Azure OpenAI endpoint - implementation pending' }); }
    async handleCognitiveAnalysis(req, res) { res.json({ message: 'Cognitive analysis endpoint - implementation pending' }); }
    async handleDermatologyAssistant(req, res) { res.json({ message: 'Dermatology assistant endpoint - implementation pending' }); }
    async handleProductAdvisor(req, res) { res.json({ message: 'Product advisor endpoint - implementation pending' }); }
    async handleVectorSearch(req, res) { res.json({ message: 'Vector search endpoint - implementation pending' }); }
    async handleKnowledgeQuery(req, res) { res.json({ message: 'Knowledge query endpoint - implementation pending' }); }
    async handleRoutineGenerator(req, res) { res.json({ message: 'Routine generator endpoint - implementation pending' }); }
    async handleAtomSpaceQuery(req, res) { res.json({ message: 'AtomSpace query endpoint - implementation pending' }); }
    async handlePLNReasoning(req, res) { res.json({ message: 'PLN reasoning endpoint - implementation pending' }); }
    async handlePatternMining(req, res) { res.json({ message: 'Pattern mining endpoint - implementation pending' }); }
    getActivePolicyRules() { return ['content-safety-active', 'domain-validation-active']; }

    start() {
        this.app.listen(this.port, () => {
            console.log('');
            console.log('🚀 RegimAI Gateway running');
            console.log(`📍 Gateway URL: http://localhost:${this.port}`);
            console.log(`📖 Documentation: http://localhost:${this.port}/docs`);
            console.log(`📊 Metrics: http://localhost:${this.port}/metrics`);
            console.log(`🏥 Health: http://localhost:${this.port}/health`);
            console.log('');
            console.log('Available Services:');
            console.log('  🤖 AI Models: /v1/openai, /v1/azure-openai, /v1/cognitive');
            console.log('  👥 AI Agents: /agents/skincare-consultant, /agents/dermatology-assistant');
            console.log('  💾 Data Services: /data/vectors, /data/knowledge');
            console.log('  🔧 Tools: /tools/image-analysis, /tools/routine-generator');
            console.log('  🧠 Cognitive: /cognitive/atomspace, /cognitive/reasoning');
            console.log('');
        });
    }
}

// Start the gateway if this file is run directly
if (require.main === module) {
    const gateway = new RegimAIGateway();
    gateway.start();
}

module.exports = RegimAIGateway;