document.getElementById("noteForm").addEventListener("submit", function(e) {
	e.preventDefault();

	const title = document.getElementById("ct").value.trim();
	const date = document.getElementById("date").value;
	const description = document.getElementById("description").value.trim();
	const important = document.getElementById("combo").checked;

	if (!title || !description) {
		alert("Title and Description are required.");
		return;
	}

	fetch("api.php?action=add_note", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			title,
			content: description,
			date: date || null,
			important // true or false
		})
	})
		.then(response => {
			if (!response.ok) throw new Error("Network response was not ok");
			return response.json();
		})
		.then(data => {
			alert("Note added successfully!");
			document.getElementById("noteForm").reset();
			setTimeout(() => {
				window.location.href = "index.php";
			}, 1000);
		})
		.catch(error => {
			console.error("Error:", error);
			alert("Failed to save note.");
		});
});