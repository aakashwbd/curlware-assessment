<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartRequest;
use App\Models\Cart;
use Exception;

class CartController extends Controller
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
     * @LRDparam search string
     */
    public function index()
    {
        try {
            $offset    = request()->input('offset') ?? 12;
            $fields    = ['id', 'user_id', 'product_id', 'quantity', 'amount'];
            $condition = [
                'user_id' => auth()->id(),
            ];
            $relations = [];

            $queries = Cart::query();

            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (request()->has('relations') && request()->input('relations')) {
                $relations = gettype(request()->input('relations')) === 'array' ? request()->input('relations') : explode(',', request()->input('relations'));
            }

            if (request()->has('get_all') && (int) request()->input('get_all') === 1) {
                $queries = $queries->select($fields)->where($condition)->with($relations)->get();
            } else {
                $queries = paginate($queries->select($fields)->with($relations)->where($condition)->paginate($offset)->toArray());
            }
            return entityResponse($queries);
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
    public function store(CartRequest $request)
    {
        try {
            if (Cart::query()->create(array_merge(['user_id' => auth()->id()], $request->validated()))) {
                return messageResponse('Great! The item added in cart.', 201);
            }
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * @LRDparam fields array
     * // either space or pipe
     */
    public function show(string $id)
    {
        try {
            $fields = ['id', 'user_id', 'product_id', 'quantity', 'amount'];
            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (!$query = Cart::query()->select($fields)->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the cart item is not found.', 404, 'error');
            }
            return entityResponse($query);
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
    public function update(CartRequest $request, string $id)
    {
        try {
            if (!$query = Cart::query()->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the cart item is not found.', 404, 'error');
            }
            $query->update($request->validated());
            return messageResponse('Great! The cart item has been updated.');
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
            if (!$query = Cart::query()->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the cart item is not found.', 404, 'error');
            }
            $query->delete();
            return messageResponse('Great! The cart item has been deleted.');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
