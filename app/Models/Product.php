<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'regular_price',
        'discount_price',
        'discount_properties',
        'is_featured',
        'rating',
        'attachments',
        'status',
    ];

    protected $casts = [
        'attachments'         => 'array',
        'discount_properties' => 'array',
        'is_featured'         => 'boolean',
    ];

    protected static function booted()
    {
        parent::boot();
        static::creating(fn($q) => $q->discount_price = self::discountPriceCalculation($q));
        static::updating(fn($q) => $q->discount_price = self::discountPriceCalculation($q));
    }

    public function setNameAttribute($value): void
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id', 'id');
    }

    private static function discountPriceCalculation($query)
    {
        if ($query['regular_price'] && $query['discount_properties']) {
            $regular_price  = (float) $query['regular_price'];
            $discount_type  = $query['discount_properties']['type'];
            $discount_value = (float) $query['discount_properties']['value'];
            $discount_price = 0;

            if ($discount_value > 0) {
                if ($discount_type === 'percentage') {
                    $discount_price = $regular_price - round((($regular_price * $discount_value) / 100), 2);
                } else if ($discount_type === 'flat') {
                    $discount_price = $regular_price - $discount_value;
                }
                return $discount_price;
            }
            return $discount_price;
        }
    }
}
