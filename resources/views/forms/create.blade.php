<!-- Overlay -->
<div id="overlay" style="display: none;"></div>

<!-- Hovering Form Container -->
<div id="createFormContainer" style="display: none;" strcolor="white">
    <h4>Create New Item</h4>
    <form action="{{ route('item.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" name="name" id="name" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea name="description" id="description" class="form-control"></textarea>
        </div>
        <div class="mb-3">
            <label for="price" class="form-label">Price</label>
            <input type="number" step="0.01" name="price" id="price" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="stock" class="form-label">Stock</label>
            <input type="number" name="stock" id="stock" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="image" class="form-label">Image</label>
            <img src="https://cdn0.woolworths.media/content/wowproductimages/large/093167.jpg" id="image" class="form-control">
        </div>
        <!-- Submit Button -->
        <button type="submit" class="btn btn-success">Submit</button>
        <!-- Close Button -->
        <button type="button" id="closeFormButton" class="btn btn-secondary">Close</button>
    </form>
</div>