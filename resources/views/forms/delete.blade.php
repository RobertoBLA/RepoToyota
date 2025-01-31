<form action="{{ route('items.destroy', '') }}" method="POST">
    @csrf
    @method('DELETE')
    <p>Are you sure you want to delete this item?</p>
    <button type="submit">Delete</button>
</form>