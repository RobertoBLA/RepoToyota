<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    // Display the form to create a new item
    public function index() {
        $items = Item::all();
        return view('item', compact('items'));
    }

    // Store a new item
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        Item::create($validatedData);

        return redirect()->back()->with('success', 'Item created successfully!');
    }

    // Display the form to edit an existing item
    public function edit($id)
    {
        $item = Item::findOrFail($id);
        return view('form.edit', compact('item'));
    }

    // Display a specific item
    public function show($id)
    {
        $item = Item::findOrFail($id);

        //Return item details
        return response()->json([
            'id' => $item -> id,
            'name' => $item -> name,
            'description' => $item -> description,
            'price' => $item -> price,
            'stock' => $item -> stock,
            //'image' => $item->image ? asset('storage/' . $item->image) : null,
            //'status' => $item -> status,
        ]);
    }

    // Update an existing item
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:active,inactive',
        ]);
    
        $item = Item::findOrFail($id);
    
        // Update item fields
        $item->name = $request->input('name');
        $item->description = $request->input('description');
        $item->price = $request->input('price');
        $item->stock = $request->input('stock');
    
        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $item->image = $imagePath;
        }
    
        $item->save();
    
        return redirect()->back()->with('success', 'Item updated successfully!');
    }

    // Delete an existing item
    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        return view('delete', compact('item'));

        return redirect()->back()->with('success', 'Item deleted successfully!');
    }
}
