<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BanController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/create',[BanController::class,'store']);
Route::put('/update/{id}',[BanController::class,'update']);
Route::delete('/delete/{id}',[BanController::class,'destroy']);