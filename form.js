document.addEventListener('DOMContentLoaded', () => {
    // Get form ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('id');
    
    if(!formId) {
        alert('Invalid form link');
        window.location.href = 'home.html';
        return;
    }

    // Load form data
    const forms = JSON.parse(localStorage.getItem('forms') || '[]');
    const form = forms.find(f => f.id === formId);
    
    if(!form) {
        alert('Form not found');
        window.location.href = 'home.html';
        return;
    }

    // Display form info
    document.getElementById('formTitle').textContent = form.title;
    document.getElementById('formDescription').textContent = form.description;

    // Generate questions
    const container = document.getElementById('questionsContainer');
    form.questions.forEach((question, qIndex) => {
        const questionHTML = `
            <div class="question-card">
                <h3>${qIndex + 1}. ${question.question}</h3>
                <div class="options-list">
                    ${question.options.map((option, oIndex) => `
                        <label class="option-item">
                            <input 
                                type="radio" 
                                name="q${qIndex}" 
                                value="${oIndex}"
                                required
                            >
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML += questionHTML;
    });

    // Handle form submission
    document.getElementById('quizForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(!currentUser) {
            alert('Session expired. Please login again.');
            window.location.href = 'index.html';
            return;
        }

        // Collect answers
        const answers = form.questions.map((question, qIndex) => {
            const selected = document.querySelector(`input[name="q${qIndex}"]:checked`);
            return {
                question: question.question,
                selectedOption: selected ? question.options[selected.value] : null,
                optionIndex: selected ? parseInt(selected.value) : -1
            };
        });

        // Save submission
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        submissions.push({
            formId: formId,
            studentEmail: currentUser.email,
            answers: answers,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('submissions', JSON.stringify(submissions));
        
        alert('Form submitted successfully!');
        window.location.href = 'home.html';
    });
});