<?php

namespace App\Http\Repository;

use App\Models\Product;

class ProductRepository
{
    public function index()
    {
        $offset    = request()->input('offset') ?? 12;
        $fields    = ['id', 'name'];
        $condition = [];
        $relations = [];

        $queries = Product::query();

        if (request()->has('fields') && request()->input('fields')) {
            $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
        }

        if (request()->has('relations') && request()->input('relations')) {
            $relations = gettype(request()->input('relations')) === 'array' ? request()->input('relations') : explode(',', request()->input('relations'));
        }

        if (request()->has('search') && request()->input('search')) {
            $queries = $queries->whereAny(['name', 'description'], 'LIKE', '%' . trim(request()->input('search')) . '%');
        }

        if (request()->has('is_featured') && (int) request()->input('is_featured')) {
            $condition['is_featured'] = (int) request()->input('is_featured');
        }

        if (request()->has('category_id') && request()->input('category_id')) {
            $condition['category_id'] = request()->input('category_id');
        }

        if (request()->has('category_ids') && request()->input('category_ids')) {
            $category_ids = gettype(request()->input('category_ids')) === 'array' ? request()->input('category_ids') : explode(',', request()->input('category_ids'));
            $queries      = $queries->whereIn('category_id', $category_ids);
        }

        if (request()->has('price_range') && request()->input('price_range')) {
            $range   = gettype(request()->input('price_range')) === 'array' ? request()->input('price_range') : explode(',', request()->input('price_range'));
            $queries = $queries->whereBetween('regular_price', $range);
        }

        if (request()->has('rating') && request()->input('rating')) {
            $condition['rating'] = request()->input('rating');
        }

        if (request()->has('get_all') && (int) request()->input('get_all') === 1) {
            $queries = $queries->select($fields)->where($condition)->get();
        } else {
            $queries = paginate($queries->select($fields)->with($relations)->where($condition)->paginate($offset)->toArray());
        }
        return $queries;
    }

    public function store($data)
    {
        if (Product::create($data)) {
            return ["success" => true, "message" => "Great! The product has been added."];
        }
    }

    public function show($id)
    {
        $key       = 'id';
        $fields    = ['id', 'category_id', 'name', 'description', 'regular_price', 'discount_properties', 'is_featured', 'attachments', 'status'];
        $relations = [];

        if (request()->has('fields') && request()->input('fields')) {
            $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
        }

        if (request()->has('relations') && request()->input('relations')) {
            $relations = gettype(request()->input('relations')) === 'array' ? request()->input('relations') : explode(',', request()->input('relations'));
        }

        if (request()->has('key') && request()->input('key')) {
            $key = request()->input('key');
        }

        if (!$query = Product::query()->select($fields)->with($relations)->where([$key => $id])->first()) {
            return messageResponse('Sorry, the product is not found.', 404, 'error');
        }
        return ['success' => true, 'data' => $query];
    }

    public function update($data, $id)
    {
        if (!$query = Product::query()->where('id', $id)->first()) {
            return ['success' => false, 'message' => 'Sorry, the product is not found.'];
        }
        $query->update($data);
        return ['success' => true, 'message' => 'Great! The product has been updated.'];
    }

    public function destroy($id)
    {
        if (!$query = Product::query()->where('id', $id)->first()) {
            return ['success' => false, 'message' => 'Sorry, the product is not found.'];
        }
        $query->delete();
        return ['success' => true, 'message' => 'Great! The product has been deleted.'];
    }
}
