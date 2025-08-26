---
title: Contact Us
description: Get in touch with RégimA Zone for all your skincare needs. Based in Bedfordview, Johannesburg.
schemaType: ContactPage
path: /contact-us/
---

<section class="content-section">
    <h1>Contact RégimA Zone</h1>
    
    <div class="contact-intro">
        <p>Based in Bedfordview, Johannesburg, we look forward to hearing from you for any and all skincare needs! If you'd like us to get back to you, please fill in the contact form below with as much information you can and we'll get back to you as soon as possible.</p>
    </div>

    <div class="contact-container">
        <div class="contact-info">
            <h2>Where We Are</h2>
            <div class="info-card">
                <h3>📍 Location</h3>
                <p>Bedfordview<br>Johannesburg, South Africa</p>
            </div>
            
            <div class="info-card">
                <h3>🏢 Company</h3>
                <p>RégimA Zone<br>Advanced Skincare Solutions</p>
            </div>
            
            <div class="info-card">
                <h3>🌐 Connect</h3>
                <div class="social-links">
                    <a href="https://www.facebook.com/regimaglobal/" target="_blank" rel="noopener">Facebook</a>
                    <a href="https://twitter.com/RegimaZone" target="_blank" rel="noopener">Twitter</a>
                    <a href="https://www.linkedin.com/company/régima-global" target="_blank" rel="noopener">LinkedIn</a>
                </div>
            </div>
        </div>

        <div class="contact-form-section">
            <h2>Get In Touch</h2>
            <form id="contact-form" data-type="contact" class="contact-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="first-name">First Name *</label>
                        <input type="text" id="first-name" name="first-name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="last-name">Last Name *</label>
                        <input type="text" id="last-name" name="last-name" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" name="email" required>
                </div>

                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone">
                </div>

                <div class="form-group">
                    <label for="profession">Professional Role</label>
                    <select id="profession" name="profession">
                        <option value="">Select your profession</option>
                        <option value="dermatologist">Dermatologist</option>
                        <option value="aesthetician">Aesthetician</option>
                        <option value="spa-owner">Spa Owner</option>
                        <option value="beauty-therapist">Beauty Therapist</option>
                        <option value="clinic-manager">Clinic Manager</option>
                        <option value="consumer">Consumer</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="skin-concerns">Skin Concerns or Interests</label>
                    <textarea id="skin-concerns" name="skin-concerns" rows="3" placeholder="Describe any specific skin concerns, product interests, or questions you have..."></textarea>
                </div>

                <div class="form-group">
                    <label for="subject">Subject</label>
                    <select id="subject" name="subject" required>
                        <option value="">What is your inquiry about?</option>
                        <option value="product-info">Product Information</option>
                        <option value="professional-training">Professional Training</option>
                        <option value="distribution">Distribution & Wholesale</option>
                        <option value="technical-support">Technical Support</option>
                        <option value="skin-consultation">Skin Consultation</option>
                        <option value="partnership">Partnership Opportunities</option>
                        <option value="general">General Inquiry</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea id="message" name="message" rows="5" required placeholder="Please provide details about your inquiry..."></textarea>
                </div>

                <div class="form-group checkbox-group">
                    <input type="checkbox" id="newsletter" name="newsletter">
                    <label for="newsletter">I would like to receive updates about new products and skincare tips</label>
                </div>

                <div class="form-group checkbox-group">
                    <input type="checkbox" id="privacy" name="privacy" required>
                    <label for="privacy">I agree to the privacy policy and terms of service *</label>
                </div>

                <button type="submit" class="submit-button">🧠 Send Message (Cognitive Analysis Enabled)</button>
            </form>
        </div>
    </div>

    <!-- Cognitive Analysis Display -->
    <div class="knowledge-graph">
        <h4>🧠 SkinTwin Contact Intelligence</h4>
        <div class="cognitive-insights">
            <p><strong>Smart Form Processing:</strong> Your inquiry will be analyzed by our cognitive system to route to the most appropriate expert</p>
            <p><strong>Skin Concern Analysis:</strong> Mentioned skin concerns are automatically categorized for personalized follow-up</p>
            <p><strong>Professional Matching:</strong> Your professional role helps us provide relevant product recommendations</p>
        </div>
        <div class="contact-analytics">
            <h5>Common Inquiry Patterns</h5>
            <div class="pattern-stats">
                <div class="stat-item">
                    <span class="stat-label">Product Information:</span>
                    <span class="stat-value">45%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Skin Consultations:</span>
                    <span class="stat-value">28%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Professional Training:</span>
                    <span class="stat-value">18%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Distribution:</span>
                    <span class="stat-value">9%</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Response Time Information -->
    <section class="response-info">
        <h2>⏱️ Response Times</h2>
        <div class="response-grid">
            <div class="response-card">
                <h3>🚀 Urgent Inquiries</h3>
                <p><strong>Within 2 hours</strong></p>
                <p>Technical support, professional emergencies</p>
            </div>
            
            <div class="response-card">
                <h3>📋 General Inquiries</h3>
                <p><strong>Within 24 hours</strong></p>
                <p>Product information, consultations</p>
            </div>
            
            <div class="response-card">
                <h3>🤝 Partnership Requests</h3>
                <p><strong>Within 3-5 business days</strong></p>
                <p>Distribution, training, collaboration</p>
            </div>
        </div>
    </section>
</section>

<style>
/* Contact page specific styles */
.contact-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3rem;
    margin: 2rem 0;
}

.contact-info {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 12px;
    height: fit-content;
}

.info-card {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    border-left: 4px solid var(--primary-color);
}

.info-card h3 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}

.contact-form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-dark);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--cognitive-highlight);
}

.checkbox-group {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
}

.checkbox-group input[type="checkbox"] {
    width: auto;
    margin-top: 0.25rem;
}

.checkbox-group label {
    margin-bottom: 0;
    font-weight: normal;
}

.submit-button {
    background: linear-gradient(135deg, var(--cognitive-highlight), var(--primary-color));
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: transform 0.3s ease;
}

.submit-button:hover {
    transform: translateY(-2px);
}

.pattern-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: white;
    border-radius: 20px;
    border: 1px solid var(--border-color);
}

.stat-value {
    font-weight: 600;
    color: var(--cognitive-highlight);
}

.response-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.response-card {
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    border: 2px solid var(--border-color);
    text-align: center;
    transition: border-color 0.3s ease;
}

.response-card:hover {
    border-color: var(--cognitive-highlight);
}

.response-card h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.response-card p:first-of-type {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--cognitive-highlight);
    margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
    .contact-container {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
}
</style>