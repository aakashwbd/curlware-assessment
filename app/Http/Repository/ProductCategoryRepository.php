<?php

namespace App\Http\Repository;

use App\Models\ProductCategory;

class ProductCategoryRepository
{
    public function index()
    {
        $offset    = request()->input('offset') ?? 12;
        $fields    = ['id', 'name'];
        $condition = [];
        $relations = [];

        $queries = ProductCategory::query();

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

        if (request()->has('children') && (int) request()->input('children') == 1) {
            $queries = $queries->whereNull('parent_id');
        }

        if (request()->has('get_all') && (int) request()->input('get_all') === 1) {
            $queries = $queries->select($fields)->with($relations)->where($condition)->whereNotNull('name')->get();
        } else {
            $queries = paginate($queries->select($fields)->with($relations)->where($condition)->whereNotNull('name')->latest()->paginate($offset)->toArray());
        }
        return $queries;
    }

    public function store($data)
    {
        if (ProductCategory::create($data)) {
            return ["success" => true, "message" => "Great! The category has been added."];
        }
    }

    public function show($id)
    {
        $key       = 'id';
        $fields    = ['id', 'parent_id', 'name', 'slug', 'is_featured', 'attachments', 'status'];
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

        if (!$query = ProductCategory::query()->select($fields)->with($relations)->where([$key => $id])->first()) {
            return messageResponse('Sorry, the category is not found.', 404, 'error');
        }
        return ['success' => true, 'data' => $query];
    }

    public function update($data, $id)
    {
        if (!$query = ProductCategory::query()->where('id', $id)->first()) {
            return ['success' => false, 'message' => 'Sorry, the category is not found.'];
        }
        $query->update($data);
        return ['success' => true, 'message' => 'Great! The category has been updated.'];
    }

    public function destroy($id)
    {
        if (!$query = ProductCategory::query()->where('id', $id)->first()) {
            return ['success' => false, 'message' => 'Sorry, the category is not found.'];
        }
        $query->delete();
        return ['success' => true, 'message' => 'Great! The category has been deleted.'];
    }
}
