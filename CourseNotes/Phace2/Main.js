document.addEventListener('DOMContentLoaded', function() {
	// Fetch data from JSONPlaceholder
	fetchNotes();

	// Add event listeners
	document.getElementById('searchbtn').addEventListener('click', searchNotes);
	document.querySelectorAll('.sort')[0].addEventListener('click', () => sortNotes('asc'));
	document.querySelectorAll('.sort')[1].addEventListener('click', () => sortNotes('desc'));
	document.getElementById('publish').addEventListener('click', addComment);
	document.getElementById('navigate').addEventListener('click', navigate);
	document.getElementsByClassName("reset")[0].
		addEventListener("click", reset);

	// Pagination event listeners
	document.getElementById('firstPage').addEventListener('click', () => changePage('first'));
	document.getElementById('prevPage').addEventListener('click', () => changePage('prev'));
	document.getElementById('nextPage').addEventListener('click', () => changePage('next'));
	document.getElementById('lastPage').addEventListener('click', () => changePage('last'));
});

let currentPage = 1; // Current page number
const notesPerPage = 5; // Number of notes to display per page
let totalNotes = 0; // Total number of notes fetched from the API
let allNotes = []; // Array to store all fetched notes
let originalNotes = []; // Array to store the original notes (unfiltered)

const jason = 'https://jsonplaceholder.typicode.com/posts';

// Fetch notes and calculate pagination
function fetchNotes() {
	fetch(jason)
		.then(response => response.json())
		.then(data => {
			allNotes = data; // Store all fetched notes
			originalNotes = [...data]; // Create a copy of the original notes
			totalNotes = data.length; // Total number of notes
			updatePaginationControls(); // Update pagination controls
			displayNotes(currentPage); // Display notes for the current page
		})
		.catch(error => {
			console.error('Error fetching notes:', error);
		});
}

// Search notes
function searchNotes() {
	const searchTerm = document.getElementById('search').value.toLowerCase();

	if (!searchTerm) {
		// If the search term is empty, restore the original notes
		allNotes = [...originalNotes];
		totalNotes = allNotes.length;
		currentPage = 1; // Reset to the first page
		updatePaginationControls();
		displayNotes(currentPage);
		return;
	}

	// Filter notes based on the search term
	const filteredNotes = originalNotes.filter(note =>
		note.title.toLowerCase().includes(searchTerm) ||
		note.body.toLowerCase().includes(searchTerm)
	);

	// Update allNotes with the filtered results
	allNotes = filteredNotes;
	totalNotes = filteredNotes.length;
	currentPage = 1; // Reset to the first page
	updatePaginationControls();
	displayNotes(currentPage);
}

// Display notes for the given page
function displayNotes(page) {
	const notesContainer = document.getElementById('notes');
	notesContainer.innerHTML = ''; // Clear previous notes

	const start = (page - 1) * notesPerPage;
	const end = start + notesPerPage;
	const notesToShow = allNotes.slice(start, end);

	notesToShow.forEach(note => {
		const noteElement = document.createElement('div');
		noteElement.className = 'notes';

		noteElement.innerHTML = `
            <figure>
                <h4 class="maxhw">${note.title}</h4>
                <a class="maxhw">${note.body}</a>
                <figcaption></figcaption>
                <a href="MoreDetalsPage.html?id=${note.id}" target="_blank">
                    <button class="det">More details</button>
                </a>
                <a href="EditItemPage.html?id=${note.id}" target="_blank">
                    <button class="edit">Edit</button>
                </a>
                <button class="del" data-id="${note.id}">Delete</button>
            </figure>
        `;

		notesContainer.appendChild(noteElement);
	});

	// Add delete event listeners
	document.querySelectorAll('.del').forEach(button => {
		button.addEventListener('click', function() {
			const noteId = this.getAttribute('data-id');
			deleteNote(noteId);
		});
	});
}

// Update pagination controls based on total notes and current page
function updatePaginationControls() {
	const totalPages = Math.ceil(totalNotes / notesPerPage);
	const paginationContainer = document.getElementById('page');
	paginationContainer.innerHTML = ''; // Clear previous pagination controls

	// Add "First" and "Previous" buttons
	const firstButton = document.createElement('a');
	firstButton.textContent = '|<';
	firstButton.id = 'firstPage';
	firstButton.addEventListener('click', () => changePage('first'));
	paginationContainer.appendChild(firstButton);

	const prevButton = document.createElement('a');
	prevButton.textContent = '<';
	prevButton.id = 'prevPage';
	prevButton.addEventListener('click', () => changePage('prev'));
	paginationContainer.appendChild(prevButton);

	// Generate page numbers
	const maxPagesToShow = 5; // Maximum number of page numbers to display
	let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
	let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

	if (endPage - startPage < maxPagesToShow - 1) {
		startPage = Math.max(1, endPage - maxPagesToShow + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
		const pageButton = document.createElement('a');
		pageButton.textContent = i;
		pageButton.classList.add('page');
		if (i === currentPage) {
			pageButton.classList.add('active'); // Highlight the current page
		}
		pageButton.addEventListener('click', () => {
			currentPage = i;
			updatePaginationControls();
			displayNotes(currentPage);
		});
		paginationContainer.appendChild(pageButton);
	}

	// Add "Next" and "Last" buttons
	const nextButton = document.createElement('a');
	nextButton.textContent = '>';
	nextButton.id = 'nextPage';
	nextButton.addEventListener('click', () => changePage('next'));
	paginationContainer.appendChild(nextButton);

	const lastButton = document.createElement('a');
	lastButton.textContent = '>|';
	lastButton.id = 'lastPage';
	lastButton.addEventListener('click', () => changePage('last'));
	paginationContainer.appendChild(lastButton);

	// Disable/enable navigation buttons
	document.getElementById('prevPage').disabled = currentPage === 1;
	document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Handle pagination navigation
function changePage(action) {
	const totalPages = Math.ceil(totalNotes / notesPerPage);

	switch (action) {
		case 'first':
			currentPage = 1;
			break;
		case 'prev':
			if (currentPage > 1) currentPage--;
			break;
		case 'next':
			if (currentPage < totalPages) currentPage++;
			break;
		case 'last':
			currentPage = totalPages;
			break;
	}

	updatePaginationControls();
	displayNotes(currentPage);
}

// Sort notes
function sortNotes(order) {
	allNotes.sort((a, z) => {
		const A = a.title.toLowerCase();
		const Z = z.title.toLowerCase();

		if (order === 'asc') {
			return A.localeCompare(Z);
		} else {
			return Z.localeCompare(A);
		}
	});

	currentPage = 1; // Reset to the first page after sorting
	updatePaginationControls();
	displayNotes(currentPage);
}

// Delete note
function deleteNote(noteId) {
	const noteElement = document.querySelector(`.del[data-id="${noteId}"]`).closest('.notes');
	const isConfirmed = confirm(`Are you sure you want to delete the note?`);

	if (!isConfirmed) {
		return; // Exit if user cancels
	}

	fetch(`https://jsonplaceholder.typicode.com/posts/${noteId}`, {
		method: 'DELETE'
	})
		.then(response => {
			if (response.ok) {
				noteElement.remove();
				// Remove the note from the local array
				allNotes = allNotes.filter(note => note.id !== parseInt(noteId));
				originalNotes = originalNotes.filter(note => note.id !== parseInt(noteId)); // Update originalNotes too
				totalNotes = allNotes.length;
				updatePaginationControls();
				displayNotes(currentPage);
			}
		})
		.catch(error => {
			console.error('Error deleting note:', error);
			alert('Failed to delete note. Please try again.');
		});
}

// Add comment
function addComment() {
	const commentText = document.getElementById('comment').value.trim();
	if (!commentText) return;

	const commentSection = document.getElementById('commentSection');
	const newComment = document.createElement('div');
	newComment.innerHTML = `
        <p>Anon:</p>
        <p>${commentText}</p>
        <hr>
    `;
	commentSection.prepend(newComment);

	// Clear the textarea
	document.getElementById('comment').value = '';
}

// Scroll to top
function navigate() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

function reset() {
	// Reset to the original notes
	allNotes = [...originalNotes];
	totalNotes = allNotes.length;
	currentPage = 1;  // Reset to first page

	// Clear the search input
	document.getElementById("search").value = "";

	// Update the display
	updatePaginationControls();
	displayNotes(currentPage);
}