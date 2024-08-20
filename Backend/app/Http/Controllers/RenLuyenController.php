<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HocSinh;
use App\Models\Lop;
use App\Models\HocLop;
use App\Models\RenLuyen;
use Illuminate\Http\Response;
use App\Http\Controllers\TaiKhoanController;
class RenLuyenController extends Controller
{
    public function index()
    {
        $rl = RenLuyen::all();
        return response()->json($rl,200);
    }
    public function addRL(Request $rq){
        $rl = HocLop::where('MaLop',$rq->MaLop)->where('MaNK',$rq->MaNK)->where('MSHS',$rq->MSHS)->first();
        if($rl != null){
            if($rq->LoaiRL == 1){
                $rl->MaRL_HK1 = $rq->RenLuyen;
            }else{
                $rl->MaRL_HK2 = $rq->RenLuyen;
            }
            $rl->save();
            return response()->json("Đã cập nhật đánh giá rèn luyện thành công", 200);
        }else{
            return response()->json("Không tìm thấy học sinh trong lớp", 404);
        }
    }
}