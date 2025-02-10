<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    // Placeholder image URL (can be moved to config if needed)
    const PLACEHOLDER_IMAGE = 'https://static.thenounproject.com/png/1269202-200.png';

    /**
     * Display a listing of all items.
     */
    public function index()
    {
        $items = Item::all();
        return view('item', compact('items'));
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('images', 'public');
        } else {
            $validatedData['image'] = null;
        }
    
        $item = Item::create($validatedData);
    
        return response()->json([
            'message' => 'Item created successfully',
            'item' => [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'price' => $item->price,
                'stock' => $item->stock,
                'image' => $item->image ? asset('storage/' . $item->image) : null,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified item.
     */
    public function edit($id)
    {
        $item = Item::findOrFail($id);
        return view('form.edit', compact('item'));
    }

    /**
     * Display the specified item (used for AJAX requests).
     */
    public function show($id)
    {
        $item = Item::findOrFail($id);

        // Return item details as JSON
        return response()->json([
            'id' => $item->id,
            'name' => $item->name,
            'description' => $item->description,
            'price' => $item->price,
            'stock' => $item->stock,
            'image' => $item->image ? asset('storage/' . $item->image) : self::PLACEHOLDER_IMAGE,
        ]);
    }


    /**
     * Update the specified item in storage.
     */
    public function update(Request $request, $id)
{
    $validatedData = $request->validate([
        'name' => 'required|string',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $item = Item::findOrFail($id);

    // Handle image upload if provided
    if ($request->hasFile('image') && $request->file('image')->isValid()) {
        $validatedData['image'] = $request->file('image')->store('images', 'public');
    } else {
        // Don't change the image if no file is uploaded
        $validatedData['image'] = $item->image;
    }

    // Update the item
    $item->update($validatedData);

    // Return a success response
    return response()->json([
        'message' => 'Item updated successfully!',
        'item' => $item
    ]);
}


    /**
     * Remove the specified item from storage.
     */
    public function destroy($id)
    {
        $item = Item::findOrFail($id);

        // Optionally, use soft deletes if enabled in the model
        $item->delete();

        return redirect()->back()->with('success', 'Item deleted successfully!');
    }
}