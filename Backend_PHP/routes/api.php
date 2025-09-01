<?php

use App\Http\Controllers\Register;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ToolController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ProductController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::post('/tools', [ToolController::class, 'store']);
// Route::get('/tools', [ToolController::class, 'index']);
Route::get('Students',[StudentController::class,'list']);
Route::get('toolrent',[ToolController::class,'Details']);

// Route::post('rent', [ToolController::class, 'store']);
// Route::post('register', [Register::class, 'store']);

Route::post('products', [ProductController::class, 'store']);