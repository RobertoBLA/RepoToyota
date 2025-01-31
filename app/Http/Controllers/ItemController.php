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
        ]);

        Item::create($validatedData);

        return redirect()->back()->with('success', 'Item created successfully!');
    }

    // Display a specific item
    public function show($id)
    {
        $item = Item::findOrFail($id);
        return view('item.show', compact('item'));
    }

    // Display the form to edit an existing item
    public function edit($id)
    {
        $item = Item::findOrFail($id);
        return view('form.edit', compact('item'));
    }

    // Update an existing item
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        $item = Item::findOrFail($id);
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
