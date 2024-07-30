<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeRequest;
use App\Models\User;
use Exception;
use Spatie\Permission\Models\Role;

class EmployeeController extends Controller
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
            if (!auth()->user()->can('user-list')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $offset    = request()->input('offset') ?? 12;
            $fields    = ['id', 'role_id', 'name', 'email', 'phone', 'avatars'];
            $condition = [];
            $relations = [];

            $queries = User::query();

            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (request()->has('relations') && request()->input('relations')) {
                $relations = gettype(request()->input('relations')) === 'array' ? request()->input('relations') : explode(',', request()->input('relations'));
            }

            if (request()->has('search') && request()->input('search')) {
                $queries = $queries->whereAny(['name'], 'LIKE', '%' . trim(request()->input('search')) . '%');
            }

            if (request()->has('get_all') && (int) request()->input('get_all') === 1) {
                $queries = $queries->select($fields)->where($condition)->get();
            } else {
                $queries = paginate($queries->select($fields)->with($relations)->where($condition)->whereNotNull('role_id')->paginate($offset)->toArray());
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
    public function store(EmployeeRequest $request)
    {
        try {
            if (!auth()->user()->can('user-create')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            if ($user = User::query()->create($request->validated())) {
                $role = Role::query()->select('name')->where('id', request()->input('role_id'))->first();
                $user->assignRole([$role->name]);
                return messageResponse('Great! The user has been added.', 201);
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
            if (!auth()->user()->can('user-list')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $fields = ['id', 'role_id', 'name', 'email', 'phone', 'avatars'];
            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (!$query = User::query()->select($fields)->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the user is not found.', 404, 'error');
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
    public function update(EmployeeRequest $request, string $id)
    {
        try {
            if (!auth()->user()->can('user-edit')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            if (!$query = User::query()->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the user is not found.', 404, 'error');
            }
            $query->update($request->validated());
            return messageResponse('Great! The user has been updated.');
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
            if (!auth()->user()->can('user-delete')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            if (!$query = User::query()->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the user is not found.', 404, 'error');
            }
            $query->delete();
            return messageResponse('Great! The user has been deleted.');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
