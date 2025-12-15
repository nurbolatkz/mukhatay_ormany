// Sample data for the application
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let donations = JSON.parse(localStorage.getItem('donations')) || [];
let applications = JSON.parse(localStorage.getItem('applications')) || [];

// DOM Elements
const homePage = document.getElementById('home-page');
const dashboardPage = document.getElementById('dashboard-page');
const adminPage = document.getElementById('admin-page');
const authSection = document.getElementById('auth-section');
const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmitText = document.getElementById('auth-submit-text');
const toggleAuthText = document.getElementById('toggle-auth-text');
const toggleAuthMode = document.getElementById('toggle-auth-mode');
const registerFields = document.getElementById('register-fields');
const closeAuthModal = document.getElementById('close-auth-modal');
const plantTreeBtn = document.getElementById('plant-tree-btn');
const chooseLocationBtn = document.getElementById('choose-location-btn');

// Authentication state
let isRegisterMode = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavigation();
        showDashboard();
    } else {
        updateNavigation();
        showHomePage();
    }
    
    // Event listeners
    toggleAuthMode.addEventListener('click', toggleAuthForm);
    authForm.addEventListener('submit', handleAuthSubmit);
    closeAuthModal.addEventListener('click', closeAuthModalFunc);
    plantTreeBtn.addEventListener('click', openAuthModal);
    chooseLocationBtn.addEventListener('click', openAuthModal);
});

// Toggle between login and register forms
function toggleAuthForm() {
    isRegisterMode = !isRegisterMode;
    
    if (isRegisterMode) {
        authTitle.textContent = 'Регистрация';
        authSubmitText.textContent = 'Зарегистрироваться';
        registerFields.classList.remove('hidden');
        toggleAuthText.textContent = 'Уже есть аккаунт?';
        toggleAuthMode.textContent = 'Войти';
    } else {
        authTitle.textContent = 'Вход';
        authSubmitText.textContent = 'Войти';
        registerFields.classList.add('hidden');
        toggleAuthText.textContent = 'Нет аккаунта?';
        toggleAuthMode.textContent = 'Зарегистрироваться';
    }
}

// Handle authentication form submission
function handleAuthSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (isRegisterMode) {
        const name = document.getElementById('name').value;
        
        // Check if user already exists
        if (users.some(user => user.email === email)) {
            alert('Пользователь с таким email уже существует!');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: 'user'
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto-login
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        closeAuthModalFunc();
        updateNavigation();
        showDashboard();
        alert('Регистрация успешна!');
    } else {
        // Login
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            closeAuthModalFunc();
            updateNavigation();
            showDashboard();
            alert('Вход выполнен успешно!');
        } else {
            alert('Неверный email или пароль!');
        }
    }
}

// Open authentication modal
function openAuthModal() {
    isRegisterMode = false;
    toggleAuthForm(); // Reset to login form
    authModal.classList.remove('hidden');
}

// Close authentication modal
function closeAuthModalFunc() {
    authModal.classList.add('hidden');
    authForm.reset();
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNavigation();
    showHomePage();
}

// Update navigation based on authentication state
function updateNavigation() {
    if (currentUser) {
        authSection.innerHTML = `
            <span class="text-sm text-muted-foreground">${currentUser.name}</span>
            <button onclick="showDashboard()" class="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                Личный кабинет
            </button>
            <button onclick="logout()" class="px-4 py-2 rounded-lg font-semibold text-red-600 border border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300">
                Выйти
            </button>
        `;
    } else {
        authSection.innerHTML = `
            <button onclick="openAuthModal()" class="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                Войти
            </button>
        `;
    }
}

// Show home page
function showHomePage() {
    homePage.classList.remove('hidden');
    dashboardPage.classList.add('hidden');
    adminPage.classList.add('hidden');
}

// Show dashboard page
function showDashboard() {
    if (!currentUser) {
        openAuthModal();
        return;
    }
    
    homePage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
    adminPage.classList.add('hidden');
    
    // Update user name
    document.getElementById('user-name').textContent = currentUser.name;
    
    // Update donations stats
    const userDonations = donations.filter(d => d.userId === currentUser.id);
    document.getElementById('total-donations').textContent = userDonations.length;
    const totalTrees = userDonations.reduce((sum, d) => sum + d.treeQuantity, 0);
    document.getElementById('trees-planted').textContent = totalTrees;
    
    // Render donations
    renderDonations(userDonations);
    
    // Render applications
    const userApplications = applications.filter(a => a.userId === currentUser.id);
    renderApplications(userApplications);
}

// Show admin page
function showAdminPanel() {
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Доступ запрещен. Требуются права администратора.');
        return;
    }
    
    homePage.classList.add('hidden');
    dashboardPage.classList.add('hidden');
    adminPage.classList.remove('hidden');
    
    // Update stats
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('admin-total-donations').textContent = donations.length;
    const pendingApps = applications.filter(a => a.status === 'pending').length;
    document.getElementById('pending-applications').textContent = pendingApps;
    
    // Render admin applications
    renderAdminApplications();
    
    // Set up tab switching
    document.getElementById('applications-tab').addEventListener('click', function() {
        document.getElementById('applications-tab').className = 'px-6 py-3 font-semibold transition-all text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400';
        document.getElementById('users-tab').className = 'px-6 py-3 font-semibold transition-all text-muted-foreground hover:text-foreground';
        document.getElementById('applications-tab-content').classList.remove('hidden');
        document.getElementById('users-tab-content').classList.add('hidden');
    });
    
    document.getElementById('users-tab').addEventListener('click', function() {
        document.getElementById('users-tab').className = 'px-6 py-3 font-semibold transition-all text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400';
        document.getElementById('applications-tab').className = 'px-6 py-3 font-semibold transition-all text-muted-foreground hover:text-foreground';
        document.getElementById('users-tab-content').classList.remove('hidden');
        document.getElementById('applications-tab-content').classList.add('hidden');
        renderAdminUsers();
    });
}

// Render donations for dashboard
function renderDonations(donationsList) {
    const container = document.getElementById('donations-container');
    
    if (donationsList.length === 0) {
        container.innerHTML = `
            <div class="glass-web3 p-12 rounded-2xl text-center border border-green-500/30">
                <p class="text-muted-foreground mb-4">Пока нет пожертвований. Начните свое путешествие сегодня!</p>
                <button onclick="alert('Функция пожертвований будет реализована в полной версии')" class="btn-premium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    Сделать первое пожертвование
                    <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        `;
        return;
    }
    
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
    
    donationsList.forEach((donation, index) => {
        html += `
            <div class="glass-web3 p-6 rounded-2xl border border-green-500/30 hover:border-green-500/60 transition-all cursor-pointer">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <p class="text-muted-foreground text-sm">ID пожертвования: ${donation.id}</p>
                        <p class="text-2xl font-bold mt-2">${donation.treeQuantity} Деревьев</p>
                    </div>
                    <div class="animate-rotate3d">
                        <i class="fas fa-tree text-2xl text-green-600 dark:text-green-400"></i>
                    </div>
                </div>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Сумма:</span>
                        <span class="font-semibold">$${(donation.amount / 100).toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Дата:</span>
                        <span class="font-semibold">${new Date(donation.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Render applications for dashboard
function renderApplications(applicationsList) {
    const container = document.getElementById('applications-container');
    
    if (applicationsList.length === 0) {
        container.innerHTML = `
            <div class="glass-web3 p-12 rounded-2xl text-center border border-green-500/30">
                <p class="text-muted-foreground">Пока нет заявок. Сделайте пожертвование, чтобы начать!</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="space-y-4">';
    
    applicationsList.forEach((app, index) => {
        let statusClass = '';
        let statusIcon = '';
        
        switch (app.status) {
            case 'pending':
                statusClass = 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200 border-yellow-500/50';
                statusIcon = '<i class="fas fa-clock mr-2"></i>';
                break;
            case 'approved':
                statusClass = 'bg-green-500/20 text-green-700 dark:text-green-200 border-green-500/50';
                statusIcon = '<i class="fas fa-check-circle mr-2"></i>';
                break;
            case 'rejected':
                statusClass = 'bg-red-500/20 text-red-700 dark:text-red-200 border-red-500/50';
                statusIcon = '<i class="fas fa-times-circle mr-2"></i>';
                break;
            case 'processing':
                statusClass = 'bg-blue-500/20 text-blue-700 dark:text-blue-200 border-blue-500/50';
                statusIcon = '<i class="fas fa-clock mr-2"></i>';
                break;
            case 'completed':
                statusClass = 'bg-green-500/20 text-green-700 dark:text-green-200 border-green-500/50';
                statusIcon = '<i class="fas fa-check-circle mr-2"></i>';
                break;
            case 'failed':
                statusClass = 'bg-red-500/20 text-red-700 dark:text-red-200 border-red-500/50';
                statusIcon = '<i class="fas fa-times-circle mr-2"></i>';
                break;
        }
        
        html += `
            <div class="glass-web3 p-6 rounded-2xl border border-green-500/30 hover:border-green-500/60 transition-all">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="animate-pulse">
                            ${statusIcon}
                        </div>
                        <div>
                            <p class="font-semibold">Заявка #${app.id}</p>
                            <p class="text-sm text-muted-foreground">
                                <i class="fas fa-calendar mr-1"></i>
                                ${new Date(app.date).toLocaleDateString('ru-RU')}
                            </p>
                        </div>
                    </div>
                    <div class="px-4 py-2 rounded-full border text-sm font-semibold ${statusClass}">
                        ${app.status === 'pending' ? 'На рассмотрении' : 
                          app.status === 'approved' ? 'Одобрена' : 
                          app.status === 'rejected' ? 'Отклонена' : 
                          app.status === 'processing' ? 'В обработке' : 
                          app.status === 'completed' ? 'Завершена' : 'Ошибка'}
                    </div>
                </div>
                ${app.notes ? `<p class="text-sm text-muted-foreground mt-3 p-3 bg-muted/30 rounded-lg">
                    <strong>Примечание администратора:</strong> ${app.notes}
                </p>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Render applications for admin panel
function renderAdminApplications() {
    const container = document.getElementById('admin-applications-container');
    
    if (applications.length === 0) {
        container.innerHTML = `
            <div class="glass-web3 p-12 rounded-2xl text-center border border-green-500/30">
                <p class="text-muted-foreground">Заявок не найдено.</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="space-y-4">';
    
    applications.forEach((app, index) => {
        let statusClass = '';
        let statusIcon = '';
        
        switch (app.status) {
            case 'pending':
                statusClass = 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200 border-yellow-500/50';
                statusIcon = '<i class="fas fa-clock mr-2"></i>';
                break;
            case 'approved':
                statusClass = 'bg-green-500/20 text-green-700 dark:text-green-200 border-green-500/50';
                statusIcon = '<i class="fas fa-check-circle mr-2"></i>';
                break;
            case 'rejected':
                statusClass = 'bg-red-500/20 text-red-700 dark:text-red-200 border-red-500/50';
                statusIcon = '<i class="fas fa-times-circle mr-2"></i>';
                break;
            case 'processing':
                statusClass = 'bg-blue-500/20 text-blue-700 dark:text-blue-200 border-blue-500/50';
                statusIcon = '<i class="fas fa-clock mr-2"></i>';
                break;
        }
        
        const user = users.find(u => u.id === app.userId);
        const userName = user ? user.name : 'Неизвестный пользователь';
        
        html += `
            <div class="glass-web3 p-6 rounded-2xl border border-green-500/30 hover:border-green-500/60 transition-all">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-4">
                        <div class="animate-pulse">
                            ${statusIcon}
                        </div>
                        <div>
                            <p class="font-semibold">Заявка #${app.id}</p>
                            <p class="text-sm text-muted-foreground">Пользователь: ${userName} (ID: ${app.userId})</p>
                        </div>
                    </div>
                    <div class="px-4 py-2 rounded-full border text-sm font-semibold ${statusClass}">
                        ${app.status === 'pending' ? 'На рассмотрении' : 
                          app.status === 'approved' ? 'Одобрена' : 
                          app.status === 'rejected' ? 'Отклонена' : 'В обработке'}
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-green-500/30 space-y-4">
                    <div>
                        <label class="block text-sm font-semibold mb-2">Обновить статус</label>
                        <select onchange="updateApplicationStatus(${app.id}, this.value)" class="w-full px-4 py-2 rounded-lg border border-border bg-muted/30">
                            <option value="">Выберите статус</option>
                            <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>На рассмотрении</option>
                            <option value="approved" ${app.status === 'approved' ? 'selected' : ''}>Одобрена</option>
                            <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Отклонена</option>
                            <option value="processing" ${app.status === 'processing' ? 'selected' : ''}>В обработке</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">Примечания администратора</label>
                        <input type="text" value="${app.notes || ''}" onchange="updateApplicationNotes(${app.id}, this.value)" placeholder="Добавьте примечания для пользователя..." class="w-full px-4 py-2 rounded-lg border border-border bg-muted/30">
                    </div>
                    <button onclick="saveApplicationChanges(${app.id})" class="w-full btn-premium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <i class="fas fa-edit mr-2"></i>
                        Обновить заявку
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Update application status
function updateApplicationStatus(appId, status) {
    const app = applications.find(a => a.id === appId);
    if (app) {
        app.status = status;
        localStorage.setItem('applications', JSON.stringify(applications));
    }
}

// Update application notes
function updateApplicationNotes(appId, notes) {
    const app = applications.find(a => a.id === appId);
    if (app) {
        app.notes = notes;
        localStorage.setItem('applications', JSON.stringify(applications));
    }
}

// Save application changes
function saveApplicationChanges(appId) {
    localStorage.setItem('applications', JSON.stringify(applications));
    renderAdminApplications();
    alert('Заявка успешно обновлена!');
}

// Render users for admin panel
function renderAdminUsers() {
    const container = document.getElementById('admin-users-container');
    
    if (users.length === 0) {
        container.innerHTML = `
            <div class="glass-web3 p-12 rounded-2xl text-center border border-green-500/30">
                <p class="text-muted-foreground">Пользователей не найдено.</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="space-y-4">';
    
    users.forEach((user, index) => {
        const roleClass = user.role === 'admin' ? 
            'bg-purple-500/20 text-purple-700 dark:text-purple-200 border-purple-500/50' : 
            'bg-blue-500/20 text-blue-700 dark:text-blue-200 border-blue-500/50';
            
        html += `
            <div class="glass-web3 p-6 rounded-2xl border border-green-500/30 hover:border-green-500/60 transition-all">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-semibold">${user.name}</p>
                        <p class="text-sm text-muted-foreground">${user.email}</p>
                        <p class="text-xs text-muted-foreground mt-1">ID: ${user.id}</p>
                    </div>
                    <div class="px-4 py-2 rounded-full border text-sm font-semibold ${roleClass}">
                        ${user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Initialize with sample data if empty
function initializeSampleData() {
    if (users.length === 0) {
        // Create sample users
        users = [
            {
                id: 1,
                name: 'Администратор',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                id: 2,
                name: 'Иван Петров',
                email: 'ivan@example.com',
                password: 'user123',
                role: 'user'
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    if (donations.length === 0) {
        // Create sample donations
        donations = [
            {
                id: 1,
                userId: 2,
                treeQuantity: 5,
                amount: 5000,
                date: new Date().toISOString()
            },
            {
                id: 2,
                userId: 2,
                treeQuantity: 10,
                amount: 10000,
                date: new Date(Date.now() - 86400000).toISOString() // Yesterday
            }
        ];
        localStorage.setItem('donations', JSON.stringify(donations));
    }
    
    if (applications.length === 0) {
        // Create sample applications
        applications = [
            {
                id: 1,
                userId: 2,
                status: 'approved',
                date: new Date().toISOString(),
                notes: 'Заявка одобрена. Деревья будут посажены в ближайшее время.'
            },
            {
                id: 2,
                userId: 2,
                status: 'pending',
                date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                notes: ''
            }
        ];
        localStorage.setItem('applications', JSON.stringify(applications));
    }
}

// Initialize sample data
initializeSampleData();