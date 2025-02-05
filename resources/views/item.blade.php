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

        /* Modal Container */
        .modal-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 80%;
            /* Adjusted for larger content */
            max-width: 800px;
            /* Maximum width for responsiveness */
            border-radius: 8px;
            /* Rounded corners */
        }

        /* Split Container */
        .split-container {
            display: flex;
            gap: 20px;
            /* Space between the two sections */
        }

        /* Form Section */
        .form-section {
            flex: 1;
            /* Take up half the space */
            display: flex;
            flex-direction: column;
            gap: 10px;
            /* Space between form elements */
        }

        /* Image Section */
        .image-section {
            flex: 1;
            /* Take up half the space */
            display: flex;
            flex-direction: column;
            align-items: center;
            /* Center horizontally */
            justify-content: center;
            /* Align content to the top */
            text-align: center;
            /* Ensure text inside is centered */
            min-width: 300px;
            /* Ensure the section is at least as wide as the image preview */
        }

        /* Image Preview */
        .image-preview {
            width: 300px;
            /* Fixed width for the image preview */
            height: 400px;
            /* Fixed height for consistency */
            overflow: hidden;
            border: 1px solid #ccc;
            border-radius: 8px;
            display: flex;
            align-items: center;
            /* Center vertically within the preview box */
            justify-content: center;
            /* Center horizontally within the preview box */
            background: #f9f9f9;
            margin: 0 auto;
            /* Center the preview box horizontally */
            transition: all 0.3s;
            /* Add a smooth transition effect */

        }

        .image-preview:hover {
            border-color: #007bff;
            /* Change border color on hover */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            /* Add a subtle shadow */
            transform: scale(1.02);
            /* Slightly enlarge the container */
        }

        /* Image Styling */
        .image-preview img {
            max-width: 100%;
            /* Ensure the image doesn't exceed the container's width */
            max-height: 100%;
            /* Ensure the image doesn't exceed the container's height */
            object-fit: cover;
            /* Scale the image to cover the container while maintaining aspect ratio */
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
                        <button type="button" class="btn btn-primary editButton" data-item-id="{{ $item->id }}">
                            Edit
                        </button>
                        <button type="button" class="btn btn-primary deleteButton" data-item-id="{{ $item->id }}">
                            Delete
                        </button>
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