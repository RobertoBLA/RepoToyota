<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

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

require __DIR__.'/auth.php';
