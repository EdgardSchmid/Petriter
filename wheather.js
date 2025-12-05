document.addEventListener("DOMContentLoaded", function() {
    // ===============================
    // === CONFIGURAÇÃO DO CLIMA =====
    // ===============================
    const OWM_API_KEY = "bf750366270e78f3f93e96d550a5627a"; // Sua chave
    const LAT = -22.5046;
    const LON = -43.1823;

    // Elementos do DOM
    const weatherButton = document.getElementById('weatherButton');
    const mapContainer = document.getElementById('map-container'); 
    
    let weatherBox = null; 
    let isVisible = false;
    
    // NOTA: A função formatTime não é mais necessária, pois usaremos um texto estático.

    // ===============================
    // === 1. CRIAR A CAIXINHA =======
    // ===============================
    function createWeatherBox() {
        const div = document.createElement('div');
        div.id = 'weather-box-id'; 
        div.className = 'weather-box'; 
        div.innerHTML = "<div>Buscando dados...</div>";
        div.style.display = 'none'; 
        
        if (mapContainer) {
            mapContainer.appendChild(div);
        } else {
            console.error("ERRO: #map-container não encontrado no HTML");
            document.body.appendChild(div); 
        }
        return div;
    }

    // ===============================
    // === 2. ATUALIZAR O HTML =======
    // ===============================
    function updateUI(currentData, nextForecast) {
        if (!weatherBox) return;

        if (currentData.error) {
            weatherBox.innerHTML = `<div style="color:red; font-weight:bold;">⚠️ ${currentData.error}</div>`;
            return;
        }

        let htmlContent = `
            <div style="font-size: 10px; color: #888; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">
                Petrópolis, RJ
            </div>
            
            <div style="display: flex; justify-content: space-around; gap: 15px; text-align: center;">
                
                <div style="flex: 1; border-right: 1px solid #eee; padding-right: 15px;">
                    <div style="font-size: 10px; color: #555; font-weight: bold; margin-bottom: 5px;">AGORA</div>
                    <img src="${currentData.icon}" alt="${currentData.desc}" style="width: 45px; height: 45px; margin-bottom: 3px;">
                    <div style="font-size: 18px; font-weight: 700; color: #333; line-height: 1;">${Math.round(currentData.temp)}°C</div>
                    <div style="font-size: 11px; color: #555; text-transform: capitalize; margin-top: 5px;">${currentData.desc}</div>
                </div>

                <div style="flex: 1;">
                    ${nextForecast ? `
                        <div style="font-size: 10px; color: #555; font-weight: bold; margin-bottom: 5px;">PRÓXIMAS 3 HORAS</div>
                        <img src="${nextForecast.icon}" alt="${nextForecast.desc}" style="width: 45px; height: 45px; margin-bottom: 3px;">
                        <div style="font-size: 18px; font-weight: 700; color: #333; line-height: 1;">${Math.round(nextForecast.temp)}°C</div>
                        <div style="font-size: 11px; color: #555; text-transform: capitalize; margin-top: 5px;">${nextForecast.desc}</div>
                    ` : `<div style="font-size:11px; color:#999; padding-top:10px;">Sem previsão.</div>`}
                </div>
            </div>
        `;

        weatherBox.innerHTML = htmlContent;
    }

    // ===============================
    // === 3. BUSCAR DADOS (API) =====
    // ===============================
    async function fetchWeatherData() {
        let currentData = { error: "Erro desconhecido" };
        let nextForecast = null;

        try {
            // 3.1. Busca Clima Atual
            const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&lang=pt_br&appid=${OWM_API_KEY}`;
            const currentRes = await fetch(currentUrl);
            const currentJson = await currentRes.json();
            
            if (!currentRes.ok) throw new Error(`Erro API Clima: ${currentJson.message}`);
            
            currentData = {
                temp: currentJson.main.temp,
                desc: currentJson.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${currentJson.weather[0].icon}@2x.png`
            };
            
            // 3.2. Busca Previsão 5 dias (usaremos apenas o primeiro item futuro)
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&lang=pt_br&appid=${OWM_API_KEY}`;
            const forecastRes = await fetch(forecastUrl);
            const forecastJson = await forecastRes.json();

            if (forecastRes.ok && forecastJson.list && forecastJson.list.length > 0) {
                // O primeiro item na lista (index 0) é a previsão mais próxima,
                // que geralmente é a de 3 horas.
                const nextItem = forecastJson.list[0]; 
                
                nextForecast = {
                    // Removido o timestamp
                    temp: nextItem.main.temp,
                    desc: nextItem.weather[0].description,
                    icon: `https://openweathermap.org/img/wn/${nextItem.weather[0].icon}@2x.png`
                };
            }

            // 3.3. Atualiza a UI
            updateUI(currentData, nextForecast);

        } catch (error) {
            console.error(error);
            updateUI({ error: error.message || "Falha ao carregar dados do clima." }, null);
        }
    }

    // ===============================
    // === 4. EVENTO DE CLIQUE =======
    // ===============================
    if (weatherButton) {
        weatherButton.addEventListener('click', () => {
            if (!weatherBox) {
                weatherBox = createWeatherBox();
                fetchWeatherData(); // Busca Clima Atual e Previsão
            }

            // Alterna visibilidade
            if (isVisible) {
                weatherBox.style.display = 'none';
                weatherButton.innerHTML = "Clima";
                isVisible = false;
            } else {
                weatherBox.style.display = 'block'; // Mostra
                weatherButton.innerHTML = "Fechar Clima";
                isVisible = true;
            }
        });
    }
});