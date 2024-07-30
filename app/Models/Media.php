<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'company_id', 'branch_id', 'user_id', 'name', 'extension', 'type', 'size', 'path',
    ];
}
