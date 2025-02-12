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
    const editPreviewImage = document.getElementById('ePreviewImage');
    const editImageInput = document.getElementById('eImage');


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
                if (isFormChanged()) {
                    const confirmClose = confirm('You have unsaved changes. Are you sure you want to close?');
                    if (!confirmClose) return; // Do not close the modal if the user cancels
                }
                closeModal();
            });
        });
    }
    console.log('editImageInput:', editImageInput);
    console.log('editPreviewImage:', editPreviewImage);
    
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


if (editImageInput && editPreviewImage) {
    editImageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                editPreviewImage.src = e.target.result;
                console.log('Edit image selected:', file.name);
            };
            reader.readAsDataURL(file);
        } else {
            editPreviewImage.src = 'https://static.thenounproject.com/png/1269202-200.png';
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

        editItemId.dataset.originalValue = item.id;
        editName.dataset.originalValue = item.name;
        editDescription.dataset.originalValue = item.description;
        editPrice.dataset.originalValue = item.price;
        editStock.dataset.originalValue = item.stock;

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

                // Update the item in the table
                const updatedItem = result.item;
                const table = $('#items-table').DataTable();

                // Find the row that matches the item's ID
                const rowIndexes = table.rows().eq(0).filter(function (rowIdx) {
                    return table.cell(rowIdx, 0).data() == updatedItem.id; // Use `==` to avoid type mismatch issues
                }).toArray(); // Convert to array


                // If a matching row is found, update it
                if (rowIndexes.length > 0) {
                    const rowIndex = rowIndexes[0]; // Get the first matched row index
                    const row = table.row(rowIndex);;
                    row.data([
                        updatedItem.id,
                        updatedItem.name,
                        updatedItem.description,
                        updatedItem.price,
                        updatedItem.stock,
                        `<td>
                        <button class="editButton btn btn-primary" data-item-id="${updatedItem.id}">Edit</button>
                        <button class="deleteButton btn btn-danger" data-item-id="${updatedItem.id}">Delete</button>
                    </td>`
                    ]).draw(false);
                }



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
        const createForm = document.querySelector('#createFormContainer form');
        if (!createForm || createForm.closest('.hidden')) {
            console.log('Create form is not visible, skipping dirtiness check.');
            return false;
        }
    
        const inputs = createForm.querySelectorAll('input, textarea, select');
        console.log(`Checking ${inputs.length} create form fields for input...`);
    
        for (const input of inputs) {
            if (input.name === '_token' || input.name === '_method') continue;
    
            // For create, just check if the field has a value
            if (input.value.trim() !== '') {
                console.log(`User typed in ${input.name}: ${input.value}`);
                return true;
            }
        }
        return false;
    }
    
    // Function to Check if Edit Form Has Changes (Edit Form)
    function isFormChanged() {
        const editForm = document.querySelector('#editFormContainer form');
        if (!editForm || editForm.closest('.hidden')) {
            console.log('Edit form is not visible, skipping change detection.');
            return false;
        }
    
        const inputs = editForm.querySelectorAll('input, textarea, select');
        console.log(`Checking ${inputs.length} edit form fields for changes...`);
    
        for (const input of inputs) {
            if (input.name === '_token' || input.name === '_method') continue;
    
            // Compare only if the original value exists
            if (input.dataset.originalValue !== undefined) {
                if (input.value !== input.dataset.originalValue) {
                    console.log(`Change detected in ${input.name}: ${input.value} (original: ${input.dataset.originalValue})`);
                    return true;
                }
            }
        }
        return false;
    }
    

    // Function to Reset Form
    function resetForm() {
        const forms = document.querySelectorAll('#createFormContainer form, #editFormContainer form');
        forms.forEach(form => form.reset());

        // Remove the original value attributes to prevent comparison issues
        forms.forEach(form => {
            form.querySelectorAll('input, textarea, select').forEach(input => {
                input.removeAttribute('data-original-value'); // Remove original value attribute on reset
            });
        });

        const previewImages = document.querySelectorAll('#previewImage, #editPreviewImage');
        previewImages.forEach(image => {
            if (image) {
                image.src = 'https://static.thenounproject.com/png/1269202-200.png'; // Reset image preview
            }
        });
    }

});