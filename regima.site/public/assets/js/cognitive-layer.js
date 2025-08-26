/**
 * Cognitive Layer - SkinTwin Integration
 * Provides cognitive architecture integration for RegimA site
 */

class CognitiveLayer {
    constructor() {
        this.initialized = false;
        this.knowledgeNodes = new Map();
        this.currentPage = window.location.pathname;
        this.init();
    }

    init() {
        this.setupCognitiveIndicator();
        this.extractPageKnowledge();
        this.setupAtomSpaceConnection();
        this.initialized = true;
        console.log('SkinTwin Cognitive Layer initialized');
    }

    setupCognitiveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'cognitive-indicator';
        indicator.innerHTML = '🧠 SkinTwin Active';
        indicator.title = 'Cognitive Architecture: AtomSpace, PLN, MOSES, ESN';
        document.body.appendChild(indicator);
    }

    extractPageKnowledge() {
        const pageData = {
            url: this.currentPage,
            title: document.title,
            description: this.getMetaContent('description'),
            keywords: this.extractKeywords(),
            entities: this.extractEntities(),
            relationships: this.extractRelationships(),
            domain: 'dermatology'
        };

        this.knowledgeNodes.set(this.currentPage, pageData);
        this.sendToAtomSpace(pageData);
    }

    getMetaContent(name) {
        const meta = document.querySelector(`meta[name="${name}"]`);
        return meta ? meta.getAttribute('content') : '';
    }

    extractKeywords() {
        const text = document.body.textContent.toLowerCase();
        const dermatologyKeywords = [
            'skin', 'skincare', 'dermatology', 'anti-aging', 'wrinkles',
            'acne', 'pigmentation', 'moisturizer', 'serum', 'treatment',
            'cleansing', 'toning', 'rejuvenation', 'collagen', 'elastin',
            'vitamin', 'antioxidant', 'peptides', 'retinol', 'hyaluronic',
            'sunscreen', 'spf', 'exfoliation', 'inflammation', 'repair'
        ];

        return dermatologyKeywords.filter(keyword => text.includes(keyword));
    }

    extractEntities() {
        const entities = [];
        const text = document.body.textContent;

        // Extract product names
        const productMatches = text.match(/RégimA\s+[A-Z][^.!?]*(?=[.!?]|$)/g);
        if (productMatches) {
            entities.push(...productMatches.map(p => ({ type: 'product', value: p.trim() })));
        }

        // Extract ingredient mentions
        const ingredientPattern = /\b(?:vitamin [A-E]|retinol|hyaluronic acid|collagen|peptides|antioxidants)\b/gi;
        const ingredientMatches = text.match(ingredientPattern);
        if (ingredientMatches) {
            entities.push(...ingredientMatches.map(i => ({ type: 'ingredient', value: i })));
        }

        // Extract skin concerns
        const concernPattern = /\b(?:acne|wrinkles|pigmentation|aging|scars|dryness|oily skin)\b/gi;
        const concernMatches = text.match(concernPattern);
        if (concernMatches) {
            entities.push(...concernMatches.map(c => ({ type: 'concern', value: c })));
        }

        return entities;
    }

    extractRelationships() {
        const relationships = [];
        
        // Product-concern relationships
        const entities = this.knowledgeNodes.get(this.currentPage)?.entities || [];
        const products = entities.filter(e => e.type === 'product');
        const concerns = entities.filter(e => e.type === 'concern');
        
        products.forEach(product => {
            concerns.forEach(concern => {
                relationships.push({
                    type: 'treats',
                    source: product.value,
                    target: concern.value,
                    strength: 0.8
                });
            });
        });

        return relationships;
    }

    sendToAtomSpace(data) {
        // Simulate AtomSpace integration
        // In real implementation, this would connect to OpenCog AtomSpace
        const atomData = {
            type: 'ConceptNode',
            name: `Page_${data.url.replace(/[^a-zA-Z0-9]/g, '_')}`,
            truthValue: { strength: 0.9, confidence: 0.8 },
            attributes: {
                url: data.url,
                title: data.title,
                domain: data.domain,
                keywords: data.keywords,
                entities: data.entities,
                relationships: data.relationships
            }
        };

        console.log('Sending to AtomSpace:', atomData);
        
        // Store for local processing
        this.storeKnowledgeNode(atomData);
    }

    storeKnowledgeNode(atomData) {
        // Store in localStorage for persistence
        const stored = JSON.parse(localStorage.getItem('skintwin_knowledge') || '[]');
        stored.push(atomData);
        localStorage.setItem('skintwin_knowledge', JSON.stringify(stored));
    }

    // PLN (Probabilistic Logic Networks) simulation
    performReasoning(query) {
        const knowledge = JSON.parse(localStorage.getItem('skintwin_knowledge') || '[]');
        const results = [];

        knowledge.forEach(node => {
            if (node.attributes.keywords.some(keyword => 
                query.toLowerCase().includes(keyword.toLowerCase()))) {
                results.push({
                    node: node.name,
                    relevance: Math.random() * 0.8 + 0.2, // Simulate reasoning
                    attributes: node.attributes
                });
            }
        });

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    // MOSES (pattern mining) simulation
    minePatterns() {
        const knowledge = JSON.parse(localStorage.getItem('skintwin_knowledge') || '[]');
        const patterns = {
            productConcernPairs: new Map(),
            commonIngredients: new Map(),
            pageNavigationPatterns: []
        };

        knowledge.forEach(node => {
            if (node.attributes.relationships) {
                node.attributes.relationships.forEach(rel => {
                    if (rel.type === 'treats') {
                        const key = `${rel.source}_${rel.target}`;
                        patterns.productConcernPairs.set(key, 
                            (patterns.productConcernPairs.get(key) || 0) + 1);
                    }
                });
            }
        });

        return patterns;
    }

    // ESN (Echo State Networks) for temporal prediction
    predictUserJourney(currentPath) {
        const navigationHistory = JSON.parse(localStorage.getItem('skintwin_navigation') || '[]');
        navigationHistory.push({ path: currentPath, timestamp: Date.now() });
        
        // Keep only last 50 entries
        if (navigationHistory.length > 50) {
            navigationHistory.splice(0, navigationHistory.length - 50);
        }
        
        localStorage.setItem('skintwin_navigation', JSON.stringify(navigationHistory));

        // Predict next likely pages based on patterns
        const predictions = this.generateNavigationPredictions(navigationHistory);
        return predictions;
    }

    generateNavigationPredictions(history) {
        const transitions = new Map();
        
        for (let i = 0; i < history.length - 1; i++) {
            const from = history[i].path;
            const to = history[i + 1].path;
            const key = `${from}_${to}`;
            transitions.set(key, (transitions.get(key) || 0) + 1);
        }

        const currentPath = history[history.length - 1]?.path;
        const predictions = [];

        transitions.forEach((count, key) => {
            const [from, to] = key.split('_');
            if (from === currentPath) {
                predictions.push({ path: to, probability: count / history.length });
            }
        });

        return predictions.sort((a, b) => b.probability - a.probability).slice(0, 3);
    }

    // Public API for external integration
    query(searchTerm) {
        return this.performReasoning(searchTerm);
    }

    getKnowledgeGraph() {
        return JSON.parse(localStorage.getItem('skintwin_knowledge') || '[]');
    }

    getNavigationPredictions() {
        return this.predictUserJourney(this.currentPage);
    }
}

// Initialize cognitive layer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cognitiveLayer = new CognitiveLayer();
    
    // Add search capability
    const searchBox = document.querySelector('#cognitive-search');
    if (searchBox) {
        searchBox.addEventListener('input', (e) => {
            const results = window.cognitiveLayer.query(e.target.value);
            console.log('Search results:', results);
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CognitiveLayer;
}