<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['user_id', 'cart_ids', 'payment_method', 'payment_status', 'delivery_status', 'amount'];

    protected $casts = ['cart_ids' => 'array'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
