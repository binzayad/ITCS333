
document.addEventListener('DOMContentLoaded', function() {
	// fetch data from JSONPlaceholder
	fetchNotes();
	// add event listeners
	document.getElementById('searchbtn').addEventListener('click', searchNotes);
	document.querySelectorAll('.sort')[0].addEventListener('click', () => sortNotes('asc'));
	document.querySelectorAll('.sort')[1].addEventListener('click', () => sortNotes('desc'));
	document.getElementById('publish').addEventListener('click', addComment);
	document.getElementById('navigate').addEventListener('click', navigate);
});

const jason = 'https://jsonplaceholder.typicode.com/posts';
function fetchNotes() {
	fetch(jason)
		.then(response => response.json())
		.then(data => {
			displayNotes(data);
		})
		.catch(error => {
			console.error('Error fetching notes:', error);
		});
}

function displayNotes(notes) {
	const notesContainer = document.getElementById('notes');
	notesContainer.innerHTML = '';

	notes.forEach(note => {
		const noteElement = document.createElement('div');
		noteElement.className = 'notes';

		// Format the date if it exists in the note
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

function searchNotes() {
	const searchTerm = document.getElementById('search').value.toLowerCase();
	const notes = document.querySelectorAll('.notes');

	notes.forEach(note => {
		const search = note.textContent.toLowerCase();
		if (search.includes(searchTerm)) {
			note.style.display = 'block';
		} else {
			note.style.display = 'none';
		}
	});
}

function sortNotes(order) {
	const notesContainer = document.getElementById('notes');
	const notes = Array.from(document.querySelectorAll('.notes'));

	notes.sort((a, z) => {
		const A = a.querySelector('h4').textContent.toLowerCase();
		const Z = z.querySelector('h4').textContent.toLowerCase();

		if (order === 'asc') {
			return A.localeCompare(Z);
		} else {
			return Z.localeCompare(A);
		}
	});

	// Clear and re-append sorted notes
	notesContainer.innerHTML = '';
	notes.forEach(note => notesContainer.appendChild(note));
}

// delete function. this function will not acutaly delete the notes
function deleteNote(noteId) {
	// Get the note title for the confirmation message
	const noteElement = document.querySelector(`.del[data-id="${noteId}"]`).closest('.notes');
	const isConfirmed = confirm(`Are you sure you want to delete the note'?`);

	if (!isConfirmed) {
		return; // exit if user cancels
	}

	fetch(`https://jsonplaceholder.typicode.com/posts/${noteId}`, {
		method: 'DELETE'
	})
		.then(response => {
			if (response.ok) {
				noteElement.remove();
			}
		})
		.catch(error => {
			console.error('Error deleting note:', error);
			alert('Failed to delete note. Please try again.');
		});
}
function addComment() {
	const commentText = document.getElementById('comment').value.trim();
	if (!commentText) return;

	// In a real app, you would send this to your API
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

function navigate() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

// AddNewItem.js
document.addEventListener('DOMContentLoaded', function() {
	// Get form elements
	const titleInput = document.getElementById('ct');
	const courseNameInput = document.getElementById('cn');
	const courseCodeInput = document.getElementById('cc');
	const dateInput = document.getElementById('date');
	const importantCheckbox = document.getElementById('combo');
	const descriptionTextarea = document.querySelector('textarea');
	const addButton = document.querySelector('button');

	// Handle form submission
	addButton.addEventListener('click', function(e) {
		e.preventDefault();

		// Validate required fields
		if (!titleInput.value || !courseNameInput.value || !courseCodeInput.value || !descriptionTextarea.value) {
			alert('Please fill in all required fields (marked with *)');
			return;
		}

		// Create new note object
		const newNote = {
			id: Date.now(), // Generate unique ID
			title: `${courseCodeInput.value}: ${titleInput.value}`,
			body: descriptionTextarea.value + (dateInput.value ? ` (Date: ${dateInput.value})` : ''),
			courseName: courseNameInput.value,
			courseCode: courseCodeInput.value,
			date: dateInput.value,
			isImportant: importantCheckbox.checked,
			timestamp: new Date().toISOString()
		};

		// Send the new note back to the main page
		if (window.opener) {
			window.opener.postMessage({
				type: 'noteAdded',
				note: newNote
			}, '*');

			// Close the window after successful addition
			window.close();
		} else {
			// Fallback for testing
			alert('Note created successfully!\n' + JSON.stringify(newNote, null, 2));
		}
	});

	// Set default date to today
	dateInput.valueAsDate = new Date();
});