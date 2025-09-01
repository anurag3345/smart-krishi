<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
      protected $fillable = [
        'product_name',
        'category',
        'quantity',
        'price_per_kg',
        'location',
        'home_delivery',
        'self_pickup',
        'product_image',
        'description',
    ];
}
