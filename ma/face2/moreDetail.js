document.addEventListener('DOMContentLoaded', function() {
	// Get the note ID from the URL query parameter
	const urlParams = new URLSearchParams(window.location.search);
	const noteId = urlParams.get('id');

	if (!noteId) {
		alert('Note ID not found!');
		return;
	}

	// Fetch the note details based on the ID
	fetch(`https://jsonplaceholder.typicode.com/posts/${noteId}`)
		.then(response => response.json())
		.then(note => {
			// Display the note details
			document.getElementById('noteTitle').textContent = note.title;
			document.getElementById('courseName').textContent = '-'; // Replace with actual course name if available
			document.getElementById('courseCode').textContent = '-'; // Replace with actual course code if available
			document.getElementById('noteDate').textContent = '-'; // Replace with actual date if available
			document.getElementById('noteDescription').textContent = note.body;

			// Add delete functionality
			document.getElementById('deleteBtn').addEventListener('click', function() {
				const isConfirmed = confirm('Are you sure you want to delete this note?');
				if (!isConfirmed) return;

				fetch(`https://jsonplaceholder.typicode.com/posts/${noteId}`, {
					method: 'DELETE'
				})
					.then(response => {
						if (response.ok) {
							alert('Note deleted successfully!');
							window.close(); // Close the current window/tab
						} else {
							alert('Failed to delete the note.');
						}
					})
					.catch(error => {
						console.error('Error deleting note:', error);
						alert('An error occurred while deleting the note.');
					});
			});
		})
		.catch(error => {
			console.error('Error fetching note details:', error);
			alert('Failed to load note details.');
		});
});