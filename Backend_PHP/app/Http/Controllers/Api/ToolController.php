<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use Illuminate\Http\Request;

class ToolController extends Controller
{
    // Create new tool
    public function store(Request $request)
    {
        $request->validate([
            'tool_name' => 'required|string',
            'category' => 'required|string',
            'rental_price' => 'required|numeric',
            'available_from' => 'required|date',
            'available_to' => 'required|date|after_or_equal:available_from',
            'location' => 'required|string',
            'pickup_available' => 'nullable|boolean',
        ]);

        $tool = Tool::create([
            'tool_name' => $request->tool_name,
            'category' => $request->category,
            'rental_price' => $request->rental_price,
            'available_from' => $request->available_from,
            'available_to' => $request->available_to,
            'location' => $request->location,
            'pickup_available' => $request->pickup_available ?? false,
        ]);

        return response()->json([
            'message' => 'Tool created successfully',
            'tool' => $tool
        ], 201);
    }

    // Get all tools
    public function index()
    {
        return response()->json(Tool::all());
    }
}

