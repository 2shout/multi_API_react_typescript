document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".quick-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.getElementById("fromCurrency").value =
        this.getAttribute("data-from");
      document.getElementById("toCurrency").value =
        this.getAttribute("data-to");
      document
        .getElementById("currencyForm")
        .dispatchEvent(new Event("submit"));
    });
  });
});

document
  .getElementById("currencyForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const resultsDiv = document.getElementById("currencyResults");

    if (isNaN(amount) || amount <= 0) {
      resultsDiv.innerHTML =
        '<div class="error">Пожалуйста, введите корректную сумму</div>';
      return;
    }

    resultsDiv.innerHTML =
      '<div class="loading">💱 Получение курса валют...</div>';

    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении курсов валют");
      }

      const data = await response.json();

      if (!data.rates[toCurrency]) {
        throw new Error("Выбранная валюта не найдена");
      }

      const rate = data.rates[toCurrency];
      const convertedAmount = (amount * rate).toFixed(2);
      const reverseRate = (1 / rate).toFixed(4);

      const resultHTML = `
            <div class="currency-card">
                <h3>💱 Результат конвертации</h3>
                <div class="currency-info">
                    <p class="conversion-result">${amount} ${fromCurrency} = <strong>${convertedAmount} ${toCurrency}</strong></p>
                    <p><strong>📈 Курс:</strong> 1 ${fromCurrency} = ${rate.toFixed(
        4
      )} ${toCurrency}</p>
                    <p><strong>📉 Обратный курс:</strong> 1 ${toCurrency} = ${reverseRate} ${fromCurrency}</p>
                    <p><em>🕐 Данные на: ${new Date().toLocaleDateString(
                      "ru-RU"
                    )}</em></p>
                </div>
            </div>
        `;

      resultsDiv.innerHTML = resultHTML;
    } catch (error) {
      console.error("Error fetching currency rates:", error);
      resultsDiv.innerHTML = `<div class="error">${error.message}. Используем демо-данные...</div>`;

      setTimeout(() => {
        const demoResult = getDemoConversion(amount, fromCurrency, toCurrency);
        resultsDiv.innerHTML = demoResult;
      }, 1500);
    }
  });

function getDemoConversion(amount, fromCurrency, toCurrency) {
  const demoRates = {
    USD: { EUR: 0.92, RUB: 92.5, GBP: 0.79, JPY: 150.25 },
    EUR: { USD: 1.09, RUB: 100.5, GBP: 0.86, JPY: 163.0 },
    RUB: { USD: 0.0108, EUR: 0.0099, GBP: 0.0085, JPY: 1.62 },
    GBP: { USD: 1.27, EUR: 1.16, RUB: 117.0, JPY: 190.0 },
    JPY: { USD: 0.0067, EUR: 0.0061, RUB: 0.62, GBP: 0.0053 },
  };

  const rate = demoRates[fromCurrency]?.[toCurrency] || 1;
  const convertedAmount = (amount * rate).toFixed(2);
  const reverseRate = (1 / rate).toFixed(4);

  return `
        <div class="currency-card">
            <h3>💱 Результат конвертации (демо)</h3>
            <div class="currency-info">
                <p class="conversion-result">${amount} ${fromCurrency} = <strong>${convertedAmount} ${toCurrency}</strong></p>
                <p><strong>📈 Курс:</strong> 1 ${fromCurrency} = ${rate.toFixed(
    4
  )} ${toCurrency}</p>
                <p><strong>📉 Обратный курс:</strong> 1 ${toCurrency} = ${reverseRate} ${fromCurrency}</p>
                <p><em>⚠️ Это демо-данные. Реальные курсы могут отличаться.</em></p>
            </div>
        </div>
    `;
}
