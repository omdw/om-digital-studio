// DOM Elements
const loadingEl = document.getElementById('loading');
const customerView = document.getElementById('customer-view');
const adminPanel = document.getElementById('admin-panel');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const servicesContainer = document.getElementById('services');
const adminServicesContainer = document.getElementById('admin-services');
const inquiryForm = document.getElementById('inquiry-form');
const openBotBtn = document.getElementById('open-bot');
const closeBotBtn = document.getElementById('close-bot');
const botPanel = document.getElementById('bot-panel');
const botInput = document.getElementById('bot-input');
const sendBotBtn = document.getElementById('send-bot');
const botMessages = document.getElementById('bot-messages');
const serviceBotToggle = document.getElementById('service-bot-toggle');

// Firebase references
const { auth, db, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, 
        collection, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc } = window.firebase;

// AI Bot Knowledge Base
const aiKnowledge = {
  "pricing": "Our packages start at ₹12,000 for basic photography and go up to ₹22,000 for premium video production.",
  "services": "We offer photography, videography, drone shots, editing, and branding services.",
  "location": "We're based in Huvinahadagali, Karnataka, but serve clients across South India.",
  "turnaround": "Standard delivery takes 7-10 business days after shoot completion.",
  "whatsapp": "For urgent queries, message us directly on WhatsApp: +919876543210"
};

// Show loading spinner
function showLoading() {
  loadingEl.classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
  loadingEl.classList.add('hidden');
}

// Initialize Firebase Auth state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    
    // Check if admin
    if (user.email === 'omdigitalworks5@gmail.com') {
      customerView.classList.add('hidden');
      adminPanel.classList.remove('hidden');      loadAdminServices();
      loadServiceBotSetting();
    } else {
      customerView.classList.remove('hidden');
      adminPanel.classList.add('hidden');
      loadServices();
    }
  } else {
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    customerView.classList.remove('hidden');
    adminPanel.classList.add('hidden');
    loadServices();
  }
});

// Login with Google
loginBtn.addEventListener('click', () => {
  showLoading();
  signInWithPopup(auth, new GoogleAuthProvider())
    .catch(() => hideLoading());
});

// Logout
logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

// Load services for customer view
async function loadServices() {
  try {
    const querySnapshot = await getDocs(collection(db, 'services'));
    servicesContainer.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      servicesContainer.innerHTML += `
        <div class="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
          <img src="${data.image || 'https://via.placeholder.com/400x250'}" alt="${data.title}" class="w-full h-48 object-cover rounded-xl mb-4">
          <h3 class="text-xl font-bold mb-2">${data.title}</h3>
          <p class="text-gray-600">${data.description || 'Premium service description'}</p>
        </div>
      `;
    });
  } catch (e) {
    console.error("Error loading services:", e);
  }
}

// Load services for admin panel
async function loadAdminServices() {  try {
    const querySnapshot = await getDocs(collection(db, 'services'));
    adminServicesContainer.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      adminServicesContainer.innerHTML += `
        <div class="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 class="font-bold">${data.title}</h4>
            <p class="text-sm text-gray-600 truncate max-w-xs">${data.description}</p>
          </div>
          <button onclick="deleteService('${doc.id}')" class="text-red-500 hover:text-red-700">Delete</button>
        </div>
      `;
    });
  } catch (e) {
    console.error("Error loading admin services:", e);
  }
}

// Add new service
document.getElementById('add-service').addEventListener('click', async () => {
  const title = document.getElementById('service-title').value;
  const image = document.getElementById('service-image').value;
  let desc = document.getElementById('service-desc').value;
  
  // Auto-generate description if bot is enabled
  if (serviceBotToggle.checked && !desc) {
    desc = `Professional ${title.toLowerCase()} service by OM Digital Studio. High-quality results with attention to detail. Serving Huvinahadagali since 2020.`;
  }
  
  if (!title) return alert('Please enter a service title');
  
  try {
    await addDoc(collection(db, 'services'), { title, image, description: desc });
    document.getElementById('service-title').value = '';
    document.getElementById('service-image').value = '';
    document.getElementById('service-desc').value = '';
    loadAdminServices();
    loadServices(); // Update customer view
  } catch (e) {
    console.error("Error adding service:", e);
  }
});

// Delete service
window.deleteService = async (id) => {
  if (!confirm('Delete this service?')) return;
  try {
    await deleteDoc(doc(db, 'services', id));    loadAdminServices();
    loadServices();
  } catch (e) {
    console.error("Error deleting service:", e);
  }
};

// Service Bot Toggle
serviceBotToggle.addEventListener('change', async () => {
  try {
    await setDoc(doc(db, 'settings', 'serviceBot'), { enabled: serviceBotToggle.checked });
  } catch (e) {
    console.error("Error saving bot setting:", e);
  }
});

// Load Service Bot setting
async function loadServiceBotSetting() {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'serviceBot'));
    if (docSnap.exists()) {
      serviceBotToggle.checked = docSnap.data().enabled;
    }
  } catch (e) {
    console.error("Error loading bot setting:", e);
  }
}

// Inquiry Form Submission
inquiryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // Save to Firestore
  addDoc(collection(db, 'inquiries'), { name, email, message, timestamp: new Date() })
    .then(() => {
      // Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/919876543210?text=Hi%20OM%20Digital%20Studio!%20I'm%20${encodeURIComponent(name)}%20(${email}).%20${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      inquiryForm.reset();
    })
    .catch(console.error);
});

// AI Bot Functions
openBotBtn.addEventListener('click', () => botPanel.classList.toggle('hidden'));
closeBotBtn.addEventListener('click', () => botPanel.classList.add('hidden'));
sendBotBtn.addEventListener('click', handleBotMessage);
botInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleBotMessage();
});

function handleBotMessage() {
  const input = botInput.value.trim().toLowerCase();
  if (!input) return;
  
  // Add user message
  botMessages.innerHTML += `<div class="text-right"><div class="inline-block bg-blue-100 text-gray-800 p-3 rounded-xl">${input}</div></div>`;
  botInput.value = '';
  
  // Find response
  let response = "I couldn't find that information. ";
  for (const [key, value] of Object.entries(aiKnowledge)) {
    if (input.includes(key)) {
      response = value;
      break;
    }
  }
  
  // Add bot response
  setTimeout(() => {
    botMessages.innerHTML += `<div class="bg-gray-100 p-3 rounded-xl">${response}<br><button onclick="transferToWhatsApp()" class="text-blue-600 underline mt-2">Transfer to WhatsApp</button></div>`;
    botMessages.scrollTop = botMessages.scrollHeight;
  }, 500);
}

function transferToWhatsApp() {
  window.open('https://wa.me/919876543210', '_blank');
  botPanel.classList.add('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Apply styles.css
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = 'styles.css';
  document.head.appendChild(styleLink);
});