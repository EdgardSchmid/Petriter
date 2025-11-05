// ===============================
// === CONFIGURAÇÃO DO CLIMA =====
// ===============================
const OWM_API_KEY = "bf750366270e78f3f93e96d550a5627a"; // 🔑 coloque sua chave do OpenWeatherMap
const LAT = -22.5046;
const LON = -43.1823;

// Classe para criar a caixinha de clima
function WeatherControl() {
  this._container = null;
}
WeatherControl.prototype.onAdd = function(map) {
  this._map = map;
  this._container = document.createElement('div');
  this._container.className = 'weather-box maplibregl-ctrl maplibregl-ctrl-group'; // Adicionado classes do MapLibre para estilização
  this._container.innerHTML = "<div>Carregando clima...</div>";
  
  // Estilos para a caixa de clima parecer um controle do mapa
  this._container.style.backgroundColor = 'white';
  this._container.style.padding = '10px';
  this._container.style.borderRadius = '4px';
  this._container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
  this._container.style.textAlign = 'center';

  // Impede que clique na caixa interfira no mapa
  this._container.style.pointerEvents = "auto";
  return this._container;
};
WeatherControl.prototype.onRemove = function() {
  this._container.parentNode.removeChild(this._container);
  this._map = undefined;
};
WeatherControl.prototype.update = function(data) {
  if (data.error) {
    this._container.innerHTML = `<div><b>Erro:</b> ${data.error}</div>`;
    return;
  }
  this._container.innerHTML = `
    <div style="font-weight: bold;">Clima em Petrópolis</div>
    <div>${data.temp.toFixed(1)}°C — ${data.desc}</div>
    <img src="${data.icon}" alt="${data.desc}" style="width: 50px; height: 50px;">
  `;
};

// ===============================
// === BOTÃO CLIMA ===============
// ===============================
const weatherButton = document.getElementById('weatherButton');
let weatherControl = null;
let isWeatherVisible = false;

weatherButton.addEventListener('click', async () => {
  if (!isWeatherVisible) {
    weatherControl = new WeatherControl();
    // Adiciona no mapa global (MapLibre já existe em maps.js)
    map.addControl(weatherControl, 'top-right');
    await loadWeather();
    isWeatherVisible = true;
  } else {
    map.removeControl(weatherControl);
    weatherControl = null;
    isWeatherVisible = false;
  }
});

// ===============================
// === FUNÇÃO PARA BUSCAR DADOS ===
// ===============================
async function loadWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&lang=pt_br&appid=${OWM_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro " + res.status);
    const data = await res.json();

    const clima = {
      temp: data.main.temp,
      desc: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };

    weatherControl.update(clima);

  } catch (err) {
    weatherControl.update({ error: err.message });
  }
}