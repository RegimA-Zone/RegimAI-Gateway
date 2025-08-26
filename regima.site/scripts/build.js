#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

class SiteBuilder {
    constructor() {
        this.publicDir = path.join(__dirname, '..', 'public');
        this.contentDir = path.join(__dirname, '..', 'content');
        this.templatesDir = path.join(__dirname, '..', 'templates');
        this.assetsDir = path.join(__dirname, '..', 'assets');
        
        this.siteConfig = {
            baseUrl: 'https://regima.site',
            title: 'RégimA Zone',
            description: 'Advanced skincare solutions powered by cognitive architecture'
        };
    }

    async build() {
        console.log('🚀 Building RegimA site with cognitive architecture...');
        
        try {
            // Clean and create public directory
            await fs.remove(this.publicDir);
            await fs.ensureDir(this.publicDir);
            
            // Copy assets
            await this.copyAssets();
            
            // Build pages
            await this.buildPages();
            
            // Generate sitemap
            await this.generateSitemap();
            
            // Generate robots.txt
            await this.generateRobots();
            
            // Generate cognitive knowledge index
            await this.generateCognitiveIndex();
            
            console.log('✅ Build completed successfully!');
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
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
}

// Run the build
if (require.main === module) {
    const builder = new SiteBuilder();
    builder.build();
}

module.exports = SiteBuilder;