<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Items</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="//cdn.datatables.net/2.2.1/css/dataTables.dataTables.min.css" rel="stylesheet">
    <script src="//cdn.datatables.net/2.2.1/js/dataTables.min.js"></script>
    <style>
        /* Style for the hovering form container */
        #createFormContainer {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 400px;
            max-width: 90%;
        }
        /* Overlay to dim the background */
        #overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <!-- Create Button -->
        <button id="createButton" type="button" class="btn btn-primary">Create Item</button>

        <!-- Table to Display Items -->
        <table id="items-table" class="table table-bordered mt-3">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($items as $item)
                    <tr>
                        <td>{{ $item->id }}</td>
                        <td>{{ $item->name }}</td>
                        <td>{{ $item->description }}</td>
                        <td>{{ $item->price }}</td>
                        <td>{{ $item->stock }}</td>
                        <td>
                            <button value="{{ $item->id }}" id="editButton" type="button" class="btn btn-primary">
                                Edit 
                            </button>
                            <button id="deleteButton" type="button" class="btn btn-primary">
                                Delete
                            </button>
                            <!-- Edit and Delete buttons will go here -->
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Include the modal -->
        @include('forms.create')
    </div>

    <script src="{{ asset('buttons.js') }}"></script>
</body>
</html>