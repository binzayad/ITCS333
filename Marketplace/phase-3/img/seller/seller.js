doc = document;
API_URL = "https://c140a00d-c033-436d-bf1b-c267caa6b4ef-00-2y8jgtbafogmg.pike.replit.dev/apis/api.php";
ID = parseInt(new URLSearchParams(window.location.search).get("id"));
console.log(ID);
fetch(`${API_URL}?action=itemData`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: ID })
})
.then((response) => {
    if (!response.ok) {
        console.error("HTTP error:", response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json(); // Return the JSON-parsed response
})
.then((data) => {
    if (data.status === 'success') {
        const item = data[0]; // Assuming `files` contains an array
        document.getElementById("name").textContent = item.Name;
        document.getElementById("description").textContent = item.Description;
        document.getElementById("price").textContent = item.Price;
    } else {
        console.error('Error:', data.message);
    }
})
.catch((error) => {
    console.error('Error fetching item:', error);
});