<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductManage\ProductCategoryController;
use App\Http\Controllers\Api\ProductManage\ProductController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SiteController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    /**
     * Login & Registration
     */
    Route::post('register', [RegisterController::class, 'register']);
    Route::post('login', [LoginController::class, 'login']);

    /**
     * Social Login (GOOGLE)
     */
    Route::prefix('oauth-login')->group(function () {
        Route::get('{provider}', [LoginController::class, 'oAuthRedirect']);
        Route::get('{provider}/callback', [LoginController::class, 'oAuthCallback']);
    });

    /**
     * Auth user update & change password
     */
    Route::middleware(['auth:api'])->group(function () {
        Route::post('update', [RegisterController::class, 'updateProfile']);
        Route::post('change-password', [RegisterController::class, 'changePassword']);
    });
});

Route::group(['middleware' => ['auth:api']], function () {
    /**
     * Product Management
     * --- Product
     * --- Import CSV (Product)
     * --- Product Category
     */
    Route::post('import-products', [ProductController::class, 'importCSV']);
    Route::apiResource('products', ProductController::class)->except(['create', 'edit']);
    Route::apiResource('product-categories', ProductCategoryController::class)->except(['create', 'edit']);

    /**
     * Employee & Role Management
     */
    Route::post('assign-permissions', [RoleController::class, 'assignPermission']);
    Route::get('get-assigned-permissions', [RoleController::class, 'getAssignedPermissions']);
    Route::get('permissions', [RoleController::class, 'getPermission']);
    Route::apiResource('roles', RoleController::class)->except(['create', 'edit']);
    Route::apiResource('employees', EmployeeController::class)->except(['create', 'edit']);

    /**
     * Order & Cart Management
     */
    Route::get('transactions', [OrderController::class, 'getTransactions']);
    Route::post("assign-plan", [OrderController::class, 'assignOrder']);
    Route::apiResource('orders', OrderController::class)->except(['create', 'edit']);
    Route::apiResource('carts', CartController::class)->except(['create', 'edit']);

    /**
     * Reports
     * --- Summary
     */
    Route::prefix('reports')->group(function () {
        Route::get('summary', [ReportController::class, 'summary']);
    });
});

/**
 * Site (Global Routes)
 * -- Product
 * -- Category
 */
Route::prefix('site')->group(function () {
    Route::get('categories', [SiteController::class, 'getCategories']);
    Route::prefix('products')->group(function () {
        Route::get('', [SiteController::class, 'getProducts']);
        Route::get('{id}', [SiteController::class, 'getProduct']);
    });
});

/**
 * Store and Get Media Files
 */
Route::apiResource('media-files', FileController::class)->only(['index', 'store', 'destroy']);