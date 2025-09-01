<?php

namespace App\Http\Controllers;
use App\Models\register_item;

use Illuminate\Http\Request;

class Register extends Controller
{
    //
     public function store(Request $request)
    {
        $validated = $request->validate([
            'tool_name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'rental_price' => 'required|numeric|min:0',
            'available_from' => 'required|date',
            'available_to' => 'required|date|after_or_equal:available_from',
            'location' => 'required|string|max:255',
            'pickup_available' => 'required|boolean',
        ]);

        $tool = register_item::create($validated);

        return response()->json([
            'message' => 'Tool created successfully',
            'data' => $tool
        ], 201);
    }
}
