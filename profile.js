/* =========================================================
   CONFIGURAÇÃO DE TAGS DISPONÍVEIS
   ========================================================= */
   
const AVAILABLE_TAGS = [
    // EIXOS GASTRONÔMICOS
    "Chocolate Artesanal",
    "Cervejarias",
    "Cafés Históricos",
    "Restaurantes Coloniais",

    // EIXOS HISTÓRICOS
    "Rota Imperial",
    "Brasil Império",
    "Arquitetura Alemã",
    "Arquitetura Colonial",

    // EIXOS NATURAIS
    "Cachoeiras",
    "Trilhas Secretas",
    "Mirantes Pouco Conhecidos",
    "Astroturismo",
    "Observação Noturna",

    // EIXOS CULTURAIS
    "Feiras Artesanais",
    "Ateliês Locais",
    "Eventos de Rua",
    "Centros Culturais Alternativos",

    // EIXOS RELIGIOSOS E MÍSTICOS
    "Igrejas Históricas",
    "Espaços de Meditação",
    "Roteiros Espirituais",

    // TECNOLÓGICOS
    "Inovação",
    "Museus Científicos",
    "História da Tecnologia"
];


/* =========================================================
   AVATAR
   ========================================================= */
function handleAvatarUpload(event){
    const file = event.target.files[0];
    if(!file) return;

    const avatarImg = document.getElementById('avatar-img');
    const placeholder = document.getElementById('avatar-placeholder');
    avatarImg.src = URL.createObjectURL(file);
    avatarImg.style.display = "block";
    placeholder.style.display = "none";
}

/* =========================================================
   TAG SYSTEM
   ========================================================= */
const tagsContainer = document.getElementById("tags-container");
let selectedTags = [];

function loadTags(){
    const savedTags = localStorage.getItem("selectedTags");
    if(savedTags) selectedTags = JSON.parse(savedTags);
    renderTags();
}

function renderTags(){
    tagsContainer.innerHTML = "";
    AVAILABLE_TAGS.forEach(tag => {
        const tagElement = document.createElement("div");
        tagElement.classList.add("tag");
        tagElement.textContent = tag;
        if(selectedTags.includes(tag)) tagElement.classList.add("selected");
        tagElement.addEventListener("click", () => toggleTag(tag));
        tagsContainer.appendChild(tagElement);
    });
}

function toggleTag(tag){
    if(selectedTags.includes(tag)){
        selectedTags = selectedTags.filter(t => t!==tag);
    } else {
        selectedTags.push(tag);
    }
    localStorage.setItem("selectedTags", JSON.stringify(selectedTags));
    renderTags();
}

/* =========================================================
   PERFIL DE USUÁRIO
   ========================================================= */
function saveProfile(){
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const bio = document.getElementById("bio").value;

    const profileData = { name, email, bio, tags: selectedTags };
    localStorage.setItem("profileData", JSON.stringify(profileData));
    document.getElementById("display-name").textContent = name;
}

function loadProfile(){
    const data = localStorage.getItem("profileData");
    if(!data) return;
    const profile = JSON.parse(data);
    if(profile.name) document.getElementById("name").value = profile.name;
    if(profile.email) document.getElementById("email").value = profile.email;
    if(profile.bio) document.getElementById("bio").value = profile.bio;
    if(profile.tags) selectedTags = profile.tags;
}

/* =========================================================
   FEEDBACK VISUAL AO SALVAR
   ========================================================= */
function showSuccessFeedback(){
    const btn = document.querySelector(".b-save_and_go");
    const originalText = btn.textContent;
    btn.textContent = "✔ Salvo";
    btn.style.backgroundColor = "var(--gold)";
    btn.style.color = "#3E2723";

    setTimeout(()=>{
        btn.textContent = originalText;
        btn.style.backgroundColor = "var(--brown-dark)";
        btn.style.color = "#fff";
    }, 2000);
}


/* =========================================================
   REDIRECIONAR AO MAPA
   ========================================================= */
document.getElementById("profile-form").addEventListener("submit", function(e){
    e.preventDefault();   // previne reload da página
    saveProfile();
    showSuccessFeedback();

    // Redireciona após 1s para o mapa
    setTimeout(()=> {
        window.location.href = "maps.html"; // ajuste o caminho
    }, 1000);
});

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */
window.addEventListener("DOMContentLoaded", ()=>{
    loadProfile();
    loadTags();
});