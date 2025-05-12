document.addEventListener("DOMContentLoaded", function() {
	const urlParams = new URLSearchParams(window.location.search);
	const noteId = urlParams.get('id');

	if (!noteId || !/^\d+$/.test(noteId)) {
		document.getElementById('nt').textContent = 'Invalid or missing note ID.';
		return;
	}

	fetch(`api.php?action=get_note_by_id&id=${noteId}`)
		.then(res => {
			if (!res.ok) throw new Error("Failed to fetch note details");
			return res.json();
		})
		.then(note => {
			document.getElementById('nt').textContent = note.title || 'Untitled Note';
			document.getElementById('date').textContent = note.note_date || 'N/A';

			// Display importance with conditional styling
			const importantLabel = document.getElementById('important');
			if (note.is_important == 1) {
				importantLabel.innerHTML = '<span class="important-tag">Yes (Important)</span>';
			} else {
				importantLabel.textContent = 'No';
			}

			document.getElementById('desc').textContent = note.content || 'No description available.';
		})
		.catch(err => {
			console.error(err);
			document.getElementById('nt').textContent = 'Error loading note details.';
		});
});