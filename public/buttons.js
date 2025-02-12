document.addEventListener('DOMContentLoaded', () => {
    // Initialize DataTable
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const table = new DataTable('#items-table');
    console.log('DOM fully loaded. Running script...');

    // Declare shared DOM elements
    const createForm = document.getElementById('itemForm');
    const submitButton = document.querySelector('#createFormContainer button[type="submit"]');
    const saveButton = document.querySelector('#editFormContainer button[type="submit"]');
    const createButton = document.getElementById('createButton');
    const overlay = document.getElementById('overlay');
    const createFormContainer = document.getElementById('createFormContainer');
    const closeFormButton = document.getElementById('closeFormButton');
    const previewImage = document.getElementById('previewImage');
    const imageInput = document.getElementById('image');

    
    // Handle Create Button Click
    if (createButton && createFormContainer) {
        createButton.addEventListener('click', () => {
            console.log('Create button clicked');
            createFormContainer.style.display = 'block';
            overlay.style.display = 'block'; // Show the overlay
            resetForm();
        });
    }

    // Handle Close Button and Overlay Clicks
    if (closeFormButton && overlay) {
        [closeFormButton, overlay].forEach(element => {
            element.addEventListener('click', () => {
                if (isFormDirty()) {
                    const confirmClose = confirm('You have unsaved changes. Are you sure you want to close?');
                    if (!confirmClose) return; // Do not close the modal if the user cancels
                }
                closeModal();
            });
        });
    }

    // Handle Image Preview for Create Form
    if (imageInput && previewImage) {
        imageInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImage.src = e.target.result; // Set the image source
                    console.log('Image selected:', file.name);
                };
                reader.readAsDataURL(file); // Read the file as a data URL
            } else {
                previewImage.src = 'https://static.thenounproject.com/png/1269202-200.png'; // Reset to placeholder
            }
        });
    }

    // Handle Form Submission
    if (createForm && submitButton) {
        createForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent the default form submission

            // Disable the submit button to prevent multiple submissions
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...'; // Optional: Change button text

            try {
                // Gather form data
                const formData = new FormData(createForm);

                // Send the form data to the server
                const response = await fetch(createForm.action, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to create item');
                }

                // Handle success response
                const result = await response.json();
                console.log('Item created successfully:', result);

                // Add the new item to the table
                const newItem = result.item;

                const newRow = table.row.add([
                    newItem.id,
                    newItem.name,
                    newItem.description,
                    newItem.price,
                    newItem.stock,
                    `<td>
                    <button class="editButton btn btn-primary" data-item-id="${newItem.id}">Edit</button>
                    <button class="deleteButton btn btn-danger" data-item-id="${newItem.id}">Delete</button>
                </td>`,
                ]).draw(false).node();

                table.row(newRow).invalidate().draw(false);


                // Make sure the newRow is inserted into the DOM before querying it
                setTimeout(() => {
                    const editButton = newRow.querySelector('.editButton');
                    const deleteButton = newRow.querySelector('.deleteButton');

                    if (editButton) {
                        editButton.addEventListener('click', () => handleEdit(editButton));
                    } else {
                        console.error(`Edit button not found for item ID: ${newItem.id}`);
                    }

                    if (deleteButton) {
                        deleteButton.addEventListener('click', () => handleDelete(deleteButton));
                    } else {
                        console.error(`Delete button not found for item ID: ${newItem.id}`);
                    }
                }, 100); // Delay execution slightly to ensure buttons are in the DOM

                // Close the modal and reset the form
                closeModal();

                // Optionally, show a success message
                alert(result.message || 'Item created successfully!');
            } catch (error) {
                console.error(error.message);
                alert('An error occurred while creating the item.');
            } finally {
                // Re-enable the submit button
                submitButton.disabled = false;
                submitButton.textContent = 'Create Item'; // Reset button text
            }
        });
    }



    // Function to Handle Edit Button Click
    document.addEventListener("click", function (event) {
        if (event.target.closest(".editButton")) {
            handleEdit(event); // Pass the full event
        }
        if (event.target.closest(".deleteButton")) {
            handleDelete(event);
        }
    });



    // Function to handle Edit Clicks
    function handleEdit(event) {
        const editButton = event.target.closest('.editButton'); // Ensure correct target
        if (!editButton) {
            console.error("Edit button not found in handleEdit");
            return;
        }

        const itemId = editButton.getAttribute('data-item-id');
        if (!itemId) {
            console.error("Item ID not found for edit button");
            return;
        }

        console.log("Editing item with ID:", itemId);
        fetch(`item/${itemId}`)
            .then(response => response.json())
            .then(item => {
                // Populate the edit form with item data
                populateEditForm(item);

                // Show the edit form container and overlay after a short delay
                setTimeout(() => {
                    const editFormContainer = document.getElementById('editFormContainer');
                    const overlay = document.getElementById('overlay');
                    if (editFormContainer && overlay) {
                        editFormContainer.style.display = 'block';
                        overlay.style.display = 'block';
                    }
                }, 200); // Delay of 200ms to ensure form is populated
            })
            .catch(error => {
                console.error('Error fetching item data for edit:', error);
            });
    }
    // Function to handle Delete Clicks
    async function handleDelete(event) {
        const deleteButton = event.target.closest('.deleteButton');
        const itemId = deleteButton.dataset.itemId;
        console.log('Delete button clicked for item ID:', itemId);

        const confirmDelete = confirm(`Are you sure you want to delete item ${itemId}?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete item', itemId);
            }

            const table = $('#items-table').DataTable();
            table.row(deleteButton.closest('tr')).remove().draw();

            console.log(`Item ${itemId} deleted successfully.`);
        } catch (error) {
            console.error(error.message);
            alert('An error occurred while deleting the item.');
        }
    }

    // Function to Populate the Edit Form
    function populateEditForm(item) {
        const editItemId = document.getElementById('eId');
        const editName = document.getElementById('eName');
        const editDescription = document.getElementById('eDescription');
        const editPrice = document.getElementById('ePrice');
        const editStock = document.getElementById('eStock');

        if (!editItemId || !editName || !editDescription || !editPrice || !editStock) {
            console.error('One or more form fields are missing. Check the IDs in the HTML.');
            return;
        }

        // Populate the form fields
        editItemId.value = item.id;
        editName.value = item.name;
        editDescription.value = item.description;
        editPrice.value = item.price;
        editStock.value = item.stock;

        // Update the image preview
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

    // Handle Edit Form Submission
const editForm = document.getElementById('editForm'); // Or the specific edit form
if (editForm) {
    editForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const itemIdE = document.getElementById('eId').value;  // Get the item ID (hidden input)
        console.log('Updating item with ID:', itemIdE);

        // Disable the submit button to prevent multiple submissions
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        try {
            // Gather the form data
            const formData = new FormData(editForm);
            formData.append('_method', 'PUT'); // Simulate PUT request

            const file = document.getElementById('image').files[0];
            if (file && file.size > 0) {
                formData.append('image', file);
            } else {
                formData.delete('image'); // Remove the image field if no file is selected
            }

            formData.forEach((value, key) => {
                console.log(key, value); // Log all form fields and their values
            });

            // Send the form data to the server for updating the item
            const response = await fetch(`/item/${itemIdE}`, {
                method: 'POST', // Use POST with _method=PUT
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update item');
            }

            // Handle success response
            const result = await response.json();
            console.log('Item updated successfully:', result);
            // Close the modal after successful submission
            closeModal();
            alert(result.message || 'Item updated successfully!');
        } catch (error) {
            console.error(error.message);
            alert('An error occurred while updating the item.');
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = 'Save Changes'; // Reset button text
        }
    });
    
}

    // Function to Close Modal
    function closeModal() {
        const containers = [
            document.getElementById('createFormContainer'),
            document.getElementById('editFormContainer')
        ];
        const overlay = document.getElementById('overlay');

        // Hide the containers and overlay
        containers.forEach(container => {
            if (container) {
                container.style.display = 'none';
            }
        });

        if (overlay) {
            overlay.style.display = 'none';
        }

        // Reset the form fields
        resetForm();
    }

    // Function to Check if Form Has Data
    function isFormDirty() {
        const form = document.querySelector('#createFormContainer form, #editFormContainer form');
        if (!form) return false;

        const inputs = form.querySelectorAll('input, textarea, select'); // Get all form fields
        console.log(`Checking ${inputs.length} form fields for changes...`);

        for (const input of inputs) {
            if (input.name === '_token') continue; // Skip CSRF token field

            if (input.type === 'file' && input.files.length > 0) {
                console.log(`File input detected: ${input.files[0].name}`);
                return true;
            } else if (input.value.trim() !== '') {
                console.log(`Non-empty input detected: ${input.name} = ${input.value}`);
                return true;
            }
        }

        // Check if the image preview has changed
        const previewImage = document.getElementById('previewImage') || document.getElementById('editPreviewImage');
        const defaultPlaceholder = 'https://static.thenounproject.com/png/1269202-200.png';

        if (previewImage) {
            const previewUrl = new URL(previewImage.src);
            const defaultUrl = new URL(defaultPlaceholder);

            if (previewUrl.hostname !== defaultUrl.hostname || previewUrl.pathname !== defaultUrl.pathname) {
                console.log('Image preview has changed.');
                return true;
            }
        }

        console.log('No changes detected in the form or image preview.');
        return false;
    }


    // Function to Reset Form
    function resetForm() {
        const forms = document.querySelectorAll('#createFormContainer form, #editFormContainer form');
        forms.forEach(form => form.reset());

        const previewImages = document.querySelectorAll('#previewImage, #editPreviewImage');
        previewImages.forEach(image => {
            if (image) {
                image.src = 'https://static.thenounproject.com/png/1269202-200.png';
            }
        });
    }
});