@if(isset($item))
    <div>
        <h1>{{ $item->name }}</h1>
        <p>{{ $item->description }}</p>
        <p>{{ $item->price }}</p>
        <p>{{ $item->stock }}</p>
        <p>{{ $item->created_at }}</p>
        <p>{{ $item->updated_at }}</p>
    </div>
@else
    <p>No item selected.</p>
@endif