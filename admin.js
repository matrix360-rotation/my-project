const Admin = {
    init() {
        this.checkAuth();
        this.loadData();
        this.setupListeners();
        this.renderSection('members');
    },

    checkAuth() {
        const storedPass = localStorage.getItem('adminPass');
        if (storedPass !== 'Tr0j@nW01f#4dm1n') {
            window.location.href = 'index.html';
        }
    },

    data: {
        members: [],
        requests: [],
        mails: [],
        forms: [],
        submissions: []
    },

    loadData() {
        this.data.members = JSON.parse(localStorage.getItem('users') || '[]');
        this.data.requests = JSON.parse(localStorage.getItem('requests') || '[]');
        this.data.mails = JSON.parse(localStorage.getItem('mails') || '[]');
        this.data.forms = JSON.parse(localStorage.getItem('forms') || '[]');
        this.data.submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    },

    setupListeners() {
        document.querySelectorAll('.admin-nav button').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.admin-nav button.active')?.classList.remove('active');
                btn.classList.add('active');
                this.renderSection(btn.dataset.section);
            });
        });
    },

    renderSection(section) {
        const sections = {
            members: this.renderMembers,
            requests: this.renderRequests,
            mail: this.renderMail,
            forms: this.renderForms,
            submissions: this.renderSubmissions
        };

        if (sections[section]) {
            document.getElementById('adminContent').innerHTML = sections[section].call(this);
        }
    },

    // Members Section
    renderMembers() {
        return `
            <div class="members-section">
                <h2><i class="fas fa-users-cog"></i> Members (${this.data.members.length})</h2>
                <table class="admin-table">
                    ${this.data.members.map(member => `
                        <tr>
                            <td>${member.name}</td>
                            <td>${member.email}</td>
                            <td>${new Date(member.joined).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-delete" onclick="Admin.deleteMember('${member.email}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    },

    deleteMember(email) {
        this.data.members = this.data.members.filter(m => m.email !== email);
        localStorage.setItem('users', JSON.stringify(this.data.members));
        this.renderSection('members');
    },

    // Requests Section
    renderRequests() {
        return `
            <div class="requests-section">
                <h2><i class="fas fa-inbox"></i> Requests (${this.data.requests.length})</h2>
                ${this.data.requests.map((req, index) => `
                    <div class="request-card">
                        <div class="request-header">
                            <span>${req.email}</span>
                            <button class="btn-delete" onclick="Admin.deleteRequest(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <p>${req.message}</p>
                        <small>${new Date(req.timestamp).toLocaleString()}</small>
                    </div>
                `).join('')}
            </div>
        `;
    },

    deleteRequest(index) {
        this.data.requests.splice(index, 1);
        localStorage.setItem('requests', JSON.stringify(this.data.requests));
        this.renderSection('requests');
    },

    // Mail Section
    renderMail() {
        return `
            <div class="mail-section">
                <h2><i class="fas fa-envelope"></i> Send Mail</h2>
                <form onsubmit="Admin.handleSendMail(event)">
                    <select id="mailRecipient" required>
                        ${this.data.members.map(m => `
                            <option value="${m.email}">${m.name} (${m.email})</option>
                        `).join('')}
                    </select>
                    <textarea id="mailContent" required placeholder="Message content"></textarea>
                    <input type="password" id="mailPassword" placeholder="Set mail password" required>
                    <button type="submit" class="cta-button">
                        <i class="fas fa-paper-plane"></i> Send Mail
                    </button>
                </form>
            </div>
        `;
    },

    handleSendMail(e) {
        e.preventDefault();
        this.data.mails.push({
            to: e.target.mailRecipient.value,
            content: e.target.mailContent.value,
            password: e.target.mailPassword.value,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('mails', JSON.stringify(this.data.mails));
        alert('Mail sent successfully!');
        e.target.reset();
    },

    // Forms Section
    renderForms() {
        return `
            <div class="forms-section">
                <h2><i class="fas fa-file-alt"></i> Forms (${this.data.forms.length})</h2>
                <button onclick="Admin.showFormBuilder()" class="cta-button">
                    <i class="fas fa-plus"></i> New Form
                </button>
                <div class="forms-list">
                    ${this.data.forms.map((form, index) => `
                        <div class="form-card">
                            <h3>${form.title}</h3>
                            <p>${form.description}</p>
                            <div class="form-meta">
                                <span>${form.questions.length} questions</span>
                                <div>
                                    <button class="btn-delete" onclick="Admin.deleteForm(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    deleteForm(index) {
        this.data.forms.splice(index, 1);
        localStorage.setItem('forms', JSON.stringify(this.data.forms));
        this.renderSection('forms');
    },

    // Submissions Section
    renderSubmissions() {
        return `
            <div class="submissions-section">
                <h2><i class="fas fa-file-import"></i> Submissions (${this.data.submissions.length})</h2>
                <div class="submissions-list">
                    ${this.data.submissions.map((sub, index) => {
                        const student = this.data.members.find(m => m.email === sub.studentEmail);
                        const form = this.data.forms.find(f => f.id === sub.formId);
                        return `
                            <div class="submission-card" onclick="Admin.viewSubmission(${index})">
                                <div class="submission-header">
                                    <span>${student?.name || sub.studentEmail}</span>
                                    <small>${form?.title || 'Deleted Form'}</small>
                                </div>
                                <small>${new Date(sub.timestamp).toLocaleString()}</small>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    viewSubmission(index) {
        const submission = this.data.submissions[index];
        const student = this.data.members.find(m => m.email === submission.studentEmail);
        const form = this.data.forms.find(f => f.id === submission.formId);

        document.getElementById('submissionStudent').innerHTML = `
            <i class="fas fa-user"></i> ${student?.name || submission.studentEmail}
        `;

        const details = document.getElementById('submissionDetails');
        details.innerHTML = `
            <div class="submission-meta">
                <p><i class="fas fa-file"></i> ${form?.title || 'Deleted Form'}</p>
                <p><i class="fas fa-clock"></i> ${new Date(submission.timestamp).toLocaleString()}</p>
            </div>
            ${submission.answers.map((answer, i) => `
                <div class="answer-item">
                    <h4>Q${i + 1}: ${answer.question}</h4>
                    <p class="student-answer">
                        <i class="fas fa-pen"></i> 
                        Student's Answer: ${answer.selectedOption || 'No answer provided'}
                    </p>
                    ${form?.questions?.[i]?.correct !== undefined ? `
                        <p class="correct-answer">
                            <i class="fas fa-check"></i> 
                            Correct Answer: ${form.questions[i].options[form.questions[i].correct]}
                        </p>
                    ` : ''}
                </div>
            `).join('')}
        `;

        document.getElementById('submissionModal').style.display = 'block';
    },

    closeSubmissionModal() {
        document.getElementById('submissionModal').style.display = 'none';
    },

    logout() {
        localStorage.removeItem('adminPass');
        window.location.href = 'index.html';
    }
};

document.addEventListener('DOMContentLoaded', () => Admin.init());