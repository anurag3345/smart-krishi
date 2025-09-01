<?php

namespace App\Http\Controllers;
use App\Models\Product;

use Illuminate\Http\Request;

class ProductController extends Controller
{
     public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name'   => 'required|string|max:255',
            'category'       => 'required|string|max:255',
            'quantity'       => 'required|integer|min:1',
            'price_per_kg'   => 'required|numeric|min:0',
            'location'       => 'required|string|max:255',
            'home_delivery'  => 'required|boolean',
            'self_pickup'    => 'required|boolean',
            'product_image'  => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description'    => 'nullable|string',
        ]);

        if ($request->hasFile('product_image')) {
            $validated['product_image'] = $request->file('product_image')->store('products', 'public');
        }

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product listed successfully',
            'data' => $product
        ], 201);
    }
}
