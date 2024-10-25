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
use App\Http\Controllers\TaiKhoanController;
use App\Http\Controllers\DiemController;
use App\Http\Controllers\RenLuyenController;
use App\Http\Controllers\KhenThuongController;
use App\Http\Controllers\TBController;
use App\Http\Controllers\TinNhanController;
use App\Http\Controllers\GroupController;
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
Route::get('/hs/all',[HSController::class,'allHS']);
Route::get('/hs/show/{mshs}',[HSController::class,'show']);
Route::put('/hs/update/{mshs}',[HSController::class,'update']);
Route::delete('/hs/delete/{mshs}',[HSController::class,'destroy']);
Route::get('/hs/search/{name}',[HSController::class,'findByName']);
Route::get('/hs/last/{MaNK}',[HSController::class,'lastStudent']);
Route::get('/hs/new',[HSController::class,'newStudents']);
Route::get('/hs/{MaNK}',[HSController::class,'oLaiLop']);
Route::post('/hs/check',[HSController::class,'checkAdd']);
Route::post('/hs/tkb',[HSController::class,'getTKB']);
Route::post('/hs/ph',[HSController::class,'addPH']);
Route::get('/hs/ph/{mshs}',[HSController::class,'showPH']);
Route::put('/hs/ph',[HSController::class,'updatePH']);
Route::post('/hs/ph/login',[HSController::class,'loginPH']);


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
Route::get('/gv/all',[GiaoVienController::class,'allGV']);
Route::get('/gv/show/{MSGV}',[GiaoVienController::class,'show']);
Route::post('/gv/show/cn',[GiaoVienController::class,'showChuNhiem']);
Route::get('/gv/search/{name}',[GiaoVienController::class,'findByName']);
Route::put('/gv/update/{MSGV}',[GiaoVienController::class,'update']);
Route::delete('/gv/delete/{MSGV}',[GiaoVienController::class,'destroy']);
Route::get('/gv/last',[GiaoVienController::class,'lastTeacher']);
Route::post('/gv/teaching',[GiaoVienController::class,'showTeaching']);
Route::post('/gv/tkb',[GiaoVienController::class,'getTKB']);
Route::post('/gv/daybu',[GiaoVienController::class,'getDayBu']);
Route::post('/gv/daybu/ngay',[GiaoVienController::class,'getDayBuNgay']);
Route::post('/gv/class',[GiaoVienController::class,'classes']);

//lop route
Route::post('/lop/create',[LopController::class,'store']);
Route::get('/lop/index',[LopController::class,'index']);
Route::get('/lop/index/tkb/{nk}',[LopController::class,'indexWithTKB']);
Route::get('/lop/list/withoutTkb',[LopController::class,'indexWithoutTKB']);
Route::get('/lop/list',[LopController::class,'indexWithStudent']);
Route::get('/lop/list/{MaNK}',[LopController::class,'indexWithStudentNow']);
Route::get('/lop/show/{MaLop}',[LopController::class,'show']);
Route::put('/lop/update/{MaLop}',[LopController::class,'update']);
Route::delete('/lop/delete/{MaLop}',[LopController::class,'destroy']);
Route::post('/lop/add',[LopController::class,'assignStudentsToClass']);
Route::get('/lop/tn/{MaNK}',[LopController::class,'indexTN']);
Route::get('/lop/xh/{MaNK}',[LopController::class,'indexXH']);
Route::post('/lop/addHS',[LopController::class,'addToClass']);
Route::post('/lop/change',[LopController::class,'changeClass']);
Route::get('/lop/duyetkq/{MaLop}',[LopController::class,'DuyetKQHT']);
Route::post('/lop/daybu',[LopController::class,'getDayBu']);

//tkb route
Route::post('/tkb/create/{nk}',[TKBController::class,'create']);
Route::put('/tkb/update',[TKBController::class,'update']);
Route::post('/tkb/createPC',[TKBController::class,'createPhanCong']);
Route::get('/tkb/index/{nk}',[TKBController::class,'index']);
Route::get('/tkb/index/class/{MaLop}',[TKBController::class,'indexClass']);
Route::get('/tkb/date',[TKBController::class,'indexDate']);
Route::post('/tkb/date',[TKBController::class,'getByDay']);
Route::post('/tkb/gv/week',[TKBController::class,'getByWeek']);
Route::post('/tkb/get',[TKBController::class,'getTietHoc']);
Route::post('/tkb/week',[TKBController::class,'getTHWeek']);
Route::post('/tkb/createTH',[TKBController::class,'createTietHoc']);
Route::put('/tkb/updateTH',[TKBController::class,'updateTietHoc']);
Route::delete('/tkb/deleteTH/{id}',[TKBController::class,'deleteTietHoc']);

//tai khoan route
Route::get('/tk/index/hs',[TaiKhoanController::class,'indexHS']);
Route::get('/tk/index/gv',[TaiKhoanController::class,'indexGV']);
Route::post('/tk/create/hs',[TaiKhoanController::class,'createHS']);
Route::post('/tk/create/gv',[TaiKhoanController::class,'createGV']);
Route::put('/tk/update/hs',[TaiKhoanController::class,'updateHS']);
Route::put('/tk/update/gv',[TaiKhoanController::class,'updateGV']);
Route::delete('/tk/delete/hs/{id}',[TaiKhoanController::class,'deleteHS']);
Route::delete('/tk/delete/gv/{id}',[TaiKhoanController::class,'deleteGV']);
Route::post('/tk/update/admin',[TaiKhoanController::class,'changeAdmin']);
Route::post('/tk/admin/login',[TaiKhoanController::class,'adminLogin']);
Route::get('/tk/admin/check/{id}',[TaiKhoanController::class,'checkTime']);
Route::get('/tk/hs/{MSHS}',[TaiKhoanController::class,'findHocSinh']);
Route::get('/tk/gv/{MSGV}',[TaiKhoanController::class,'findGiaoVien']);
Route::post('/tk/gv',[TaiKhoanController::class,'changePassGVAdmin']);
Route::post('/tk/hs',[TaiKhoanController::class,'changePassHSAdmin']);
Route::put('/tk/update/gv',[TaiKhoanController::class,'changePassGV']);
Route::put('/tk/update/hs',[TaiKhoanController::class,'changePassHS']);
Route::post('/tk/hs/login',[TaiKhoanController::class,'HSLogin']);
Route::post('/tk/gv/login',[TaiKhoanController::class,'GVLogin']);
Route::get('/test',[TaiKhoanController::class,'test']);

//Diem route
Route::get('/diem/loaidiem',[DiemController::class,'loaiDiem']);
Route::post('/diem/get',[DiemController::class,'diemMH']);
Route::post('/diem/cn',[DiemController::class,'diemLH']);
Route::post('/diem/hs',[DiemController::class,'diemHS']);
Route::post('/diem/getCN',[DiemController::class,'diemCN']);
Route::post('/diem/cn/getCN',[DiemController::class,'diemCNLopHoc']);
Route::post('/diem/tb',[DiemController::class,'DiemTB']);
Route::post('/diem/tb/hs',[DiemController::class,'DiemTB_HS']);
Route::post('/diem/add',[DiemController::class,'AddDiem']);
Route::post('/diem/update',[DiemController::class,'updateDiem']);
Route::delete('/diem/delete/{id}',[DiemController::class,'deleteDiem']);
Route::post('/diem/mon/hocky',[DiemController::class,'TongKetMonHK']);
Route::post('/diem/mon/canam',[DiemController::class,'TongKetMonCN']);
Route::post('/diem/tk/hocki',[DiemController::class,'TongKetHocKi']);
Route::post('/diem/tk/namhoc',[DiemController::class,'TongKetNamHoc']);
Route::post('/diem/mon/rlh',[DiemController::class,'monRLH']);
Route::post('/diem/rlh',[DiemController::class,'diemRLH']);
Route::get('/diem',[DiemController::class,'NhapDiem']);
Route::get('/tongKet/truong/{MaNK}',[DiemController::class,'TongKetTruong']);
Route::get('/tongKet/khoi/{MaNK}',[DiemController::class,'TongKetKhoi']);
Route::get('/tongKet/lop/{MaNK}',[DiemController::class,'TongKetLop']);

//ren luyen route
Route::get('/rl/index',[RenLuyenController::class,'index']);
Route::post('/rl/add',[RenLuyenController::class,'addRL']);
Route::post('/rl/update',[RenLuyenController::class,'updateRL']);
Route::get('/rl/{MaLop}',[RenLuyenController::class,'xetRLCaNam']);
Route::get('/tk/{MaLop}',[RenLuyenController::class,'xetLenLop']);

//Khen thuong route
Route::get('/kt/index',[KhenThuongController::class,'index']);
Route::post('/kt/add',[KhenThuongController::class,'create']);
Route::put('/kt/update',[KhenThuongController::class,'update']);
Route::get('/kt/get/{MaLop}',[KhenThuongController::class,'getLop']);
Route::post('/kt/get',[KhenThuongController::class,'getHS']);


// Thong bao route
Route::get('/tb/index',[TBController::class,'index']);
Route::get('/tb/gv/{MSGV}',[TBController::class,'getGV']);
Route::get('/tb/gv/send/{MSGV}',[TBController::class,'getSendedGV']);
Route::get('/tb/hs/{MSHS}',[TBController::class,'getHS']);
Route::post('/tb/add',[TBController::class,'create']);
Route::put('/tb/update',[TBController::class,'update']);
Route::delete('/tb/delete',[TBController::class,'delete']);

//Tin nhan route
Route::get('/tn/index/{NguoiNhan}',[TinNhanController::class,'index']);
Route::get('/tn/name/{id}',[TinNhanController::class,'getName']);
Route::get('/tn/group/{id}',[TinNhanController::class,'getTN']);
Route::get('/tn/all/{id}',[TinNhanController::class,'getAllTN']);
Route::get('/tn/count/{id}',[TinNhanController::class,'countNotSeen']);
Route::put('/tn',[TinNhanController::class,'setSeen']);
Route::get('/tn/{id}',[TinNhanController::class,'getGroup']);
Route::get('/tn',[TinNhanController::class,'getAllGroup']);
Route::post('/tn/add',[TinNhanController::class,'store']);
Route::post('/tn/create',[TinNhanController::class,'create']);
Route::post('/tn/member',[TinNhanController::class,'addMember']);
Route::post('/tn/test',[TinNhanController::class,'addGroup']);


//Group route
Route::get('/gr/index/{NguoiNhan}',[GroupController::class,'index']);
Route::get('/gr/name/{id}',[GroupController::class,'getName']);
Route::get('/gr/group/{id}',[GroupController::class,'getTN']);
Route::get('/gr/all/{id}',[GroupController::class,'getAllTN']);
Route::get('/gr/count/{id}',[GroupController::class,'countNotSeen']);
Route::put('/gr',[GroupController::class,'setSeen']);
Route::get('/gr/{id}',[GroupController::class,'getGroup']);
Route::get('/gr',[GroupController::class,'getAllGroup']);
Route::post('/gr/add',[GroupController::class,'store']);
Route::post('/gr/create',[GroupController::class,'create']);
Route::post('/gr/member',[GroupController::class,'addMember']);
Route::post('/gr/test',[GroupController::class,'addGroup']);