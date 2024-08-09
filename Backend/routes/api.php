<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BanController;
use App\Http\Controllers\HSController;
use App\Http\Controllers\NienKhoaController;
use App\Http\Controllers\HocKiController;
use App\Http\Controllers\MonHocController;
use App\Http\Controllers\GiaoVienController;
use App\Http\Controllers\LopController;
use App\Http\Controllers\TKBController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ban route
Route::post('/ban/create',[BanController::class,'store']);
Route::put('/ban/update/{MaBan}',[BanController::class,'update']);
Route::get('/ban/show/{MaBan}',[BanController::class,'show']);
Route::delete('/ban/delete/{MaBan}',[BanController::class,'destroy']);

//hoc sinh route
Route::post('/hs/create',[HSController::class,'store']);
Route::get('/hs/index',[HSController::class,'index']);
Route::get('/hs/show/{mshs}',[HSController::class,'show']);
Route::put('/hs/update/{mshs}',[HSController::class,'update']);
Route::delete('/hs/delete/{mshs}',[HSController::class,'destroy']);
Route::get('/hs/search/{name}',[HSController::class,'findByName']);
Route::get('/hs/last',[HSController::class,'lastStudent']);
Route::get('/hs/new',[HSController::class,'newStudents']);

//nien khoa route
Route::post('/nk/create',[NienKhoaController::class,'store']);
Route::get('/nk/index',[NienKhoaController::class,'index']);
Route::get('/nk/show/{maNK}',[NienKhoaController::class,'show']);
Route::put('/nk/update/{maNK}',[NienKhoaController::class,'update']);
Route::delete('/nk/delete/{maNK}',[NienKhoaController::class,'destroy']);
Route::get('/nk/setNow',[NienKhoaController::class,'setNienKhoaHienTai']);
Route::get('/nk/getNow',[NienKhoaController::class,'getNienKhoaHienTai']);

//hoc ki route
Route::post('/hk/create',[HocKiController::class,'store']);
Route::get('/hk/index',[HocKiController::class,'index']);
Route::get('/hk/show/{maHK}',[HocKiController::class,'show']);
Route::put('/hk/update/{maHK}',[HocKiController::class,'update']);
Route::delete('/hk/delete/{maHK}',[HocKiController::class,'destroy']);

//mon hoc route
Route::post('/mh/create',[MonHocController::class,'store']);
Route::get('/mh/index',[MonHocController::class,'index']);
Route::get('/mh/tn',[MonHocController::class,'monHocTN']);
Route::get('/mh/xh',[MonHocController::class,'monHocXH']);
Route::get('/mh/show/{maMH}',[MonHocController::class,'show']);
Route::put('/mh/update/{maMH}',[MonHocController::class,'update']);
Route::delete('/mh/delete/{maMH}',[MonHocController::class,'destroy']);


//giao vien route
Route::post('/gv/create',[GiaoVienController::class,'store']);
Route::get('/gv/index',[GiaoVienController::class,'index']);
Route::get('/gv/show/{MSGV}',[GiaoVienController::class,'show']);
Route::put('/gv/update/{MSGV}',[GiaoVienController::class,'update']);
Route::delete('/gv/delete/{MSGV}',[GiaoVienController::class,'destroy']);
Route::get('/gv/last',[GiaoVienController::class,'lastTeacher']);

//lop route
Route::post('/lop/create',[LopController::class,'store']);
Route::get('/lop/index',[LopController::class,'index']);
Route::get('/lop/list/withoutTkb',[LopController::class,'indexWithoutTKB']);
Route::get('/lop/list',[LopController::class,'indexWithStudent']);
Route::get('/lop/list/{MaNK}',[LopController::class,'indexWithStudentNow']);
Route::get('/lop/show/{MaLop}',[LopController::class,'show']);
Route::put('/lop/update/{MaLop}',[LopController::class,'update']);
Route::delete('/lop/delete/{MaLop}',[LopController::class,'destroy']);
Route::post('/lop/add',[LopController::class,'assignStudentsToClass']);

//tkb route
Route::post('/tkb/create/{nk}',[TKBController::class,'create']);
Route::post('/tkb/createPC',[TKBController::class,'createPhanCong']);