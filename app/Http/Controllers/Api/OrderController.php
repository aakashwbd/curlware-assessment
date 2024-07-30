<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Models\Cart;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Leafwrap\PaymentDeals\Facades\PaymentDeal;
use Leafwrap\PaymentDeals\Models\PaymentTransaction;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $offset    = request()->input('offset') ?? 12;
            $fields    = ['id', 'user_id', 'cart_ids', 'payment_method', 'payment_status', 'delivery_status', 'amount'];
            $condition = [];
            $relations = [];

            $queries = Order::query();

            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (request()->has('relations') && request()->input('relations')) {
                $relations = gettype(request()->input('relations')) === 'array' ? request()->input('relations') : explode(',', request()->input('relations'));
            }

            if (request()->has('search') && request()->input('search')) {
                $queries = $queries->whereAny(['id'], 'LIKE', '%' . trim(request()->input('search')) . '%');
            }

            if (request()->has('get_all') && (int) request()->input('get_all') === 1) {
                $queries = $queries->select($fields)->where($condition)->get();
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
    public function store(OrderRequest $request)
    {
        try {
            $payload = $request->validated();
            if (auth()->check()) {
                $payload['user_id'] = auth()->id();
            }
            if ($query = Order::query()->create($payload)) {
                Cart::query()->whereIn('id', request()->input('cart_ids'))->get()->each(function ($q) {
                    $q->status = 'purchased';
                    $q->update();
                });

                if (request()->input('payment_method') === 'paypal' || request()->input('payment_method') === 'stripe') {
                    $amount   = request()->input('amount');
                    $gateway  = request()->input('payment_method');
                    $userId   = auth()->id();
                    $currency = request()->input('currency') ?? '$';

                    PaymentDeal::init($query->toArray(), $amount, $userId, $gateway, $currency);
                    PaymentDeal::pay();
                    $res = PaymentDeal::feedback();

                    if ($res['isError']) {
                        return messageResponse($res['message'], $res['statusCode']);
                    }

                    return entityResponse($res['data']['url'], $res['statusCode'], $res['status'], $res['message']);
                }
                return messageResponse('Great! The order has been added.', 201);
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
            $fields = ['id', 'user_id', 'cart_ids', 'payment_method', 'payment_status', 'delivery_status', 'amount'];
            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (!$query = Order::query()->select($fields)->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the order is not found.', 404, 'error');
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
    public function update(OrderRequest $request, string $id)
    {
        try {
            if (!$query = Order::query()->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the order is not found.', 404, 'error');
            }
            $query->update($request->validated());
            return messageResponse('Great! The order has been updated.');
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
            if (!$query = Order::query()->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the order is not found.', 404, 'error');
            }
            $query->delete();
            return messageResponse('Great! The order has been deleted.');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function assignOrder(Request $request)
    {
        try {
            $transactionId = $request->input('transaction_id');
            if ($query = PaymentTransaction::where(['transaction_id' => $transactionId])->first()) {
                if ($query->status === 'completed') {
                    $orderQuery                 = Order::query()->where('id', $query->plan_data['id'])->first();
                    $orderQuery->payment_status = 'paid';
                    $orderQuery->update();
                    return messageResponse("Great! The order has been added.", 201, 'success');
                }
            }
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function getTransactions()
    {
        try {
            $offset    = request()->input('offset') ?? 12;
            $fields    = ['id', 'transaction_id', 'user_id', 'gateway', 'amount', 'plan_data', 'status'];
            $condition = [];
            $relations = [];

            $queries = PaymentTransaction::query();

            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (request()->has('relations') && request()->input('relations')) {
                $relations = gettype(request()->input('relations')) === 'array' ? request()->input('relations') : explode(',', request()->input('relations'));
            }

            if (request()->has('search') && request()->input('search')) {
                $queries = $queries->whereAny(['id'], 'LIKE', '%' . trim(request()->input('search')) . '%');
            }

            if (request()->has('get_all') && (int) request()->input('get_all') === 1) {
                $queries = $queries->select($fields)->where($condition)->get();
            } else {
                $queries = paginate($queries->select($fields)->with($relations)->where($condition)->paginate($offset)->toArray());
            }
            return entityResponse($queries);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
