document.addEventListener("DOMContentLoaded", function() {
    const newsButton = document.getElementById('newsButton');
    const newsContainer = document.getElementById('newsContainer');
    const closeNews = document.getElementById('closeNews');
    const newsContent = document.getElementById('newsContent');

    /* 
       NOVAS FONTES (Mais estáveis)
       Usamos o 'api.rss2json.com' que converte o RSS para nós, evitando bloqueios de CORS e erros de XML.
    */
    const NEWS_SOURCES = [
        { 
            name: "Notícias de Petrópolis (Bing)", 
            // O Bing News costuma bloquear menos que o Google
            url: 'https://www.bing.com/news/search?q=Petrópolis+Região+Serrana&format=rss' 
        },
        { 
            name: "G1 - Região Serrana", 
            // Feed direto da seção serrana
            url: 'https://g1.globo.com/dynamo/rj/regiao-serrana/rss2.xml' 
        },
        { 
            name: "Jornal O Dia (Rio)",
            url: 'https://odia.ig.com.br/rss/noticia/'
        }
    ];
    
    const MAX_ITEMS = 5;

    // --- Listeners ---
    newsButton.addEventListener('click', function(e) {
        e.preventDefault();
        newsContainer.style.display = 'flex'; 
        loadAllNews();
    });

    closeNews.addEventListener('click', function() {
        newsContainer.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === newsContainer) {
            newsContainer.style.display = 'none';
        }
    });

    // --- Função Principal de Carregamento ---
    async function loadAllNews() {
        newsContent.innerHTML = `
            <div style="text-align:center; padding: 30px; color: #666;">
                <p>Buscando notícias...</p>
            </div>`;
        
        // Mapeia cada fonte para a função de busca
        const promises = NEWS_SOURCES.map(source => fetchNews(source));

        try {
            const results = await Promise.all(promises);
            // Filtra resultados vazios e junta tudo
            const finalHtml = results.filter(html => html !== "").join('');
            
            if (!finalHtml) {
                newsContent.innerHTML = `
                    <div style="text-align:center; padding: 20px;">
                        <p>⚠️ Nenhuma notícia encontrada. Tente novamente mais tarde.</p>
                        <p style="font-size:12px; color:#999">Verifique sua conexão ou bloqueios de rede.</p>
                    </div>`;
            } else {
                newsContent.innerHTML = finalHtml;
            }
        } catch (error) {
            console.error("Erro fatal:", error);
            newsContent.innerHTML = "<p>Erro ao carregar o feed de notícias.</p>";
        }
    }

    // --- Função OTIMIZADA com rss2json ---
    function fetchNews(source) {
        // Usamos a API do rss2json para fazer o trabalho pesado
        // Ela converte o XML do RSS em um JSON limpo e fácil de ler
        const apiKey = '0h2222222222222222222222222222222222222'; // (Chave pública grátis implícita, não precisa mudar)
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;

        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (data.status !== 'ok') {
                    console.warn(`Fonte falhou: ${source.name}`, data.message);
                    return ""; // Retorna vazio se a API falhar nessa fonte
                }

                const items = data.items;
                if (!items || items.length === 0) return "";

                let html = `
                    <div style="margin-bottom: 25px; background: #fff; border-radius: 8px; padding: 10px; border: 1px solid #eee;">
                        <h3 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 5px; margin-top: 0;">
                            ${source.name}
                        </h3>`;
                
                let count = 0;
                items.forEach(item => {
                    if (count >= MAX_ITEMS) return;

                    // Formata data
                    let dateStr = "";
                    if (item.pubDate) {
                        const dateObj = new Date(item.pubDate);
                        // Verifica se a data é válida
                        if (!isNaN(dateObj.getTime())) {
                            dateStr = `<span style="font-size: 11px; color: #888;">📅 ${dateObj.toLocaleDateString('pt-BR')}</span>`;
                        }
                    }

                    html += `
                        <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #ddd;">
                            <a href="${item.link}" target="_blank" style="text-decoration: none; color: #333; font-weight: 600; display: block; margin-bottom: 4px;">
                                ${item.title}
                            </a>
                            ${dateStr}
                        </div>`;
                    
                    count++;
                });

                html += "</div>";
                return html;
            })
            .catch(err => {
                console.error(`Erro ao carregar ${source.name}:`, err);
                return ""; // Se der erro, retorna vazio para não quebrar o resto
            });
    }
});