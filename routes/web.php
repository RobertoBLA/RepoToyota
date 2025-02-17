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

Route::get('/items', [ItemController::class, 'index'])-> middleware(['auth', 'verified'])->name('items.index');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::group(['middleware' => ['role:admin']], function () { 
    Route::put('/item/{id}', [ItemController::class, 'update'])->name('item.update');
    Route::post('/item', [ItemController::class, 'store'])->name('item.store');
    Route::post('/update-status/{id}', [ItemController::class, 'updateStatus']);
 });








// Show Item (AJAX)
Route::get('/item/{id}', [ItemController::class, 'show'])->name('item.show');




require __DIR__ . '/auth.php';
