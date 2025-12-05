/* ============================================================
   1. CONFIGURAÇÃO DE DADOS, ESTILOS E VARIÁVEIS GLOBAIS
   ============================================================ */

const PETROPOLIS_CENTER = { lat: -22.5113, lng: -43.1779 };

// Variáveis Globais do Mapa
let map;
let activeOverlays = []; // Guarda polígonos e marcadores de filtro para remover depois
let infoWindow;
let placesService;
let CustomMarkerClass; // Classe definida após o carregamento do Google Maps

// Variáveis das Novas Funcionalidades (Rotas e Trânsito)
let trafficLayer;
let directionsService;
let directionsRenderer;
let routePoints = []; // Array de pontos clicados para a rota
let isRouteMode = false; // Define se o clique cria rota ou abre detalhes do local

const PALETA = {
  d1: '#E63946', // Vermelho (Centro)
  d2: '#F4A261', // Laranja (Cascatinha)
  d3: '#2A9D8F', // Verde (Itaipava)
  d4: '#264653', // Azul (Pedro do Rio)
  d5: '#E9C46A', // Amarelo (Posse)
  default: '#964B00'
};

const MAP_STYLE = [
    { "featureType": "landscape.man_made", "elementType": "all", "stylers": [{ "color": "#f5f5dc" }] },
    { "featureType": "landscape.natural.landcover", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#9caf88" }] },
    { "featureType": "poi.attraction", "elementType": "all", "stylers": [{ "color": "#c2a14b" }, { "visibility": "simplified" }] },
    { "featureType": "poi.business", "elementType": "all", "stylers": [{ "color": "#6b4423" }, { "visibility": "simplified" }] },
    { "featureType": "poi.government", "elementType": "all", "stylers": [{ "color": "#b85c2f" }, { "visibility": "simplified" }] },
    { "featureType": "poi.medical", "elementType": "all", "stylers": [{ "color": "#2b4a6b" }, { "visibility": "simplified" }] },
    { "featureType": "poi.park", "elementType": "all", "stylers": [{ "visibility": "simplified" }, { "color": "#566b31" }] },
    { "featureType": "poi.place_of_worship", "elementType": "all", "stylers": [{ "color": "#7a4b85" }, { "visibility": "simplified" }] },
    { "featureType": "poi.school", "elementType": "all", "stylers": [{ "color": "#8b2635" }, { "visibility": "simplified" }] },
    { "featureType": "poi.sports_complex", "elementType": "all", "stylers": [{ "color": "#c17b5a" }, { "visibility": "simplified" }] },
    { "featureType": "road.highway", "elementType": "all", "stylers": [{ "color": "#919191" }, { "visibility": "simplified" }] },
    { "featureType": "road.arterial", "elementType": "all", "stylers": [{ "color": "#8b7d6b" }, { "visibility": "simplified" }] },
    { "featureType": "road.local", "elementType": "all", "stylers": [{ "color": "#967574" }, { "visibility": "simplified" }] },
    { "featureType": "transit.station.bus", "elementType": "all", "stylers": [{ "color": "#1f5f3f" }, { "visibility": "simplified" }] },
    { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#4682b4" }, { "visibility": "simplified" }] }
];

// Dados Geográficos Completos
const dadosGeograficos = [
  {
    nome: "1º Distrito: Petrópolis", id: "d1", tipo: "distrito", coords: [-43.1787, -22.5113],
    bairros: [
      { nome: "Centro", id: "b_centro", tipo: "bairro", coords: [-43.1770, -22.5100], subs: [] },
      { 
        nome: "Alto da Serra", id: "b_alto", tipo: "bairro", coords: [-43.1800, -22.5200],
        subs: [
          { nome: "24 de Maio", coords: [-43.177206, -22.517102] },
          { nome: "Castelânea", coords: [-43.182826, -22.522922] },
          { nome: "Sargento Boening", coords: [-43.182314, -22.528510] }
        ]
      },
      { 
        nome: "Bingen", id: "b_bingen", tipo: "bairro", coords: [-43.2100, -22.5120],
        subs: [{ nome: "Capela", coords: [-43.218300, -22.512411] }]
      },
      { nome: "Vila Militar", id: "b_vila_militar", tipo: "bairro", coords: [-43.1950, -22.5150], subs: [] },
      { nome: "Duarte Silveira", id: "b_duarte", tipo: "bairro", coords: [-43.2300, -22.5100], subs: [] },
      { nome: "Castrioto", id: "b_castrioto", tipo: "bairro", coords: [-43.2250, -22.5150], subs: [] },
      { 
        nome: "Quitandinha", id: "b_quitandinha", tipo: "bairro", coords: [-43.2200, -22.5300],
        subs: [
          { nome: "Amazonas", coords: [-43.223648, -22.532696] },
          { nome: "Dr. Thouzet", coords: [-43.199912, -22.525363] },
          { nome: "Rio de Janeiro", coords: [-43.217395, -22.524098] },
          { nome: "Espírito Santo", coords: [-43.221430, -22.523117] }
        ]
      },
      { nome: "Duques", id: "b_duques", tipo: "bairro", coords: [-43.2100, -22.5400], subs: [] },
      { 
        nome: "Valparaíso", id: "b_valparaiso", tipo: "bairro", coords: [-43.1900, -22.5250],
        subs: [{ nome: "Oswaldo Cruz", coords: [-43.192451, -22.525036] }]
      },
      { nome: "Morin", id: "b_morin", tipo: "bairro", coords: [-43.1700, -22.5200], subs: [] },
      { 
        nome: "Mosela", id: "b_mosela", tipo: "bairro", coords: [-43.2000, -22.4900],
        subs: [
          { nome: "Moinho Preto", coords: [-43.210474, -22.485101] },
          { nome: "Battailard", coords: [-43.197186, -22.488805] },
          { nome: "Pedras Brancas", coords: [-43.208673, -22.493350] }
        ]
      },
      { nome: "Duchas", id: "b_duchas", tipo: "bairro", coords: [-43.2050, -22.5180], subs: [] },
      { nome: "Retiro", id: "b_retiro", tipo: "bairro", coords: [-43.1850, -22.4950], subs: [] },
      { nome: "Siméria", id: "b_simeria", tipo: "bairro", coords: [-43.1900, -22.5400], subs: [] },
      { 
        nome: "São Sebastião", id: "b_saosebastiao", tipo: "bairro", coords: [-43.1950, -22.5370],
        subs: [{ nome: "Tancredo Neves", coords: [-43.195941, -22.537608] }]
      },
      { 
        nome: "Independência", id: "b_independencia", tipo: "bairro", coords: [-43.2100, -22.5450],
        subs: [
          { nome: "Alto Independência", coords: [-43.214534, -22.548573] },
          { nome: "Taquara", coords: [-43.206801, -22.537511] }
        ]
      },
      { nome: "Caxambu", id: "b_caxambu", tipo: "bairro", coords: [-43.1800, -22.5500], subs: [] },
      { nome: "Fazenda Inglesa", id: "b_fazenda", tipo: "bairro", coords: [-43.2500, -22.5300], subs: [] },
      { nome: "Quarteirão Brasileiro", id: "b_quarteirao", tipo: "bairro", coords: [-43.1800, -22.4800], subs: [] },
      { 
        nome: "Chácara Flora", id: "b_chacara", tipo: "bairro", coords: [-43.1700, -22.5300],
        subs: [
          { nome: "Lopes Trovão", coords: [-43.168169, -22.535630] },
          { nome: "Vila Felipe", coords: [-43.176617, -22.535386] },
          { nome: "Campinho", coords: [-43.178882, -22.532991] },
          { nome: "Rua Teresa", coords: [-43.171416, -22.524543] }
        ]
      },
      { nome: "Meio da Serra", id: "b_meioserra", tipo: "bairro", coords: [-43.1600, -22.5400], subs: [] },
      { nome: "Coronel Veiga", id: "b_coronel", tipo: "bairro", coords: [-43.1900, -22.5100], subs: [] }
    ]
  },
  {
    nome: "2º Distrito: Cascatinha", id: "d2", tipo: "distrito", coords: [-43.1678, -22.4700],
    bairros: [
      { nome: "Itamarati", id: "b_itamarati", tipo: "bairro", coords: [-43.1600, -22.4750], subs: [] },
      { nome: "Roseiral", id: "b_roseiral", tipo: "bairro", coords: [-43.1500, -22.4700], subs: [] },
      { nome: "Corrêas", id: "b_correas", tipo: "bairro", coords: [-43.1350, -22.4600], subs: [] },
      { nome: "Nogueira", id: "b_nogueira", tipo: "bairro", coords: [-43.1400, -22.4400], subs: [] },
      { nome: "Araras", id: "b_araras", tipo: "bairro", coords: [-43.2400, -22.4300], subs: [] },
      { nome: "Samambaia", id: "b_samambaia", tipo: "bairro", coords: [-43.1500, -22.4800], subs: [] },
      { nome: "Bairro da Glória", id: "b_gloria", tipo: "bairro", coords: [-43.1450, -22.4650], subs: [] },
      { nome: "Quissamã", id: "b_quissama", tipo: "bairro", coords: [-43.1650, -22.4850], subs: [] },
      { nome: "Carangola", id: "b_carangola", tipo: "bairro", coords: [-43.1550, -22.4900], subs: [] },
      { nome: "Bonsucesso", id: "b_bonsucesso", tipo: "bairro", coords: [-43.1300, -22.4200], subs: [] }
    ]
  },
  {
    nome: "3º Distrito: Itaipava", id: "d3", tipo: "distrito", coords: [-43.1305, -22.3811],
    bairros: [
      { nome: "Itaipava (Centro)", id: "b_itaipava", tipo: "bairro", coords: [-43.1305, -22.3811], subs: [] },
      { nome: "Cuiabá", id: "b_cuiaba", tipo: "bairro", coords: [-43.0900, -22.3900], subs: [] },
      { nome: "Manga Larga", id: "b_mangalarga", tipo: "bairro", coords: [-43.1100, -22.3700], subs: [] }
    ]
  },
  {
    nome: "4º Distrito: Pedro do Rio", id: "d4", tipo: "distrito", coords: [-43.1643, -22.3294],
    bairros: [
      { nome: "Pedro do Rio", id: "b_pedrorio", tipo: "bairro", coords: [-43.1643, -22.3294], subs: [] }
    ]
  },
  {
    nome: "5º Distrito: Posse", id: "d5", tipo: "distrito", coords: [-43.0714, -22.2533],
    bairros: [
      { nome: "Posse", id: "b_posse", tipo: "bairro", coords: [-43.0714, -22.2533], subs: [] }
    ]
  }
];

/* ============================================================
   2. INICIALIZAÇÃO DO MAPA (INITMAP)
   ============================================================ */
window.initMap = function() {
  
  // Classe Marcador Personalizado (definida aqui pois depende do google.maps)
  class CustomMarker extends google.maps.OverlayView {
    constructor(position, content, map) {
      super();
      this.position = position;
      this.content = content;
      this.div = null;
      this.setMap(map);
    }
    onAdd() {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.innerHTML = this.content;
      this.div = div;
      const panes = this.getPanes();
      panes.overlayImage.appendChild(div);
      div.addEventListener('click', (e) => {
        e.stopPropagation();
        google.maps.event.trigger(this, 'click');
      });
    }
    draw() {
      const overlayProjection = this.getProjection();
      const point = overlayProjection.fromLatLngToDivPixel(this.position);
      if (this.div) {
        this.div.style.left = point.x + 'px';
        this.div.style.top = point.y + 'px';
      }
    }
    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }
  }
  CustomMarkerClass = CustomMarker;

  // 1. Instanciar o Mapa
  map = new google.maps.Map(document.getElementById("map"), {
    center: PETROPOLIS_CENTER,
    zoom: 14,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    clickableIcons: true,
    styles: MAP_STYLE
  });

  // O restante do seu código (mapa, etc.)
// ...

const input = document.getElementById('searchInput');
const autocomplete = new google.maps.places.Autocomplete(input, {
    // Mantém as restrições para Petrópolis (usando um exemplo de bounds)
    bounds: new google.maps.LatLngBounds(
        { lat: -22.6105, lng: -43.3423 }, // Sudoeste
        { lat: -22.3168, lng: -43.0850 }  // Nordeste
    ),
    strictBounds: true // Restringe a pesquisa aos limites
});

// Remove a vinculação ao mapa que você tinha, pois agora vamos controlar o mapa
// autocomplete.bindTo('bounds', map); // REMOVER/COMENTAR ESTA LINHA

const searchMarker = new google.maps.Marker({
    map: map,
    visible: false // Começa invisível
});

// Adiciona o listener para quando um local for selecionado
autocomplete.addListener('place_changed', function() {
    // Obtém o objeto Place com todos os detalhes
    const place = autocomplete.getPlace();

    if (!place.geometry) {
        // Se o usuário selecionou uma previsão que não tem geometria, pode ser um erro ou uma entrada incompleta
        window.alert("Detalhes indisponíveis para a entrada: '" + place.name + "'");
        return;
    }

    // A. **Centraliza o Mapa** no local selecionado
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport); // Ajusta o zoom e a área visível
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Define um zoom padrão bom para ruas
    }

    // B. **Coloca e Exibe o Marcador**
    searchMarker.setPosition(place.geometry.location);
    searchMarker.setVisible(true);

    // C. **Exibe os Resultados no Painel**
    displayPlaceDetails(place);
});

  // 2. Instanciar Serviços do Google
  infoWindow = new google.maps.InfoWindow({ maxWidth: 260 });
  placesService = new google.maps.places.PlacesService(map);
  
  // -- Trânsito
  trafficLayer = new google.maps.TrafficLayer();

  // -- Rotas
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ 
      map: map,
      suppressMarkers: false,
      draggable: true
  });

  // 3. Listener Global de Cliques no Mapa
  map.addListener("click", (e) => {
    // SE O MODO ROTA ESTIVER ATIVO
    if (isRouteMode) {
        addRoutePoint(e.latLng);
        return; // Para aqui, não tenta abrir POI
    }

    // SE FOR UM CLIQUE NORMAL EM UM POI (ÍCONE DO MAPA)
    if (e.placeId) {
      e.stop(); // Previne o balão padrão do Google
      
      const request = {
        placeId: e.placeId,
        fields: [
          'name', 'formatted_address', 'photos', 'opening_hours', 'website', 
          'formatted_phone_number', 'international_phone_number', 
          'editorial_summary', 'types', 'geometry'
        ]
      };

      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          if (window.showTourCardFromPlace) {
            window.showTourCardFromPlace(place, e.latLng);
          }
        }
      });
    }
  });

  // 4. Configurar Botões da Interface (Satélite, Trânsito, Rota)
  setupMapControls();
};

/* ============================================================
   3. FUNÇÕES DE CONTROLE DA INTERFACE (BOTÕES)
   ============================================================ */
function setupMapControls() {
    // Selecionar botões pelo ID (certifique-se que eles existem no HTML)
    const btnDefault = document.getElementById('btn-default');
    const btnSatellite = document.getElementById('btn-satellite');
    const btnTraffic = document.getElementById('btn-traffic');
    const btnRoute = document.getElementById('btn-route-mode');
    
    const btnSaveRoute = document.getElementById('btn-save-route');
    const btnClearRoute = document.getElementById('btn-clear-route');

    // Botão Mapa Normal
    if (btnDefault) {
        btnDefault.addEventListener('click', () => {
            map.setMapTypeId('roadmap');
            btnDefault.classList.add('active');
            if(btnSatellite) btnSatellite.classList.remove('active');
        });
    }

    // Botão Satélite
    if (btnSatellite) {
        btnSatellite.addEventListener('click', () => {
            map.setMapTypeId('hybrid');
            btnSatellite.classList.add('active');
            if(btnDefault) btnDefault.classList.remove('active');
        });
    }

    // Botão Trânsito
    if (btnTraffic) {
        btnTraffic.addEventListener('click', () => {
            if (trafficLayer.getMap()) {
                trafficLayer.setMap(null); // Ocultar
                btnTraffic.classList.remove('active');
            } else {
                trafficLayer.setMap(map); // Mostrar
                btnTraffic.classList.add('active');
            }
        });
    }

    // Botão Modo Rota (Alternar)
    if (btnRoute) {
        btnRoute.addEventListener('click', () => {
            isRouteMode = !isRouteMode; // Inverte o estado
            
            if (isRouteMode) {
                btnRoute.classList.add('active');
                map.setOptions({ draggableCursor: 'crosshair' }); // Muda cursor para mira
                alert('Modo Rota Ativado: Clique no mapa para adicionar pontos de parada.');
            } else {
                btnRoute.classList.remove('active');
                map.setOptions({ draggableCursor: null }); // Volta cursor normal
            }
        });
    }

    // Botões do Painel de Rota
    if (btnSaveRoute) btnSaveRoute.addEventListener('click', saveRoute);
    if (btnClearRoute) btnClearRoute.addEventListener('click', clearRoute);
}

/* ============================================================
   4. LÓGICA DE ROTAS
   ============================================================ */
function addRoutePoint(location) {
    routePoints.push(location);

    // Marcador visual temporário onde o usuário clicou
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: "Ponto " + routePoints.length
    });
    // Adiciona ao array de overlays para poder limpar depois se necessário
    activeOverlays.push(marker);

    // Se tiver 2 ou mais pontos, calcula a rota
    if (routePoints.length >= 2) {
        calculateRoute();
    }
}

function calculateRoute() {
    if (routePoints.length < 2) return;

    const origin = routePoints[0];
    const destination = routePoints[routePoints.length - 1];
    
    // Pontos intermediários (waypoints)
    const waypoints = routePoints.slice(1, -1).map(p => ({
        location: p,
        stopover: true
    }));

    directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
            showRouteInfo(result);
        } else {
            console.error("Erro ao calcular rota:", status);
        }
    });
}

function showRouteInfo(result) {
    const panel = document.getElementById('route-info-panel');
    const dataDiv = document.getElementById('route-data');
    if(!panel || !dataDiv) return;

    // Calcula totais
    let totalDist = 0;
    let totalDur = 0;
    result.routes[0].legs.forEach(leg => {
        totalDist += leg.distance.value;
        totalDur += leg.duration.value;
    });

    const distText = (totalDist / 1000).toFixed(1) + " km";
    const durText = Math.round(totalDur / 60) + " min";

    dataDiv.innerHTML = `
        <p><b>Distância:</b> ${distText}</p>
        <p><b>Duração:</b> ${durText}</p>
    `;
    panel.classList.remove('hidden');
}

function saveRoute() {
    if (routePoints.length < 2) {
        alert("Crie uma rota antes de salvar.");
        return;
    }
    // Salva array simples de coordenadas no LocalStorage
    const pointsData = routePoints.map(p => ({ lat: p.lat(), lng: p.lng() }));
    localStorage.setItem("rotaSalvaPetriter", JSON.stringify(pointsData));
    alert("Rota salva no navegador!");
}

function clearRoute() {
    // Limpa dados
    routePoints = [];
    directionsRenderer.setDirections({ routes: [] }); // Limpa linha azul
    
    // Limpa marcadores de pontos criados manualmente
    // (A variável activeOverlays contém marcadores de filtro E de rota, então cuidado)
    // Aqui vamos remover apenas os marcadores padrões do google que adicionamos
    activeOverlays.forEach(overlay => {
        if(overlay instanceof google.maps.Marker) {
             overlay.setMap(null);
        }
    });
    
    // Oculta painel
    const panel = document.getElementById('route-info-panel');
    if(panel) panel.classList.add('hidden');
}

/* ============================================================
   5. LÓGICA DE INTERFACE: CHECKBOXES E DROPDOWN DE FILTROS
   ============================================================ */
const dropdown = document.getElementById('filter-dropdown');
const btnAbrir = document.getElementById('btn-abrir-filtros');
const btnFechar = document.getElementById('btn-fechar-filtros');
const btnAplicar = document.getElementById('btn-aplicar-filtros');
const listaFiltros = document.getElementById('lista-filtros');

if(btnAbrir) {
  btnAbrir.addEventListener('click', (e) => {
    e.preventDefault();
    if(dropdown) {
        dropdown.classList.toggle('hidden');
        if (!dropdown.classList.contains('hidden')) {
          const rect = btnAbrir.getBoundingClientRect();
          dropdown.style.left = `${rect.left}px`;
        }
    }
  });
}

if(btnFechar) {
  btnFechar.addEventListener('click', () => {
    if(dropdown) dropdown.classList.add('hidden');
  });
}

// Renderizar Checkboxes
function renderizarFiltros() {
  if(!listaFiltros) return;
  
  const ulRaiz = document.createElement('ul');
  ulRaiz.className = 'tree-list';

  dadosGeograficos.forEach(distrito => {
    const liDist = document.createElement('li');
    liDist.className = 'item-filtro';
    const distCoords = JSON.stringify(distrito.coords);
    
    liDist.innerHTML = `
      <div class="checkbox-wrapper">
        <input type="checkbox" id="${distrito.id}" class="chk-item" 
               data-tipo="distrito" data-coords='${distCoords}' 
               data-nome="${distrito.nome}" data-pai="${distrito.id}">
        <label for="${distrito.id}" class="label-distrito">${distrito.nome}</label>
      </div>`;

    const ulBairros = document.createElement('ul');
    distrito.bairros.forEach(bairro => {
      const liBairro = document.createElement('li');
      liBairro.className = 'item-filtro';
      const bairroId = bairro.id || Math.random().toString(36).substr(2, 9);
      const bairroCoords = JSON.stringify(bairro.coords);

      liBairro.innerHTML = `
        <div class="checkbox-wrapper">
           <input type="checkbox" id="${bairroId}" class="chk-item" 
                  data-tipo="bairro" data-coords='${bairroCoords}' 
                  data-nome="${bairro.nome}" data-pai="${distrito.id}">
           <label for="${bairroId}" class="label-bairro">${bairro.nome}</label>
        </div>`;

      if (bairro.subs && bairro.subs.length > 0) {
        const ulSubs = document.createElement('ul');
        bairro.subs.forEach((sub, idx) => {
          const subId = `${bairroId}_sub_${idx}`;
          const subCoords = JSON.stringify(sub.coords);
          
          const liSub = document.createElement('li');
          liSub.className = 'item-filtro';
          liSub.innerHTML = `
            <div class="checkbox-wrapper">
              <input type="checkbox" id="${subId}" class="chk-item" 
                     data-tipo="sub" data-coords='${subCoords}' 
                     data-nome="${sub.nome}" data-pai="${distrito.id}">
              <label for="${subId}" class="label-sub">${sub.nome}</label>
            </div>`;
          ulSubs.appendChild(liSub);
        });
        liBairro.appendChild(ulSubs);
      }
      ulBairros.appendChild(liBairro);
    });
    liDist.appendChild(ulBairros);
    ulRaiz.appendChild(liDist);
  });
  listaFiltros.appendChild(ulRaiz);
}

// Checkbox pai seleciona filhos
if(listaFiltros) {
  listaFiltros.addEventListener('change', (e) => {
    const chk = e.target;
    const liPai = chk.closest('li');
    const filhos = liPai.querySelectorAll('ul input[type="checkbox"]');
    filhos.forEach(filho => filho.checked = chk.checked);
  });
}

// Inicia a renderização
renderizarFiltros();

/* ============================================================
   6. APLICAÇÃO DOS FILTROS (DESENHO NO MAPA)
   ============================================================ */
function criarCirculoCoords(centerLat, centerLng, radiusKm) {
  const points = 32;
  const coords = [];
  const rLat = radiusKm / 111.32;
  const rLng = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    coords.push({ lat: centerLat + (rLat * Math.sin(theta)), lng: centerLng + (rLng * Math.cos(theta)) });
  }
  return coords;
}

if(btnAplicar) {
  btnAplicar.addEventListener('click', () => {
    if (!map) return;
    
    // Limpar overlays antigos
    activeOverlays.forEach(o => o.setMap(null));
    activeOverlays = [];
    infoWindow.close();

    const checks = document.querySelectorAll('.chk-item:checked');
    const emptyState = document.querySelector('.empty-state');
    const bounds = new google.maps.LatLngBounds();

    if(emptyState) emptyState.style.display = (checks.length === 0) ? 'block' : 'none';
    if (checks.length === 0) return;

    checks.forEach(chk => {
      const tipo = chk.getAttribute('data-tipo');
      const rawCoords = JSON.parse(chk.getAttribute('data-coords'));
      const pos = { lat: rawCoords[1], lng: rawCoords[0] };
      const nome = chk.getAttribute('data-nome');
      const paiId = chk.getAttribute('data-pai');
      const cor = PALETA[paiId] || PALETA.default;

      // Se for Sub-bairro: usa Marcador Personalizado
      if (tipo === 'sub') {
        const htmlContent = `
          <div class="pin-sub" title="${nome}">
            <span class="material-symbols-outlined" style="color: ${cor};">location_on</span>
          </div>`;
        const marker = new CustomMarkerClass(pos, htmlContent, map);
        
        marker.addListener('click', () => {
          infoWindow.setContent(`
            <div style="padding: 5px;">
                <div class="info-window-title" style="color: ${cor}; font-weight:bold;">${nome}</div>
                <div style="font-size:12px; color:#666;">Sub-bairro</div>
            </div>
          `);
          infoWindow.setPosition(pos);
          infoWindow.open(map);
        });

        activeOverlays.push(marker);
        bounds.extend(pos);

      } else {
        // Se for Bairro ou Distrito: usa Polígono
        const raio = (tipo === 'distrito') ? 1.5 : 0.6;
        const path = criarCirculoCoords(pos.lat, pos.lng, raio);
        const poly = new google.maps.Polygon({
          paths: path,
          strokeColor: cor, strokeOpacity: 0.8, strokeWeight: 2,
          fillColor: cor, fillOpacity: 0.25,
          map: map,
          zIndex: (tipo === 'distrito') ? 1 : 10
        });

        poly.addListener('mouseover', () => poly.setOptions({ fillOpacity: 0.5, strokeWeight: 3 }));
        poly.addListener('mouseout', () => poly.setOptions({ fillOpacity: 0.25, strokeWeight: 2 }));
        
        poly.addListener('click', (e) => {
          infoWindow.setContent(`
            <div style="padding: 5px;">
                <div class="info-window-title" style="color: ${cor}; font-weight:bold;">${nome}</div>
                <div style="font-size:12px; color:#666;">${tipo === 'distrito' ? 'Distrito' : 'Bairro'}</div>
            </div>
          `);
          infoWindow.setPosition(e.latLng);
          infoWindow.open(map);
        });

        activeOverlays.push(poly);
        bounds.extend(pos);
      }
    });

    if (!bounds.isEmpty()) map.fitBounds(bounds);
  });
}

/* ============================================================
   7. TOUR CARD FLUTUANTE (Lógica de exibição e fotos)
   ============================================================ */
(function() {
  const card = document.getElementById('tour-card');
  const closeBtn = document.getElementById('tour-card-close');
  const imgEl = document.getElementById('tour-image');
  const nameEl = document.getElementById('tour-name');
  const addrEl = document.getElementById('tour-address');
  const excerptEl = document.getElementById('tour-excerpt');
  const hoursEl = document.getElementById('tour-hours');
  const webEl = document.getElementById('tour-web');
  const phoneEl = document.getElementById('tour-phone');
  const rowHours = document.getElementById('row-hours');
  const rowWeb = document.getElementById('row-web');
  const rowPhone = document.getElementById('row-phone');
  
  const favBtn = document.getElementById('tour-fav');
  const addPhotoBtn = document.getElementById('tour-add-photo');
  const prevBtn = document.getElementById('tour-prev');
  const nextBtn = document.getElementById('tour-next');
  const sourceEl = document.querySelector('.meta-source') || null;

  let currentPhotos = [];
  let currentIndex = 0;
  let carouselTimer = null;
  const carouselInterval = 5000;
  const API_KEY_FALLBACK = "AIzaSyBCPypWrP-wkTUKd0m0j2PWNi-YSRcbd6Y";

  function showCard() {
    if (!card) return;
    card.style.display = 'block';
    card.setAttribute('aria-hidden', 'false');
    startAuto();
  }
  function hideCard() {
    if (!card) return;
    card.style.display = 'none';
    card.setAttribute('aria-hidden', 'true');
    stopAuto();
  }
  if (closeBtn) closeBtn.addEventListener('click', hideCard);

  function setPhotos(photos) {
    currentPhotos = photos && photos.length ? photos : [];
    currentIndex = 0;
    if (!imgEl) return;
    if (currentPhotos.length === 0) {
      imgEl.src = '';
      imgEl.style.background = '#e9e9e9';
    } else {
      imgEl.style.background = 'none';
      imgEl.src = currentPhotos[0];
    }
  }

  function updateImageTransition(newIndex) {
    if (!imgEl) return;
    imgEl.style.opacity = 0.25;
    setTimeout(() => {
      imgEl.src = currentPhotos[newIndex];
      imgEl.style.opacity = 1;
    }, 180);
  }

  function nextPhoto() {
    if (currentPhotos.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    updateImageTransition(currentIndex);
  }
  function prevPhoto() {
    if (currentPhotos.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateImageTransition(currentIndex);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); nextPhoto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prevPhoto(); });

  function startAuto() {
    stopAuto();
    if (currentPhotos.length > 1) {
      carouselTimer = setInterval(nextPhoto, carouselInterval);
    }
  }
  function stopAuto() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  if (favBtn) favBtn.addEventListener('click', () => {
    const icon = favBtn.querySelector('.material-symbols-outlined');
    if (!icon) return;
    if (icon.textContent === 'star_border') {
      icon.textContent = 'star';
      favBtn.title = 'Remover dos favoritos';
    } else {
      icon.textContent = 'star_border';
      favBtn.title = 'Adicionar aos favoritos';
    }
  });

  if (addPhotoBtn) addPhotoBtn.addEventListener('click', () => {
    const icon = addPhotoBtn.querySelector('.material-symbols-outlined');
    if(icon) icon.classList.add('pulse');
  });

  // Função Global Exposta para ser chamada pelo initMap
  window.showTourCardFromPlace = function(place, position) {
    if (!place) return;

    if (nameEl) nameEl.textContent = place.name || '—';
    if (addrEl) addrEl.textContent = place.formatted_address || (place.vicinity || 'Endereço desconhecido');

    let overviewText = '';
    if (place.editorial_summary) {
      overviewText = (typeof place.editorial_summary === 'string') ? place.editorial_summary : (place.editorial_summary.overview || '');
    } else if (place.types && place.types.length > 0 && place.photos && place.photos.length > 2) {
      overviewText = place.types.join(', ');
    }
    if (excerptEl) {
      excerptEl.textContent = overviewText;
      excerptEl.style.display = overviewText ? 'block' : 'none';
    }

    // Horários
    if (place.opening_hours && place.opening_hours.weekday_text) {
      if (hoursEl) hoursEl.textContent = place.opening_hours.weekday_text.join(' • ');
      if (rowHours) rowHours.style.display = 'flex';
    } else if (place.opening_hours && typeof place.opening_hours.open_now !== 'undefined') {
      if (hoursEl) hoursEl.textContent = place.opening_hours.open_now ? 'Aberto agora' : 'Fechado agora';
      if (rowHours) rowHours.style.display = 'flex';
    } else {
      if (rowHours) rowHours.style.display = 'none';
    }

    // Website
    if (place.website) {
      if (webEl) webEl.innerHTML = `<a href="${place.website}" target="_blank" rel="noopener noreferrer">${place.website.replace(/^https?:\/\//,'')}</a>`;
      if (rowWeb) rowWeb.style.display = 'flex';
    } else {
      if (rowWeb) rowWeb.style.display = 'none';
      if (webEl) webEl.innerHTML = '';
    }

    // Telefone
    if (place.formatted_phone_number || place.international_phone_number) {
      if (phoneEl) phoneEl.textContent = place.formatted_phone_number || place.international_phone_number;
      if (rowPhone) rowPhone.style.display = 'flex';
    } else {
      if (rowPhone) rowPhone.style.display = 'none';
    }

    // Fotos
    const photos = [];
    if (place.photos && place.photos.length) {
      for (let i = 0; i < Math.min(place.photos.length, 6); i++) {
        try {
          photos.push(place.photos[i].getUrl({ maxWidth: 1200, maxHeight: 800 }));
        } catch (err) { }
      }
    }

    // Fallback StreetView
    if (photos.length === 0 && position && typeof position.lat === 'function') {
      photos.push(`https://maps.googleapis.com/maps/api/streetview?size=1200x800&location=${position.lat()},${position.lng()}&fov=90&key=${API_KEY_FALLBACK}`);
    }

    setPhotos(photos);
    if (sourceEl) sourceEl.textContent = 'Fonte: Google Maps';
    showCard();

    // Pan no mapa (ajuste visual)
    try {
      if (position && map && map.panBy) {
        if (position.lat && typeof position.lat === 'function') {
          map.panTo(position);
        }
        map.panBy(180, 0);
      }
    } catch (err) { }
  };

  // Funções de Debug
  window.__PETR_MAP__ = {
    openCardWithPlaceObject: function(place, latLng) {
      if (window.showTourCardFromPlace) window.showTourCardFromPlace(place, latLng);
    },
    closeTourCard: hideCard,
    getMapInstance: function() { return map; }
  };

})();
/* =====================================================
   REDIRECIONAR PARA O PERFIL
   ===================================================== */

document.querySelector('.action-icon').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "profile.html";
});
/* ============================================================
   8. INTEGRAÇÃO ROTAS COM BARRA LATERAL VERTICAL
   ============================================================ */

// Botão do rodapé superior para abrir/fechar painel de rotas
const btnToggleRoutesPanel = document.getElementById('btn-toggle-routes-panel');
const routesPanel = document.getElementById('routes-panel');

if(btnToggleRoutesPanel && routesPanel) {
    btnToggleRoutesPanel.addEventListener('click', () => {
        routesPanel.classList.toggle('hidden'); // mostra/esconde o painel
    });
}

// Atualiza a lista de pontos no painel
function updateRoutesPanel() {
    if(!routesPanel) return;
    const listEl = routesPanel.querySelector('#routes-list');
    if(!listEl) return;

    listEl.innerHTML = ''; // limpa lista anterior
    routePoints.forEach((pt, idx) => {
        const li = document.createElement('li');
        li.textContent = `Ponto ${idx+1}: ${pt.lat().toFixed(5)}, ${pt.lng().toFixed(5)}`;
        listEl.appendChild(li);
    });

    // Atualiza botões
    const btnSave = routesPanel.querySelector('#btn-save-route-panel');
    const btnClear = routesPanel.querySelector('#btn-clear-route-panel');

    if(btnSave) btnSave.onclick = saveRoute;
    if(btnClear) btnClear.onclick = clearRoute;
}

// Modificar addRoutePoint para atualizar painel automaticamente
function addRoutePoint(location) {
    routePoints.push(location);

    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: "Ponto " + routePoints.length
    });
    activeOverlays.push(marker);

    // Atualiza painel de rotas
    updateRoutesPanel();

    if (routePoints.length >= 2) {
        calculateRoute();
    }
}

// Modificar clearRoute para atualizar painel
function clearRoute() {
    routePoints = [];
    directionsRenderer.setDirections({ routes: [] });

    activeOverlays.forEach(overlay => {
        if(overlay instanceof google.maps.Marker) overlay.setMap(null);
    });

    const panel = document.getElementById('route-info-panel');
    if(panel) panel.classList.add('hidden');

    // Limpa painel lateral de rotas
    if(routesPanel) {
        const listEl = routesPanel.querySelector('#routes-list');
        if(listEl) listEl.innerHTML = '';
    }
}
/* ============================================================
   PETRITER AI 5.0 - DEDUPLICAÇÃO & MIX INTELIGENTE
   ============================================================ */

// 1. BANCO DE DADOS (Mantido e Ajustado)
const POI_DATABASE = [
    // --- HISTÓRIA / CULTURA / ESPIRITUALIDADE ---
    { name: "Museu Imperial", lat: -22.50736, lng: -43.17527, category: "História", type: "Museu", tags: ["Museus", "História", "Cultura", "Rota Imperial"] },
    { name: "Catedral São Pedro de Alcântara", lat: -22.504620, lng: -43.178652, category: "História", type: "Igreja", tags: ["História", "Arquitetura", "Espiritualidade"] },
    { name: "Palácio de Cristal", lat: -22.50528, lng: -43.18313, category: "Cultura", type: "Monumento", tags: ["História", "Eventos Locais", "Jardins"] },
    { name: "Casa de Santos Dumont", lat: -22.51014, lng: -43.18423, category: "História", type: "Museu", tags: ["História", "Ciência", "Inovação"] },
    { name: "Casa da Ipiranga", lat: -22.50192, lng: -43.17282, category: "Arquitetura", type: "Casa Histórica", tags: ["Arquitetura", "História", "Fotografia"] },
    { name: "Casa Stefan Zweig", lat: -22.52037, lng: -43.18883, category: "Cultura", type: "Museu", tags: ["Museus", "História", "Literatura"] },
    { name: "Museu da FEB", lat: -22.50835, lng: -43.18113, category: "História", type: "Museu", tags: ["Museus", "História", "Militar"] },
    { name: "Igreja Luterana", lat: -22.50447, lng: -43.17663, category: "História", type: "Igreja", tags: ["Espiritualidade", "Igrejas"] },
    { name: "Museu Casa do Colono", lat: -22.52848, lng: -43.19038, category: "História", type: "Museu", tags: ["Museus", "História", "Tradição"] },
    { name: "Mesquita Islã Baitul Awal", lat: -22.49783, lng: -43.16533, category: "História", type: "Igreja", tags: ["Espiritualidade", "Cultura"] },
    { name: "Casa da Princesa Isabel", lat: -22.50623, lng: -43.18056, category: "História", type: "Casa Histórica", tags: ["História", "Arquitetura Imperial"] },
    { name: "Museu de Cera", lat: -22.51010, lng: -43.18320, category: "Cultura", type: "Museu", tags: ["Museus", "Entretenimento"] },
    { name: "Centro Cultural Raul de Leoni", lat: -22.50740, lng: -43.17757, category: "Cultura", type: "Centro Cultural", tags: ["Arte", "Cultura"] },
    { name: "Sesc Quitandinha", lat: -22.52693, lng: -43.21280, category: "Cultura", type: "Centro Cultural", tags: ["Arquitetura", "História", "Lagos"] },
    { name: "Castelo de Itaipava", lat: -22.36057, lng: -43.12523, category: "Arquitetura", type: "Casa Histórica", tags: ["Arquitetura", "Eventos Locais"] },

    // --- GASTRONOMIA ---
    { name: "Cervejaria Bohemia", lat: -22.50610, lng: -43.18468, category: "Gastronomia", type: "Cervejaria", tags: ["Gastronomia", "Cervejarias", "História"] },
    { name: "Bar da Cervejaria Odin", lat: -22.50686, lng: -43.18531, category: "Gastronomia", type: "Cervejaria", tags: ["Cervejarias", "Gastronomia"] },
    { name: "Katz Chocolates", lat: -22.51042, lng: -43.18341, category: "Gastronomia", type: "Chocolate", tags: ["Cafés", "Chocolate", "Tradição"] },
    { name: "Brownie do Ton", lat: -22.52197, lng: -43.19031, category: "Gastronomia", type: "Café", tags: ["Cafés", "Chocolate", "Gastronomia"] },
    { name: "Casa D'Angelo", lat: -22.50994, lng: -43.17621, category: "Gastronomia", type: "Restaurante", tags: ["Restaurantes", "História", "Gastronomia"] },
    { name: "Bordeaux Vinhos", lat: -22.50384, lng: -43.17285, category: "Gastronomia", type: "Restaurante", tags: ["Restaurantes", "Vinhos"] },
    { name: "Chocolates Patrone", lat: -22.52967, lng: -43.19644, category: "Gastronomia", type: "Chocolate", tags: ["Chocolate", "Tradição", "Cafés"] },
    { name: "Charmoso Café", lat: -22.51416, lng: -43.17515, category: "Gastronomia", type: "Café", tags: ["Cafés", "Chocolate", "História"] },
    { name: "Casa do Alemão", lat: -22.53444, lng: -43.21997, category: "Gastronomia", type: "Restaurante", tags: ["Salgados", "Tradição"] },

    // --- NATUREZA / MIRANTES ---
    { name: "Trono de Fátima", lat: -22.51078, lng: -43.18676, category: "Natureza", type: "Mirante", tags: ["Mirantes", "Espiritualidade", "Vista Panorâmica"] },
    { name: "Mirante do Cristo", lat: -22.55121, lng: -43.23004, category: "Natureza", type: "Mirante", tags: ["Mirantes", "Fotografia", "Espiritualidade"] },
    { name: "Praça da Liberdade", lat: -22.50928, lng: -43.18270, category: "Natureza", type: "Parque", tags: ["Praças", "Lazer"] },
    { name: "Rampa de Voo-livre", lat: -22.54582, lng: -43.20285, category: "Natureza", type: "Mirante", tags: ["Natureza", "Mirantes", "Vista Panorâmica"] },
    { name: "Rua Teresa", lat: -22.52457, lng: -43.17145, category: "Cultura", type: "Compras", tags: ["Compras", "Moda"] },
    { name: "PARNASO (Sede)", lat: -22.46273, lng: -43.09416, category: "Natureza", type: "Trilha", tags: ["Natureza", "Trilhas", "Ecoturismo"] },
    { name: "Parque de Itaipava", lat: -22.40242, lng: -43.13485, category: "Natureza", type: "Parque", tags: ["Parques", "Natureza", "Lazer"] },
    { name: "Cachoeira Véu da Noiva", lat: -22.45348, lng: -43.07273, category: "Natureza", type: "Cachoeira", tags: ["Cachoeiras", "Trilhas", "Aventura"] },
    { name: "Vale do Amor", lat: -22.45235, lng: -43.24103, category: "Natureza", type: "Jardim", tags: ["Espiritualidade", "Natureza", "Jardins"] },
    { name: "Pedra do Quitandinha", lat: -22.52343, lng: -43.20218, category: "Natureza", type: "Trilha", tags: ["Trilhas", "Mirantes", "Aventura"] },
    { name: "Trilha do Castelinho", lat: -22.53302, lng: -43.16220, category: "Natureza", type: "Trilha", tags: ["Trilhas", "Mirantes"] },
    { name: "Pedra do Queijo", lat: -22.48801, lng: -43.06700, category: "Natureza", type: "Trilha", tags: ["Trilhas", "Mirantes"] },
    { name: "Cachoeira da Macumba", lat: -22.43141, lng: -43.06659, category: "Natureza", type: "Cachoeira", tags: ["Trilhas", "Cachoeiras"] },
    { name: "Cachoeira da Rocinha", lat: -22.35284, lng: -43.19192, category: "Natureza", type: "Cachoeira", tags: ["Trilhas", "Cachoeiras"] },
    { name: "Morro do Bonet", lat: -22.47493, lng: -43.28452, category: "Natureza", type: "Trilha", tags: ["Trilhas", "Montanhismo"] },
    { name: "Trilha Uricanal", lat: -22.49519, lng: -43.12721, category: "Natureza", type: "Trilha", tags: ["Trilhas", "Natureza"] },
    { name: "Pedra do Cortiço", lat: -22.54197, lng: -43.19846, category: "Natureza", type: "Trilha", tags: ["Mirantes", "Montanhismo"] }
];

// 2. CONFIGURAÇÃO (AJUSTADA PARA ESPIRITUALIDADE)
const TAG_CONFIG = {
    // GASTRO
    "Chocolate Artesanal": { type: "Chocolate", cluster: "GASTRO", label: "Chocolate" },
    "Cafés Históricos": { type: "Café", cluster: "GASTRO", label: "Cafés" },
    "Cervejarias": { type: "Cervejaria", cluster: "GASTRO", label: "Cervejas" },
    "Restaurantes Coloniais": { type: "Restaurante", cluster: "GASTRO", label: "Restaurantes" },
    
    // HISTORIA
    "Rota Imperial": { type: "Museu", cluster: "HISTORIA", label: "Museus" },
    "Brasil Império": { type: "Casa Histórica", cluster: "HISTORIA", label: "História" },
    "Arquitetura Alemã": { type: "Casa Histórica", cluster: "HISTORIA", label: "Arquitetura" },
    "Igrejas Históricas": { type: "Igreja", cluster: "HISTORIA", label: "Igrejas" },
    
    // NATUREZA / ESPIRITUAL (Separado logicamente)
    "Cachoeiras": { type: "Cachoeira", cluster: "NATUREZA", label: "Cachoeiras" },
    "Trilhas Secretas": { type: "Trilha", cluster: "NATUREZA", label: "Trilhas" },
    "Mirantes Pouco Conhecidos": { type: "Mirante", cluster: "NATUREZA", label: "Mirantes" },
    
    // NOVO: Espiritualidade agora é tratada com carinho
    "Roteiros Espirituais": { type: "Espiritual", cluster: "HISTORIA", label: "Espiritualidade" },
    "Espiritualidade": { type: "Espiritual", cluster: "HISTORIA", label: "Espiritualidade" } 
};

let aiGeneratedRoutes = { 1: [], 2: [], 3: [] };
let activeRouteMarkers = [];

// ============================================================
// 3. LÓGICA DE GERAÇÃO (ANTI-REPETIÇÃO)
// ============================================================
window.generateAIRoutes = function() {
    const savedTags = localStorage.getItem("selectedTags");
    const userTags = savedTags ? JSON.parse(savedTags) : [];
    
    // Atualiza Texto
    const displayTags = document.getElementById('user-tags-display');
    if(displayTags) displayTags.textContent = userTags.length > 0 ? userTags.join(", ") : "Explorador";

    if (userTags.length === 0) {
        generateSurpriseMode();
        openModal();
        return;
    }

    // LISTA NEGRA: O que já foi usado, não entra mais
    let usedPoiNames = new Set();

    // 1. Detectar Grupos
    let clustersFound = {};
    userTags.forEach(tag => {
        const config = TAG_CONFIG[tag];
        if(config) {
            if(!clustersFound[config.cluster]) clustersFound[config.cluster] = [];
            clustersFound[config.cluster].push(config.type);
        }
    });
    const clusterKeys = Object.keys(clustersFound);

    // 2. Gerar Cards
    for(let i=1; i<=3; i++) {
        let route = [];
        let title = "";

        // Cenário: Temos grupos suficientes para cobrir os cards (Ex: Gastro, Natureza, História)
        if (i <= clusterKeys.length) {
            const currentCluster = clusterKeys[i-1];
            const types = clustersFound[currentCluster];
            
            // Pega itens desse grupo, EXCLUINDO os já usados
            route = getMixedRouteForCluster(currentCluster, types, usedPoiNames);
            const label = [...new Set(types.map(t => t === "Espiritual" ? "Templos & Jardins" : t))].join(" & ");
            title = `${getClusterIcon(currentCluster)} Combo: ${label}`;
        } 
        
        // Cenário: Acabaram os grupos (Ex: Você marcou Gastro e Natureza. Estamos no Card 3)
        // AQUI ESTAVA O ERRO. Não podemos gerar aleatório.
        // Temos que gerar "Mais do Mesmo" mas sem repetir itens, OU focar em tags que sobraram.
        else {
            // Pega TODAS as tags que o usuário pediu
            let allRequestedTypes = [];
            Object.values(clustersFound).forEach(arr => allRequestedTypes.push(...arr));
            
            // Gera uma rota com TUDO o que o usuário pediu, mas removendo o que já apareceu nos cards 1 e 2
            route = getRemainingMix(allRequestedTypes, usedPoiNames);
            title = "✨ Mix: Mais Opções para Você";
            
            // Se mesmo assim não achar nada (ex: banco de dados pequeno), aí sim sugere algo novo
            if (route.length === 0) {
                route = generateDiscoveryRoute(usedPoiNames); // Aleatório mas SEM REPETIR o que já viu
                title = "✨ Sugestão: Explore Algo Novo";
            }
        }

        // Salva na memória global e adiciona à Lista Negra
        aiGeneratedRoutes[i] = route;
        route.forEach(p => usedPoiNames.add(p.name));
        
        // Atualiza Título
        updateCardTitle(i, title);
    }

    renderListHTML(1, aiGeneratedRoutes[1]);
    renderListHTML(2, aiGeneratedRoutes[2]);
    renderListHTML(3, aiGeneratedRoutes[3]);
    
    openModal();
}

// ============================================================
// 4. ALGORITMOS INTELIGENTES
// ============================================================

// Filtro dentro do Cluster (Respeita "Espiritualidade")
function getMixedRouteForCluster(clusterName, allowedTypes, blacklist) {
    const candidates = POI_DATABASE.filter(poi => {
        if (blacklist.has(poi.name)) return false; // Anti-repetição

        // Verifica se é tipo permitido
        let isAllowed = allowedTypes.includes(poi.type);
        
        // CORREÇÃO PARA ESPIRITUALIDADE:
        // Se o usuário pediu "Espiritual", aceita itens com a tag "Espiritualidade" mesmo que o type seja Igreja ou Jardim
        if (allowedTypes.includes("Espiritual")) {
            if (poi.tags.includes("Espiritualidade")) isAllowed = true;
        }

        // Verifica Cluster
        let poiCluster = getClusterFromCategory(poi.category);
        return isAllowed && poiCluster === clusterName;
    });

    return candidates.sort(() => Math.random() - 0.5).slice(0, 6);
}

// O Salvador do Card 3: Pega o que sobrou dos interesses do usuário
function getRemainingMix(allRequestedTypes, blacklist) {
    const candidates = POI_DATABASE.filter(poi => {
        if (blacklist.has(poi.name)) return false;

        let isMatch = allRequestedTypes.includes(poi.type);
        // Match especial para Espiritualidade
        if (allRequestedTypes.includes("Espiritual") && poi.tags.includes("Espiritualidade")) {
            isMatch = true;
        }
        return isMatch;
    });

    return candidates.sort(() => Math.random() - 0.5).slice(0, 6);
}

// Fallback (Aleatório, mas respeita a blacklist)
function generateDiscoveryRoute(blacklist) {
    return POI_DATABASE
        .filter(p => !blacklist.has(p.name))
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
}

// Auxiliar: Normaliza Categoria -> Cluster
function getClusterFromCategory(cat) {
    if (cat === "Gastronomia") return "GASTRO";
    if (cat === "Natureza") return "NATUREZA";
    if (["História", "Cultura", "Arquitetura"].includes(cat)) return "HISTORIA";
    return "OUTROS";
}

// Modo Surpresa (Sem Tags)
function generateSurpriseMode() {
    // Definimos manualmente para garantir variedade
    const h = POI_DATABASE.filter(p => p.category === "História").slice(0, 5);
    const n = POI_DATABASE.filter(p => p.category === "Natureza").slice(0, 5);
    const g = POI_DATABASE.filter(p => p.category === "Gastronomia").slice(0, 5);
    
    aiGeneratedRoutes[1] = h; updateCardTitle(1, "🏛️ Tour Histórico");
    aiGeneratedRoutes[2] = n; updateCardTitle(2, "🌿 Natureza");
    aiGeneratedRoutes[3] = g; updateCardTitle(3, "🍽️ Gastronomia");
    
    renderListHTML(1, h); renderListHTML(2, n); renderListHTML(3, g);
}

// ============================================================
// 5. VISUAL E MAPA (Mantido)
// ============================================================
function getClusterIcon(cluster) {
    if(cluster === "GASTRO") return "🍽️";
    if(cluster === "NATUREZA") return "🌿";
    if(cluster === "HISTORIA") return "🏛️";
    return "✨";
}

function getIcon(type) {
    if(type === "Chocolate") return "🍫";
    if(type === "Café") return "☕";
    if(type === "Cervejaria") return "🍺";
    if(type === "Trilha") return "🥾";
    if(type === "Cachoeira") return "🌊";
    if(type === "Mirante") return "🔭";
    if(type === "Museu") return "🏛️";
    if(type === "Igreja" || type === "Espiritual") return "⛪";
    return "📍";
}

function updateCardTitle(id, text) {
    const card = document.getElementById(`route-card-${id}`);
    if(card) { const h4 = card.querySelector('h4'); if(h4) h4.innerText = text; }
}

function renderListHTML(index, points) {
    const ul = document.getElementById(`list-route-${index}`);
    if (!ul) return;
    ul.innerHTML = "";
    if(points.length === 0) {
        ul.innerHTML = "<li style='padding:10px; color:#999'>Sem opções extras.</li>";
        return;
    }
    points.forEach((poi, idx) => {
        const li = document.createElement('li');
        li.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid #eee;";
        li.innerHTML = `
            <div style="font-size:13px; line-height:1.2;">
                <strong>${idx + 1}.</strong> ${getIcon(poi.type)} ${poi.name}
                <div style="font-size:11px; color:#777; margin-left:15px;">${poi.type}</div>
            </div>
            <button onclick="addSingleToCustom(${index}, ${idx})" 
             style="background:#f4f4f4; border:1px solid #ccc; width:28px; height:28px; border-radius:50%; cursor:pointer;">+</button>
        `;
        ul.appendChild(li);
    });
}

function openModal() { document.getElementById('ai-modal').classList.remove('hidden'); }

// --- MAPA ---
window.visualizeAIRoute = function(routeId) {
    const route = aiGeneratedRoutes[routeId];
    if (!route || route.length === 0) return;
    document.getElementById('ai-modal').classList.add('hidden');

    if (!placesService && typeof map !== 'undefined') placesService = new google.maps.places.PlacesService(map);
    activeRouteMarkers.forEach(m => m.setMap(null));
    activeRouteMarkers = [];

    if (typeof directionsRenderer !== 'undefined') {
        directionsRenderer.setMap(map);
        directionsRenderer.setOptions({ suppressMarkers: true, polylineOptions: { strokeColor: '#8A2BE2', strokeWeight: 6 } });
    }
    const bounds = new google.maps.LatLngBounds();
    route.forEach(p => {
        const pos = { lat: p.lat, lng: p.lng };
        const m = new google.maps.Marker({
            position: pos, map: map, title: p.name,
            icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
            animation: google.maps.Animation.DROP
        });
        m.addListener("click", () => fetchPlaceDetailsAndShowCard(p.name, pos));
        activeRouteMarkers.push(m);
        bounds.extend(pos);
    });
    map.fitBounds(bounds);
    if(typeof directionsService !== 'undefined') {
        const origin = { lat: route[0].lat, lng: route[0].lng };
        const dest = { lat: route[route.length-1].lat, lng: route[route.length-1].lng };
        const waypoints = route.slice(1, -1).map(p => ({ location: {lat: p.lat, lng: p.lng}, stopover:true }));
        directionsService.route({ origin, destination: dest, waypoints, travelMode: 'DRIVING' }, (r,s) => { if(s==='OK') directionsRenderer.setDirections(r); });
    }
}

function fetchPlaceDetailsAndShowCard(queryName, locationBias) {
    if (!placesService) return;
    const request = { query: queryName, fields: ['name', 'formatted_address', 'photos', 'rating', 'geometry'], locationBias: locationBias };
    placesService.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) openDetailCard(results[0]);
        else { infoWindow.setContent(`<strong>${queryName}</strong>`); infoWindow.open(map); }
    });
}

function openDetailCard(place) {
    const card = document.getElementById('tour-card');
    const imgEl = document.getElementById('tour-image');
    const nameEl = document.getElementById('tour-name');
    const addrEl = document.getElementById('tour-address');
    if (!card) return;

    if (nameEl) nameEl.textContent = place.name;
    if (addrEl) addrEl.textContent = place.formatted_address || "";
    if (place.photos && place.photos.length > 0) {
        if (imgEl) { imgEl.src = place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }); imgEl.style.display = 'block'; }
    } else { if (imgEl) imgEl.src = "https://via.placeholder.com/400x200?text=Petriter"; }

    card.classList.remove('hidden'); card.setAttribute('aria-hidden', 'false'); card.style.display = 'block';
    const closeBtn = document.getElementById('tour-card-close');
    if (closeBtn) closeBtn.onclick = () => { card.classList.add('hidden'); card.style.display = 'none'; };
}

// --- BOILERPLATE ---
window.addSingleToCustom = function(rId, idx) { const p = aiGeneratedRoutes[rId][idx]; if(typeof addRoutePoint === 'function') addRoutePoint(new google.maps.LatLng(p.lat, p.lng)); }
window.addAllToCustom = function(rId) { const r = aiGeneratedRoutes[rId]; if(typeof addRoutePoint === 'function') { r.forEach(p => addRoutePoint(new google.maps.LatLng(p.lat, p.lng))); document.getElementById('ai-modal').classList.add('hidden'); } }
window.addEventListener("load", () => {
    const btn = document.getElementById("btn-ai-routes");
    const close = document.getElementById("close-ai-modal");
    if(btn) { const clone = btn.cloneNode(true); btn.parentNode.replaceChild(clone, btn); clone.addEventListener("click", window.generateAIRoutes); }
    if(close) close.addEventListener("click", () => document.getElementById("ai-modal").classList.add("hidden"));
});