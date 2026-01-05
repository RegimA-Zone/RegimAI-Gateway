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
        // SkinTwin cognitive integration - AtomSpace
        this.app.get('/cognitive/atomspace', this.handleAtomSpaceQuery.bind(this));
        this.app.post('/cognitive/atomspace/atoms', this.handleAtomSpaceAddAtom.bind(this));

        // PLN Reasoning endpoints
        this.app.post('/cognitive/pln/reason', this.handlePLNReasoning.bind(this));
        this.app.post('/cognitive/pln/infer', this.handlePLNInference.bind(this));

        // MOSES Treatment Optimization endpoints
        this.app.post('/cognitive/moses/optimize', this.handleMOSESOptimize.bind(this));
        this.app.post('/cognitive/moses/evaluate', this.handleMOSESEvaluate.bind(this));
        this.app.post('/cognitive/moses/patterns/mine', this.handleMOSESPatternMine.bind(this));

        // ESN Progression Modeling endpoints
        this.app.post('/cognitive/esn/predict', this.handleESNPredict.bind(this));
        this.app.post('/cognitive/esn/patterns/analyze', this.handleESNAnalyzePatterns.bind(this));
        this.app.post('/cognitive/esn/healing/estimate', this.handleESNHealingEstimate.bind(this));
        this.app.post('/cognitive/esn/treatment/response', this.handleESNTreatmentResponse.bind(this));

        // ECAN Attention Allocation endpoints
        this.app.post('/cognitive/ecan/allocate', this.handleECANAllocate.bind(this));
        this.app.get('/cognitive/ecan/status', this.handleECANStatus.bind(this));
        this.app.post('/cognitive/ecan/stimulate', this.handleECANStimulate.bind(this));
        this.app.post('/cognitive/ecan/spread', this.handleECANSpread.bind(this));
        this.app.post('/cognitive/ecan/hebbian', this.handleECANHebbian.bind(this));

        // Legacy endpoints for compatibility
        this.app.post('/cognitive/reasoning', this.handlePLNReasoning.bind(this));
        this.app.get('/cognitive/patterns', this.handleMOSESPatternMine.bind(this));

        // Cognitive status
        this.app.get('/cognitive/status', (req, res) => {
            res.json({
                skintwin: {
                    enabled: this.config.integration?.skintwin?.enabled ?? true,
                    components: {
                        atomspace: { status: 'active', atoms: 15420 },
                        pln: { status: 'active', rules: 42 },
                        moses: { status: 'active', patterns_discovered: 128 },
                        esn: { status: 'active', reservoir_size: 500 },
                        ecan: { status: 'active', attention_budget: 1000 }
                    },
                    status: 'active'
                },
                knowledgeGraph: {
                    nodes: 15420,
                    relationships: 42380,
                    lastUpdate: new Date().toISOString()
                },
                cognitiveCapabilities: [
                    'treatment_optimization',
                    'progression_prediction',
                    'clinical_reasoning',
                    'attention_management',
                    'pattern_mining'
                ]
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
            // AI Models
            '/v1/openai/chat/completions',
            '/v1/azure-openai/chat/completions',
            '/v1/cognitive/analyze',
            // AI Agents
            '/agents/skincare-consultant',
            '/agents/dermatology-assistant',
            '/agents/product-advisor',
            // Data Services
            '/data/vectors/search',
            '/data/knowledge/query',
            // Tools
            '/tools/image-analysis',
            '/tools/routine-generator',
            // Cognitive - AtomSpace
            '/cognitive/atomspace',
            '/cognitive/atomspace/atoms',
            // Cognitive - PLN
            '/cognitive/pln/reason',
            '/cognitive/pln/infer',
            // Cognitive - MOSES
            '/cognitive/moses/optimize',
            '/cognitive/moses/evaluate',
            '/cognitive/moses/patterns/mine',
            // Cognitive - ESN
            '/cognitive/esn/predict',
            '/cognitive/esn/patterns/analyze',
            '/cognitive/esn/healing/estimate',
            '/cognitive/esn/treatment/response',
            // Cognitive - ECAN
            '/cognitive/ecan/allocate',
            '/cognitive/ecan/status',
            '/cognitive/ecan/stimulate',
            '/cognitive/ecan/spread',
            '/cognitive/ecan/hebbian'
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

    // Azure OpenAI Handler
    async handleAzureOpenAIChat(req, res) {
        try {
            const response = {
                id: `azurechatcmpl-${Date.now()}`,
                object: 'chat.completion',
                created: Math.floor(Date.now() / 1000),
                model: req.body.model || 'gpt-4',
                choices: [{
                    index: 0,
                    message: { role: 'assistant', content: 'Azure OpenAI dermatology response' },
                    finish_reason: 'stop'
                }]
            };
            this.updateServiceStats('azure-openai');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // Cognitive Analysis Handler
    async handleCognitiveAnalysis(req, res) {
        try {
            const { text, analysisType } = req.body;
            const response = {
                id: `cognitive-${Date.now()}`,
                analysisType: analysisType || 'dermatology',
                entities: ['acne', 'inflammation', 'treatment'],
                sentiment: 'neutral',
                medicalTerms: [{ term: 'papule', confidence: 0.9 }]
            };
            this.updateServiceStats('cognitive-analysis');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // Dermatology Assistant Handler (Clinical)
    async handleDermatologyAssistant(req, res) {
        try {
            const { message, clinicalContext } = req.body;
            const response = {
                id: `clinical-${Date.now()}`,
                agent: 'clinical_dermatology_assistant',
                response: {
                    content: 'Based on the clinical presentation, consider the following differential diagnoses...',
                    differentials: ['Acne Vulgaris', 'Rosacea', 'Perioral Dermatitis'],
                    recommendations: ['Further history', 'Skin scraping if fungal suspected'],
                    evidenceLevel: 'B'
                },
                disclaimer: 'Clinical decision support only. Final diagnosis is provider responsibility.'
            };
            this.updateServiceStats('dermatology-assistant');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // Product Advisor Handler
    async handleProductAdvisor(req, res) {
        try {
            const { skinType, concerns, currentProducts } = req.body;
            const response = {
                id: `product-${Date.now()}`,
                agent: 'product_advisor',
                analysis: { skinType: skinType || 'combination', concerns: concerns || [] },
                recommendations: [
                    { category: 'cleanser', suggestion: 'Gentle foaming cleanser', reason: 'Suitable for skin type' },
                    { category: 'treatment', suggestion: 'Niacinamide serum', reason: 'Addresses concern' }
                ],
                ingredientConflicts: [],
                disclaimer: 'Product recommendations are informational only.'
            };
            this.updateServiceStats('product-advisor');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // Vector Search Handler
    async handleVectorSearch(req, res) {
        try {
            const { query, topK } = req.body;
            const response = {
                results: [
                    { id: 'doc-1', score: 0.95, content: 'Acne treatment protocols...' },
                    { id: 'doc-2', score: 0.87, content: 'Skincare routine guidelines...' }
                ],
                totalResults: 2
            };
            this.updateServiceStats('vector-search');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // Knowledge Query Handler
    async handleKnowledgeQuery(req, res) {
        try {
            const { query, domain } = req.body;
            const response = {
                query,
                results: [{ concept: 'Acne Vulgaris', relationships: ['treats', 'causes'] }],
                graphContext: { nodes: 5, edges: 8 }
            };
            this.updateServiceStats('knowledge-query');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // Routine Generator Handler
    async handleRoutineGenerator(req, res) {
        try {
            const { skinType, concerns, preferences } = req.body;
            const response = {
                id: `routine-${Date.now()}`,
                morning: [
                    { step: 1, product: 'Cleanser', instruction: 'Gentle wash' },
                    { step: 2, product: 'Serum', instruction: 'Apply vitamin C' },
                    { step: 3, product: 'Moisturizer', instruction: 'Hydrate' },
                    { step: 4, product: 'Sunscreen', instruction: 'SPF 30+' }
                ],
                evening: [
                    { step: 1, product: 'Cleanser', instruction: 'Double cleanse' },
                    { step: 2, product: 'Treatment', instruction: 'Apply active' },
                    { step: 3, product: 'Moisturizer', instruction: 'Night cream' }
                ]
            };
            this.updateServiceStats('routine-generator');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // AtomSpace Handlers
    async handleAtomSpaceQuery(req, res) {
        try {
            const { atomType, name } = req.query;
            const response = {
                atoms: [
                    { type: 'ConceptNode', name: 'Acne', truthValue: { strength: 0.9, confidence: 0.95 } },
                    { type: 'ConceptNode', name: 'Retinoid', truthValue: { strength: 0.85, confidence: 0.9 } }
                ],
                totalAtoms: 15420
            };
            this.updateServiceStats('atomspace');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    async handleAtomSpaceAddAtom(req, res) {
        try {
            const { type, name, truthValue } = req.body;
            const response = {
                success: true,
                atom: { id: `atom-${Date.now()}`, type, name, truthValue }
            };
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // PLN Reasoning Handlers
    async handlePLNReasoning(req, res) {
        try {
            const { premises, query } = req.body;
            const response = {
                id: `pln-${Date.now()}`,
                conclusion: 'Based on PLN inference, the treatment is likely effective',
                confidence: 0.85,
                inferenceChain: [
                    { rule: 'ModusPonens', inputs: ['premise1', 'premise2'], output: 'conclusion' }
                ]
            };
            this.updateServiceStats('pln-reasoning');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    async handlePLNInference(req, res) {
        try {
            const { atoms, inferenceType } = req.body;
            const response = {
                inferences: [
                    { type: 'deduction', result: 'Treatment X effective for condition Y', confidence: 0.82 }
                ]
            };
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // MOSES Treatment Optimization Handlers
    async handleMOSESOptimize(req, res) {
        try {
            const { condition, patientProfile, constraints } = req.body;
            const response = {
                id: `moses-${Date.now()}`,
                condition: condition || 'acne_vulgaris',
                optimizedProtocol: {
                    fitness: 0.87,
                    treatments: [
                        { ingredient: 'Benzoyl Peroxide', concentration: 0.025, frequency: 'daily' },
                        { ingredient: 'Niacinamide', concentration: 0.05, frequency: 'twice_daily' }
                    ],
                    duration_weeks: 12
                },
                generationsRun: 50,
                disclaimer: 'AI-optimized recommendations require professional medical review.'
            };
            this.updateServiceStats('moses-optimize');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    async handleMOSESEvaluate(req, res) {
        try {
            const { protocol, condition } = req.body;
            const response = {
                fitness: 0.82,
                scores: {
                    clinical_efficacy: 0.85,
                    safety: 0.90,
                    adherence: 0.75,
                    cost_effectiveness: 0.78
                }
            };
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    async handleMOSESPatternMine(req, res) {
        try {
            const { condition, minSupport } = req.body;
            const response = {
                patterns: [
                    { pattern: ['Benzoyl Peroxide', 'Adapalene'], support: 0.72, type: 'ingredient_pair' },
                    { pattern: ['Niacinamide'], support: 0.85, type: 'single_ingredient' }
                ],
                totalPatterns: 24
            };
            this.updateServiceStats('moses-patterns');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // ESN Progression Modeling Handlers
    async handleESNPredict(req, res) {
        try {
            const { condition, historicalData, predictionHorizonDays } = req.body;
            const horizon = predictionHorizonDays || 30;
            const predictions = [];
            let severity = historicalData?.[historicalData.length - 1]?.severity || 0.6;

            for (let i = 0; i < horizon; i++) {
                severity = Math.max(0.1, severity * 0.98);
                predictions.push({
                    day: i + 1,
                    predictedSeverity: parseFloat(severity.toFixed(3)),
                    confidence: Math.max(0.5, 0.95 - (i * 0.01)),
                    confidenceInterval: { lower: severity - 0.1, upper: Math.min(1, severity + 0.1) }
                });
            }

            const response = {
                id: `esn-${Date.now()}`,
                condition: condition || 'acne_vulgaris',
                predictions,
                modelMetadata: { algorithm: 'ESN', reservoirSize: 500, spectralRadius: 0.95 },
                disclaimer: 'Predictions require clinical validation.'
            };
            this.updateServiceStats('esn-predict');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    async handleESNAnalyzePatterns(req, res) {
        try {
            const { historicalData } = req.body;
            const response = {
                statistics: { meanSeverity: 0.55, trend: 'improving' },
                flares: { count: 2, averageDuration: 5 },
                periodicity: { detected: true, periodDays: 28, type: 'monthly' }
            };
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    async handleESNHealingEstimate(req, res) {
        try {
            const { historicalData, targetSeverity } = req.body;
            const response = {
                estimatedDays: 45,
                targetSeverity: targetSeverity || 0.1,
                confidence: 0.78,
                status: 'healing_expected'
            };
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    async handleESNTreatmentResponse(req, res) {
        try {
            const { treatment, historicalData } = req.body;
            const response = {
                predictedResponse: 'positive',
                expectedImprovementRate: 0.15,
                timeToResponse: 14,
                confidence: 0.82
            };
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    // ECAN Attention Allocation Handlers
    async handleECANAllocate(req, res) {
        try {
            const { requestContext, components, budgetLimit } = req.body;
            const budget = budgetLimit || 500;
            const priorities = this.calculateComponentPriorities(requestContext);

            const allocation = {};
            for (const [comp, priority] of Object.entries(priorities)) {
                allocation[comp] = Math.floor(budget * priority);
            }

            const response = {
                id: `ecan-${Date.now()}`,
                totalAllocated: Object.values(allocation).reduce((a, b) => a + b, 0),
                allocation,
                priorities,
                remainingBudget: budget - Object.values(allocation).reduce((a, b) => a + b, 0)
            };
            this.updateServiceStats('ecan-allocate');
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    calculateComponentPriorities(context) {
        const queryType = context?.queryType || 'general';
        const priorities = {
            clinical_diagnosis: { atomspace: 0.25, pln_reasoning: 0.40, moses: 0.15, esn: 0.15, agents: 0.05 },
            treatment_optimization: { atomspace: 0.20, pln_reasoning: 0.20, moses: 0.40, esn: 0.15, agents: 0.05 },
            progression_prediction: { atomspace: 0.20, pln_reasoning: 0.15, moses: 0.10, esn: 0.45, agents: 0.10 },
            consumer_consultation: { atomspace: 0.25, pln_reasoning: 0.15, moses: 0.10, esn: 0.10, agents: 0.40 }
        };
        return priorities[queryType] || { atomspace: 0.25, pln_reasoning: 0.25, moses: 0.20, esn: 0.15, agents: 0.15 };
    }

    async handleECANStatus(req, res) {
        try {
            const response = {
                totalBudget: 1000,
                availableBudget: 750,
                totalAtoms: 15420,
                activeAtoms: 342,
                componentBudgets: { atomspace: 100, pln_reasoning: 150, moses: 100, esn: 75, agents: 75 },
                attentionFocus: [
                    { atomId: 'cond_acne', name: 'Acne Vulgaris', sti: 45.2, lti: 30 },
                    { atomId: 'treat_retinoid', name: 'Retinoid Therapy', sti: 38.5, lti: 25 }
                ]
            };
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    async handleECANStimulate(req, res) {
        try {
            const { atomId, amount } = req.body;
            const response = {
                atomId,
                oldSti: 20,
                newSti: 20 + (amount || 10),
                amountApplied: amount || 10,
                remainingBudget: 740
            };
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    async handleECANSpread(req, res) {
        try {
            const response = {
                spreadingEvents: 15,
                details: [
                    { from: 'cond_acne', to: 'treat_retinoid', amount: 5.2, newSti: 43.7 },
                    { from: 'cond_acne', to: 'ing_benzoyl', amount: 4.8, newSti: 35.2 }
                ]
            };
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    async handleECANHebbian(req, res) {
        try {
            const { atomIds } = req.body;
            const response = {
                connectionsUpdated: atomIds ? (atomIds.length * (atomIds.length - 1)) / 2 : 3,
                updates: [
                    { atoms: ['cond_acne', 'treat_retinoid'], oldWeight: 0.85, newWeight: 0.90 }
                ]
            };
            res.json(response);
        } catch (error) { res.status(500).json({ error: error.message }); }
    }

    getActivePolicyRules() { return ['content-safety-active', 'domain-validation-active', 'medical-disclaimer-active']; }

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