document.addEventListener('DOMContentLoaded', () => {
    const tableUsers = new DataTable('#users-table');

    document.addEventListener('click', function (event) {
        if (event.target.closest (".SaveRoleButton")) {
            handleRoleUpdate(event);
        }
    })

    function handleRoleUpdate(event) {
        const SaveRoleButton = event.target.closest(".SaveRoleButton");
        itemId = SaveRoleButton.getAttribute('data-item-id');

        console.log('saving item with ID:', itemId);

        requestUrl = ('/permissions/{id}')

        fetch(requestUrl);


    }



})