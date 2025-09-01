<?php

namespace App\Http\Controllers;
use App\Models\ToolRegister;

use Illuminate\Http\Request;

class ToolController extends Controller
{
    //
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'price'    => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
        ]);

        // Save to database using ToolRegister model
        $tool = ToolRegister::create($validated);

        // Return response
        return response()->json([
            'message' => 'Tool rental added successfully',
            'data'    => $tool
        ], 201);
    }
}
