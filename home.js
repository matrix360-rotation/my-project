document.addEventListener('DOMContentLoaded', () => {
    // Get current user once
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Theme Management
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // Theme Toggle
    document.querySelector('.theme-toggle').addEventListener('click', () => {
        const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
        localStorage.setItem('darkMode', !isDarkMode);
    });

    // Load sections with user data
    loadSections(currentUser);

    // Mail Modal Close
    document.querySelector('.mail-close').addEventListener('click', () => {
        document.getElementById('mailModal').style.display = 'none';
    });
});

function loadSections(currentUser) {
    loadForms();
    loadMail(currentUser);
    setupRequestForm(currentUser);
}

// Forms Handling
function loadForms() {
    const formsList = document.getElementById('formsList');
    try {
        const forms = JSON.parse(localStorage.getItem('forms') || '[]');
        formsList.innerHTML = forms.map(form => `
            <div class="form-card">
                <div class="form-header">
                    <h3>${form.title}</h3>
                    <small>Due: ${new Date(form.dueDate).toLocaleDateString()}</small>
                </div>
                <p>${form.description}</p>
                <div class="form-meta">
                    <span>${form.questions.length} questions</span>
                    <button class="take-form" onclick="openForm('${form.id}')">
                        <i class="fas fa-pen-to-square"></i> Start
                    </button>
                </div>
            </div>
        `).join('') || '<p class="no-data">No forms assigned yet</p>';
    } catch (error) {
        console.error('Forms load error:', error);
        formsList.innerHTML = '<p class="error">Error loading forms</p>';
    }
}

function openForm(formId) {
    localStorage.setItem('currentFormId', formId);
    window.location.href = `form.html?id=${formId}`;
}

// Mail Handling
function loadMail(currentUser) {
    const mailList = document.getElementById('mailList');
    try {
        const mails = JSON.parse(localStorage.getItem('mails') || '[]');
        const userMail = mails.filter(mail => mail.to === currentUser.email);
        
        mailList.innerHTML = userMail.map((mail, index) => `
            <div class="mail-item">
                <div class="mail-header">
                    <span>From: EXN Admin</span>
                    <small>${new Date(mail.timestamp).toLocaleDateString()}</small>
                </div>
                <button class="view-mail" onclick="viewMail(${index}, '${currentUser.email}')">
                    <i class="fas fa-lock"></i> View Message
                </button>
            </div>
        `).join('') || '<p class="no-data">No secure messages</p>';
    } catch (error) {
        console.error('Mail load error:', error);
        mailList.innerHTML = '<p class="error">Error loading mail</p>';
    }
}

function viewMail(index, userEmail) {
    try {
        const mails = JSON.parse(localStorage.getItem('mails') || '[]');
        const mail = mails[index];
        
        if (!mail || mail.to !== userEmail) {
            alert('Message not found');
            return;
        }

        const password = prompt('Enter mail password:');
        if (password === mail.password) {
            document.getElementById('mailSubject').textContent = `Received: ${new Date(mail.timestamp).toLocaleDateString()}`;
            document.getElementById('mailContent').textContent = mail.content;
            document.getElementById('mailModal').style.display = 'flex';
        } else {
            alert('Incorrect password!');
        }
    } catch (error) {
        console.error('Mail view error:', error);
        alert('Error loading message');
    }
}

// Request Handling
function setupRequestForm(currentUser) {
    document.getElementById('requestForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const message = e.target.requestMessage.value.trim();
        
        if (message.length < 20) {
            alert('Message must be at least 20 characters');
            return;
        }

        try {
            const requests = JSON.parse(localStorage.getItem('requests') || '[]');
            requests.push({
                user: currentUser.email,
                message: message,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
            
            localStorage.setItem('requests', JSON.stringify(requests));
            alert('Request submitted successfully!');
            e.target.reset();
        } catch (error) {
            console.error('Request error:', error);
            alert('Failed to submit request');
        }
    });
}

// Modal Close Handler
window.onclick = function(event) {
    const modal = document.getElementById('mailModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}