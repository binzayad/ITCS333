// Fetch and Display Reviews
async function fetchReviews() {
    const reviewsContainer = document.getElementById('reviews');
    reviewsContainer.innerHTML = 'Loading...';
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const reviews = await response.json();
      window.allReviews = reviews; // Save globally for search/sort/pagination
      displayReviews(reviews.slice(0, 10)); // Display first 10 for pagination
    } catch (error) {
      reviewsContainer.innerHTML = 'Failed to load reviews: ' + error.message;
    }
  }
  
  function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews');
    reviewsContainer.innerHTML = '';
    
    reviews.forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.classList.add('review');
      reviewElement.innerHTML = `
        <h3>${review.title}</h3>
        <p>${review.body}</p>
        <button onclick="viewReview(${review.id})">View Details</button>
      `;
      reviewsContainer.appendChild(reviewElement);
    });
  }
  
  // Search Reviews
  function searchReviews() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = window.allReviews.filter(review => review.title.toLowerCase().includes(query));
    displayReviews(filtered.slice(0, 10));
  }
  
  // Sort Reviews (by Title)
  function sortReviews() {
    const sorted = [...window.allReviews].sort((a, b) => a.title.localeCompare(b.title));
    displayReviews(sorted.slice(0, 10));
  }
  
  // Simple Pagination
  let currentPage = 1;
  function nextPage() {
    currentPage++;
    const start = (currentPage - 1) * 10;
    const end = start + 10;
    displayReviews(window.allReviews.slice(start, end));
  }
  
  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
      const start = (currentPage - 1) * 10;
      const end = start + 10;
      displayReviews(window.allReviews.slice(start, end));
    }
  }
  
  // View Single Review Detail
  function viewReview(id) {
    const review = window.allReviews.find(r => r.id === id);
    if (review) {
      localStorage.setItem('selectedReview', JSON.stringify(review));
      window.location.href = 'details.html'; // Redirect to detail page
    }
  }
  
  // Load Review in Detail Page
  function loadReviewDetails() {
    const reviewData = JSON.parse(localStorage.getItem('selectedReview'));
    if (reviewData) {
      document.getElementById('reviewTitle').innerText = reviewData.title;
      document.getElementById('reviewBody').innerText = reviewData.body;
    }
  }
  
  // Form Validation
  function validateForm(event) {
    event.preventDefault();
    
    const title = document.getElementById('title');
    const body = document.getElementById('body');
    
    if (title.value.trim() === '' || body.value.trim() === '') {
      alert('Please fill out all required fields.');
      return false;
    }
    
    alert('Form is valid! (In real project, it would now submit)');
    return true;
  }
  
  // Initialize (only call fetchReviews if on listing page)
  if (document.getElementById('reviews')) {
    fetchReviews();
  }
  