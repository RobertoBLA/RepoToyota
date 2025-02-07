<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Items</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- DataTables CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>

    <style>
        /* Slider Switch Styles */
        .slider-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            /* Increased width for a slider-like appearance */
            height: 30px;
            /* Increased height for better proportions */
        }

        .slider-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            /* Default gray color */
            transition: 0.3s;
            border-radius: 30px;
            /* Rounded corners for slider effect */
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 24px;
            width: 24px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
            /* Circle handle */
        }

        input:checked+.slider {
            background-color: #28a745;
            /* Green when toggled on */
        }

        input:checked+.slider:before {
            transform: translateX(30px);
            /* Move the handle to the right */
        }

        /* Rounded sliders */
        .slider.round {
            border-radius: 30px;
        }

        .slider.round:before {
            border-radius: 50%;
        }

        /* Overlay to dim the background */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }

/* Modal Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none; /* Hidden by default */
}

/* Modal Container */
.modal-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    width: 80%; /* Adjust as needed */
    max-width: 800px;
    display: none; /* Hidden by default */
}

/* Split Layout */
.split-container {
    display: flex;
    gap: 20px; /* Space between form and image preview */
}

/* Form Section */
.form-section {
    flex: 2; /* Takes up 2/3 of the space */
}

/* Image Section */
.image-section {
    flex: 1; /* Takes up 1/3 of the space */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* Image Preview Container */
.image-preview-container {
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ccc;
    border-radius: 8px;
    overflow: hidden;
}

.image-preview-container:hover {
            border-color: #007bff;
            /* Change border color on hover */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            /* Add a subtle shadow */
            transform: scale(1.02);
            /* Slightly enlarge the container */
        }

/* Image Preview */
.image-preview img {
    max-width: 100%;
    max-height: 200px;
    object-fit: cover;
}

/* Buttons */
.btn {
    margin-top: 10px;
}
    </style>
</head>

<body>

    <div class="container mt-5">
        <!-- Create Button -->

        <button id="createButton" type="button" class="btn btn-primary">Create Item</button>
        <!-- Table to Display Items -->
        <table id="items-table" class="display" style="width: 100%;">
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
                        <button id="editItem" type="button" class="btn btn-primary editButton" data-item-id="{{ $item->id }}">
                            Edit
                        </button>
                        <button id="deleteItem" type="button" class="btn btn-primary deleteButton" data-item-id="{{ $item->id }}">
                            Delete
                        </button>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Include the modal -->
        @include('forms.create')
        @include('forms.update')
    </div>

    <script src="{{ asset('buttons.js') }}"></script>
</body>

</html>