<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class register_item extends Model
{
    use HasFactory;
    protected $fillable = [
        'tool_name',
        'category',
        'rental_price',
        'available_from',
        'available_to',
        'location',
        'pickup_available',
    ];
}
