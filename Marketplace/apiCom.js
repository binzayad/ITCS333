API_URL="https://c140a00d-c033-436d-bf1b-c267caa6b4ef-00-2y8jgtbafogmg.pike.replit.dev/apis/api.php";
function showMessage(element, message, type) {
    element.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  }
document.addEventListener("DOMContentLoaded", function () {
  // Get the sell form and submit button
  const sellForm = document.getElementById("sellForm");
  const sellButton = sellForm.querySelector("button[type='submit']");
const uploadForm = document.getElementById("uploadForm");

  // Add event listener to the submit button
  sellButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const itemName = document.getElementById("itemName").value.trim();
    const itemLocation = document.getElementById("itemLocation").value.trim();
    const itemCategory = document.getElementById("itemCategory").value;
    const itemPrice = document.getElementById("itemPrice").value.trim();
    const itemDescription = document.getElementById("itemDescription").value.trim();
    const itemImage = document.getElementById("itemImage").files[0];

    // Validate the form fields
    if (!itemName || !itemCategory || !itemPrice || !itemDescription || !itemLocation) {
        showMessage(addItemMessage, 'Please fill in all fields', 'danger');
        return;
    }

    // Log the form data (for debugging)
    console.log({
      itemName,
      itemLocation,
      itemCategory,
      itemPrice,
      itemDescription,
      itemLocation,
    });

    // Create FormData object
    const formData = new FormData();
    formData.append('file', itemImage);
    
    // Upload file
    
    fetch(`${API_URL}?action=upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            Name: itemName,
            Price: itemPrice,
            Description: itemDescription,
            Location: itemLocation,
            Category: itemCategory
         })
    })
    
    .then(response => response.json())
    
    .then(data => {
        if (data.status == 'success') {
            showMessage(uploadMessage, data.message, 'success');
            sellForm.reset(); // Reset the form after successful upload
        } else {
            showMessage(uploadMessage, data.message, 'danger');
        }
        alert("Form submitted successfully!");
    })
    .catch(error => {
        console.log(JSON.stringify({ 
            Name: itemName,
            Price: itemPrice,
            Description: itemDescription,
            Location: itemLocation,
            Category: itemCategory
         }));
        
        showMessage(uploadMessage, 'Error uploading file: ' + error, 'danger');
    });

    // Simulate sending the data to an API
    
  });
});