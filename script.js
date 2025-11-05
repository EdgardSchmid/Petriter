// Variáveis globais
let isLoginScreen = true;

// --- Troca de telas ---
function switchToRegister() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('register-screen').classList.add('active');
    isLoginScreen = false;
    clearForms();
}

function switchToLogin() {
    document.getElementById('register-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
    isLoginScreen = true;
    clearForms();
}

// --- Limpar formulários ---
function clearForms() {
    ['login-email','login-password','login-stay-connected',
     'register-fullname','register-email','register-password',
     'register-confirm-password','register-stay-connected'].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            if(el.type === 'checkbox') el.checked = false;
            else el.value = '';
        }
    });
}

// --- Validação ---
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
function validatePassword(password) {
    return password.length >= 6;
}

// --- Mensagens ---
function showMessage(msg, isError = true) {
    const existing = document.querySelector('.message');
    if(existing) existing.remove();

    const div = document.createElement('div');
    div.className = `message ${isError?'error':'success'}`;
    div.textContent = msg;
    div.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        padding: 12px 24px; border-radius: 6px;
        font-weight: 500; z-index: 1000;
        animation: slideIn 0.3s ease;
        ${isError ? 
            'background-color: #fee2e2; color: #dc2626; border: 1px solid #fecaca;' :
            'background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0;'
        }
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 5000);
}

// --- Login e Cadastro ---
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if(!email) { showMessage('Digite seu email.'); return; }
    if(!validateEmail(email)) { showMessage('Email inválido.'); return; }
    if(!password) { showMessage('Digite sua senha.'); return; }
    if(!validatePassword(password)) { showMessage('Senha muito curta.'); return; }

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', 'Usuário Teste'); // exemplo
    showMessage('Login realizado!', false);

    setTimeout(() => window.location.href = 'profile.html', 1000);
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-fullname').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if(!name || name.length < 2) { showMessage('Nome inválido.'); return; }
    if(!email || !validateEmail(email)) { showMessage('Email inválido.'); return; }
    if(!password || !validatePassword(password)) { showMessage('Senha inválida.'); return; }
    if(password !== confirmPassword) { showMessage('Senhas não coincidem.'); return; }

    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    showMessage('Cadastro realizado!', false);

    setTimeout(() => switchToLogin(), 1000);
}

// --- Google Login / Cadastro (simulação) ---
function handleGoogleLogin() { alert('Login via Google ainda não implementado.'); }
function handleGoogleRegister() { alert('Cadastro via Google ainda não implementado.'); }

// --- Recuperação de senha ---
function handleForgotPassword() {
    const email = prompt('Digite seu email para recuperação de senha:');
    if(!email) return;
    if(!validateEmail(email)) { showMessage('Email inválido.'); return; }
    showMessage('Email de recuperação enviado!', false);
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // Ativar tela de login por padrão
    switchToLogin();

    // Submissão via Enter
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            if(isLoginScreen) handleLogin(e);
            else handleRegister(e);
        }
        if(e.key === 'Escape') clearForms();
    });
});