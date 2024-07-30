<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Fetch Summary as Report
     */
    public function summary()
    {
        try {
            return entityResponse([
                'total_product' => Product::count(),
                'total_category' => ProductCategory::count(),
                'total_order' => Order::count(),
                'total_customer' => User::where('type', 'customer')->count(),
                'total_payment' => Order::sum('amount'),
                'payment_summary_by_method' => Order::select('payment_method as name', DB::raw('SUM(amount) as amount'))->groupBy('payment_method')->get(),
            ]);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }

    }
}
