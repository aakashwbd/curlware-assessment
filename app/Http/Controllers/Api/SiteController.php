<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Repository\ProductCategoryRepository;
use App\Http\Repository\ProductRepository;
use Exception;

class SiteController extends Controller
{
    /**
     * @LRDparam get_all int|value:1
     * // either space or pipe
     * @LRDparam offset int
     * // either space or pipe
     * @LRDparam fields array
     * // either space or pipe
     * @LRDparam relations[] array
     * // either space or pipe
     * @LRDparam is_featured int|value:1
     * // either space or pipe
     * @LRDparam category_id string
     * // either space or pipe
     * @LRDparam category_ids array
     * // either space or pipe
     * @LRDparam price_range array
     * // either space or pipe
     * @LRDparam rating int
     * // either space or pipe
     * @LRDparam search string
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
     * @LRDparam key string|value:slug
     * // either space or pipe
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
     * @LRDparam get_all int|value:1
     * // either space or pipe
     * @LRDparam offset int
     * // either space or pipe
     * @LRDparam fields array
     * // either space or pipe
     * @LRDparam relations[] array
     * // either space or pipe
     * @LRDparam is_featured int|value:1
     * // either space or pipe
     * @LRDparam children int|value:1
     * // either space or pipe
     * @LRDparam search string
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
