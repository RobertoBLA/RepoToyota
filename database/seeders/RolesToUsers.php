<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class RolesToUsers extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::find(1); // or any other user
        $user->assignRole('admin');

        $user = User::find(2);
        $user->assignRole('editor');

        $user = User::find(3);
        $user->assignRole('user');
    }
}
