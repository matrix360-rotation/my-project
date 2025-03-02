// settings.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.getElementById('darkModeToggle').checked = isDark;

    // Initialize language
    const savedLang = localStorage.getItem('language') || 'en';
    document.getElementById('languageSelect').value = savedLang;

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('change', (e) => {
        const isDarkMode = e.target.checked;
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Language selection
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        localStorage.setItem('language', e.target.value);
        alert('Language changed - page will refresh');
        window.location.reload();
    });
});

// Admin login
function handleAdminLogin() {
    const password = document.getElementById('adminPassword').value;
    if(password === 'Tr0j@nW01f#4dm1n') {
        localStorage.setItem('adminPass', password);
        window.location.href = 'admin.html';
    } else {
        alert('Invalid admin password!');
        document.getElementById('adminPassword').value = '';
    }
}

// Logout
function handleLogout() {
    if(confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('adminPass');
        window.location.href = 'index.html';
    }
}