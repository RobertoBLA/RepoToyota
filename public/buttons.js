document.addEventListener('DOMContentLoaded', () => {
    new DataTable('#items-table',);
    console.log('DOM fully loaded. Running script...');
    
        // Use event delegation for dynamically added buttons
        document.addEventListener('click', async function (event) {
            const editButton = event.target.closest('.editButton'); // Check for Edit button
            const deleteButton = event.target.closest('.deleteButton'); // Check for Delete button
    
            if (editButton) {
                // Handle Edit Button Click
                const itemId = editButton.dataset.itemId; // Get the item ID
                console.log('Edit button clicked for item ID:', itemId);
    
                try {
                    // Fetch item data from the server
                    const response = await fetch(`item/${itemId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch item data');
                    }
    
                    const item = await response.json();
                    populateEditForm(item);
    
                    // Show the modal
                    const editFormContainer = document.getElementById('editFormContainer');
                    const overlay = document.getElementById('overlay');
    
                    if (editFormContainer && overlay) {
                        editFormContainer.style.display = 'block';
                        overlay.style.display = 'block';
                    }
                } catch (error) {
                    console.error(error.message);
                    alert('An error occurred while fetching the item data.');
                }
            } else if (deleteButton) {
                // Handle Delete Button Click
                const itemId = deleteButton.dataset.itemId; // Get the item ID
                console.log('Delete button clicked for item ID:', itemId);
    
                // Confirm deletion
                const confirmDelete = confirm(`Are you sure you want to delete item ${itemId}?`);
                if (confirmDelete) {
                    try {
                        // Send a DELETE request to the server
                        const response = await fetch(`/api/items/${itemId}`, {
                            method: 'DELETE',
                        });
    
                        if (!response.ok) {
                            throw new Error('Failed to delete item');
                        }
    
                        // Remove the row from the table
                        const row = deleteButton.closest('tr');
                        if (row) {
                            row.remove();
                            console.log(`Item ${itemId} deleted successfully.`);
                        }
                    } catch (error) {
                        console.error(error.message);
                        alert('An error occurred while deleting the item.');
                    }
                }
            }
        });
    });
    
    // Function to Populate the Edit Form
    function populateEditForm(item) {
        const editItemId = document.getElementById('eId');
        const editName = document.getElementById('eName');
        const editDescription = document.getElementById('eDescription');
        const editPrice = document.getElementById('ePrice');
        const editStock = document.getElementById('eStock');
    
        console.log('eId:', editItemId);
        console.log('eName:', editName);
        console.log('eDescription:', editDescription);
        console.log('ePrice:', editPrice);
        console.log('eStock:', editStock);
    
        if (!editItemId || !editName || !editDescription || !editPrice || !editStock) {
            console.error('One or more form fields are missing. Check the IDs in the HTML.');
            return;
        }
    
        editItemId.value = item.id;
        editName.value = item.name;
        editDescription.value = item.description;
        editPrice.value = item.price;
        editStock.value = item.stock;
    
        const previewImage = document.getElementById('editPreviewImage');
        if (previewImage) {
            if (item.image) {
                previewImage.src = item.image;
            } else {
                previewImage.src = 'https://static.thenounproject.com/png/1269202-200.png';
            }
        } else {
            console.error('editPreviewImage element not found.');
        }
    }

function closeModal() {
    document.getElementById('createFormContainer').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    resetForm();
}

// Function to Check if Form Has Data
function isFormDirty() {
    const form = document.querySelector('#createFormContainer form');
    const inputs = form.querySelectorAll('input, textarea, select'); // Get all form fields

    // Log the number of inputs being checked
    console.log(`Checking ${inputs.length} form fields for changes...`);

    // Check if any input has a value
    for (const input of inputs) {
        // Exclude the _token field
        if (input.name === '_token') {
            console.log(`Skipping _token field.`);
            continue;
        }

        if (input.type === 'file') {
            // For file inputs, check if a file is selected
            if (input.files.length > 0) {
                console.log(`File input detected: ${input.files[0].name}`);
                return true;
            }
        } else if (input.value.trim() !== '') {
            // For other inputs, check if the value is not empty
            console.log(`Non-empty input detected: ${input.name} = ${input.value}`);
            return true;
        }
    }

    // Check if the image preview is not the default placeholder
    const previewImage = document.getElementById('previewImage');
    const defaultPlaceholder = 'https://static.thenounproject.com/png/1269202-200.png'; // Default placeholder URL

    console.log(`Preview Image src: ${previewImage.src}`);
    console.log(`Default Placeholder URL: ${defaultPlaceholder}`);

    // Normalize both URLs for comparison
    const previewUrl = new URL(previewImage.src);
    const defaultUrl = new URL(defaultPlaceholder);

    console.log(`Normalized Preview URL: ${previewUrl.hostname}${previewUrl.pathname}`);
    console.log(`Normalized Default URL: ${defaultUrl.hostname}${defaultUrl.pathname}`);

    if (
        previewUrl.hostname !== defaultUrl.hostname ||
        previewUrl.pathname !== defaultUrl.pathname
    ) {
        console.log('Image preview has changed.');
        return true; // Image preview has changed
    }

    console.log('No changes detected in the form or image preview.');
    return false; // No changes detected
}


// Handle Form Reset
function resetForm() {
    const form = document.getElementById('itemForm');
    form.reset();
    const previewImage = document.getElementById('previewImage');
    previewImage.src = 'https://static.thenounproject.com/png/1269202-200.png';

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const createButton = document.getElementById('createButton');
const overlay = document.getElementById('overlay');
const createFormContainer = document.getElementById('createFormContainer');
const closeFormButton = document.getElementById('closeFormButton');


// Close the form container when the "Close" button/overlay is clicked
if (closeFormButton && overlay) {
    // Hide the form container when the "Close" button is clicked
    document.getElementById('closeFormButton').addEventListener('click', () => {
        // Check if the form or image preview has data
        if (isFormDirty()) {
            // Show confirmation dialog
            const confirmClose = confirm('You have unsaved changes. Are you sure you want to close?');
            if (!confirmClose) {
                return; // Do not close the modal if the user cancels
            }
        }
        // Close the modal adn reset the form
        closeModal();
    });

    // Hide the form container when clicking outside the form (on the overlay)
    document.getElementById('overlay').addEventListener('click', () => {
        // Check if the form or image preview has data
        if (isFormDirty()) {
            // Show confirmation dialog
            const confirmClose = confirm('You have unsaved changes. Are you sure you want to close?');
            if (!confirmClose) {
                return; // Do not close the modal if the user cancels
            }
        }

        // Close the modal and resete the form
        closeModal();
    });
}

// Show the form container when the "Create Item" button is clicked
if (createButton && createFormContainer) {
    createButton.addEventListener('click', () => {
        console.log('Create button clicked');
        createFormContainer.style.display = 'block';
        overlay.style.display = 'block'; // Show the overlay
    });
}

    document.getElementById('image')?.addEventListener('change', function (event) {
        const file = event.target.files[0]; // Get the selected file
        const previewImage = document.getElementById('previewImage'); // Get the preview image element

        if (file) {
            const reader = new FileReader(); // Create a FileReader instance
            reader.onload = function (e) {
                previewImage.src = e.target.result; // Set the image source to the file's data URL
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        } else {
            previewImage.src = 'https://static.thenounproject.com/png/1269202-200.png'; // Reset to placeholder if no file is selected
        }
    });
