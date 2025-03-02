document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'home.html';
        return;
    }

    // Initialize dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // Password visibility toggle
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const isVisible = input.type === 'text';
            
            input.type = isVisible ? 'password' : 'text';
            this.classList.toggle('fa-eye-slash', !isVisible);
            this.classList.toggle('fa-eye', isVisible);
        });
    });

    // Form handling
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        
        const email = e.target.email.value.trim().toLowerCase();
        const password = e.target.password.value;
        let isValid = true;

        // Validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError(e.target.email, 'Invalid email format');
            isValid = false;
        }

        if (password.length < 8) {
            showError(e.target.password, 'Password must be 8+ characters');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        submitBtn.disabled = true;

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => 
                u.email.toLowerCase() === email && 
                u.password === btoa(password) // Match encoded password
            );

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showToast('Login successful! Redirecting...', 'success');
                setTimeout(() => window.location.href = 'home.html', 1500);
            } else {
                showToast('Invalid email or password', 'error');
            }
        } catch (error) {
            showToast('Login failed. Please try again.', 'error');
            console.error('Login error:', error);
        } finally {
            submitBtn.innerHTML = 'Login';
            submitBtn.disabled = false;
        }
    });

    // Helper functions
    function showError(input, message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
        input.parentElement.appendChild(error);
        input.classList.add('invalid');
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            ${message}
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});