# RégimA Site - Cognitive Architecture Implementation

This repository implements the RegimA.site website as a cognitive architecture layer for SkinTwin inference, integrating advanced skincare content with AI-powered knowledge representation and reasoning.

## 🧠 Cognitive Architecture Overview

The site implements a multi-layered cognitive architecture inspired by SkinTwin's approach:

- **AtomSpace Integration**: Knowledge representation for skincare domain
- **PLN (Probabilistic Logic Networks)**: Reasoning about skin concerns and treatments  
- **MOSES**: Pattern mining for product recommendations
- **ESN (Echo State Networks)**: Temporal prediction of user journeys

## 🏗️ Site Structure

### Core Pages
- **Homepage** (`/`) - Product showcase with cognitive analysis
- **Products** (`/products/`) - Comprehensive product catalog with smart recommendations
- **About Us** (`/about-us/`) - Company information with brand DNA analysis
- **Contact** (`/contact-us/`) - Contact form with cognitive processing
- **Testimonials** (`/testimonials/`) - Success stories with pattern analysis
- **FAQs** (`/faqs/`) - Intelligent FAQ system with search
- **Blog** (`/blog/`) - Content hub with cognitive curation

### Product Categories
- Anti-Ageing
- Day Preparations  
- Night Preparations
- Eye Care
- In-Salon Treatments
- Pigmentation
- Problem Skin
- Repairing
- Cleansing & Toning
- Classic Range

## 🔧 Technical Implementation

### Build System
```bash
npm install          # Install dependencies
npm run build        # Build static site
npm run dev          # Start development server
```

### Architecture Components

#### 1. Static Site Generator
- Markdown-based content management
- Template-driven HTML generation
- Asset optimization and copying

#### 2. Cognitive Layer (`assets/js/cognitive-layer.js`)
- Knowledge extraction from page content
- AtomSpace simulation for knowledge storage
- PLN reasoning simulation
- Pattern recognition and mining
- Temporal prediction algorithms

#### 3. API Layer (`scripts/dev-server.js`)
- `/cognitive/api/knowledge` - Knowledge graph access
- `/cognitive/api/recommend` - Product recommendations
- `/cognitive/api/search` - Cognitive search
- `/cognitive/api/analyze` - User behavior analysis

### Knowledge Representation

The cognitive system represents skincare knowledge using:

```javascript
{
  "entities": ["skincare", "anti-ageing", "acne", "pigmentation"],
  "relationships": [
    {
      "source": "retinol",
      "target": "anti-ageing", 
      "type": "treats",
      "strength": 0.9
    }
  ],
  "inference": {
    "rules": [
      "IF age > 30 AND concern = wrinkles THEN recommend anti-ageing"
    ]
  }
}
```

## 🗺️ Sitemap Structure

The comprehensive sitemap includes:

- Main pages (priority 0.7-1.0)
- Product categories (priority 0.8)
- Portfolio items (priority 0.7)
- Cognitive architecture pages (priority 0.4-0.5)

Generated automatically with proper SEO metadata and change frequencies.

## 🔍 Cognitive Features

### 1. Smart Product Recommendations
- Analyzes skin type, concerns, age, and preferences
- Uses pattern mining to suggest optimal product combinations
- Provides reasoning explanations for recommendations

### 2. Intelligent Content Discovery
- Cognitive search across all content
- Automatic content personalization
- Reading pattern analysis for content optimization

### 3. Knowledge Graph Integration
- Real-time knowledge extraction from user interactions
- Relationship mapping between products, ingredients, and concerns
- Continuous learning from user behavior patterns

### 4. Temporal Prediction
- User journey prediction using Echo State Networks
- Next action prediction based on behavior patterns
- Treatment timeline estimation

## 📊 Analytics & Insights

The cognitive layer provides:
- User engagement tracking
- Content performance analysis
- Product recommendation effectiveness
- Knowledge graph growth metrics

## 🚀 Deployment

### Production Build
```bash
npm run build
# Outputs to ./public directory
```

### Development Server
```bash
npm run dev
# Serves on http://localhost:3000
# Includes cognitive API endpoints
```

## 🔗 Integration Points

### SkinTwin Architecture
- Compatible with OpenCog AtomSpace
- PLN rule integration ready
- MOSES pattern mining endpoints
- ESN temporal prediction hooks

### External Systems
- Ready for professional training platform integration
- API endpoints for mobile app connectivity
- Analytics dashboard compatibility

## 📱 Mobile & Responsive

- Fully responsive design
- Mobile-optimized cognitive interactions
- Touch-friendly interface elements
- Progressive enhancement

## 🔒 Security & Privacy

- No sensitive data storage in cognitive layer
- Privacy-compliant user tracking
- Secure API endpoints
- GDPR-ready data handling

## 📈 Performance

- Static site generation for fast loading
- Optimized asset delivery
- Efficient cognitive processing
- Minimal JavaScript for core functionality

## 🧪 Testing

Run the development server and test:
- Page navigation and responsiveness
- Cognitive search functionality
- Product recommendation system
- Form processing with cognitive analysis

## 📚 Documentation

- `/cognitive/api.html` - API documentation
- `/cognitive/index.json` - Knowledge graph structure
- `/sitemap.xml` - Complete site map
- `/robots.txt` - Search engine guidelines

---

This implementation bridges traditional skincare expertise with cutting-edge cognitive computing, creating an intelligent platform for personalized skincare guidance and professional education.