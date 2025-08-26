#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

/**
 * RegimAI Gateway Site Builder
 * 
 * Builds the RegimAI Gateway documentation site and API portal
 * from the regima.site content, adapting it for AI Gateway functionality.
 */
class RegimAIGatewaySiteBuilder {
    constructor() {
        this.publicDir = path.join(__dirname, '..', 'public');
        this.contentDir = path.join(__dirname, '..', 'content');
        this.templatesDir = path.join(__dirname, '..', 'templates');
        this.assetsDir = path.join(__dirname, '..', 'assets');
        this.configDir = path.join(__dirname, '..', 'config');
        
        this.siteConfig = {
            baseUrl: 'https://gateway.regima.ai',
            title: 'RegimAI Gateway',
            description: 'AI Gateway for dermatology and skincare cognitive services - powered by SkinTwin architecture'
        };
        
        this.gatewayConfig = null;
    }

    async build() {
        console.log('🚀 Building RegimAI Gateway site with AI services documentation...');
        
        try {
            // Load gateway configuration
            await this.loadGatewayConfig();
            
            // Clean and create public directory
            await fs.remove(this.publicDir);
            await fs.ensureDir(this.publicDir);
            
            // Copy assets
            await this.copyAssets();
            
            // Build pages
            await this.buildPages();
            
            // Generate gateway-specific content
            await this.generateGatewayDocumentation();
            await this.generateAPIDocumentation();
            await this.generateServiceCatalog();
            
            // Generate sitemap
            await this.generateSitemap();
            
            // Generate robots.txt
            await this.generateRobots();
            
            // Generate cognitive knowledge index
            await this.generateCognitiveIndex();
            
            console.log('✅ RegimAI Gateway build completed successfully!');
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    }

    async loadGatewayConfig() {
        console.log('📋 Loading gateway configuration...');
        const configPath = path.join(this.configDir, 'gateway.json');
        this.gatewayConfig = await fs.readJson(configPath);
    }

    async copyAssets() {
        console.log('📁 Copying assets...');
        const assetsTarget = path.join(this.publicDir, 'assets');
        await fs.copy(this.assetsDir, assetsTarget);
    }

    async buildPages() {
        console.log('📄 Building pages...');
        
        const pagesDir = path.join(this.contentDir, 'pages');
        const pages = await fs.readdir(pagesDir);
        
        for (const pageFile of pages) {
            if (pageFile.endsWith('.md')) {
                await this.buildPage(pageFile);
            }
        }
    }

    async buildPage(pageFile) {
        const pagePath = path.join(this.contentDir, 'pages', pageFile);
        const content = await fs.readFile(pagePath, 'utf-8');
        
        // Parse frontmatter and content
        const { frontmatter, body } = this.parseFrontmatter(content);
        
        // Convert markdown to HTML
        const htmlContent = marked(body);
        
        // Load template
        const template = await fs.readFile(path.join(this.templatesDir, 'layout.html'), 'utf-8');
        
        // Replace template variables
        const html = this.processTemplate(template, {
            title: frontmatter.title || this.siteConfig.title,
            description: frontmatter.description || this.siteConfig.description,
            content: htmlContent,
            path: frontmatter.path || '/',
            schemaType: frontmatter.schemaType || 'WebPage'
        });
        
        // Determine output path
        let outputPath;
        if (pageFile === 'index.md') {
            outputPath = path.join(this.publicDir, 'index.html');
        } else {
            const pageName = path.basename(pageFile, '.md');
            const pageDir = path.join(this.publicDir, pageName);
            await fs.ensureDir(pageDir);
            outputPath = path.join(pageDir, 'index.html');
        }
        
        // Write HTML file
        await fs.writeFile(outputPath, html);
        console.log(`  ✅ Built ${pageFile} → ${path.relative(this.publicDir, outputPath)}`);
    }

    parseFrontmatter(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (match) {
            const frontmatterText = match[1];
            const body = match[2];
            
            // Simple YAML parsing (for basic key-value pairs)
            const frontmatter = {};
            frontmatterText.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
                    frontmatter[key] = value;
                }
            });
            
            return { frontmatter, body };
        }
        
        return { frontmatter: {}, body: content };
    }

    processTemplate(template, variables) {
        let html = template;
        
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, value);
        });
        
        return html;
    }

    async generateSitemap() {
        console.log('🗺️  Generating sitemap...');
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <!-- Homepage -->
    <url>
        <loc>${this.siteConfig.baseUrl}/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>1.0</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <!-- Main Pages -->
    <url>
        <loc>${this.siteConfig.baseUrl}/products/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.9</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/about-us/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>monthly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/contact-us/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.7</priority>
        <changefreq>monthly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/testimonials/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.7</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/faqs/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.6</priority>
        <changefreq>monthly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/blog/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>daily</changefreq>
    </url>
    
    <!-- Product Categories -->
    <url>
        <loc>${this.siteConfig.baseUrl}/products/anti-ageing/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/products/day-preperations/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/products/night-preparations/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/products/eye-care/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/products/in-salon-treatments/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/products/pigmentation/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/products/problem-skin/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/products/repairing/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/products/cleansing-toning/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/products/classic/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    
    <!-- Portfolio Items -->
    <url>
        <loc>${this.siteConfig.baseUrl}/portfolio/zone-scar-repair-forte-serum/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.7</priority>
        <changefreq>monthly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/portfolio/epi-genes-xpress/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.7</priority>
        <changefreq>monthly</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/portfolio/zone-quantum-elast-collagen-revival/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.7</priority>
        <changefreq>monthly</changefreq>
    </url>
    
    <!-- Cognitive Architecture Pages -->
    <url>
        <loc>${this.siteConfig.baseUrl}/cognitive/knowledge-graph/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.5</priority>
        <changefreq>daily</changefreq>
    </url>
    
    <url>
        <loc>${this.siteConfig.baseUrl}/cognitive/api/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <priority>0.4</priority>
        <changefreq>weekly</changefreq>
    </url>
</urlset>`;

        await fs.writeFile(path.join(this.publicDir, 'sitemap.xml'), sitemap);
    }

    async generateRobots() {
        console.log('🤖 Generating robots.txt...');
        
        const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.siteConfig.baseUrl}/sitemap.xml

# Cognitive Architecture - Allow crawling for knowledge extraction
Allow: /cognitive/
Allow: /assets/js/cognitive-layer.js

# Product images for visual AI
Allow: /assets/images/products/
Allow: /assets/images/categories/

# Crawl delay for cognitive processing
Crawl-delay: 1

# Special directives for AI/ML crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

# Block admin areas
Disallow: /admin/
Disallow: /wp-admin/
Disallow: /wp-includes/

# Block temporary files
Disallow: /tmp/
Disallow: /*.tmp$
Disallow: /*.temp$`;

        await fs.writeFile(path.join(this.publicDir, 'robots.txt'), robots);
    }

    async generateCognitiveIndex() {
        console.log('🧠 Generating cognitive knowledge index...');
        
        const cognitiveIndex = {
            version: '1.0',
            generatedAt: new Date().toISOString(),
            architecture: 'SkinTwin',
            components: {
                atomspace: 'Knowledge representation layer',
                pln: 'Probabilistic logic networks for reasoning',
                moses: 'Pattern mining and optimization',
                esn: 'Echo state networks for temporal prediction'
            },
            domain: 'dermatology',
            knowledge: {
                entities: [
                    'skincare', 'anti-ageing', 'acne', 'pigmentation', 'wrinkles',
                    'moisturizer', 'serum', 'cleanser', 'sunscreen', 'retinol',
                    'vitamin-c', 'hyaluronic-acid', 'collagen', 'peptides'
                ],
                relationships: [
                    { source: 'retinol', target: 'anti-ageing', type: 'treats', strength: 0.9 },
                    { source: 'vitamin-c', target: 'pigmentation', type: 'treats', strength: 0.8 },
                    { source: 'hyaluronic-acid', target: 'hydration', type: 'provides', strength: 0.95 },
                    { source: 'sunscreen', target: 'prevention', type: 'enables', strength: 0.9 }
                ],
                categories: [
                    'anti-ageing', 'day-preparations', 'night-preparations',
                    'eye-care', 'in-salon-treatments', 'pigmentation',
                    'problem-skin', 'repairing', 'cleansing-toning', 'classic'
                ]
            },
            inference: {
                rules: [
                    'IF age > 30 AND concern = wrinkles THEN recommend anti-ageing',
                    'IF skin-type = oily AND concern = acne THEN recommend problem-skin',
                    'IF concern = pigmentation THEN recommend vitamin-c + sunscreen'
                ]
            },
            api: {
                endpoint: '/cognitive/api/',
                methods: ['GET', 'POST'],
                capabilities: ['search', 'recommend', 'analyze', 'predict']
            }
        };
        
        // Create cognitive directory
        const cognitiveDir = path.join(this.publicDir, 'cognitive');
        await fs.ensureDir(cognitiveDir);
        
        // Write knowledge index
        await fs.writeFile(
            path.join(cognitiveDir, 'index.json'),
            JSON.stringify(cognitiveIndex, null, 2)
        );
        
        // Create API documentation
        const apiDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkinTwin Cognitive API - RégimA</title>
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <div class="content-section">
        <h1>🧠 SkinTwin Cognitive Architecture API</h1>
        <p>Access the cognitive layer powering RegimA's intelligent skincare recommendations.</p>
        
        <h2>Knowledge Graph Access</h2>
        <pre><code>GET /cognitive/index.json</code></pre>
        <p>Returns the complete knowledge graph structure and inference rules.</p>
        
        <h2>Product Recommendation</h2>
        <pre><code>POST /cognitive/api/recommend
{
  "skinType": "oily",
  "concerns": ["acne", "pigmentation"],
  "age": 28
}</code></pre>
        
        <h2>Knowledge Search</h2>
        <pre><code>GET /cognitive/api/search?query=anti-ageing</code></pre>
        
        <p>This API enables integration with the SkinTwin cognitive architecture for advanced skincare personalization.</p>
    </div>
</body>
</html>`;
        
        await fs.writeFile(path.join(cognitiveDir, 'api.html'), apiDoc);
    }

    async generateGatewayDocumentation() {
        console.log('📖 Generating gateway documentation...');
        
        const gatewayDir = path.join(this.publicDir, 'gateway');
        await fs.ensureDir(gatewayDir);
        
        const gatewayDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RegimAI Gateway - AI Services for Dermatology</title>
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <div class="content-section">
        <h1>🚀 ${this.gatewayConfig.gateway.name}</h1>
        <p>${this.gatewayConfig.gateway.description}</p>
        
        <h2>🏗️ Architecture Overview</h2>
        <p>The RegimAI Gateway provides a unified interface for AI services, agents, and tools specifically designed for dermatology and skincare applications.</p>
        
        <div class="architecture-diagram">
            <h3>Gateway Components</h3>
            <ul>
                <li><strong>AI Models:</strong> OpenAI, Azure OpenAI, Cognitive Services</li>
                <li><strong>AI Agents:</strong> Skincare Consultant, Dermatology Assistant, Product Advisor</li>
                <li><strong>Data Services:</strong> Vector Store, Knowledge Graph</li>
                <li><strong>Tools:</strong> Image Analysis, Routine Generator</li>
                <li><strong>Cognitive Integration:</strong> SkinTwin Architecture (AtomSpace, PLN, MOSES, ESN)</li>
            </ul>
        </div>
        
        <h2>🛡️ Policies & Governance</h2>
        <p>All services are protected by comprehensive policies ensuring safety, privacy, and domain expertise:</p>
        <ul>
            <li><strong>Content Safety:</strong> Medical accuracy validation and harmful content filtering</li>
            <li><strong>Privacy Protection:</strong> HIPAA compliance and data anonymization</li>
            <li><strong>Domain Validation:</strong> Dermatology-specific terminology and evidence-based recommendations</li>
            <li><strong>Authentication:</strong> API key management and user permissions</li>
        </ul>
        
        <h2>🔗 Quick Start</h2>
        <p>Get started with the RegimAI Gateway:</p>
        <ol>
            <li>Obtain your API key from the RegimA platform</li>
            <li>Include the API key in your requests: <code>X-API-Key: regima_your_api_key</code></li>
            <li>Start making requests to the gateway endpoints</li>
        </ol>
        
        <h2>📚 Resources</h2>
        <ul>
            <li><a href="/gateway/api-docs">Complete API Documentation</a></li>
            <li><a href="/gateway/services">Service Catalog</a></li>
            <li><a href="/cognitive/status">Cognitive Architecture Status</a></li>
            <li><a href="/metrics">Gateway Metrics</a></li>
        </ul>
    </div>
</body>
</html>`;
        
        await fs.writeFile(path.join(gatewayDir, 'index.html'), gatewayDoc);
    }

    async generateAPIDocumentation() {
        console.log('📋 Generating API documentation...');
        
        const gatewayDir = path.join(this.publicDir, 'gateway');
        await fs.ensureDir(gatewayDir);
        
        const apiDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RegimAI Gateway API Documentation</title>
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <div class="content-section">
        <h1>📖 RegimAI Gateway API</h1>
        <p>Complete API reference for the RegimAI Gateway services.</p>
        
        <h2>🔐 Authentication</h2>
        <p>All API requests require authentication using an API key:</p>
        <pre><code>X-API-Key: regima_your_api_key_here</code></pre>
        
        <h2>🤖 AI Models</h2>
        
        <h3>OpenAI Chat Completions</h3>
        <pre><code>POST /v1/openai/chat/completions
Content-Type: application/json
X-API-Key: regima_your_api_key

{
  "model": "gpt-3.5-turbo",
  "messages": [
    {"role": "user", "content": "What's the best skincare routine for oily skin?"}
  ],
  "max_tokens": 150
}</code></pre>
        
        <h3>Azure OpenAI Chat Completions</h3>
        <pre><code>POST /v1/azure-openai/chat/completions
Content-Type: application/json
X-API-Key: regima_your_api_key

{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Analyze this skincare routine for effectiveness"}
  ]
}</code></pre>
        
        <h2>👥 AI Agents</h2>
        
        <h3>Skincare Consultant</h3>
        <pre><code>POST /agents/skincare-consultant
Content-Type: application/json
X-API-Key: regima_your_api_key

{
  "skinType": "combination",
  "concerns": ["acne", "dark-spots"],
  "routine": "basic",
  "goals": ["clear-skin", "even-tone"]
}</code></pre>
        
        <h3>Product Advisor</h3>
        <pre><code>POST /agents/product-advisor
Content-Type: application/json
X-API-Key: regima_your_api_key

{
  "skinType": "sensitive",
  "budget": "moderate",
  "preferences": ["fragrance-free", "cruelty-free"]
}</code></pre>
        
        <h2>🔧 Tools</h2>
        
        <h3>Image Analysis</h3>
        <pre><code>POST /tools/image-analysis
Content-Type: application/json
X-API-Key: regima_your_api_key

{
  "imageData": "base64_encoded_image_data",
  "analysisType": "skin-assessment"
}</code></pre>
        
        <h3>Routine Generator</h3>
        <pre><code>POST /tools/routine-generator
Content-Type: application/json
X-API-Key: regima_your_api_key

{
  "skinType": "dry",
  "concerns": ["aging", "hydration"],
  "timeAvailable": "moderate",
  "products": ["cleanser", "serum", "moisturizer"]
}</code></pre>
        
        <h2>💾 Data Services</h2>
        
        <h3>Vector Search</h3>
        <pre><code>GET /data/vectors/search?query=retinol%20benefits&limit=10
X-API-Key: regima_your_api_key</code></pre>
        
        <h3>Knowledge Query</h3>
        <pre><code>POST /data/knowledge/query
Content-Type: application/json
X-API-Key: regima_your_api_key

{
  "query": "ingredients for anti-aging",
  "context": "evidence-based",
  "limit": 5
}</code></pre>
        
        <h2>🧠 Cognitive Services</h2>
        
        <h3>AtomSpace Query</h3>
        <pre><code>GET /cognitive/atomspace?concept=hyaluronic-acid
X-API-Key: regima_your_api_key</code></pre>
        
        <h3>PLN Reasoning</h3>
        <pre><code>POST /cognitive/reasoning
Content-Type: application/json
X-API-Key: regima_your_api_key

{
  "premises": ["dry skin", "winter climate"],
  "goal": "optimal moisturizer"
}</code></pre>
        
        <h2>📊 Response Format</h2>
        <p>All API responses follow a consistent format:</p>
        <pre><code>{
  "success": true,
  "data": { /* response data */ },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_123456",
    "processingTime": "150ms"
  }
}</code></pre>
        
        <h2>⚠️ Error Handling</h2>
        <p>Error responses include detailed information:</p>
        <pre><code>{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is not valid",
    "details": "Please check your API key and try again"
  }
}</code></pre>
    </div>
</body>
</html>`;
        
        await fs.writeFile(path.join(gatewayDir, 'api-docs.html'), apiDoc);
    }

    async generateServiceCatalog() {
        console.log('🗂️ Generating service catalog...');
        
        const gatewayDir = path.join(this.publicDir, 'gateway');
        await fs.ensureDir(gatewayDir);
        
        const serviceDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RegimAI Gateway Service Catalog</title>
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <div class="content-section">
        <h1>🗂️ Service Catalog</h1>
        <p>Comprehensive catalog of available services in the RegimAI Gateway.</p>
        
        <h2>🤖 AI Models & Services</h2>
        ${this.generateServiceSection('ai-models')}
        
        <h2>👥 AI Agents</h2>
        ${this.generateServiceSection('ai-agents')}
        
        <h2>💾 Data Services</h2>
        ${this.generateServiceSection('data-services')}
        
        <h2>🔧 Tools & Functions</h2>
        ${this.generateServiceSection('tools')}
        
        <h2>📊 Service Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Services</h3>
                <p class="stat-number">${this.countTotalServices()}</p>
            </div>
            <div class="stat-card">
                <h3>AI Models</h3>
                <p class="stat-number">${Object.keys(this.gatewayConfig.services['ai-models']).length}</p>
            </div>
            <div class="stat-card">
                <h3>AI Agents</h3>
                <p class="stat-number">${Object.keys(this.gatewayConfig.services['ai-agents']).length}</p>
            </div>
            <div class="stat-card">
                <h3>Active Policies</h3>
                <p class="stat-number">${Object.keys(this.gatewayConfig.policies).length}</p>
            </div>
        </div>
    </div>
</body>
</html>`;
        
        await fs.writeFile(path.join(gatewayDir, 'services.html'), serviceDoc);
    }

    generateServiceSection(category) {
        const services = this.gatewayConfig.services[category];
        let html = '<div class="service-category">';
        
        for (const [serviceName, serviceConfig] of Object.entries(services)) {
            html += `
                <div class="service-card">
                    <h3>${serviceName}</h3>
                    <p><strong>Endpoint:</strong> <code>${serviceConfig.endpoint}</code></p>
                    <p>${serviceConfig.description}</p>
                    ${serviceConfig.capabilities ? `
                        <p><strong>Capabilities:</strong></p>
                        <ul>
                            ${serviceConfig.capabilities.map(cap => `<li>${cap}</li>`).join('')}
                        </ul>
                    ` : ''}
                    ${serviceConfig.models ? `
                        <p><strong>Models:</strong> ${serviceConfig.models.join(', ')}</p>
                    ` : ''}
                    ${serviceConfig.services ? `
                        <p><strong>Services:</strong> ${serviceConfig.services.join(', ')}</p>
                    ` : ''}
                    <p><strong>Policies:</strong> ${serviceConfig.policies.join(', ')}</p>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    countTotalServices() {
        return Object.values(this.gatewayConfig.services)
            .reduce((total, category) => total + Object.keys(category).length, 0);
    }
}

// Run the build
if (require.main === module) {
    const builder = new RegimAIGatewaySiteBuilder();
    builder.build();
}

module.exports = RegimAIGatewaySiteBuilder;