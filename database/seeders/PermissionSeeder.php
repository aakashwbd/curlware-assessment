<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * List of permissions to add.
     */
    private $permissions = [
        'product-list',
        'product-create',
        'product-edit',
        'product-delete',
        'product-import',

        'product-category-list',
        'product-category-create',
        'product-category-edit',
        'product-category-delete',

        'role-list',
        'role-create',
        'role-edit',
        'role-delete',

        'user-list',
        'user-create',
        'user-edit',
        'user-delete',

        'order-list',
        'transaction-create',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
        $role = Role::create(['name' => 'Admin']);
        $user = User::create([
            'name' => 'William C. Schroyer',
            'email' => 'admin@example.com',
            'password' => Hash::make('123456'),
            'role_id' => $role->id,
        ]);
        $permissions = Permission::pluck('id', 'id')->all();
        $role->syncPermissions($permissions);
        $user->assignRole([$role->id]);
    }
}
