document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const addNewsForm = document.getElementById('news-form');
    const detailsSection = document.getElementById('details');
    const detailTitle = document.getElementById('detail-title');
    const detailContent = document.getElementById('detail-content');
    const commentsContainer = document.getElementById('comments-container');
    const commentInput = document.getElementById('comment-input');
    const submitCommentButton = document.getElementById('submit-comment');
    const editButton = document.getElementById('edit-button');
    const deleteButton = document.getElementById('delete-button');

    let newsData = [];
    let currentNewsItem = null;

    
    fetch('https://replit.com/@xotha07/Campus-News#htdocs/api.php')
        .then(response => response.json())
        .then(data => {
            
            newsData.push({
                id: data.id,
                title: data.title,
                content: data.completed ? "Completed" : "Not Completed",
                comments: []
            });
            renderNews();
        })
        .catch(error => console.error('Error fetching data:', error));

    function renderNews() {
        newsContainer.innerHTML = '';
        const filteredData = filterAndSortNews();
        filteredData.forEach(news => {
            const article = document.createElement('article');
            article.innerHTML = `
                <h3>${news.title}</h3>
                <p>${news.content}</p>
                <button class="read-more" data-id="${news.id}">Read more</button>
            `;
            newsContainer.appendChild(article);
        });
    }

    function filterAndSortNews() {
        const searchTerm = searchInput.value.toLowerCase();
        return newsData.filter(news => news.title.toLowerCase().includes(searchTerm))
            .sort((a, b) => sortSelect.value === 'title' ? a.title.localeCompare(b.title) : 0);
    }

    addNewsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = event.target.title.value.trim();
        const content = event.target.content.value.trim();

        const newNewsItem = {
            id: Date.now(),
            title,
            content,
            comments: []
        };
        newsData.push(newNewsItem);
        renderNews();
        addNewsForm.reset();
    });

    searchInput.addEventListener('input', renderNews);
    sortSelect.addEventListener('change', renderNews);

    newsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('read-more')) {
            const newsId = event.target.getAttribute('data-id');
            currentNewsItem = newsData.find(news => news.id == newsId);
            if (currentNewsItem) {
                detailTitle.textContent = currentNewsItem.title;
                detailContent.textContent = currentNewsItem.content;
                commentsContainer.innerHTML = currentNewsItem.comments.map(comment => `<div>${comment}</div>`).join('');
                detailsSection.style.display = 'block';
            }
        }
    });

    editButton.addEventListener('click', () => {
        if (currentNewsItem) {
            const newTitle = prompt('Edit Title:', currentNewsItem.title);
            const newContent = prompt('Edit Content:', currentNewsItem.content);
            if (newTitle !== null) currentNewsItem.title = newTitle;
            if (newContent !== null) currentNewsItem.content = newContent;
            renderNews();
            detailTitle.textContent = currentNewsItem.title;
            detailContent.textContent = currentNewsItem.content;
        }
    });

    deleteButton.addEventListener('click', () => {
        if (currentNewsItem) {
            newsData = newsData.filter(news => news.id !== currentNewsItem.id);
            detailsSection.style.display = 'none';
            renderNews();
        }
    });

    submitCommentButton.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText && currentNewsItem) {
            currentNewsItem.comments.push(commentText);
            commentsContainer.innerHTML += `<div>${commentText}</div>`;
            commentInput.value = '';
        } else {
            alert('Please enter a comment.');
        }
    });
});