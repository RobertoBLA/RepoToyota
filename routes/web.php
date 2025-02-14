<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ItemController;
use App\Models\Item;

Route::get('/', function () {
    return view('welcome');
});

// Index Page
Route::get('/items', [ItemController::class, 'index'])->name('items.index');

// Create Item
Route::post('/item', [ItemController::class, 'store'])->name('item.store');

Route::post('/update-status/{id}', [ItemController::class, 'updateStatus']);

// Show Item (AJAX)
Route::get('/item/{id}', [ItemController::class, 'show'])->name('item.show');

// Update Item
Route::put('/item/{id}', [ItemController::class, 'update'])->name('item.update');

// Delete Item
Route::delete('/item/{id}', [ItemController::class, 'destroy'])->name('item.destroy');