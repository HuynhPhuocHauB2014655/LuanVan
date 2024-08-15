<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Diem;
use App\Models\LoaiDiem;
use Illuminate\Http\Response;
use App\Http\Controllers\TaiKhoanController;
class DiemController extends Controller
{
    public function loaiDiem()
    {
        $loaiDiem = LoaiDiem::orderBy('MaLoai', 'desc')->get();
        return response()->json($loaiDiem, Response::HTTP_OK);
    }
    public function diem(Request $request)
    {
        $diem = Diem::with(['hocSinh.lop'])
        ->whereHas('hocSinh.lop', function($query) use ($request) {
            $query->where('lop.MaLop', $request->MaLop);
        })
        ->where('MaHK', $request->MaHK)
        ->where('MaMH', $request->MaMH)
        ->get();
        return response()->json($diem, Response::HTTP_OK);
    }
}