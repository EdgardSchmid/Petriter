// --- Interesses disponíveis ---
const availableInterests = ['História','Natureza','Fotografia','Culinária','Música','Arte','Esportes','Literatura','Cinema','Tecnologia','Viagem','Aventura','Cultura','Arquitetura','Design'];
let selectedInterests = ['História','Natureza','Fotografia'];

// --- Inicializar perfil ---
window.onload = function() {
    const name = localStorage.getItem('userName') || 'Visitante';
    const email = localStorage.getItem('userEmail') || 'sememail@teste.com';

    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('profile-display-name').textContent = name;

    renderInterests();
    document.getElementById('name').addEventListener('input', updateDisplayName);
};

// --- Exibir interesses ---
function renderInterests() {
    const container = document.getElementById('interests-container');
    container.innerHTML = '';
    availableInterests.forEach(interest => {
        const tag = document.createElement('div');
        tag.className = 'interest-tag';
        tag.textContent = interest;
        if(selectedInterests.includes(interest)) tag.classList.add('selected');
        tag.addEventListener('click', () => toggleInterest(interest));
        container.appendChild(tag);
    });
}

function toggleInterest(interest) {
    const index = selectedInterests.indexOf(interest);
    if(index > -1) selectedInterests.splice(index, 1);
    else selectedInterests.push(interest);
    renderInterests();
}

// --- Avatar ---
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('avatar').innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
        };
        reader.readAsDataURL(file);
    }
}

// --- Atualizar nome no display ---
function updateDisplayName() {
    const nameInput = document.getElementById('name');
    document.getElementById('profile-display-name').textContent = nameInput.value || 'Usuário';
}

// --- Salvar perfil ---
function saveProfile() {
    console.log('Perfil salvo:', {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        bio: document.getElementById('bio').value,
        interests: selectedInterests
    });

    // Feedback visual
    ['.save-button','.btn-primary'].forEach(sel => {
        const btn = document.querySelector(sel);
        if(btn) {
            const original = btn.textContent;
            btn.textContent = 'Salvando...';
            btn.classList.add('saving');
            setTimeout(() => {
                btn.textContent = 'Salvo!';
                btn.classList.remove('saving');
                setTimeout(() => btn.textContent = original, 1500);
            }, 1000);
        }
    });
}

// --- Submissão do formulário ---
function handleSubmit(event) {
    event.preventDefault();
    saveProfile();
}

// --- Voltar ao login ---
function goBack() {
    localStorage.clear();
    window.location.href = 'index.html';
}