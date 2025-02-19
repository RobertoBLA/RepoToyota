<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;



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
                'status' => (int) $item->status,
            ],
        ]);
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
            'created_at' => Carbon::parse($item->created_at)->setTimezone('America/New_York')->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::parse($item->updated_at)->setTimezone('America/New_York')->format('Y-m-d H:i:s'),
        ]);
    }


    /**
     * Update the specified item in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            // Validate the request
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:255',
                'price' => 'required|numeric',
                'stock' => 'required|integer',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Find the item
            $item = Item::findOrFail($id);

            // Handle image upload if provided
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                // Store the new image
                $validatedData['image'] = $request->file('image')->store('images', 'public');
            } else {
                // Do not include 'image' field if no new image is uploaded
                unset($validatedData['image']);
            }

            // Update the item (image will only be updated if a new image is uploaded)
            $item->update($validatedData);

            // Return a success response
            return response()->json([
                'message' => 'Item updated successfully!',
                'item' => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'price' => $item->price,
                    'stock' => $item->stock,
                    'image' => $item->image ? asset('storage/' . $item->image) : null,
                    'status' => $item->status,
                ],
            ]);
        } catch (ValidationException $e) {
            // Return validation errors as JSON
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Handle other exceptions
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $item = Item::findOrFail($id);
        $item->status = $request->status; // Store as 0 or 1
        $item->save();
    
        return response()->json(['message' => 'Status updated successfully',
        'item' => [
            'status' => $item->status,
        ]]);
    }
    

    /**
     * Remove the specified item from storage.
     */
    public function destroy($id)
    {
        try {
            $item = Item::findOrFail($id);
            // Optionally, use soft deletes if enabled in the model
            $item->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Item updated successfully!',
            ]);
        } catch (ValidationException $e) {
            // Return validation errors as JSON
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Handle other exceptions
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
