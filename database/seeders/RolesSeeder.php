<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesSeeder extends Seeder
{
    public function run()
    {
        // Create roles
        $admin = Role::create(['name' => 'admin']);
        $editor = Role::create(['name' => 'editor']);
        $user = Role::create(['name' => 'user']);

        // Create permissions
        Permission::create(['name' => 'view items']);
        Permission::create(['name' => 'create items']);
        Permission::create(['name' => 'edit items']);
        Permission::create(['name' => 'change items status']);

        // Assign permissions to roles
        $admin->givePermissionTo(['create items', 'edit items', 'view items', 'change items status']);
        $editor->givePermissionTo(['create items', 'edit items', 'view items']);
        $user->givePermissionTo(['view items']);
    }
}
