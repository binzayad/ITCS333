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
            alert('Please fill in all required fields!');
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