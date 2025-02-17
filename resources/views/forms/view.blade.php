<!-- Overlay -->

<div class="modal-overlay" id="overlay" style="display: none;"></div>

<!-- Hovering Form Container -->
<div class="modal-container" id="viewFormContainer" style="display: none;">
    <h4 style="text-align: center;"> View Item</h4>
    <div class="modal-content">
        <!-- Split Layout -->
        <form enctype="multipart/form-data" id="viewForm">
            <div class="split-container">
                <!-- Left Side: Form Fields -->
                <div class="form-section">
                    <input type="hidden" name="id" id="vId">
                    <div class="mb-3">
                        <label for="vName" class="form-label">Name</label>
                        <input type="text" name="name" id="vName" class="form-control" required disabled>
                    </div>
                    <div class="mb-3">
                        <label for="vDescription" class="form-label">Description</label>
                        <textarea name="description" id="vDescription" class="form-control" disabled></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="vPrice" class="form-label">Price</label>
                        <input type="number" step="0.01" name="price" id="vPrice" class="form-control" required disabled>
                    </div>
                    <div class="mb-3">
                        <label for="vStock" class="form-label">Stock</label>
                        <input type="number" name="stock" id="vStock" class="form-control" required disabled>
                    </div>
                    <div class="mb-3">
                        <!-- Hidden File Input -->
                        <input type="file" name="image" id="vImage" class="form-control d-none" accept="image/*" disabled>
                    </div>
                    <!-- Close Button -->
                    <button type="button" id="closeFormButtonV" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                   
                    <div id="vCreatedAt">Created At: </div>
                    <div id="vUpdatedAt">Last Updated At: </div>

                </div>

                <!-- Right Side: Image Preview -->
                <div class="image-section">
                    <!-- Clickable Image Container -->
                    <label for="vImage" class="image-preview-container">
                        <div id="imagePreview" class="image-preview">
                            <!-- Default Placeholder -->
                            <img src="https://static.thenounproject.com/png/1269202-200.png" alt="Preview" id="vPreviewImage">
                        </div>
                    </label>
                </div>
            </div>
        </form>
    </div>
</div>