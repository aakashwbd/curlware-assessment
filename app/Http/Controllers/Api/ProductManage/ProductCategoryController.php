<?php

namespace App\Http\Controllers\Api\ProductManage;

use App\Http\Controllers\Controller;
use App\Http\Repository\ProductCategoryRepository;
use App\Http\Requests\ProductManage\ProductCategoryRequest;
use Exception;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            if (!auth()->user()->can('product-category-list')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            return entityResponse((new ProductCategoryRepository)->index());
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductCategoryRequest $request)
    {
        try {
            if (!auth()->user()->can('product-category-create')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $res = (new ProductCategoryRepository)->store($request->validated());
            if ($res['success']) {
                return messageResponse($res['message'], 201);
            }
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            if (!auth()->user()->can('product-category-list')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $res = (new ProductCategoryRepository)->show($id);
            if (!$res['success']) {
                return messageResponse($res['message'], 404, 'error');
            }
            return entityResponse($res['data']);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductCategoryRequest $request, string $id)
    {
        try {
            if (!auth()->user()->can('product-category-edit')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $res = (new ProductCategoryRepository)->update($request->validated(), $id);
            if (!$res['success']) {
                return messageResponse($res['message'], 404, 'error');
            }
            return messageResponse($res['message']);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            if (!auth()->user()->can('product-category-delete')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $res = (new ProductCategoryRepository)->destroy($id);
            if (!$res['success']) {
                return messageResponse($res['message'], 404, 'error');
            }
            return messageResponse($res['message']);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
