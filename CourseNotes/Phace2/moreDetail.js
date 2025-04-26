document.addEventListener('DOMContentLoaded', function() {
	// Get the note ID from the URL query parameter
	const urlParams = new URLSearchParams(window.location.search);
	const noteId = urlParams.get('id');

	if (noteId) {
		fetchNoteDetails(noteId);
	} else {
		// Handle case where no ID is provided
		document.getElementById('nt').textContent = 'No note selected';
	}
});

function fetchNoteDetails(noteId) {
	fetch(`https://jsonplaceholder.typicode.com/posts/${noteId}`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Note not found');
			}
			return response.json();
		})
		.then(note => {
			// Display the note details
			document.getElementById('nt').textContent = note.title;
			document.getElementById('desc').textContent = note.body;

			// Add some mock data for date and importance since they're not in the API
			const currentDate = new Date();
			document.getElementById('date').textContent = currentDate.toLocaleDateString();
		})
		.catch(error => {
			console.error('Error fetching note details:', error);
			document.getElementById('nt').textContent = 'Error loading note details';
			document.getElementById('desc').textContent = error.message;
		});
}