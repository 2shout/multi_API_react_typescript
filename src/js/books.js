document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".query-tag").forEach((tag) => {
    tag.addEventListener("click", function () {
      const query = this.getAttribute("data-query");
      document.getElementById("searchQuery").value = query;
      document.getElementById("booksForm").dispatchEvent(new Event("submit"));
    });
  });
});

document
  .getElementById("booksForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const query = document.getElementById("searchQuery").value.trim();
    const resultsDiv = document.getElementById("booksResults");

    if (!query) {
      resultsDiv.innerHTML =
        '<div class="error">Пожалуйста, введите поисковый запрос</div>';
      return;
    }

    resultsDiv.innerHTML = '<div class="loading">🔍 Поиск книг...</div>';

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          query
        )}&limit=6`
      );

      if (!response.ok) {
        throw new Error("Ошибка при поиске книг");
      }

      const data = await response.json();

      if (data.docs.length === 0) {
        resultsDiv.innerHTML =
          '<div class="error">📚 Книги по вашему запросу не найдены</div>';
        return;
      }

      let html = `<h3>📚 Найдено книг: ${data.numFound.toLocaleString()}</h3>`;
      html += `<p>Показано первых ${Math.min(
        data.docs.length,
        6
      )} результатов:</p>`;

      data.docs.slice(0, 6).forEach((book, index) => {
        const title = book.title || "Неизвестное название";
        const author = book.author_name
          ? book.author_name[0]
          : "Неизвестный автор";
        const year = book.first_publish_year || "Год издания неизвестен";
        const isbn = book.isbn ? book.isbn[0] : "";
        const coverId = book.cover_i;

        html += `
                <div class="book-card">
                    <div class="book-info">
                        <h4>${index + 1}. ${title}</h4>
                        <p><strong>✍️ Автор:</strong> ${author}</p>
                        <p><strong>📅 Год издания:</strong> ${year}</p>
                        ${
                          isbn ? `<p><strong>🔖 ISBN:</strong> ${isbn}</p>` : ""
                        }
                        ${
                          coverId
                            ? `
                            <div class="book-cover">
                                <img src="https://covers.openlibrary.org/b/id/${coverId}-M.jpg" 
                                     alt="Обложка книги '${title}'" 
                                     onerror="this.style.display='none'">
                            </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            `;
      });

      resultsDiv.innerHTML = html;
    } catch (error) {
      console.error("Error fetching books:", error);
      resultsDiv.innerHTML = `<div class="error">${error.message}</div>`;

      setTimeout(() => {
        const demoBooks = getDemoBooks(query);
        resultsDiv.innerHTML = demoBooks;
      }, 1500);
    }
  });

function getDemoBooks(query) {
  const demoBooks = {
    javascript: [
      {
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        year: 2008,
      },
      { title: "Eloquent JavaScript", author: "Marijn Haverbeke", year: 2018 },
      { title: "You Don't Know JS", author: "Kyle Simpson", year: 2015 },
    ],
    "harry potter": [
      {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        year: 1997,
      },
      {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J.K. Rowling",
        year: 1998,
      },
      {
        title: "Harry Potter and the Prisoner of Azkaban",
        author: "J.K. Rowling",
        year: 1999,
      },
    ],
    "stephen king": [
      { title: "The Shining", author: "Stephen King", year: 1977 },
      { title: "It", author: "Stephen King", year: 1986 },
      { title: "The Stand", author: "Stephen King", year: 1978 },
    ],
  };

  const books = demoBooks[query.toLowerCase()] || [
    { title: `Результаты для "${query}"`, author: "Разные авторы", year: 2023 },
    { title: "Искусство программирования", author: "Дональд Кнут", year: 1968 },
    { title: "Чистый код", author: "Роберт Мартин", year: 2008 },
  ];

  let html = `<h3>📚 Демо-результаты для "${query}"</h3>`;
  books.forEach((book, index) => {
    html += `
            <div class="book-card">
                <div class="book-info">
                    <h4>${index + 1}. ${book.title}</h4>
                    <p><strong>✍️ Автор:</strong> ${book.author}</p>
                    <p><strong>📅 Год издания:</strong> ${book.year}</p>
                    <p><em>⚠️ Это демо-данные</em></p>
                </div>
            </div>
        `;
  });

  return html;
}
