<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    // Display the form to create a new item
    public function index()
    {
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);
        // Handle file upload
        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('images', 'public');
        } else {
            $validatedData['image'] = null; // Ensure the image field is set to null if no file is uploaded
        }

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
            'id' => $item->id,
            'name' => $item->name,
            'description' => $item->description,
            'price' => $item->price,
            'stock' => $item->stock,
            'image' => $item->image ? asset('storage/' . $item->image) : null,
            //'status' => $item -> status,
        ]);
    }

    // Update an existing item
    public function update(Request $request, $id)
    {
        
        $validatedData = $request->validate([

            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            //'status' => 'required|in:active,inactive',
        ]);

        $item = Item::findOrFail($id);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('images', 'public');
        } elseif ($request->input('image') === null) {
            // If no new image is uploaded and the image field is explicitly cleared, set it to null
            $validatedData['image'] = null;
        }

        $item->update($validatedData);

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
