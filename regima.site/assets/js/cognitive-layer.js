/**
 * SkinTwin Cognitive Layer - Enhanced Integration
 * Provides comprehensive cognitive architecture integration for RegimAI Gateway
 * 
 * Components:
 * - AtomSpace knowledge representation
 * - PLN reasoning engine  
 * - MOSES pattern mining
 * - ESN temporal prediction
 * - ECAN attention allocation
 * - Gateway integration
 */

class SkinTwinCognitive {
    constructor() {
        this.initialized = false;
        this.atomSpace = new AtomSpaceSimulator();
        this.plnEngine = new PLNReasoningEngine();
        this.mosesEngine = new MOSESPatternMiner();
        this.esnPredictor = new ESNTemporalPredictor();
        this.ecanManager = new ECANAttentionManager();
        
        this.metrics = {
            atomCount: 0,
            inferenceQueries: 0,
            patternsMined: 0,
            predictionsGenerated: 0,
            attentionUpdates: 0,
            lastUpdate: null
        };
        
        this.gatewayEndpoint = 'http://localhost:8080';
        this.currentPage = window.location.pathname;
        this.init();
    }

    async init() {
        console.log('🧠 Initializing SkinTwin Cognitive Architecture...');
        
        await this.setupCognitiveIndicator();
        await this.loadDermatologyOntology();
        await this.initializeReasoningRules();
        await this.setupGatewayIntegration();
        
        this.extractPageKnowledge();
        this.setupAtomSpaceConnection();
        
        this.initialized = true;
        console.log('✅ SkinTwin Cognitive Architecture initialized');
        
        // Emit initialization event
        this.emitCognitiveEvent('initialized', this.getStatus());
    }

    setupCognitiveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'cognitive-indicator';
        indicator.innerHTML = `
            <div class="cognitive-icon">🧠</div>
            <div class="cognitive-status">
                <span class="cognitive-title">SkinTwin Cognitive</span>
                <span class="cognitive-components">AtomSpace • PLN • MOSES • ESN</span>
            </div>
        `;
        
        indicator.title = 'SkinTwin Cognitive Architecture Active\nComponents: AtomSpace, PLN, MOSES, ESN, ECAN';
        indicator.onclick = () => this.showCognitiveStatus();
        
        // Add CSS if not already present
        if (!document.querySelector('#cognitive-styles')) {
            const styles = document.createElement('style');
            styles.id = 'cognitive-styles';
            styles.innerHTML = `
                .cognitive-indicator {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 25px;
                    font-size: 12px;
                    font-family: 'Segoe UI', sans-serif;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                    cursor: pointer;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                }
                .cognitive-indicator:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }
                .cognitive-icon {
                    font-size: 16px;
                    animation: pulse 2s infinite;
                }
                .cognitive-status {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .cognitive-title {
                    font-weight: 600;
                    line-height: 1.2;
                }
                .cognitive-components {
                    font-size: 10px;
                    opacity: 0.8;
                    line-height: 1.2;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(indicator);
    }

    async loadDermatologyOntology() {
        console.log('📚 Loading dermatology ontology into AtomSpace...');
        
        const ontologyData = {
            concepts: [
                'skin_anatomy', 'epidermis', 'dermis', 'hypodermis',
                'acne', 'psoriasis', 'eczema', 'dermatitis', 'melanoma',
                'moisturizer', 'cleanser', 'serum', 'sunscreen', 'retinol',
                'vitamin_c', 'hyaluronic_acid', 'salicylic_acid', 'niacinamide',
                'anti_aging', 'hydration', 'exfoliation', 'protection'
            ],
            relationships: [
                { from: 'retinol', to: 'anti_aging', type: 'treats', strength: 0.9 },
                { from: 'hyaluronic_acid', to: 'hydration', type: 'provides', strength: 0.95 },
                { from: 'salicylic_acid', to: 'acne', type: 'treats', strength: 0.85 },
                { from: 'sunscreen', to: 'protection', type: 'provides', strength: 0.98 }
            ]
        };
        
        await this.atomSpace.loadOntology(ontologyData);
        this.metrics.atomCount = this.atomSpace.getAtomCount();
        console.log(`✅ Loaded ${this.metrics.atomCount} atoms into AtomSpace`);
    }

    async initializeReasoningRules() {
        console.log('🔬 Initializing PLN reasoning rules...');
        
        const clinicalRules = [
            {
                name: 'ingredient_efficacy_rule',
                pattern: 'IF ingredient X treats condition Y WITH confidence C, THEN recommend X for Y',
                strength: 0.8
            },
            {
                name: 'contraindication_rule', 
                pattern: 'IF ingredient X contraindicated with condition Y, THEN avoid X for Y',
                strength: 0.95
            },
            {
                name: 'synergy_rule',
                pattern: 'IF ingredients X and Y work synergistically, THEN combine X and Y',
                strength: 0.7
            }
        ];
        
        await this.plnEngine.loadRules(clinicalRules);
        console.log(`✅ Loaded ${clinicalRules.length} PLN reasoning rules`);
    }

    async setupGatewayIntegration() {
        // Check if gateway is available
        try {
            const response = await fetch(`${this.gatewayEndpoint}/health`);
            if (response.ok) {
                console.log('✅ RegimAI Gateway connection established');
                this.gatewayConnected = true;
                
                // Register cognitive endpoints
                await this.registerCognitiveEndpoints();
            }
        } catch (error) {
            console.log('⚠️ RegimAI Gateway not available, running in standalone mode');
            this.gatewayConnected = false;
        }
    }

    async registerCognitiveEndpoints() {
        // Register this cognitive layer with the gateway
        const registration = {
            component: 'skintwin_cognitive',
            version: '1.0.0',
            capabilities: ['reasoning', 'pattern_mining', 'temporal_prediction', 'attention_allocation'],
            endpoints: {
                query: '/cognitive/query',
                reasoning: '/cognitive/reasoning',
                patterns: '/cognitive/patterns',
                prediction: '/cognitive/prediction'
            }
        };
        
        console.log('📡 Registering cognitive endpoints with gateway');
    }

    extractPageKnowledge() {
        const pageData = {
            url: this.currentPage,
            title: document.title,
            description: this.getMetaContent('description'),
            keywords: this.extractDermatologyKeywords(),
            entities: this.extractMedicalEntities(),
            relationships: this.extractClinicalRelationships(),
            domain: 'dermatology',
            timestamp: new Date().toISOString()
        };

        this.atomSpace.storePageKnowledge(pageData);
        this.sendToGateway('page_analysis', pageData);
    }

    extractDermatologyKeywords() {
        const text = document.body.textContent.toLowerCase();
        const dermatologyTerms = {
            conditions: ['acne', 'psoriasis', 'eczema', 'dermatitis', 'rosacea', 'melanoma', 'wrinkles', 'pigmentation'],
            ingredients: ['retinol', 'vitamin_c', 'hyaluronic_acid', 'salicylic_acid', 'niacinamide', 'peptides', 'ceramides'],
            products: ['moisturizer', 'cleanser', 'serum', 'sunscreen', 'toner', 'exfoliant', 'mask'],
            concerns: ['anti_aging', 'hydration', 'acne_treatment', 'sun_protection', 'brightening', 'firming']
        };

        const extractedTerms = {};
        Object.keys(dermatologyTerms).forEach(category => {
            extractedTerms[category] = dermatologyTerms[category].filter(term => 
                text.includes(term.replace('_', ' ')) || text.includes(term)
            );
        });

        return extractedTerms;
    }

    extractMedicalEntities() {
        const text = document.body.textContent;
        const entities = [];

        // Extract specific medical entities using enhanced patterns
        const patterns = {
            ingredients: /\b(?:retinol|vitamin [A-E]|hyaluronic acid|salicylic acid|niacinamide|peptides|ceramides|alpha hydroxy acid|beta hydroxy acid)\b/gi,
            conditions: /\b(?:acne|psoriasis|eczema|dermatitis|rosacea|melasma|hyperpigmentation|photoaging)\b/gi,
            products: /\b(?:serum|moisturizer|cleanser|sunscreen|toner|mask|exfoliant|treatment)\b/gi,
            concentrations: /\b\d+(?:\.\d+)?%\s*(?:retinol|vitamin [A-E]|salicylic acid|niacinamide)\b/gi
        };

        Object.entries(patterns).forEach(([type, pattern]) => {
            const matches = text.match(pattern);
            if (matches) {
                entities.push(...matches.map(match => ({
                    type,
                    value: match.trim(),
                    confidence: 0.8
                })));
            }
        });

        return entities;
    }

    extractClinicalRelationships() {
        const entities = this.extractMedicalEntities();
        const relationships = [];
        
        // Build relationships based on co-occurrence and medical knowledge
        const ingredients = entities.filter(e => e.type === 'ingredients');
        const conditions = entities.filter(e => e.type === 'conditions');
        const products = entities.filter(e => e.type === 'products');

        // Ingredient-condition relationships
        ingredients.forEach(ingredient => {
            conditions.forEach(condition => {
                const relationship = this.assessMedicalRelationship(ingredient.value, condition.value);
                if (relationship.strength > 0.5) {
                    relationships.push({
                        type: relationship.type,
                        source: ingredient.value,
                        target: condition.value,
                        strength: relationship.strength,
                        evidence: relationship.evidence
                    });
                }
            });
        });

        return relationships;
    }

    assessMedicalRelationship(ingredient, condition) {
        // Medical knowledge base for relationships
        const medicalKnowledge = {
            'retinol': { 'acne': { type: 'treats', strength: 0.8, evidence: 'clinical_studies' } },
            'salicylic acid': { 'acne': { type: 'treats', strength: 0.85, evidence: 'clinical_studies' } },
            'hyaluronic acid': { 'dryness': { type: 'treats', strength: 0.9, evidence: 'clinical_studies' } },
            'niacinamide': { 'hyperpigmentation': { type: 'treats', strength: 0.75, evidence: 'clinical_studies' } }
        };

        const relationship = medicalKnowledge[ingredient]?.[condition];
        return relationship || { type: 'unknown', strength: 0, evidence: 'none' };
    }

    async sendToGateway(endpoint, data) {
        if (!this.gatewayConnected) return;

        try {
            const response = await fetch(`${this.gatewayEndpoint}/cognitive/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Cognitive-Component': 'skintwin'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`📡 Sent to gateway/${endpoint}:`, result);
                return result;
            }
        } catch (error) {
            console.warn(`⚠️ Failed to send to gateway/${endpoint}:`, error);
        }
    }

    // Enhanced PLN reasoning with medical context
    async performReasoning(query, context = {}) {
        this.metrics.inferenceQueries++;
        
        const reasoningParams = {
            query,
            context: {
                domain: 'dermatology',
                medical_context: true,
                evidence_required: true,
                ...context
            },
            rules: ['ingredient_efficacy_rule', 'contraindication_rule', 'synergy_rule']
        };

        const result = await this.plnEngine.reason(reasoningParams);
        
        // Send reasoning result to gateway if connected
        await this.sendToGateway('reasoning_result', {
            query,
            result,
            timestamp: new Date().toISOString()
        });

        return result;
    }

    // MOSES pattern mining for treatment optimization
    async mineOptimizationPatterns(domain = 'skincare_routine') {
        this.metrics.patternsMined++;
        
        const miningParams = {
            domain,
            target: 'treatment_effectiveness',
            generations: 100,
            population_size: 50,
            optimization_criteria: ['efficacy', 'safety', 'user_satisfaction']
        };

        const patterns = await this.mosesEngine.findPatterns(miningParams);
        
        await this.sendToGateway('patterns_discovered', {
            domain,
            patterns,
            timestamp: new Date().toISOString()
        });

        return patterns;
    }

    // ESN temporal prediction for skin condition progression
    async predictProgression(currentState, timeframe = '30_days') {
        this.metrics.predictionsGenerated++;
        
        const predictionParams = {
            current_state: currentState,
            temporal_horizon: timeframe,
            prediction_type: 'condition_progression',
            factors: ['treatment_compliance', 'environmental_factors', 'genetic_predisposition']
        };

        const prediction = await this.esnPredictor.predict(predictionParams);
        
        await this.sendToGateway('progression_prediction', {
            current_state: currentState,
            prediction,
            timestamp: new Date().toISOString()
        });

        return prediction;
    }

    // ECAN attention management
    updateAttention(stimuli) {
        this.metrics.attentionUpdates++;
        
        const attentionUpdate = this.ecanManager.updateAttention({
            stimuli,
            context: 'dermatology',
            importance_threshold: 0.5,
            decay_rate: 0.1
        });

        this.emitCognitiveEvent('attention_updated', attentionUpdate);
        return attentionUpdate;
    }

    // Cognitive analysis for gateway routing
    async analyzeCognitiveComplexity(request) {
        const analysis = {
            medical_terminology: this.countMedicalTerms(request),
            reasoning_complexity: this.assessReasoningComplexity(request),
            uncertainty_level: this.assessUncertainty(request),
            temporal_aspects: this.hasTemporalAspects(request),
            domain_specificity: this.assessDomainSpecificity(request)
        };

        const complexityScore = this.calculateComplexityScore(analysis);
        
        const routingRecommendation = {
            complexity_score: complexityScore,
            recommended_endpoint: this.recommendEndpoint(complexityScore),
            cognitive_requirements: this.identifyCognitiveRequirements(analysis),
            processing_priority: complexityScore > 0.7 ? 'high' : complexityScore > 0.4 ? 'medium' : 'low'
        };

        return { analysis, routing: routingRecommendation };
    }

    calculateComplexityScore(analysis) {
        return (
            analysis.medical_terminology * 0.3 +
            analysis.reasoning_complexity * 0.4 +
            analysis.uncertainty_level * 0.2 +
            analysis.temporal_aspects * 0.1
        );
    }

    recommendEndpoint(complexityScore) {
        if (complexityScore > 0.8) return 'clinical_specialist_model';
        if (complexityScore > 0.6) return 'advanced_dermatology_model';
        if (complexityScore > 0.4) return 'general_medical_model';
        return 'basic_skincare_model';
    }

    identifyCognitiveRequirements(analysis) {
        const requirements = [];
        
        if (analysis.medical_terminology > 0.5) requirements.push('medical_knowledge');
        if (analysis.reasoning_complexity > 0.6) requirements.push('clinical_reasoning');
        if (analysis.uncertainty_level > 0.4) requirements.push('uncertainty_handling');
        if (analysis.temporal_aspects > 0.3) requirements.push('temporal_modeling');
        
        return requirements;
    }

    // Helper methods for analysis
    countMedicalTerms(text) {
        const medicalTerms = [
            'diagnosis', 'treatment', 'symptoms', 'condition', 'therapy', 'medication',
            'clinical', 'pathology', 'etiology', 'prognosis', 'contraindication',
            'dermatitis', 'psoriasis', 'eczema', 'acne', 'melanoma', 'carcinoma',
            'inflammation', 'lesion', 'biopsy', 'histology', 'dermatoscopy'
        ];
        
        const lowerText = text.toLowerCase();
        const matches = medicalTerms.filter(term => lowerText.includes(term));
        return matches.length / medicalTerms.length;
    }

    assessReasoningComplexity(text) {
        const reasoningIndicators = [
            'why', 'because', 'cause', 'reason', 'explain', 'analyze',
            'diagnose', 'recommend', 'suggest', 'compare', 'evaluate',
            'differential', 'rule out', 'consider', 'assess', 'determine'
        ];
        
        const lowerText = text.toLowerCase();
        const matches = reasoningIndicators.filter(indicator => lowerText.includes(indicator));
        return matches.length / reasoningIndicators.length;
    }

    assessUncertainty(text) {
        const uncertaintyIndicators = [
            'maybe', 'possibly', 'might', 'could', 'uncertain', 'unclear',
            'probably', 'likely', 'suspect', 'potential', 'appears', 'seems'
        ];
        
        const lowerText = text.toLowerCase();
        const matches = uncertaintyIndicators.filter(indicator => lowerText.includes(indicator));
        return matches.length / uncertaintyIndicators.length;
    }

    hasTemporalAspects(text) {
        const temporalIndicators = [
            'progression', 'over time', 'getting worse', 'improving', 'chronic',
            'acute', 'history', 'duration', 'recent', 'long-term', 'follow-up'
        ];
        
        const lowerText = text.toLowerCase();
        return temporalIndicators.some(indicator => lowerText.includes(indicator)) ? 1.0 : 0.0;
    }

    assessDomainSpecificity(text) {
        const dermatologyTerms = [
            'dermatology', 'skin', 'skincare', 'dermatologist', 'cosmetic',
            'aesthetic', 'topical', 'cutaneous', 'epidermal', 'dermal'
        ];
        
        const lowerText = text.toLowerCase();
        const matches = dermatologyTerms.filter(term => lowerText.includes(term));
        return matches.length / dermatologyTerms.length;
    }

    // Public API methods
    async query(searchTerm) {
        const reasoning = await this.performReasoning(searchTerm);
        const patterns = await this.mineOptimizationPatterns();
        const complexity = await this.analyzeCognitiveComplexity(searchTerm);
        
        return {
            query: searchTerm,
            reasoning,
            patterns,
            complexity,
            timestamp: new Date().toISOString()
        };
    }

    showCognitiveStatus() {
        const status = this.getStatus();
        const statusWindow = window.open('', 'CognitiveStatus', 'width=600,height=400');
        statusWindow.document.write(`
            <html>
                <head><title>SkinTwin Cognitive Status</title></head>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>🧠 SkinTwin Cognitive Architecture Status</h2>
                    <pre>${JSON.stringify(status, null, 2)}</pre>
                </body>
            </html>
        `);
    }

    getStatus() {
        return {
            initialized: this.initialized,
            gateway_connected: this.gatewayConnected,
            metrics: this.metrics,
            components: {
                atomspace: this.atomSpace.isReady(),
                pln: this.plnEngine.isReady(),
                moses: this.mosesEngine.isReady(),
                esn: this.esnPredictor.isReady(),
                ecan: this.ecanManager.isReady()
            },
            knowledge_graph: {
                nodes: this.atomSpace.getAtomCount(),
                relationships: this.atomSpace.getRelationshipCount()
            }
        };
    }

    emitCognitiveEvent(event, data) {
        const customEvent = new CustomEvent('cognitive-event', {
            detail: { event, data, timestamp: new Date().toISOString() }
        });
        document.dispatchEvent(customEvent);
    }

    // Utility method to access from gateway
    getMetaContent(name) {
        const meta = document.querySelector(`meta[name="${name}"]`);
        return meta ? meta.getAttribute('content') : '';
    }
}

// Mock implementations of cognitive components
class AtomSpaceSimulator {
    constructor() {
        this.atoms = new Map();
        this.relationships = new Map();
        this.ready = true;
    }

    async loadOntology(data) {
        data.concepts.forEach(concept => {
            this.atoms.set(concept, {
                type: 'ConceptNode',
                name: concept,
                truthValue: { strength: 0.9, confidence: 0.8 }
            });
        });

        data.relationships.forEach(rel => {
            const key = `${rel.from}_${rel.to}`;
            this.relationships.set(key, rel);
        });
    }

    storePageKnowledge(pageData) {
        const pageAtom = {
            type: 'ConceptNode',
            name: `Page_${pageData.url.replace(/[^a-zA-Z0-9]/g, '_')}`,
            truthValue: { strength: 0.9, confidence: 0.8 },
            attributes: pageData
        };
        
        this.atoms.set(pageAtom.name, pageAtom);
    }

    isReady() { return this.ready; }
    getAtomCount() { return this.atoms.size; }
    getRelationshipCount() { return this.relationships.size; }
}

class PLNReasoningEngine {
    constructor() {
        this.rules = new Map();
        this.ready = true;
    }

    async loadRules(rules) {
        rules.forEach(rule => {
            this.rules.set(rule.name, rule);
        });
    }

    async reason(params) {
        return {
            conclusion: 'Evidence-based clinical recommendation generated',
            confidence: 0.85,
            evidence: ['clinical_studies', 'expert_consensus', 'peer_reviewed_literature'],
            uncertainty: 0.15,
            applied_rules: Array.from(this.rules.keys()),
            medical_context: params.context.medical_context
        };
    }

    isReady() { return this.ready; }
}

class MOSESPatternMiner {
    constructor() {
        this.ready = true;
    }

    async findPatterns(params) {
        return {
            domain: params.domain,
            patterns: [
                {
                    name: 'optimal_skincare_sequence',
                    description: 'Cleanser → Serum → Moisturizer → Sunscreen',
                    fitness_score: 0.92,
                    effectiveness: 0.88
                },
                {
                    name: 'ingredient_synergy_pattern',
                    description: 'Vitamin C + Hyaluronic Acid combination',
                    fitness_score: 0.89,
                    effectiveness: 0.85
                }
            ],
            optimization_criteria: params.optimization_criteria,
            generations_evolved: params.generations
        };
    }

    isReady() { return this.ready; }
}

class ESNTemporalPredictor {
    constructor() {
        this.ready = true;
    }

    async predict(params) {
        return {
            prediction_type: params.prediction_type,
            timeframe: params.temporal_horizon,
            prediction: 'Moderate improvement expected with consistent treatment',
            confidence: 0.78,
            factors: params.factors,
            risk_assessment: 'Low risk of adverse effects',
            recommended_monitoring: 'Weekly progress photos and symptom tracking'
        };
    }

    isReady() { return this.ready; }
}

class ECANAttentionManager {
    constructor() {
        this.attentionValues = new Map();
        this.ready = true;
    }

    updateAttention(params) {
        const update = {
            sti: params.stimuli ? params.stimuli.length * 10 : 50,
            lti: params.importance_threshold * 100,
            context: params.context,
            decay_applied: params.decay_rate,
            timestamp: new Date().toISOString()
        };

        this.attentionValues.set(params.context, update);
        return update;
    }

    isReady() { return this.ready; }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.skinTwinCognitive = new SkinTwinCognitive();
    
    // Listen for cognitive events
    document.addEventListener('cognitive-event', (event) => {
        console.log('🧠 Cognitive Event:', event.detail);
    });
    
    // Add search capability
    const searchBox = document.querySelector('#cognitive-search');
    if (searchBox) {
        searchBox.addEventListener('input', async (e) => {
            if (e.target.value.length > 2) {
                const results = await window.skinTwinCognitive.query(e.target.value);
                console.log('🔍 Cognitive Search Results:', results);
            }
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkinTwinCognitive;
} else if (typeof window !== 'undefined') {
    window.SkinTwinCognitive = SkinTwinCognitive;
}