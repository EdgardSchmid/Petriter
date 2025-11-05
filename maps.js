// Coordenadas centrais de Petrópolis
const PETROPOLIS_COORDS = [-43.1779, -22.5113];

// Sua API Key do Maptiler (coloque sua chave aqui)
const MAPTILER_KEY = "Zeq8RWkEF6oa0baTj5nz";

// Inicializar mapa MapLibre
const map = new maplibregl.Map({
  container: 'map',
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
  center: PETROPOLIS_COORDS,
  zoom: 15
});

// Adicionar controles de navegação (zoom e rotação)
map.addControl(new maplibregl.NavigationControl(), 'top-right');

// --- Interatividade da UI ---

// Seletores atualizados para os botões
const mapBtn = document.querySelector('.map-controls .map-btn');
const satelliteBtn = document.querySelector('.map-controls .satellite-btn');

// (O resto da sua lógica para mostrar/esconder cards pode vir aqui)
// Exemplo:
// const placeCard = document.getElementById('placeCard');
// const emptyState = document.querySelector('.empty-state');

// Event listeners para os botões Map/Satellite
// (Atenção: o botão satellite não existe no seu HTML atual, adicione se necessário)
mapBtn.addEventListener('click', () => {
  mapBtn.classList.add('active');
  if (satelliteBtn) satelliteBtn.classList.remove('active');
  map.setStyle(`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`);
});

if (satelliteBtn) {
  satelliteBtn.addEventListener('click', () => {
    mapBtn.classList.remove('active');
    satelliteBtn.classList.add('active');
    map.setStyle(`https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`);
  });
}