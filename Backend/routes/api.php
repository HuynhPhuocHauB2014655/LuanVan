<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BanController;
use App\Http\Controllers\HSController;
use App\Http\Controllers\NienKhoaController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/ban/create',[BanController::class,'store']);
Route::put('/ban/update/{MaBan}',[BanController::class,'update']);
Route::get('/ban/show/{MaBan}',[BanController::class,'show']);
Route::delete('/ban/delete/{MaBan}',[BanController::class,'destroy']);

Route::post('/hs/create',[HSController::class,'store']);
Route::get('/hs/index',[HSController::class,'index']);
Route::get('/hs/show/{mshs}',[HSController::class,'show']);
Route::put('/hs/update/{mshs}',[HSController::class,'update']);
Route::delete('/hs/delete/{mshs}',[HSController::class,'destroy']);

Route::post('/nk/create',[NienKhoaController::class,'store']);
Route::get('/nk/index',[NienKhoaController::class,'index']);
Route::get('/nk/show/{mshs}',[NienKhoaController::class,'show']);
Route::put('/nk/update/{mshs}',[NienKhoaController::class,'update']);
Route::delete('/nk/delete/{mshs}',[NienKhoaController::class,'destroy']);