<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Repository\ProductCategoryRepository;
use App\Http\Repository\ProductRepository;
use App\Models\Product;
use Exception;

class SiteController extends Controller
{
    /**
     * Fetch Products
     */
    public function getProducts()
    {
        try {
            return entityResponse((new ProductRepository)->index());
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Fetch Product
     */
    public function getProduct(string $id)
    {
        try {
            $res = (new ProductRepository)->show($id);
            if (!$res['success']) {
                return messageResponse($res['message'], 404, 'error');
            }
            return entityResponse($res['data']);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Fetch Categories
     */
    public function getCategories()
    {
        try {
            return entityResponse((new ProductCategoryRepository)->index());
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
