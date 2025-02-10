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

// Edit Form
Route::get('/item/{id}/edit', [ItemController::class, 'edit'])->name('item.edit');

// Show Item (AJAX)
Route::get('/item/{id}', [ItemController::class, 'show'])->name('item.show');

// Update Item
Route::put('/item/{id}', [ItemController::class, 'update'])->name('item.update')->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

// Delete Item
Route::delete('/item/{id}', [ItemController::class, 'destroy'])->name('item.destroy');