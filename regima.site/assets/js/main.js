/**
 * Main JavaScript for RegimA Site
 * Handles general site functionality and cognitive integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize product interactions
    initializeProductInteractions();
    
    // Initialize form handling
    initializeFormHandling();
    
    // Initialize knowledge graph visualization
    initializeKnowledgeVisualization();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    // Highlight current page in navigation
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Mobile menu toggle (if implemented)
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }
}

function initializeProductInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productName = this.querySelector('h3')?.textContent;
            const productCategory = this.dataset.category;
            
            // Track interaction for cognitive layer
            if (window.cognitiveLayer) {
                window.cognitiveLayer.trackInteraction('product_view', {
                    product: productName,
                    category: productCategory,
                    timestamp: Date.now()
                });
            }
        });
        
        // Add hover effects for knowledge extraction
        card.addEventListener('mouseenter', function() {
            this.classList.add('cognitive-highlight');
            
            // Extract and display relevant knowledge
            const productInfo = extractProductKnowledge(this);
            if (productInfo && window.cognitiveLayer) {
                showKnowledgeTooltip(this, productInfo);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('cognitive-highlight');
            hideKnowledgeTooltip();
        });
    });
}

function extractProductKnowledge(productElement) {
    const name = productElement.querySelector('h3')?.textContent;
    const description = productElement.querySelector('p')?.textContent;
    const category = productElement.dataset.category;
    
    return {
        name,
        description,
        category,
        benefits: extractBenefits(description),
        ingredients: extractIngredients(description),
        concerns: extractConcerns(description)
    };
}

function extractBenefits(text) {
    const benefitKeywords = [
        'anti-aging', 'moisturizing', 'brightening', 'firming',
        'smoothing', 'healing', 'protecting', 'repairing',
        'rejuvenating', 'cleansing', 'toning'
    ];
    
    return benefitKeywords.filter(benefit => 
        text.toLowerCase().includes(benefit.toLowerCase())
    );
}

function extractIngredients(text) {
    const ingredientKeywords = [
        'vitamin c', 'vitamin e', 'retinol', 'hyaluronic acid',
        'collagen', 'peptides', 'antioxidants', 'spf',
        'salicylic acid', 'glycolic acid', 'niacinamide'
    ];
    
    return ingredientKeywords.filter(ingredient => 
        text.toLowerCase().includes(ingredient.toLowerCase())
    );
}

function extractConcerns(text) {
    const concernKeywords = [
        'acne', 'wrinkles', 'fine lines', 'dark spots',
        'pigmentation', 'dryness', 'oily skin', 'sensitive skin',
        'aging', 'scars', 'blemishes'
    ];
    
    return concernKeywords.filter(concern => 
        text.toLowerCase().includes(concern.toLowerCase())
    );
}

function showKnowledgeTooltip(element, knowledge) {
    // Remove existing tooltip
    hideKnowledgeTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'knowledge-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-header">
            <strong>${knowledge.name}</strong>
        </div>
        <div class="tooltip-content">
            ${knowledge.benefits.length > 0 ? `<p><strong>Benefits:</strong> ${knowledge.benefits.join(', ')}</p>` : ''}
            ${knowledge.ingredients.length > 0 ? `<p><strong>Key Ingredients:</strong> ${knowledge.ingredients.join(', ')}</p>` : ''}
            ${knowledge.concerns.length > 0 ? `<p><strong>Addresses:</strong> ${knowledge.concerns.join(', ')}</p>` : ''}
        </div>
    `;
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = (rect.top - 10) + 'px';
    tooltip.style.left = (rect.right + 10) + 'px';
    tooltip.style.zIndex = '1001';
    tooltip.style.background = 'white';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.borderRadius = '4px';
    tooltip.style.padding = '1rem';
    tooltip.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    tooltip.style.maxWidth = '300px';
    tooltip.style.fontSize = '0.9rem';
    
    document.body.appendChild(tooltip);
}

function hideKnowledgeTooltip() {
    const existingTooltip = document.querySelector('.knowledge-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}

function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formType = this.dataset.type || 'contact';
            
            // Process form with cognitive layer
            if (window.cognitiveLayer) {
                const formKnowledge = extractFormKnowledge(formData);
                window.cognitiveLayer.processFormSubmission(formType, formKnowledge);
            }
            
            // Show success message
            showFormSuccess(this);
        });
    });
}

function extractFormKnowledge(formData) {
    const knowledge = {};
    
    for (let [key, value] of formData.entries()) {
        knowledge[key] = value;
        
        // Extract skin concerns from form fields
        if (key.includes('concern') || key.includes('problem')) {
            knowledge.skinConcerns = extractConcerns(value);
        }
        
        // Extract product interests
        if (key.includes('product') || key.includes('interest')) {
            knowledge.productInterests = extractProductReferences(value);
        }
    }
    
    return knowledge;
}

function extractProductReferences(text) {
    const productKeywords = [
        'cleanser', 'moisturizer', 'serum', 'toner', 'sunscreen',
        'anti-aging', 'acne treatment', 'vitamin c', 'retinol'
    ];
    
    return productKeywords.filter(product => 
        text.toLowerCase().includes(product.toLowerCase())
    );
}

function showFormSuccess(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <h3>Thank You!</h3>
            <p>Your message has been received. Our skincare experts will get back to you soon.</p>
            <div class="cognitive-note">
                <small>✨ Your preferences have been added to our cognitive knowledge base for personalized recommendations.</small>
            </div>
        </div>
    `;
    
    successMessage.style.background = '#d4edda';
    successMessage.style.border = '1px solid #c3e6cb';
    successMessage.style.borderRadius = '4px';
    successMessage.style.padding = '1rem';
    successMessage.style.margin = '1rem 0';
    successMessage.style.color = '#155724';
    
    form.parentNode.insertBefore(successMessage, form);
    form.style.display = 'none';
    
    // Remove success message after 10 seconds
    setTimeout(() => {
        successMessage.remove();
        form.style.display = 'block';
        form.reset();
    }, 10000);
}

function initializeKnowledgeVisualization() {
    const knowledgeGraphs = document.querySelectorAll('.knowledge-graph');
    
    knowledgeGraphs.forEach(graph => {
        if (window.cognitiveLayer) {
            const knowledge = window.cognitiveLayer.getKnowledgeGraph();
            renderKnowledgeNodes(graph, knowledge);
        }
    });
}

function renderKnowledgeNodes(container, knowledge) {
    const nodesContainer = container.querySelector('.knowledge-nodes');
    if (!nodesContainer) return;
    
    // Clear existing nodes
    nodesContainer.innerHTML = '';
    
    // Extract unique concepts
    const concepts = new Set();
    knowledge.forEach(node => {
        if (node.attributes && node.attributes.keywords) {
            node.attributes.keywords.forEach(keyword => concepts.add(keyword));
        }
    });
    
    // Render concept nodes
    concepts.forEach(concept => {
        const nodeElement = document.createElement('span');
        nodeElement.className = 'knowledge-node';
        nodeElement.textContent = concept;
        nodeElement.addEventListener('click', () => {
            if (window.cognitiveLayer) {
                const results = window.cognitiveLayer.query(concept);
                console.log(`Knowledge for "${concept}":`, results);
                showKnowledgeResults(concept, results);
            }
        });
        nodesContainer.appendChild(nodeElement);
    });
}

function showKnowledgeResults(concept, results) {
    const modal = document.createElement('div');
    modal.className = 'knowledge-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Knowledge Graph: ${concept}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${results.length > 0 ? 
                        results.map(result => `
                            <div class="result-item">
                                <h4>${result.node}</h4>
                                <p>Relevance: ${(result.relevance * 100).toFixed(1)}%</p>
                                <div class="result-attributes">
                                    ${result.attributes.keywords ? `<p><strong>Keywords:</strong> ${result.attributes.keywords.join(', ')}</p>` : ''}
                                    ${result.attributes.entities ? `<p><strong>Entities:</strong> ${result.attributes.entities.length} found</p>` : ''}
                                </div>
                            </div>
                        `).join('') : 
                        '<p>No related knowledge found.</p>'
                    }
                </div>
            </div>
        </div>
    `;
    
    // Style the modal
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.zIndex = '2000';
    
    const overlay = modal.querySelector('.modal-overlay');
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '2rem';
    
    const content = modal.querySelector('.modal-content');
    content.style.background = 'white';
    content.style.borderRadius = '8px';
    content.style.maxWidth = '600px';
    content.style.maxHeight = '80%';
    content.style.overflow = 'auto';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) modal.remove();
    });
    
    document.body.appendChild(modal);
}

// Utility functions for cognitive integration
window.cognitiveUtils = {
    extractProductKnowledge,
    extractBenefits,
    extractIngredients,
    extractConcerns,
    showKnowledgeTooltip,
    hideKnowledgeTooltip
};

// Extend cognitive layer with additional tracking
if (window.cognitiveLayer) {
    window.cognitiveLayer.trackInteraction = function(type, data) {
        const interactions = JSON.parse(localStorage.getItem('skintwin_interactions') || '[]');
        interactions.push({
            type,
            data,
            timestamp: Date.now(),
            page: window.location.pathname
        });
        
        // Keep only last 1000 interactions
        if (interactions.length > 1000) {
            interactions.splice(0, interactions.length - 1000);
        }
        
        localStorage.setItem('skintwin_interactions', JSON.stringify(interactions));
    };
    
    window.cognitiveLayer.processFormSubmission = function(formType, knowledge) {
        const submission = {
            type: formType,
            knowledge,
            timestamp: Date.now(),
            page: window.location.pathname
        };
        
        this.trackInteraction('form_submission', submission);
        
        // Update knowledge base with form insights
        const formAtom = {
            type: 'FormSubmissionNode',
            name: `Form_${formType}_${Date.now()}`,
            truthValue: { strength: 0.9, confidence: 0.9 },
            attributes: submission
        };
        
        this.storeKnowledgeNode(formAtom);
    };
}