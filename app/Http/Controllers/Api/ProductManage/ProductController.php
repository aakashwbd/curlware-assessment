<?php

namespace App\Http\Controllers\Api\ProductManage;

use App\Http\Controllers\Controller;
use App\Http\Repository\ProductRepository;
use App\Http\Requests\ProductManage\ProductRequest;
use App\Jobs\ProductCSVData;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;

class ProductController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            if (!auth()->user()->can('product-list')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            return entityResponse((new ProductRepository)->index());
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
    public function store(ProductRequest $request)
    {
        try {
            if (!auth()->user()->can('product-create')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $res = (new ProductRepository)->store($request->validated());
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
            if (!auth()->user()->can('product-list')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
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
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, string $id)
    {
        try {
            if (!auth()->user()->can('product-edit')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $res = (new ProductRepository)->update($request->validated(), $id);
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
            if (!auth()->user()->can('product-delete')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            $res = (new ProductRepository)->destroy($id);
            if (!$res['success']) {
                return messageResponse($res['message'], 404, 'error');
            }
            return messageResponse($res['message']);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Store a import resource in storage.
     */
    public function importCSV(Request $request)
    {
        try {
            if (!auth()->user()->can('product-import')) {
                return messageResponse("Sorry, you don't have this permission.", 400, 'error');
            }
            if (request()->has('file')) {
                $fields = [];
                $file   = file($request->file);
                $chunks = array_chunk($file, 500);
                $batch  = Bus::batch([])->dispatch();

                foreach ($chunks as $key => $chunk) {
                    $payload = array_map('str_getcsv', $chunk);
                    if ($key == 0) {
                        $fields = $payload[0];
                        unset($payload[0]);
                    }
                    $batch->add(new ProductCSVData($fields, $payload));
                }
            }
            return messageResponse('Great! The product has been queued.');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
