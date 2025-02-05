<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ItemController;
use App\Models\Item;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/item', [ItemController::class, 'index'])->name('item.index');

Route::post('/item', [ItemController::class, 'store'])->name('item.store');

Route::get('/item/{id}', [ItemController::class, 'show'])->name('item.show');