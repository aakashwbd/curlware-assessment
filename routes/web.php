<?php

use Illuminate\Support\Facades\Route;

Route::get('', fn() => inertia('pages/website/Home'))->name('home');
Route::get('login', fn() => inertia('pages/website/Auth/Login'));
Route::get('register', fn() => inertia('pages/website/Auth/Register'));

Route::get('categories', fn() => inertia('pages/website/Categories'));
Route::prefix('products')->group(function () {
    Route::get('', fn() => inertia('pages/website/Products/index'));
    Route::get('{slug}', fn($slug) => inertia('pages/website/Products/Show', ['slug' => $slug]));
});
Route::get('checkout', fn() => inertia('pages/website/Checkout'));

// Backend (Admin Panel) Routes
Route::prefix('admin')->group(function () {
    Route::get('login', fn() => inertia('pages/backend/Auth/Login'));
    Route::get('my-account', fn() => inertia('pages/backend/Auth/MyAccount'));

    Route::get('dashboard', fn() => inertia('pages/backend/Dashboard'));
    Route::prefix('products')->group(function () {
        Route::get('', fn() => inertia('pages/backend/Products/List'));
        Route::get('create', fn() => inertia('pages/backend/Products/Form'));
        Route::get('{id}/edit', fn($id) => inertia('pages/backend/Products/Form', ['id' => $id]));
    });
    Route::get('categories', fn() => inertia('pages/backend/Categories'));
    Route::get('orders', fn() => inertia('pages/backend/Orders'));
    Route::get('transactions', fn() => inertia('pages/backend/Transactions'));
    Route::get('employees', fn() => inertia('pages/backend/Employees'));
    Route::get('payment-gateway', fn() => inertia('pages/backend/PaymentGateways'));

    Route::prefix('roles')->group(function () {
        Route::get('', fn() => inertia('pages/backend/Roles/List'));
        Route::get('{id}/permissions', fn($id) => inertia('pages/backend/Roles/Permissions', ['id' => $id]));
    });
});
