<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class PermissionsController extends Controller
{
    public function permissionsIndex() {
        $users = User::with(['roles', 'permissions'])->get();
        return view('admin', compact('users'));
    }

    public function update(Request $request) {

    }

    
}
