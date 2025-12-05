document.addEventListener("DOMContentLoaded", function () {
  const resultsDiv = document.getElementById("cryptoResults");
  const loadTopBtn = document.getElementById("loadTopCrypto");
  const searchBtn = document.getElementById("searchCrypto");
  const searchInput = document.getElementById("cryptoSearch");

  loadTopCryptocurrencies();

  loadTopBtn.addEventListener("click", loadTopCryptocurrencies);

  searchBtn.addEventListener("click", function () {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      searchCryptocurrency(query);
    }
  });

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const query = searchInput.value.trim().toLowerCase();
      if (query) {
        searchCryptocurrency(query);
      }
    }
  });
});

async function loadTopCryptocurrencies() {
  const resultsDiv = document.getElementById("cryptoResults");
  resultsDiv.innerHTML =
    '<div class="loading">₿ Загрузка топ криптовалют...</div>';

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    );

    if (!response.ok) {
      throw new Error("Ошибка при загрузке данных");
    }

    const data = await response.json();

    let html = "<h3>🏆 Топ 10 криптовалют по рыночной капитализации</h3>";
    html += '<div class="crypto-grid">';

    data.forEach((crypto, index) => {
      const priceChange = crypto.price_change_percentage_24h;
      const changeClass = priceChange >= 0 ? "price-up" : "price-down";
      const changeIcon = priceChange >= 0 ? "📈" : "📉";

      html += `
                <div class="crypto-card">
                    <div class="crypto-header">
                        <img src="${crypto.image}" alt="${
        crypto.name
      }" class="crypto-icon">
                        <div class="crypto-name">
                            <h4>${index + 1}. ${
        crypto.name
      } (${crypto.symbol.toUpperCase()})</h4>
                            <span class="rank">Ранг: ${
                              crypto.market_cap_rank || "N/A"
                            }</span>
                        </div>
                    </div>
                    <div class="crypto-info">
                        <p><strong>💵 Цена:</strong> $${
                          crypto.current_price?.toLocaleString() || "N/A"
                        }</p>
                        <p><strong>💰 Рыночная капитализация:</strong> $${
                          crypto.market_cap?.toLocaleString() || "N/A"
                        }</p>
                        <p><strong>📊 Объем (24ч):</strong> $${
                          crypto.total_volume?.toLocaleString() || "N/A"
                        }</p>
                        <p class="${changeClass}"><strong>${changeIcon} Изменение (24ч):</strong> ${
        priceChange ? priceChange.toFixed(2) : "0"
      }%</p>
                        <p><strong>🔄 Обновлено:</strong> ${new Date(
                          crypto.last_updated
                        ).toLocaleString("ru-RU")}</p>
                    </div>
                </div>
            `;
    });

    html += "</div>";
    resultsDiv.innerHTML = html;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    resultsDiv.innerHTML = `<div class="error">${error.message}. Загружаем демо-данные...</div>`;

    setTimeout(() => {
      showDemoCryptoData();
    }, 1500);
  }
}

async function searchCryptocurrency(query) {
  const resultsDiv = document.getElementById("cryptoResults");
  resultsDiv.innerHTML = '<div class="loading">🔍 Поиск криптовалюты...</div>';

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${query}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );

    if (!response.ok) {
      throw new Error("Криптовалюта не найдена");
    }

    const crypto = await response.json();
    const marketData = crypto.market_data;

    const priceChange = marketData.price_change_percentage_24h;
    const changeClass = priceChange >= 0 ? "price-up" : "price-down";
    const changeIcon = priceChange >= 0 ? "📈" : "📉";

    const html = `
            <div class="crypto-card detailed">
                <div class="crypto-header">
                    <img src="${crypto.image.large}" alt="${
      crypto.name
    }" class="crypto-icon large">
                    <div class="crypto-name">
                        <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
                        <span class="rank">Ранг: ${
                          crypto.market_cap_rank || "N/A"
                        }</span>
                    </div>
                </div>
                <div class="crypto-info">
                    <p><strong>💵 Текущая цена:</strong> $${marketData.current_price.usd.toLocaleString()}</p>
                    <p><strong>💰 Рыночная капитализация:</strong> $${marketData.market_cap.usd.toLocaleString()}</p>
                    <p><strong>📊 Объем (24ч):</strong> $${marketData.total_volume.usd.toLocaleString()}</p>
                    <p class="${changeClass}"><strong>${changeIcon} Изменение (24ч):</strong> ${
      priceChange ? priceChange.toFixed(2) : "0"
    }%</p>
                    <p><strong>📈 Максимум (24ч):</strong> $${marketData.high_24h.usd.toLocaleString()}</p>
                    <p><strong>📉 Минимум (24ч):</strong> $${marketData.low_24h.usd.toLocaleString()}</p>
                    <p><strong>🔄 Обновлено:</strong> ${new Date(
                      crypto.last_updated
                    ).toLocaleString("ru-RU")}</p>
                </div>
            </div>
        `;

    resultsDiv.innerHTML = html;
  } catch (error) {
    console.error("Error searching crypto:", error);
    resultsDiv.innerHTML = `<div class="error">${error.message}. Попробуйте найти другую криптовалюту.</div>`;

    setTimeout(() => {
      showCryptoSearchSuggestions(query);
    }, 2000);
  }
}

function showDemoCryptoData() {
  const demoData = [
    { name: "Bitcoin", symbol: "btc", price: 43250, change: 2.5, rank: 1 },
    { name: "Ethereum", symbol: "eth", price: 2580, change: 1.2, rank: 2 },
    { name: "Binance Coin", symbol: "bnb", price: 325, change: -0.8, rank: 3 },
    { name: "Cardano", symbol: "ada", price: 0.52, change: 3.1, rank: 4 },
    { name: "Solana", symbol: "sol", price: 102, change: 5.7, rank: 5 },
  ];

  let html = "<h3>🏆 Демо: Топ криптовалют</h3>";
  html += '<div class="crypto-grid">';

  demoData.forEach((crypto, index) => {
    const changeClass = crypto.change >= 0 ? "price-up" : "price-down";
    const changeIcon = crypto.change >= 0 ? "📈" : "📉";

    html += `
            <div class="crypto-card">
                <div class="crypto-header">
                    <div class="crypto-icon demo">${crypto.symbol.toUpperCase()}</div>
                    <div class="crypto-name">
                        <h4>${index + 1}. ${
      crypto.name
    } (${crypto.symbol.toUpperCase()})</h4>
                        <span class="rank">Ранг: ${crypto.rank}</span>
                    </div>
                </div>
                <div class="crypto-info">
                    <p><strong>💵 Цена:</strong> $${crypto.price.toLocaleString()}</p>
                    <p class="${changeClass}"><strong>${changeIcon} Изменение (24ч):</strong> ${
      crypto.change
    }%</p>
                    <p><em>⚠️ Это демо-данные</em></p>
                </div>
            </div>
        `;
  });

  html += "</div>";
  document.getElementById("cryptoResults").innerHTML = html;
}

function showCryptoSearchSuggestions(query) {
  const suggestions = {
    btc: "bitcoin",
    eth: "ethereum",
    bnb: "binancecoin",
    ada: "cardano",
    sol: "solana",
    xrp: "ripple",
    doge: "dogecoin",
    dot: "polkadot",
  };

  let html = `<div class="error">Криптовалюта "${query}" не найдена.</div>`;
  html +=
    '<div class="suggestions"><h4>🔍 Попробуйте эти популярные криптовалюты:</h4><div class="suggestion-tags">';

  Object.entries(suggestions).forEach(([symbol, id]) => {
    html += `<span class="suggestion-tag" data-id="${id}">${symbol.toUpperCase()}</span>`;
  });

  html += "</div></div>";

  document.getElementById("cryptoResults").innerHTML = html;

  document.querySelectorAll(".suggestion-tag").forEach((tag) => {
    tag.addEventListener("click", function () {
      document.getElementById("cryptoSearch").value =
        this.getAttribute("data-id");
      searchCryptocurrency(this.getAttribute("data-id"));
    });
  });
}
