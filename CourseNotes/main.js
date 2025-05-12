let currentPage = 1;
let totalPages = 1;
let currentSearchTerm = '';
let currentSort = '';

async function loadNotes(searchTerm = '', page = 1, sort = '') {
	currentSearchTerm = searchTerm;
	currentPage = page;
	currentSort = sort;
	try {
		let url = `api.php?action=get_notes&page=${page}`;
		if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
		if (sort) url += `&sort=${sort}`;
		const res = await fetch(url);
		if (!res.ok) throw new Error("Failed to load notes");
		const data = await res.json();
		const notes = data.notes;
		totalPages = data.totalPages;
		const container = document.getElementById('notes');
		container.innerHTML = '';
		if (notes.length === 0) {
			container.innerHTML = "<p>No notes found.</p>";
			updatePaginationControls();
			return;
		}
		notes.forEach(note => {
			const div = document.createElement('div');
			div.className = 'notes';
			div.innerHTML = `
                <div class="note-header">
                    <h3>${note.title}</h3>
                    ${note.is_important == 1 ? '<span class="important-corner">Important</span>' : ''}
                </div>
                <p>${note.content.substring(0, 150)}...</p>
                <a href="moreDetailsPage.html?id=${note.id}" class="det">More Details</a>
                <button class="del" onclick="deleteNote(${note.id})">Delete</button>
            `;
			container.appendChild(div);
		});
		updatePaginationControls();
	} catch (err) {
		console.error(err);
		document.getElementById('notes').innerHTML = `<p>Error loading notes: ${err.message}</p>`;
	}
}

function updatePaginationControls() {
	document.getElementById('currentPage').textContent = currentPage;
	document.getElementById('prevPage').disabled = currentPage <= 1;
	document.getElementById('nextPage').disabled = currentPage >= totalPages;
	document.getElementById('prevPage').classList.toggle('disabled', currentPage <= 1);
	document.getElementById('nextPage').classList.toggle('disabled', currentPage >= totalPages);
}

document.getElementById('prevPage').addEventListener('click', () => {
	if (currentPage > 1) loadNotes(currentSearchTerm, currentPage - 1, currentSort);
});

document.getElementById('nextPage').addEventListener('click', () => {
	if (currentPage < totalPages) loadNotes(currentSearchTerm, currentPage + 1, currentSort);
});

document.getElementById('firstPage').addEventListener('click', () => {
	if (currentPage > 1) loadNotes(currentSearchTerm, 1, currentSort);
});

document.getElementById('lastPage').addEventListener('click', () => {
	if (currentPage < totalPages) loadNotes(currentSearchTerm, totalPages, currentSort);
});

function deleteNote(id) {
	if (!confirm("Are you sure you want to delete this note?")) return;
	fetch(`api.php?action=delete_note&id=${id}`)
		.then(res => {
			if (!res.ok) throw new Error("Failed to delete note");
			return res.json();
		})
		.then(() => {
			alert("Note deleted successfully!");
			loadNotes();
		})
		.catch(err => {
			console.error(err);
			alert("Error deleting note.");
		});
}

document.getElementById("publish").addEventListener("click", () => {
	const text = document.getElementById("comment").value.trim();
	if (!text) {
		alert("Please write a comment.");
		return;
	}
	fetch("api.php?action=add_comment", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text })
	})
		.then(() => {
			document.getElementById("comment").value = "";
			alert("Comment published successfully!");
			loadAllComments();
		})
		.catch(err => {
			console.error(err);
			alert("Failed to publish comment.");
		});
});

async function loadAllComments() {
	try {
		const res = await fetch(`api.php?action=get_all_comments`);
		const comments = await res.json();
		const section = document.getElementById('commentSection');
		section.innerHTML = '';
		if (comments.length === 0) {
			section.innerHTML = "<p>No comments yet.</p>";
			return;
		}
		comments.forEach(c => {
			const div = document.createElement('div');
			div.className = 'comment-box';
			div.innerHTML = `
                <div class="comment-text">
                    <p><strong>Anon:</strong></p>
                    <p>${c.text}</p>
                </div>
                <button class="del" onclick="deleteComment(${c.id})">Delete</button>
            `;
			section.appendChild(div);
		});
	} catch (err) {
		console.error(err);
		document.getElementById('commentSection').innerHTML = "<p>Error loading comments.</p>";
	}
}

function deleteComment(id) {
	if (!confirm("Are you sure you want to delete this comment?")) return;
	fetch(`api.php?action=delete_comment&id=${id}`)
		.then(res => {
			if (!res.ok) throw new Error("Failed to delete comment");
			return res.json();
		})
		.then(() => {
			alert("Comment deleted successfully!");
			loadAllComments();
		})
		.catch(err => {
			console.error(err);
			alert("Error deleting comment.");
		});
}

document.getElementById("searchbtn").addEventListener("click", () => {
	const term = document.getElementById("search").value;
	loadNotes(term);
});

document.querySelector(".reset").addEventListener("click", () => {
	document.getElementById("search").value = "";
	loadNotes();
});

document.querySelectorAll('.sort').forEach(button => {
	button.addEventListener('click', () => {
		const sortType = button.dataset.sort;
		loadNotes(currentSearchTerm, 1, sortType);
	});
});

window.addEventListener("DOMContentLoaded", () => {
	loadNotes();
	loadAllComments();

	// Scroll to top functionality
	const navigateBtn = document.getElementById("navigate");

	window.addEventListener("scroll", () => {
		if (window.scrollY > 300) {
			navigateBtn.classList.remove("hidden");
		} else {
			navigateBtn.classList.add("hidden");
		}
	});

	navigateBtn.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});
});