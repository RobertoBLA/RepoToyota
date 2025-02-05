<!-- Overlay -->
<div class="modal-overlay" id="overlay" style="display: none;"></div>

<!-- Hovering Form Container -->
<div class="modal-container" id="editFormContainer" style=" display: none;">
    <h4 style="text-align: center;">Edit Item</h4>
    <div class="modal-content">
        <!-- Split Layout -->
        <div class="split-container">
            <!-- Left Side: Form -->
            <div class="form-section">
                <form action="{{ route('item.store') }}" method="POST" enctype="multipart/form-data" id="editForm">
                    @csrf
                    <input type="hidden" name="id" id="eId">
                    <div class="mb-3">
                        <label for="eName" class="form-label">Name</label>
                        <input type="text" name="name" id="eName" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="eDescription" class="form-label">Description</label>
                        <textarea name="description" id="eDescription" class="form-control"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="ePrice" class="form-label">Price</label>
                        <input type="number" step="0.01" name="price" id="ePrice" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="eStock" class="form-label">Stock</label>
                        <input type="number" name="stock" id="eStock" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <!-- Hidden File Input -->
                        <input type="file" name="image" id="image" class="form-control d-none" accept="image/*">
                    </div>
                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-success">Save</button>
                    <!-- Close Button -->
                    <button type="button" id="closeFormButton" class="btn btn-secondary">Close</button>
                </form>
            </div>

            <!-- Right Side: Image Preview -->
            <div class="image-section">
                <!-- Clickable Image Container -->
                <label for="image">
                    <div id="imagePreview" class="image-preview">
                        <!-- Default Placeholder -->
                        <img src="https://static.thenounproject.com/png/1269202-200.png" alt="Preview" id="previewImage">
                    </div>
                </label>

            </div>
        </div>
    </div>
</div>

<div class="mt-3 d-flex align-items-center">
    <!-- Visibility Toggle -->
    <span class="me-2">Hidden</span>
    <label class="slider-switch">
        <input type="checkbox" id="visibilityToggle" checked>
        <span class="slider round"></span>
    </label>
    <span class="ms-2">Visible</span>
</div>


</div>
</div>
</div>