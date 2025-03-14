
<!-- Overlay -->
<div class="modal-overlay" id="overlay" style="display: none;"></div>

<!-- Hovering Form Container -->
<div class="modal-container" id="editFormContainer" style="display: none;">
    <h4 style="text-align: center;"> Edit Item</h4>
    <div class="modal-content">
        <!-- Split Layout -->
        <form action="{{ route('item.update')" method="POST" enctype="multipart/form-data" id="editForm">
            @csrf
            @method('PUT')
            <div class="split-container">
                <!-- Left Side: Form Fields -->
                <div class="form-section">
                    <input type="hidden" name="id" id="eId">
                    <div class="mb-3">
                        <label for="cName" class="form-label">Name</label>
                        <input type="text" name="name" id="eName" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="cDescription" class="form-label">Description</label>
                        <textarea name="description" id="eDescription" class="form-control"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="cPrice" class="form-label">Price</label>
                        <input type="number" step="0.01" name="price" id="ePrice" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="cStock" class="form-label">Stock</label>
                        <input type="number" name="stock" id="eStock" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <!-- Hidden File Input -->
                        <input type="file" name="image" id="eImage" class="form-control d-none" accept="image/*">
                    </div>
                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-success">Save</button>
                    <!-- Close Button -->
                    <button type="button" id="closeFormButtonE" class="btn btn-secondary">Close</button>
                </div>

                <!-- Right Side: Image Preview -->
                <div class="image-section">
                    <!-- Clickable Image Container -->
                    <label for="eImage" class="image-preview-container">
                        <div id="imagePreview" class="image-preview">
                            <!-- Default Placeholder -->
                            <img src="https://static.thenounproject.com/png/1269202-200.png" alt="Preview" id="ePreviewImage">
                        </div>
                    </label>
                </div>
            </div>
        </form>
    </div>
</div>