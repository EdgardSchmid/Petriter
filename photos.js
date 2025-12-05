/* ============================================================
   LÓGICA DE FOTOS (Google Places + Debug)
   ============================================================ */

function exibirFotoNoMapa(nome, position, cor, map, infoWindow, placesService, imagemManual) {
  
  // 1. Se tiver imagem manual, usa ela e encerra
  if (imagemManual && imagemManual.trim() !== "") {
    const conteudoManual = `
      <div style="padding:5px; max-width: 240px;">
        <h3 style="color:${cor}; margin:0; font-size:16px; font-family: 'Segoe UI', sans-serif;">${nome}</h3>
        <img src="${imagemManual}" style="width:100%; height:140px; object-fit:cover; border-radius:4px; margin-top:8px;">
        <div style="font-size:11px; color:#888; margin-top:4px; text-align: right;">Fonte: Arquivo</div>
      </div>`;
    infoWindow.setContent(conteudoManual);
    infoWindow.setPosition(position);
    infoWindow.open(map);
    return;
  }

  // 2. Mostra "Carregando..."
  const loadingContent = `
    <div style="padding:5px; min-width: 200px;">
      <h3 style="color:${cor}; margin:0 0 5px 0; font-family: sans-serif;">${nome}</h3>
      <div style="display: flex; align-items: center; gap: 5px; font-size:12px; color:#666;">
        <span class="material-symbols-outlined" style="font-size: 16px; animation: spin 1s linear infinite;">progress_activity</span>
        Buscando foto no Google...
      </div>
    </div>`;
  
  infoWindow.setContent(loadingContent);
  infoWindow.setPosition(position);
  infoWindow.open(map);

  // 3. Configura a busca
  const request = {
    query: `${nome}, Petrópolis, Rio de Janeiro`, // Busca bem específica
    fields: ['name', 'photos']
  };

  // 4. Pergunta ao Google
  placesService.findPlaceFromQuery(request, (results, status) => {
    
    // --- ÁREA DE DEBUG (OLHE O CONSOLE DO NAVEGADOR) ---
    console.log(`Buscando: ${nome}`);
    console.log(`Status do Google:`, status);
    // ----------------------------------------------------

    let imgHtml = "";

    if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0 && results[0].photos) {
      const photoUrl = results[0].photos[0].getUrl({ maxWidth: 300, maxHeight: 150 });
      imgHtml = `<img src="${photoUrl}" style="width:100%; height:140px; object-fit:cover; border-radius:4px; margin-top:8px;">`;
      console.log("Foto encontrada!");
    } else {
      // Se der erro, mostra no console
      console.warn(`Não achei foto para ${nome}. Motivo: ${status}`);
      
      // Tenta Street View como consolo
      const apiKey = "AIzaSyBCPypWrP-wkTUKd0m0j2PWNi-YSRcbd6Y";
      imgHtml = `<img src="https://maps.googleapis.com/maps/api/streetview?size=300x140&location=${position.lat},${position.lng}&fov=90&heading=0&pitch=10&key=${apiKey}" style="width:100%; height:140px; object-fit:cover; border-radius:4px; margin-top:8px;">`;
    }

    const finalContent = `
      <div style="padding:5px; max-width: 240px;">
        <h3 style="color:${cor}; margin:0; font-size:16px; font-family: 'Segoe UI', sans-serif;">${nome}</h3>
        ${imgHtml}
        <div style="font-size:11px; color:#888; margin-top:4px; text-align: right;">
          ${results && results[0]?.photos ? 'Fonte: Google Places' : 'Fonte: Street View'}
        </div>
      </div>
    `;
    infoWindow.setContent(finalContent);
  });
}