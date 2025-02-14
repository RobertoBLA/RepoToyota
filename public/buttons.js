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
    const closeFormButtonV = document.getElementById('closeFormButtonV');
    const closeFormButtonE = document.getElementById('closeFormButtonE');
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
    if (closeFormButton && closeFormButtonV && closeFormButtonE && overlay) {
        [closeFormButton, closeFormButtonV, closeFormButtonE, overlay].forEach(element => {
            element.addEventListener('click', () => {
                console.log('Close button or overlay clicked');
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
                    <button class="viewButton btn btn-info" data-item-id="${newItem.id}"> View</button>
                </td>`,
                    `<td>
                <div class="form-check form-switch">
                    <input 
                        class="form-check-input toggle-status" 
                        type="checkbox" 
                        data-item-id="${newItem.id}" 
                        checked> <!-- Always checked -->
                    <label class="form-check-label"></label>
                </div>
            </td>`,
                ]).draw(false).node();



                // Make sure the newRow is inserted into the DOM before querying it
                setTimeout(() => {
                    const editButton = newRow.querySelector('.editButton');
                    const deleteButton = newRow.querySelector('.deleteButton');

                    if (editButton) {
                        editButton.addEventListener('click', () => handleEdit(editButton));
                    } else {
                        console.error(`Edit button not found for item ID: ${newItem.id}`);
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



    // Function to Handle Button Click
    document.addEventListener("click", function (event) {
        if (event.target.closest(".editButton")) {
            handleEdit(event); // Pass the full event
        }
        if (event.target.closest(".viewButton")) {
            handleView(event);
        }
    });

    // Function to handle Status



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

    // Function to handle View Clicks

    async function handleView(event) {
        const viewButton = event.target.closest('.viewButton');
        if (!viewButton) {
            console.error('View button not found');
            return;
        }
        const itemId = viewButton.getAttribute('data-item-id');
        if (!itemId) {
            console.error('Item ID not found for view button');
            return;
        }

        console.log('View button clicked for item ID:', itemId);
        fetch(`item/${itemId}`)
            .then(response => response.json())
            .then(item => {
                populateViewForm(item);
                console.log('Item data:', item);

                setTimeout(() => {
                    const viewFormContainer = document.getElementById('viewFormContainer');
                    const overlay = document.getElementById('overlay');
                    if (viewFormContainer && overlay) {
                        viewFormContainer.style.display = 'block';
                        overlay.style.display = 'block';
                    }
                }, 200);
            })
            .catch(error => {
                console.error('Error fetching item data for edit:', error);
            });
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
        const previewImage = document.getElementById('ePreviewImage');
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

    function populateViewForm(item) {
        const viewItemId = document.getElementById('vId');
        const viewName = document.getElementById('vName');
        const viewDescription = document.getElementById('vDescription');
        const viewPrice = document.getElementById('vPrice');
        const viewStock = document.getElementById('vStock');
        const viewCreatedAt = document.getElementById('vCreatedAt');
        const viewUpdatedAt = document.getElementById('vUpdatedAt');

        if (!viewItemId || !viewName || !viewDescription || !viewPrice || !viewStock || !viewCreatedAt || !viewUpdatedAt) {
            console.error('One or more form fields are missing. Check the IDs in the HTML.');
            return;
        }

        // Populate the form fields
        viewItemId.value = item.id;
        viewName.value = item.name;
        viewDescription.value = item.description;
        viewPrice.value = item.price;
        viewStock.value = item.stock;

        viewCreatedAt.textContent = 'Created at: ' + item.created_at;
        viewUpdatedAt.textContent = 'Updated at: ' + item.updated_at;

        // Update the image preview
        const previewImage = document.getElementById('vPreviewImage');
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

                const file = document.getElementById('eImage').files[0];
                if (file && file.size > 0) {
                    formData.append('eImage', file);
                } else {
                    formData.delete('eImage'); // Remove the image field if no file is selected
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
                        <button class="viewButton btn btn-info" data-item-id="${updatedItem.id}"> View</button>
                    </td>`,
                        `<td>
        <div class="form-check form-switch">
            <input 
                class="form-check-input toggle-status" 
                type="checkbox" 
                data-item-id="${updatedItem.id}" 
                ${updatedItem.status == 1 ? 'checked' : ''}>
            <label class="form-check-label"></label>
        </div>
    </td>`,
                        updatedItem.status,
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
            document.getElementById('editFormContainer'),
            document.getElementById('viewFormContainer')
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

            if (input.type === 'file') {
                // Special handling for file inputs
                if (input.files.length > 0) {
                    console.log(`Change detected in ${input.name}: New file selected.`);
                    return true;
                }
            } else {
                // 🔥 Check other fields normally
                if (input.dataset.originalValue !== undefined) {
                    if (input.value !== input.dataset.originalValue) {
                        console.log(`Change detected in ${input.name}: ${input.value} (original: ${input.dataset.originalValue})`);
                        return true;
                    }
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

        // Properly select the images inside preview containers
        const previewImages = document.querySelectorAll('#imagePreview img, #ePreviewImage');
        previewImages.forEach(image => {
            if (image) {
                image.src = 'https://static.thenounproject.com/png/1269202-200.png'; // Reset image preview
            }
        });

        // Reset file input so it doesn’t hold previous file selection
        document.getElementById('eImage').value = '';
    }

    // Ensure reset runs when closing the form
    document.getElementById('closeFormButton').addEventListener('click', function () {
        document.getElementById('editFormContainer').style.display = 'none';
        resetForm(); // Call reset AFTER hiding the form
    });



    // Event delegation for status toggle (checkbox)
    $(document).on('change', '.toggle-status', async function (event) {
        const toggle = event.target.closest('.toggle-status'); 
            const confirmClose = confirm('Are you sure you want deactivate this Item? This action cant be reversed');
            if (!confirmClose) return; // Do not close the modal if the user cancels

        if (!toggle) {
            console.error('Status toggle not found');
            return;
        }

        const itemId = toggle.getAttribute('data-item-id');
        if (!itemId) {
            console.error('Item ID not found for status toggle');
            return;
        }

        const status = toggle.checked ? 1 : 0;  // Get the status (checked = 1, unchecked = 0)
        const csrfToken = $('meta[name="csrf-token"]').attr('content');  // Get CSRF token (if needed)

        // Make the AJAX request to update the status
        try {
            const response = await fetch(`/update-status/${itemId}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const result = await response.json();
            console.log(result.message);

            // Find the row that matches the itemId and update the row's status class
            const row = $(toggle).closest('tr'); // This will find the closest tr relative to the checkbox
            console.log(row); // Log the row to confirm it's correctly selected
            // If unchecked, add the 'disabled-row' class; otherwise, remove it
            if (status === 0) {
                row.addClass('disabled-row');
            } else {
                row.removeClass('disabled-row');
            }

        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status. Please try again.");
        }
    });

});