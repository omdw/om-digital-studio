

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // Replace with your Firebase API key
    authDomain: "YOUR_AUTH_DOMAIN", // Replace with your Firebase auth domain
    databaseURL: "YOUR_DATABASE_URL", // Replace with your Firebase database URL
    projectId: "YOUR_PROJECT_ID", // Replace with your Firebase project ID
    storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your Firebase storage bucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your Firebase messaging sender ID
    appId: "YOUR_APP_ID" // Replace with your Firebase app ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Admin Email - ONLY this email can access admin panel
const ADMIN_EMAIL = 'omdigitalworks5@gmail.com';

// Global State
let currentUser = null;
let serviceBotEnabled = false;

// AI Bot FAQ Knowledge Base
const botKnowledge = {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    pricing: ['price', 'cost', 'pricing', 'package', 'how much'],
    services: ['service', 'what do you do', 'offerings', 'what can you help'],
    contact: ['contact', 'phone', 'email', 'reach', 'whatsapp'],
    location: ['where', 'location', 'address', 'based'],
    timeline: ['how long', 'duration', 'time', 'delivery'],
    
    responses: {
        greeting: "Hello! Welcome to OM Digital Studio. 👋 How can I assist you today?",
        pricing: "We offer 4 premium packages:\n\n• Starter: ₹12,000\n• Professional: ₹16,000 (Most Popular)\n• Business: ₹18,000\n• Enterprise: ₹22,000\n\nWould you like details about any specific package?",
        services: "We provide world-class digital services including:\n\n• Web Design & Development\n• Brand Identity & Logo Design\n• Social Media Marketing\n• SEO Optimization\n• E-Commerce Solutions\n• Custom Digital Solutions\n\nWhat interests you most?",
        contact: "📞 You can reach us via:\n\n• Email: omdigitalworks5@gmail.com\n• WhatsApp: Available for instant queries\n• Contact Form: Fill out our inquiry form\n\nWould you like to send us a message?",
        location: "We're based in Huvinahadagali, Karnataka, India. 📍\n\nWe serve clients nationwide and provide remote services globally.",
        timeline: "Project timelines vary based on complexity:\n\n• Starter Package: 7-10 days\n• Professional: 14-21 days\n• Business: 21-30 days\n• Enterprise: 30-45 days\n\nWe ensure quality delivery within agreed timelines!",
        default: "I'm not sure about that specific query. 🤔\n\nWould you like me to connect you with our team on WhatsApp for personalized assistance?"
    }
};

// Service Bot Auto-Generation Template
const serviceTemplate = {
    generateDescription: (serviceName) => {
        const templates = [
            `Transform your business with our premium ${serviceName} solutions. We combine cutting-edge technology with creative excellence to deliver outstanding results that exceed expectations.`,
            `Experience world-class ${serviceName} services tailored to your unique needs. Our expert team ensures every detail is crafted to perfection, driving your brand's digital success.`,
            `Elevate your brand with our professional ${serviceName} offerings. We deliver innovative solutions that captivate your audience and accelerate your business growth.`,
            `Unlock your brand's potential with our comprehensive ${serviceName} services. From concept to execution, we create digital experiences that inspire and convert.`
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    initializeNavigation();
    initializeChatBot();
    loadServices();
    initializeContactForm();
    initializeAdminPanel();
});

// Authentication Functions
function initializeAuth() {
    auth.onAuthStateChanged(user => {
        currentUser = user;
        updateUIForAuth(user);
    });

    // Login button handlers
    document.getElementById('loginBtn').addEventListener('click', openAuthModal);
    document.getElementById('mobileLoginBtn').addEventListener('click', openAuthModal);
    document.getElementById('closeAuthModal').addEventListener('click', closeAuthModal);
    
    // Google Sign In
    document.getElementById('googleSignIn').addEventListener('click', signInWithGoogle);
    
    // Email Sign In
    document.getElementById('emailSignIn').addEventListener('submit', signInWithEmail);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

function openAuthModal() {
    document.getElementById('authModal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
}

async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        closeAuthModal();
        checkAdminAccess(result.user);
    } catch (error) {
        showMessage('Login failed. Please try again.', 'error');
        console.error('Google sign-in error:', error);
    }
}

async function signInWithEmail(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    
    try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        closeAuthModal();
        checkAdminAccess(result.user);
    } catch (error) {
        showMessage('Invalid credentials. Please try again.', 'error');
        console.error('Email sign-in error:', error);
    }
}

async function logout() {
    try {
        await auth.signOut();
        showCustomerView();
        showMessage('Logged out successfully', 'success');
    } catch (error) {
        showMessage('Logout failed', 'error');
        console.error('Logout error:', error);
    }
}

function checkAdminAccess(user) {
    if (user && user.email === ADMIN_EMAIL) {
        showAdminPanel();
        document.getElementById('adminEmail').textContent = user.email;
    } else {
        showCustomerView();
        showMessage('Welcome! Browse our services and packages.', 'success');
    }
}

function updateUIForAuth(user) {
    if (user) {
        document.getElementById('loginBtn').textContent = user.email === ADMIN_EMAIL ? 'Dashboard' : 'Profile';
        document.getElementById('mobileLoginBtn').textContent = user.email === ADMIN_EMAIL ? 'Dashboard' : 'Profile';
        if (user.email === ADMIN_EMAIL) {
            showAdminPanel();
        }
    } else {
        document.getElementById('loginBtn').textContent = 'Login';
        document.getElementById('mobileLoginBtn').textContent = 'Login';
        showCustomerView();
    }
}

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                mobileMenu.classList.add('hidden');
            }
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)';
        }
        
        lastScroll = currentScroll;
    });
}

// View Management
function showAdminPanel() {
    document.getElementById('customerView').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    loadAdminData();
}

function showCustomerView() {
    document.getElementById('customerView').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
}

// Services Management
async function loadServices() {
    try {
        const snapshot = await database.ref('services').once('value');
        const services = snapshot.val();
        
        const servicesGrid = document.getElementById('servicesGrid');
        servicesGrid.innerHTML = '';
        
        if (services) {
            Object.entries(services).forEach(([id, service]) => {
                const serviceCard = createServiceCard(service);
                servicesGrid.appendChild(serviceCard);
            });
        } else {
            // Load default services if none exist
            loadDefaultServices();
        }
    } catch (error) {
        console.error('Error loading services:', error);
        loadDefaultServices();
    }
}

function loadDefaultServices() {
    const defaultServices = [
        {
            name: 'Web Design',
            image: 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Web+Design',
            description: 'Create stunning, responsive websites that captivate your audience and drive conversions with modern design principles.'
        },
        {
            name: 'Brand Identity',
            image: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Branding',
            description: 'Build a memorable brand identity with professional logo design, color palettes, and comprehensive brand guidelines.'
        },
        {
            name: 'Digital Marketing',
            image: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=Marketing',
            description: 'Amplify your online presence with strategic digital marketing campaigns that deliver measurable results.'
        },
        {
            name: 'SEO Optimization',
            image: 'https://via.placeholder.com/400x300/14b8a6/ffffff?text=SEO',
            description: 'Boost your search rankings and organic traffic with comprehensive SEO strategies and technical optimization.'
        },
        {
            name: 'E-Commerce',
            image: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=E-Commerce',
            description: 'Launch your online store with powerful e-commerce solutions designed to maximize sales and customer satisfaction.'
        },
        {
            name: 'UI/UX Design',
            image: 'https://via.placeholder.com/400x300/10b981/ffffff?text=UI%2FUX',
            description: 'Design intuitive user experiences that delight customers and enhance engagement through thoughtful UX research.'
        }
    ];
    
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.innerHTML = '';
    
    defaultServices.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });
}

function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
        <img src="${service.image}" alt="${service.name}" loading="lazy">
        <h3>${service.name}</h3>
        <p>${service.description}</p>
    `;
    return card;
}

// Admin Panel Functions
function initializeAdminPanel() {
    // Tab switching
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchAdminTab(tabName);
        });
    });
    
    // Service form submission
    document.getElementById('addServiceForm').addEventListener('submit', addService);
    
    // Service bot toggle
    document.getElementById('serviceBotToggle').addEventListener('change', toggleServiceBot);
}

function switchAdminTab(tabName) {
    // Update active tab
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Show corresponding content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${tabName}Tab`).classList.remove('hidden');
}

async function loadAdminData() {
    await loadAdminServices();
    await loadQueries();
}

async function loadAdminServices() {
    try {
        const snapshot = await database.ref('services').once('value');
        const services = snapshot.val();
        
        const servicesList = document.getElementById('servicesList');
        servicesList.innerHTML = '';
        
        if (services) {
            Object.entries(services).forEach(([id, service]) => {
                const serviceCard = createAdminServiceCard(id, service);
                servicesList.appendChild(serviceCard);
            });
        }
    } catch (error) {
        console.error('Error loading admin services:', error);
    }
}

function createAdminServiceCard(id, service) {
    const card = document.createElement('div');
    card.className = 'glass-card p-6';
    card.innerHTML = `
        <img src="${service.image}" alt="${service.name}" class="w-full h-48 object-cover rounded-xl mb-4">
        <h3 class="text-xl font-bold text-gray-800 mb-2">${service.name}</h3>
        <p class="text-gray-600 mb-4 text-sm">${service.description}</p>
        <button onclick="deleteService('${id}')" class="btn-delete">Delete Service</button>
    `;
    return card;
}

async function addService(e) {
    e.preventDefault();
    
    const name = document.getElementById('serviceName').value;
    const image = document.getElementById('serviceImage').value;
    let description = document.getElementById('serviceDescription').value;
    
    // Auto-generate description if Service Bot is enabled and description is empty
    if (serviceBotEnabled && !description.trim()) {
        description = serviceTemplate.generateDescription(name);
    }
    
    if (!description.trim()) {
        showMessage('Please provide a description or enable Service Bot', 'error');
        return;
    }
    
    try {
        await database.ref('services').push({
            name,
            image,
            description,
            createdAt: Date.now()
        });
        
        showMessage('Service added successfully!', 'success');
        document.getElementById('addServiceForm').reset();
        loadAdminServices();
        loadServices();
    } catch (error) {
        showMessage('Error adding service', 'error');
        console.error('Error adding service:', error);
    }
}

async function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        try {
            await database.ref(`services/${id}`).remove();
            showMessage('Service deleted successfully', 'success');
            loadAdminServices();
            loadServices();
        } catch (error) {
            showMessage('Error deleting service', 'error');
            console.error('Error deleting service:', error);
        }
    }
}

function toggleServiceBot(e) {
    serviceBotEnabled = e.target.checked;
    const message = serviceBotEnabled ? 
        'Service Bot enabled - descriptions will be auto-generated' : 
        'Service Bot disabled';
    showMessage(message, 'success');
}

// Contact Form
function initializeContactForm() {
    document.getElementById('contactForm').addEventListener('submit', submitContactForm);
}

async function submitContactForm(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        timestamp: Date.now(),
        status: 'new'
    };
    
    try {
        await database.ref('queries').push(formData);
        showMessage('Thank you! We\'ll get back to you shortly.', 'success');
        document.getElementById('contactForm').reset();
        
        // Also send to WhatsApp
        const whatsappMessage = `New Inquiry from ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${formData.service}\nMessage: ${formData.message}`;
        const whatsappUrl = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    } catch (error) {
        showMessage('Error submitting form. Please try WhatsApp.', 'error');
        console.error('Error submitting form:', error);
    }
}

async function loadQueries() {
    try {
        const snapshot = await database.ref('queries').orderByChild('timestamp').once('value');
        const queries = snapshot.val();
        
        const queriesList = document.getElementById('queriesList');
        queriesList.innerHTML = '';
        
        if (queries) {
            const queriesArray = Object.entries(queries).reverse();
            queriesArray.forEach(([id, query]) => {
                const queryCard = createQueryCard(id, query);
                queriesList.appendChild(queryCard);
            });
        } else {
            queriesList.innerHTML = '<p class="text-gray-500">No customer inquiries yet.</p>';
        }
    } catch (error) {
        console.error('Error loading queries:', error);
    }
}

function createQueryCard(id, query) {
    const card = document.createElement('div');
    card.className = 'query-card';
    const date = new Date(query.timestamp).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <h3>${query.name}</h3>
            <span class="query-badge">${query.status}</span>
        </div>
        <p class="mb-2"><strong>Email:</strong> ${query.email}</p>
        <p class="mb-2"><strong>Phone:</strong> ${query.phone}</p>
        <p class="mb-2"><strong>Service:</strong> ${query.service}</p>
        <p class="mb-3"><strong>Message:</strong> ${query.message}</p>
        <p class="text-xs text-gray-500">${date}</p>
    `;
    return card;
}

// Chat Bot Functions
function initializeChatBot() {
    const chatBotToggle = document.getElementById('chatBotToggle');
    const chatBot = document.getElementById('chatBot');
    const closeChatBot = document.getElementById('closeChatBot');
    const chatForm = document.getElementById('chatForm');
    
    chatBotToggle.addEventListener('click', () => {
        chatBot.classList.toggle('hidden');
    });
    
    closeChatBot.addEventListener('click', () => {
        chatBot.classList.add('hidden');
    });
    
    chatForm.addEventListener('submit', handleChatMessage);
}

function handleChatMessage(e) {
    e.preventDefault();
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Process and respond
    setTimeout(() => {
        const response = getBotResponse(message);
        addChatMessage(response, 'bot');
    }, 500);
}

function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (botKnowledge.greetings.some(word => lowerMessage.includes(word))) {
        return botKnowledge.responses.greeting;
    }
    
    // Check for pricing queries
    if (botKnowledge.pricing.some(word => lowerMessage.includes(word))) {
        return botKnowledge.responses.pricing;
    }
    
    // Check for service queries
    if (botKnowledge.services.some(word => lowerMessage.includes(word))) {
        return botKnowledge.responses.services;
    }
    
    // Check for contact queries
    if (botKnowledge.contact.some(word => lowerMessage.includes(word))) {
        return botKnowledge.responses.contact;
    }
    
    // Check for location queries
    if (botKnowledge.location.some(word => lowerMessage.includes(word))) {
        return botKnowledge.responses.location;
    }
    
    // Check for timeline queries
    if (botKnowledge.timeline.some(word => lowerMessage.includes(word))) {
        return botKnowledge.responses.timeline;
    }
    
    // Default response with WhatsApp option
    return botKnowledge.responses.default;
}

// WhatsApp Integration
function openWhatsApp(packageName) {
    const message = `Hi! I'm interested in the ${packageName}. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Utility Functions
function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'message-success' : 'message-error';
    messageDiv.textContent = text;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '100px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.maxWidth = '400px';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Export for inline use
window.openWhatsApp = openWhatsApp;
window.deleteService = deleteService;
