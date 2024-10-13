let totalPages;
let articlesPerPage = 20; // Define articles per page
let query = new URLSearchParams(window.location.search).get('q') || 'All';
let pageno = parseInt(new URLSearchParams(window.location.search).get('pageno')) || 1;
console.log(query, pageno);

// Fetch and display regular news
const fetchNews = async (query, pageno) => {
    const url = `/api?q=${query}&apiKey=698b363525234412b0811509433adde4&pagesize=${articlesPerPage}&page=${pageno}`;
    // const url = `/api?q=${query}&apiKey=e6965d3a8fe84783ac777ba7f530c643&pagesize=${articlesPerPage}&page=${pageno}`;

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch news');
        let data = await response.json();
        console.log(data);

        // Update query text and total results
        document.getElementById('queryText').innerText = query.replace("+", " ");
        document.getElementById('queryResult').innerText = data.totalResults;

        totalPages = Math.ceil(data.totalResults / articlesPerPage);

        // Update pagination links
        updatePaginationLinks(query, pageno);

        // Display the fetched articles
        displayArticles(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('content').innerHTML = `<p class="text-danger">Failed to load news. Please try again later.</p>`;
    }
};

// Update pagination links dynamically
function updatePaginationLinks(query, pageno) {
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    prev.href = `/?q=${query}&pageno=${pageno - 1 > 0 ? pageno - 1 : 1}`;
    next.href = `/?q=${query}&pageno=${pageno + 1 <= totalPages ? pageno + 1 : totalPages}`;

    // Update specific page links (for example, for 1, 2, and 3)
    document.getElementById("f").href = `/?q=${query}&pageno=1`;
    document.getElementById("s").href = `/?q=${query}&pageno=2`;
    document.getElementById("th").href = `/?q=${query}&pageno=3`;

    // Display current pagination info
    document.getElementById("paginationInfo").innerHTML = `Page ${pageno} of ${totalPages}`;
}

// Display fetched articles in cards
// Display fetched articles in cards
function displayArticles(articles) {
    let content = document.getElementById('content');
    let str = "";

    articles.forEach(item => {
        let date = new Date(item.publishedAt).toLocaleDateString();
        if (!item.urlToImage || !item.title) return;

        // Create an image element to check if the image URL is valid
        const img = new Image();
        img.src = item.urlToImage;

        img.onload = () => {
            // If image is valid, append the article to the content
            str += `
                <div class="card m-3" style="width: 18rem;">
                    <img src="${item.urlToImage}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <span class="fw-bold">Published: ${date}</span>
                        <span class="fw-bold">From: ${item.source.name}</span>
                        <p class="card-text">${item.description}.</p>
                        <a href="${item.url}" class="btn btn-danger" target="_blank" rel="noopener noreferrer">Read more</a>
                    </div>
                </div>
            `;
            content.innerHTML = str;
        };

        img.onerror = () => {
            // If image is not valid, skip this article and do nothing
            console.log(`Image not found for article: ${item.title}`);
        };
    });
}


// Fetch viral news for the carousel
const fetchViralNews = async () => {
    const url = `/api/viral-news`; // Call the backend API for viral news
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch viral news');
        let data = await response.json();
        displayViralNews(data.articles);
    } catch (error) {
        console.error('Error fetching viral news:', error);
        document.getElementById('newsCards').innerHTML = `<p class="text-danger">Failed to load viral news. Please try again later.</p>`;
    }
};

// Display viral news in a carousel
function displayViralNews(articles) {
    const newsCards = document.getElementById('newsCards');
    let isFirstItem = true;

    // Filter articles to include only those with an image, title, and description
    const filteredArticles = articles.filter(article =>
        article.urlToImage && article.title && article.description
    );

    for (let i = 0; i < filteredArticles.length; i += 3) {
        if (filteredArticles.length - i < 3 && i !== 0) break; // Stop if there are fewer than 4 articles

        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${isFirstItem ? 'active' : ''}`;
        isFirstItem = false;

        const cardsWrapper = document.createElement('div');
        cardsWrapper.className = 'cards-wrapper';

        filteredArticles.slice(i, i + 3).forEach(article => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style = 'width: 18rem;';
            card.innerHTML = `
                <img src="${article.urlToImage}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.description}</p>
                    <a href="${article.url}" class="btn btn-danger" target="_blank">Read more</a>
                </div>
            `;
            cardsWrapper.appendChild(card);
        });

        carouselItem.appendChild(cardsWrapper);
        newsCards.appendChild(carouselItem);
    }
}

// Initialize page by fetching news and viral news
document.addEventListener('DOMContentLoaded', () => {
    fetchNews(query, pageno);
    fetchViralNews();
});

