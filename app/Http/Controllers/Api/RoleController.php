<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use Exception;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * @LRDparam get_all int|value:1
     * // either space or pipe
     * @LRDparam offset int
     * // override the default response codes
     * @LRDparam fields array
     * // override the default response codes
     * @LRDparam relations[] array
     * // override the default response codes
     * @LRDparam search string
     */
    public function index()
    {
        try {
            if (!auth()->user()->can('role-list')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $offset    = request()->input('offset') ?? 12;
            $fields    = ['id', 'name'];
            $condition = [];
            $relations = [];

            $queries = Role::query();

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
    public function store(RoleRequest $request)
    {
        try {
            if (!auth()->user()->can('role-create')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            if (Role::query()->create($request->validated())) {
                return messageResponse('Great! The role has been added.', 201);
            }
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * @LRDparam fields array
     * // override the default response codes
     */
    public function show(string $id)
    {
        try {
            if (!auth()->user()->can('role-list')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $fields = ['id', 'name'];
            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (!$query = Role::query()->select($fields)->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the role is not found.', 404, 'error');
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
    public function update(RoleRequest $request, string $id)
    {
        try {
            if (!auth()->user()->can('role-edit')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            if (!$query = Role::query()->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the role is not found.', 404, 'error');
            }
            $query->update($request->validated());
            return messageResponse('Great! The role has been updated.');
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
            if (!auth()->user()->can('role-delete')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            if (!$query = Role::query()->where(['id' => $id])->first()) {
                return messageResponse('Sorry, the role is not found.', 404, 'error');
            }
            $query->delete();
            return messageResponse('Great! The role has been deleted.');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function assignPermission(Request $request)
    {
        try {
            $role        = Role::query()->where('id', request()->input('role_id'))->first();
            $permissions = request()->input('permissions');

            $role->syncPermissions($permissions);
            return messageResponse('Great! The role has given permissions.', 201);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function getPermission()
    {
        try {
            if (!$query = Permission::query()->select('id', 'name')->orderBy('id')->get()) {
                return messageResponse('Sorry, the permissions is not found.', 404, 'error');
            }
            return entityResponse($query);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function getAssignedPermissions()
    {
        try {
            $role        = Role::where('id', request()->input('user_role_id'))->first();
            $permissions = $role->permissions()->select('id')->pluck('id');

            return entityResponse($permissions);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
