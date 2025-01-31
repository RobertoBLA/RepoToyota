document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded. Running script...');
    let table = new DataTable('#item-table',);
    // Get references to the elements
    const createButton = document.getElementById('createButton');
    const editButton = document.getElementById('editButton');
    const overlay = document.getElementById('overlay');
    const createFormContainer = document.getElementById('createFormContainer');
    const closeFormButton = document.getElementById('closeFormButton');

    // Log the elements for debugging
    console.log('createButton:', createButton);
    console.log('editButton:', editButton);
    console.log('createFormContainer:', createFormContainer);
    console.log('closeFormButton:', closeFormButton);

    // Show the form container when the "Create Item" button is clicked
    if (createButton && editButton && createFormContainer && closeFormButton && overlay) {
        createButton.addEventListener('click', () => {
            console.log('Create button clicked');
            createFormContainer.style.display = 'block';
            overlay.style.display = 'block'; // Show the overlay
        });

        // Hide the form container when the "Close" button is clicked
        closeFormButton.addEventListener('click', () => {
            console.log('Close button clicked');
            createFormContainer.style.display = 'none';
            overlay.style.display = 'none'; // Hide the overlay
        });

        // Hide the form container when clicking outside the form (on the overlay)
        overlay.addEventListener('click', () => {
            console.log('Overlay clicked');
            createFormContainer.style.display = 'none';
            overlay.style.display = 'none'; // Hide the overlay
        });
    } else {
        console.error('One or more elements are missing!');
    }
});