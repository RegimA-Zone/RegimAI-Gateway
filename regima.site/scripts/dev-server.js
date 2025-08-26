#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs-extra');

class DevServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.publicDir = path.join(__dirname, '..', 'public');
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupCognitiveAPI();
    }

    setupMiddleware() {
        // Serve static files
        this.app.use(express.static(this.publicDir));
        
        // Parse JSON bodies
        this.app.use(express.json());
        
        // CORS for cognitive API
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
    }

    setupRoutes() {
        // SPA fallback for client-side routing
        this.app.get('*', (req, res, next) => {
            const filePath = path.join(this.publicDir, req.path);
            
            // Check if file exists
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                return next();
            }
            
            // Check for directory with index.html
            const indexPath = path.join(filePath, 'index.html');
            if (fs.existsSync(indexPath)) {
                return res.sendFile(indexPath);
            }
            
            // Fallback to main index for SPA
            res.sendFile(path.join(this.publicDir, 'index.html'));
        });
    }

    setupCognitiveAPI() {
        // Cognitive API endpoints
        this.app.get('/cognitive/api/knowledge', (req, res) => {
            try {
                const knowledgeIndex = fs.readJsonSync(path.join(this.publicDir, 'cognitive', 'index.json'));
                res.json(knowledgeIndex);
            } catch (error) {
                res.status(500).json({ error: 'Failed to load knowledge index' });
            }
        });

        this.app.post('/cognitive/api/recommend', (req, res) => {
            const { skinType, concerns, age, routine } = req.body;
            
            // Simulate cognitive recommendation system
            const recommendations = this.generateRecommendations(skinType, concerns, age, routine);
            
            res.json({
                success: true,
                recommendations,
                confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
                reasoning: this.generateReasoning(skinType, concerns, age)
            });
        });

        this.app.get('/cognitive/api/search', (req, res) => {
            const { query } = req.query;
            
            if (!query) {
                return res.status(400).json({ error: 'Query parameter required' });
            }
            
            const results = this.performCognitiveSearch(query);
            res.json({ results, query });
        });

        this.app.post('/cognitive/api/analyze', (req, res) => {
            const { userData, interactions } = req.body;
            
            const analysis = this.performUserAnalysis(userData, interactions);
            res.json(analysis);
        });
    }

    generateRecommendations(skinType, concerns, age, routine) {
        const productDatabase = {
            'dry': ['Daily Ultra Defence', 'ON Q Quenching Facial Oil', 'Derma Deep Rich Creamy Cleanser'],
            'oily': ['Daily Intelligent Sebum-Solver', 'Problem Skin Range', 'Daily Ultra Defence'],
            'combination': ['Sensorial Daily Protector', 'Daily Radiant Boost', 'Derma Deep Rich Creamy Cleanser'],
            'sensitive': ['Sensorial Daily Protector', 'Derma Deep Rich Creamy Cleanser'],
            'normal': ['Daily Radiant Boost', 'Super Smoother', 'Daily Ultra Defence']
        };

        const concernProducts = {
            'acne': ['Problem Skin Range', 'Daily Intelligent Sebum-Solver'],
            'anti-ageing': ['Super Smoother', 'ON Q Quenching Facial Oil', 'EPI-GENES Xpress'],
            'pigmentation': ['Zone Quantum Elast Collagen Revival', 'Daily Radiant Boost'],
            'hydration': ['ON Q Quenching Facial Oil', 'Daily Ultra Defence'],
            'sensitivity': ['Sensorial Daily Protector', 'Derma Deep Rich Creamy Cleanser']
        };

        let recommendations = [];
        
        // Add products based on skin type
        if (productDatabase[skinType]) {
            recommendations.push(...productDatabase[skinType]);
        }
        
        // Add products based on concerns
        if (Array.isArray(concerns)) {
            concerns.forEach(concern => {
                if (concernProducts[concern]) {
                    recommendations.push(...concernProducts[concern]);
                }
            });
        } else if (concernProducts[concerns]) {
            recommendations.push(...concernProducts[concerns]);
        }
        
        // Remove duplicates and limit results
        recommendations = [...new Set(recommendations)].slice(0, 5);
        
        return recommendations.map(product => ({
            name: product,
            category: this.getProductCategory(product),
            suitability: Math.random() * 0.3 + 0.7, // 70-100% suitability
            reason: this.getRecommendationReason(product, skinType, concerns)
        }));
    }

    getProductCategory(productName) {
        const categories = {
            'Daily Ultra Defence': 'day-preparations',
            'Daily Intelligent Sebum-Solver': 'day-preparations',
            'Sensorial Daily Protector': 'day-preparations',
            'Daily Radiant Boost': 'day-preparations',
            'Super Smoother': 'day-preparations',
            'ON Q Quenching Facial Oil': 'anti-ageing',
            'Derma Deep Rich Creamy Cleanser': 'cleansing-toning',
            'Problem Skin Range': 'problem-skin',
            'EPI-GENES Xpress': 'anti-ageing',
            'Zone Quantum Elast Collagen Revival': 'anti-ageing'
        };
        
        return categories[productName] || 'general';
    }

    getRecommendationReason(product, skinType, concerns) {
        const reasons = {
            'Daily Ultra Defence': 'Provides comprehensive protection suitable for all skin types',
            'Daily Intelligent Sebum-Solver': 'Specifically formulated to balance oil production',
            'Sensorial Daily Protector': 'Gentle formulation ideal for sensitive skin',
            'ON Q Quenching Facial Oil': 'Deep nourishment perfect for mature or dry skin',
            'Super Smoother': 'Advanced anti-ageing technology for visible results'
        };
        
        return reasons[product] || 'Recommended based on your profile';
    }

    generateReasoning(skinType, concerns, age) {
        return [
            `Based on your ${skinType} skin type, we've selected products that address your specific needs`,
            `Your primary concerns (${Array.isArray(concerns) ? concerns.join(', ') : concerns}) require targeted active ingredients`,
            `Age-appropriate formulations ensure optimal results for your skin maturity level`,
            `Products are sequenced for maximum synergy and efficacy`
        ];
    }

    performCognitiveSearch(query) {
        // Simulate knowledge graph search
        const knowledgeBase = [
            { type: 'product', name: 'Daily Ultra Defence', keywords: ['protection', 'spf', 'antioxidants', 'daily'] },
            { type: 'ingredient', name: 'Vitamin C', keywords: ['antioxidant', 'brightening', 'pigmentation'] },
            { type: 'concern', name: 'Acne', keywords: ['breakouts', 'oily', 'sebum', 'pores'] },
            { type: 'treatment', name: 'Anti-Ageing Protocol', keywords: ['wrinkles', 'fine lines', 'collagen'] }
        ];
        
        const queryLower = query.toLowerCase();
        
        return knowledgeBase.filter(item => 
            item.name.toLowerCase().includes(queryLower) ||
            item.keywords.some(keyword => keyword.toLowerCase().includes(queryLower))
        ).map(item => ({
            ...item,
            relevance: Math.random() * 0.4 + 0.6 // 60-100% relevance
        }));
    }

    performUserAnalysis(userData, interactions) {
        return {
            userProfile: {
                engagement: 'high',
                preferredContent: 'research-based',
                learningStyle: 'visual',
                skinJourney: 'improvement-focused'
            },
            predictions: {
                nextAction: 'product_research',
                probability: 0.78,
                timeframe: '2-3 days'
            },
            recommendations: {
                content: ['anti-ageing research', 'ingredient guides'],
                products: ['targeted serums', 'professional treatments'],
                timeline: 'immediate'
            }
        };
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 RegimA Development Server running at http://localhost:${this.port}`);
            console.log(`🧠 Cognitive API available at http://localhost:${this.port}/cognitive/api/`);
            console.log(`📊 Knowledge Graph: http://localhost:${this.port}/cognitive/index.json`);
            console.log('');
            console.log('Available endpoints:');
            console.log('  GET  / - Homepage');
            console.log('  GET  /products/ - Products page');
            console.log('  GET  /about-us/ - About page');
            console.log('  GET  /contact-us/ - Contact page');
            console.log('  GET  /testimonials/ - Testimonials page');
            console.log('  GET  /faqs/ - FAQs page');
            console.log('  GET  /blog/ - Blog page');
            console.log('  GET  /sitemap.xml - XML sitemap');
            console.log('  GET  /cognitive/api/knowledge - Knowledge graph');
            console.log('  POST /cognitive/api/recommend - Product recommendations');
            console.log('  GET  /cognitive/api/search?query=... - Cognitive search');
        });
    }
}

// Start the development server
if (require.main === module) {
    const server = new DevServer();
    server.start();
}

module.exports = DevServer;