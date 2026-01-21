// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyB--IXXXECwRYhUm3ozcePSPZiE2_wydoA",
    authDomain: "omdigitalstudio-57cbd.firebaseapp.com",
    projectId: "omdigitalstudio-57cbd",
    storageBucket: "omdigitalstudio-57cbd.firebasestorage.app",
    messagingSenderId: "489259478259",
    appId: "1:489259478259:web:46f84078c6c185b9ff9b86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Global Variables
let currentUser = null;
let aiModeEnabled = true;

// ==================== CUSTOMER PAGE FUNCTIONS ====================

// Initialize Customer Page
function initCustomerPage() {
    console.log("Initializing customer page...");
    
    // Check authentication state
    if (auth) {
        auth.onAuthStateChanged((user) => {
            currentUser = user;
            updateAuthUI();
            
            // If on admin page but not admin, redirect
            if (window.location.pathname.includes('admin.html') && 
                (!user || user.email !== 'omdigitalworks5@gmail.com')) {
                showUnauthorized();
            }
        });
    }
    
    // Initialize AI Chatbot
    initAIChatbot();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show cookie consent
    setTimeout(() => {
        if (!localStorage.getItem('cookiesAccepted')) {
            document.getElementById('cookieConsent').style.display = 'block';
        }
    }, 2000);
    
    // Load services from localStorage if Firebase not available
    loadServicesFromLocal();
    
    // Animate elements on scroll
    initAnimations();
}

// Setup Event Listeners
function setupEventListeners() {
    // Authentication
    document.getElementById('loginBtn')?.addEventListener('click', showAuthModal);
    document.getElementById('signupBtn')?.addEventListener('click', showAuthModal);
    document.getElementById('authModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'authModal') hideAuthModal();
    });
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // AI Chatbot
    const aiHelpBtn = document.getElementById('aiHelpBtn');
    const closeAiBtn = document.getElementById('closeAiBtn');
    const sendAiBtn = document.getElementById('sendAiBtn');
    const aiInput = document.getElementById('aiInput');
    
    if (aiHelpBtn) aiHelpBtn.addEventListener('click', toggleAIModal);
    if (closeAiBtn) closeAiBtn.addEventListener('click', toggleAIModal);
    if (sendAiBtn) sendAiBtn.addEventListener('click', sendAIMessage);
    if (aiInput) aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAIMessage();
    });
    
    // Pricing Selection
    window.selectPack = function(packType) {
        const packNames = {
            'starter': 'Starter Pack',
            'standard': 'Standard Pack',
            'premium': 'Premium Pack'
        };
        
        alert(`Thank you for selecting ${packNames[packType]}! Our team will contact you shortly.`);
        
        // Log selection (in real app, save to Firebase)
        console.log(`User selected: ${packNames[packType]}`);
    };
    
    // Policy Links
    window.showPolicy = function(policyType) {
        const policies = {
            'privacy': 'Privacy Policy: We respect your privacy and protect your data...',
            'terms': 'Terms of Service: By using our services, you agree to...',
            'refund': 'Refund Policy: We offer refunds within 30 days of purchase...'
        };
        
        alert(policies[policyType]);
    };
}

// Authentication Functions
function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function switchAuthTab(tab) {
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelector('.auth-tab:nth-child(1)').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelector('.auth-tab:nth-child(2)').classList.add('active');
        document.getElementById('signupForm').classList.add('active');
    }
}

function handleAuthSubmit(e, type) {
    e.preventDefault();
    
    if (type === 'login') {
        const email = document.getElementById('loginId').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simple validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // In production: Firebase auth
        console.log('Login attempt:', email);
        alert('Login successful! (Demo mode)');
        hideAuthModal();
        updateAuthUI();
        
    } else {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('signupPhone').value;
        const password = document.getElementById('signupPassword').value;
        
        if (!name || !email || !phone || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        console.log('Signup attempt:', {name, email, phone});
        alert('Account created successfully! (Demo mode)');
        hideAuthModal();
        updateAuthUI();
    }
}

function signInWithGoogle() {
    alert('Google sign-in would be implemented with Firebase');
    // In production: firebase.auth().signInWithPopup(provider)
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (currentUser) {
        loginBtn.textContent = 'My Account';
        signupBtn.textContent = 'Logout';
        
        loginBtn.onclick = () => alert('Account settings would open here');
        signupBtn.onclick = logout;
    } else {
        loginBtn.textContent = 'Sign In';
        signupBtn.textContent = 'Get Started';
        
        loginBtn.onclick = showAuthModal;
        signupBtn.onclick = showAuthModal;
    }
}

function logout() {
    currentUser = null;
    updateAuthUI();
    alert('Logged out successfully');
}

// Contact Form Handler
function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !phone || !service || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // In production: Save to Firebase
    const contactData = {
        name,
        email,
        phone,
        service,
        message,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    console.log('Contact form submitted:', contactData);
    
    // Show success message
    alert('Thank you for your inquiry! We\'ll contact you within 24 hours.');
    
    // Reset form
    e.target.reset();
    
    // Simulate saving to Firebase
    if (db) {
        db.collection('queries').add(contactData)
            .then(() => console.log('Query saved to Firebase'))
            .catch(err => console.error('Error saving query:', err));
    }
}

// AI Chatbot Functions
function initAIChatbot() {
    // Predefined responses for the AI
    window.aiResponses = {
        greetings: ["Hello! How can I help you today?", "Hi there! What can I do for you?", "Welcome! How may I assist you?"],
        services: ["We offer three main packages: Starter (₹12,000), Standard (₹16,000), and Premium (₹18,000). Each includes domain, hosting, and web design with varying maintenance options.", "Our services include web design, hosting, domain registration, and maintenance packages. Would you like details about a specific service?"],
        pricing: ["Our pricing starts at ₹12,000 for the Starter Pack. The Premium Pack at ₹18,000 is our most popular option. All prices are inclusive of GST.", "We have three pricing tiers to suit different needs. Which package are you interested in?"],
        contact: ["You can reach us at +91 7892230567 or email omdigitalworks5@gmail.com. We're available 24/7 on WhatsApp!", "Contact us directly on WhatsApp for immediate assistance. Our response time is within 24 hours."],
        default: ["I'm not sure about that. Would you like to speak with a human representative? You can contact us on WhatsApp for instant support!", "I don't have the answer to that question. Please contact our support team on WhatsApp for detailed assistance."]
    };
}

function toggleAIModal() {
    const modal = document.getElementById('aiModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addAIMessage(message, 'user');
    input.value = '';
    
    // Simulate AI thinking
    setTimeout(() => {
        const response = getAIResponse(message);
        addAIMessage(response, 'bot');
    }, 500);
}

function addAIMessage(text, sender) {
    const chat = document.getElementById('aiChat');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}`;
    messageDiv.textContent = text;
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
}

function getAIResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)];
    } else if (msg.includes('service') || msg.includes('offer') || msg.includes('package')) {
        return aiResponses.services[Math.floor(Math.random() * aiResponses.services.length)];
    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('₹')) {
        return aiResponses.pricing[Math.floor(Math.random() * aiResponses.pricing.length)];
    } else if (msg.includes('contact') || msg.includes('phone') || msg.includes('email') || msg.includes('whatsapp')) {
        return aiResponses.contact[Math.floor(Math.random() * aiResponses.contact.length)];
    } else {
        // If AI doesn't understand, suggest WhatsApp
        setTimeout(() => {
            if (Math.random() > 0.5) {
                const whatsappBtn = document.createElement('div');
                whatsappBtn.innerHTML = `
                    <div style="margin-top: 10px; text-align: center;">
                        <a href="https://wa.me/917892230567?text=I need help with: ${encodeURIComponent(message)}" 
                           target="_blank" 
                           style="display: inline-block; background: #25D366; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none;">
                            <i class="fab fa-whatsapp"></i> Contact on WhatsApp
                        </a>
                    </div>
                `;
                document.getElementById('aiChat').appendChild(whatsappBtn);
            }
        }, 100);
        
        return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
    }
}

// Load Services (Fallback if Firebase not available)
function loadServicesFromLocal() {
    const services = [
        { name: "Domain Registration", desc: "Get your perfect domain name", icon: "fa-globe" },
        { name: "Premium Hosting", desc: "99.9% uptime guaranteed", icon: "fa-server" },
        { name: "Web Design", desc: "Custom designs that convert", icon: "fa-paint-brush" },
        { name: "Maintenance", desc: "Regular updates and security", icon: "fa-cogs" }
    ];
    
    // In production: Load from Firebase
    console.log('Services loaded:', services);
}

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all service and pricing cards
    document.querySelectorAll('.service-card, .pricing-card').forEach(el => {
        observer.observe(el);
    });
}

// Cookie Consent
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookieConsent').style.display = 'none';
}

// ==================== ADMIN PAGE FUNCTIONS ====================

// Initialize Admin Page
function initAdminPage() {
    console.log("Initializing admin page...");
    
    // Check authentication
    if (auth) {
        auth.onAuthStateChanged((user) => {
            if (user && user.email === 'omdigitalworks5@gmail.com') {
                // Admin authenticated
                currentUser = user;
                document.getElementById('unauthorized').style.display = 'none';
                document.getElementById('dashboard').style.display = 'flex';
                document.getElementById('adminEmail').textContent = user.email;
                loadAdminData();
            } else {
                // Not admin, show unauthorized
                showUnauthorized();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }
        });
    } else {
        // Firebase not loaded, show demo admin
        document.getElementById('unauthorized').style.display = 'none';
        document.getElementById('dashboard').style.display = 'flex';
        document.getElementById('adminEmail').textContent = 'omdigitalworks5@gmail.com (Demo)';
        loadAdminData();
    }
}

function showUnauthorized() {
    document.getElementById('unauthorized').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

// Admin Data Management
function loadAdminData() {
    // Load services
    loadServices();
    
    // Load queries
    loadQueries();
    
    // Load activity log
    loadActivityLog();
    
    // Load media files
    loadMediaFiles();
    
    // Update stats
    updateStats();
}

function loadServices() {
    // In production: Load from Firebase
    const services = [
        { id: 1, name: "Starter Pack", category: "package", price: 12000, status: "active" },
        { id: 2, name: "Standard Pack", category: "package", price: 16000, status: "active" },
        { id: 3, name: "Premium Pack", category: "package", price: 18000, status: "active" },
        { id: 4, name: "Domain Only", category: "domain", price: 999, status: "active" }
    ];
    
    const servicesList = document.getElementById('servicesList');
    if (servicesList) {
        servicesList.innerHTML = services.map(service => `
            <tr>
                <td>${service.name}</td>
                <td>${service.category}</td>
                <td>₹${service.price.toLocaleString()}</td>
                <td><span class="status ${service.status}">${service.status}</span></td>
                <td>
                    <button onclick="editService(${service.id})" class="btn" style="padding: 4px 8px; margin-right: 5px;">Edit</button>
                    <button onclick="deleteService(${service.id})" class="btn btn-danger" style="padding: 4px 8px;">Delete</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('totalServices').textContent = services.length;
    }
}

function loadQueries() {
    // In production: Load from Firebase
    const queries = [
        { id: 1, name: "John Doe", email: "john@example.com", service: "Premium Pack", message: "Interested in your services", status: "pending", date: "2024-01-15" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", service: "Starter Pack", message: "Need more information", status: "replied", date: "2024-01-14" }
    ];
    
    const queriesList = document.getElementById('queriesList');
    if (queriesList) {
        queriesList.innerHTML = queries.map(query => `
            <tr>
                <td>${query.name}</td>
                <td>${query.email}</td>
                <td>${query.service}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${query.message}</td>
                <td><span class="status ${query.status}">${query.status}</span></td>
                <td>${query.date}</td>
                <td>
                    <button onclick="replyToQuery(${query.id})" class="btn btn-success" style="padding: 4px 8px; margin-right: 5px;">Reply</button>
                    <button onclick="markQueryStatus(${query.id}, '${query.status === 'pending' ? 'replied' : 'pending'}')" class="btn" style="padding: 4px 8px;">
                        ${query.status === 'pending' ? 'Mark Replied' : 'Mark Pending'}
                    </button>
                </td>
            </tr>
        `).join('');
        
        const pendingCount = queries.filter(q => q.status === 'pending').length;
        document.getElementById('pendingQueries').textContent = pendingCount;
    }
}

function loadActivityLog() {
    const activities = [
        { id: 1, action: "Service added", details: "Premium Pack", time: "2 hours ago" },
        { id: 2, action: "Query replied", details: "John Doe's inquiry", time: "1 day ago" },
        { id: 3, action: "Media uploaded", details: "Service image", time: "2 days ago" }
    ];
    
    const recentActivity = document.getElementById('recentActivity');
    const fullActivityLog = document.getElementById('fullActivityLog');
    
    if (recentActivity) {
        recentActivity.innerHTML = activities.map(activity => `
            <div class="log-item">
                <div class="log-icon">
                    <i class="fas fa-history"></i>
                </div>
                <div class="log-content">
                    <strong>${activity.action}</strong>
                    <p>${activity.details}</p>
                </div>
                <div class="log-time">${activity.time}</div>
            </div>
        `).join('');
    }
    
    if (fullActivityLog) {
        fullActivityLog.innerHTML = activities.map(activity => `
            <div class="log-item">
                <div class="log-icon">
                    <i class="fas fa-history"></i>
                </div>
                <div class="log-content">
                    <strong>${activity.action}</strong>
                    <p>${activity.details}</p>
                </div>
                <div class="log-time">${activity.time}</div>
            </div>
        `).join('');
    }
}

function loadMediaFiles() {
    // In production: Load from Firebase Storage
    const mediaGallery = document.getElementById('mediaGallery');
    if (mediaGallery) {
        mediaGallery.innerHTML = `
            <div class="preview-item">
                <img src="https://via.placeholder.com/150" alt="Service Image">
                <button class="delete-btn" onclick="deleteMedia(1)">×</button>
            </div>
            <div class="preview-item">
                <img src="https://via.placeholder.com/150" alt="Service Image">
                <button class="delete-btn" onclick="deleteMedia(2)">×</button>
            </div>
        `;
        
        document.getElementById('mediaFiles').textContent = 2;
    }
}

function updateStats() {
    // Calculate revenue (demo data)
    const totalRevenue = 12000 + 16000 + 18000; // Sample revenue
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
}

// Admin CRUD Operations
function showServiceForm(serviceId = null) {
    const form = document.getElementById('serviceForm');
    const title = document.getElementById('formTitle');
    
    if (serviceId) {
        title.textContent = 'Edit Service';
        // In production: Load service data
    } else {
        title.textContent = 'Add New Service';
        document.getElementById('serviceForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
    }
    
    form.style.display = 'block';
    window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });
}

function hideServiceForm() {
    document.getElementById('serviceForm').style.display = 'none';
}

function saveService() {
    const name = document.getElementById('serviceName').value;
    const category = document.getElementById('serviceCategory').value;
    const price = document.getElementById('servicePrice').value;
    
    if (!name || !category || !price) {
        alert('Please fill in all required fields');
        return;
    }
    
    // In production: Save to Firebase
    console.log('Saving service:', { name, category, price });
    alert('Service saved successfully!');
    
    // Reload services
    loadServices();
    hideServiceForm();
    
    // Add to activity log
    addActivityLog('Service ' + (document.getElementById('formTitle').textContent.includes('Edit') ? 'updated' : 'added'), name);
}

function editService(id) {
    alert(`Edit service ${id} - This would load service data in production`);
    showServiceForm(id);
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        // In production: Delete from Firebase
        console.log('Deleting service:', id);
        alert('Service deleted!');
        loadServices();
        addActivityLog('Service deleted', `ID: ${id}`);
    }
}

function uploadMedia() {
    document.getElementById('mediaUpload').click();
}

function handleMediaUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        // In production: Upload to Firebase Storage
        alert(`${files.length} file(s) selected. In production, these would be uploaded to Firebase Storage.`);
        
        // Simulate upload
        setTimeout(() => {
            loadMediaFiles();
            addActivityLog('Media uploaded', `${files.length} file(s)`);
        }, 1000);
    }
}

function deleteMedia(id) {
    if (confirm('Delete this media file?')) {
        // In production: Delete from Firebase Storage
        console.log('Deleting media:', id);
        loadMediaFiles();
        addActivityLog('Media deleted', `File ID: ${id}`);
    }
}

function replyToQuery(id) {
    const message = prompt('Enter your reply message:');
    if (message) {
        // In production: Send email/WhatsApp and update status
        console.log(`Replying to query ${id}: ${message}`);
        alert('Reply sent!');
        
        // Update status
        markQueryStatus(id, 'replied');
        addActivityLog('Query replied', `Query ID: ${id}`);
    }
}

function markQueryStatus(id, status) {
    // In production: Update in Firebase
    console.log(`Marking query ${id} as ${status}`);
    loadQueries();
    addActivityLog('Query status updated', `ID: ${id} -> ${status}`);
}

function markAllReplied() {
    if (confirm('Mark all queries as replied?')) {
        // In production: Update all in Firebase
        alert('All queries marked as replied!');
        loadQueries();
        addActivityLog('All queries marked as replied', '');
    }
}

function addActivityLog(action, details) {
    const activity = {
        action,
        details,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const logItem = `
        <div class="log-item">
            <div class="log-icon">
                <i class="fas fa-history"></i>
            </div>
            <div class="log-content">
                <strong>${action}</strong>
                <p>${details}</p>
            </div>
            <div class="log-time">Just now</div>
        </div>
    `;
    
    // Add to both activity logs
    const recentActivity = document.getElementById('recentActivity');
    const fullActivityLog = document.getElementById('fullActivityLog');
    
    if (recentActivity) {
        recentActivity.insertAdjacentHTML('afterbegin', logItem);
    }
    
    if (fullActivityLog) {
        fullActivityLog.insertAdjacentHTML('afterbegin', logItem);
    }
}

function clearActivityLog() {
    if (confirm('Clear all activity logs?')) {
        document.getElementById('fullActivityLog').innerHTML = '<p style="text-align: center; color: var(--text-muted);">No activity yet</p>';
        addActivityLog('Activity log cleared', '');
    }
}

function clearAllData() {
    if (confirm('WARNING: This will clear all demo data. Continue?')) {
        alert('Demo data cleared. In production, this would clear Firebase collections.');
        loadServices();
        loadQueries();
        loadMediaFiles();
        addActivityLog('All data cleared', 'Demo reset');
    }
}

function switchTab(tabId) {
    // Update tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-panel').forEach(panel => panel.classList.remove('active'));
    
    // Activate selected tab
    document.querySelector(`.tab[onclick*="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}Panel`).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    document.querySelector(`.nav-links a[onclick*="${tabId}"]`).classList.add('active');
}

function toggleAIMode() {
    aiModeEnabled = !aiModeEnabled;
    document.getElementById('aiModeStatus').textContent = aiModeEnabled ? 'ON' : 'OFF';
    document.getElementById('aiModeToggle').checked = aiModeEnabled;
    alert(`AI Description Mode ${aiModeEnabled ? 'enabled' : 'disabled'}`);
    addActivityLog('AI Mode toggled', aiModeEnabled ? 'Enabled' : 'Disabled');
}

function previewServiceImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function syncData() {
    alert('Syncing data...');
    loadAdminData();
    addActivityLog('Data synced', 'Manual sync triggered');
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        initAdminPage();
    } else {
        initCustomerPage();
    }
    
    // Initialize auth forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => handleAuthSubmit(e, 'login'));
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => handleAuthSubmit(e, 'signup'));
    }
});
