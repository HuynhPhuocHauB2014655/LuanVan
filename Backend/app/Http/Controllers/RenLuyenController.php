<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HocSinh;
use App\Models\Lop;
use App\Models\HocLop;
use App\Models\RenLuyen;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\TaiKhoanController;
class RenLuyenController extends Controller
{
    public function index()
    {
        $rl = RenLuyen::all();
        return response()->json($rl,200);
    }
    public function addRL(Request $rq){
        $hocsinh = HocSinh::find($rq->MSHS);
        if(!$hocsinh){
            return response()->json('Học sinh không tồn tại',404);
        };
        $exits = HocLop::where("MSHS",$rq->MSHS)->where("MaLop",$rq->MaLop)->first();
        if(!$exits){
            return response()->json('Học sinh không thuộc lớp này',401);
        }
        if($exits->MaTT != 2){
            return response()->json('Học sinh không rèn luyện hè',401);
        }
        $rl = HocLop::where('MaLop',$rq->MaLop)->where('MaNK',$rq->MaNK)->where('MSHS',$rq->MSHS)->first();
        if($rl != null){
            if($rq->LoaiRL == 1){
                if($rl->MaRL_HK1 == 0)
                {
                    $rl->MaRL_HK1 = $rq->RenLuyen;
                }else{
                    return response()->json("Học sinh đã có điểm rèn luyện trong kì này", 401);
                }
            }elseif($rq->LoaiRL == 2){
                if($rl->MaRL_HK2 == 0)
                {
                    $rl->MaRL_HK2 = $rq->RenLuyen;
                }else{
                    return response()->json("Học sinh đã có điểm rèn luyện trong kì này", 401);
                }
            }
            else{
                if($rl->MaRLL == 0)
                {
                    $rl->MaRLL = $rq->RenLuyen;
                }else{
                    return response()->json("Học sinh đã có điểm rèn luyện trong kì này", 401);
                }
            }
            $rl->save();
            return response()->json("Đã cập nhật đánh giá rèn luyện thành công", 200);
        }else{
            return response()->json("Không tìm thấy học sinh trong lớp", 404);
        }
    }
    public function updateRL(Request $rq){
        $rl = HocLop::where('MaLop',$rq->MaLop)->where('MaNK',$rq->MaNK)->where('MSHS',$rq->MSHS)->first();
        if($rl != null){
            if($rq->LoaiRL == 1){
                $rl->MaRL_HK1 = $rq->RenLuyen;
            }elseif($rq->LoaiRL == 2){
                $rl->MaRL_HK2 = $rq->RenLuyen;
            }else{
                $rl->MaRLL = $rq->RenLuyen;
            }
            $rl->save();
            return response()->json("Đã cập nhật đánh giá rèn luyện thành công", 200);
        }else{
            return response()->json("Không tìm thấy học sinh trong lớp", 404);
        }
    }
    public function xetRLCaNam($MaLop){
        $string = substr($MaLop,1,2);
        $MaNK = $string. "-". $string + 1;
        $rl = HocLop::where('MaLop',$MaLop)->where('MaNK',$MaNK)->get();
        foreach ($rl as $rl)
        {
            if($rl->MaRL_HK2 == 4 && $rl->MaRL_HK1 >= 3){
                $rl->MaRL = 4;
            }elseif(($rl->MaRL_HK2 == 3 && $rl->MaRL_HK1 >= 2) || ($rl->MaRL_HK2 == 2 && $rl->MaRL_HK1 == 4) || ($rl->MaRL_HK2 == 4 && ($rl->MaRL_HK1 == 2 || $rl->MaRL_HK1 == 1))){
                $rl->MaRL = 3;
            }elseif(($rl->MaRL_HK2 == 2 && $rl->MaRL_HK1 <= 3) || ($rl->MaRL_HK2 == 3 && $rl->MaRL_HK1 == 1)){
                $rl->MaRL = 2;
            }else{
                $rl->MaRL = 1;
            }
            $rl->save();
        }
        return response()->json("Đã cập nhật đánh giá rèn luyện thành công!",200);
    }
    public function xetLenLop($MaLop){
        $string = substr($MaLop,1,2);
        $MaNK = $string. "-". intval($string) + 1; 
        $kqht = HocLop::where('MaLop',$MaLop)->where('MaNK',$MaNK)->get(); //Kết quả học tập và rèn luyện
        DB::beginTransaction();
        $break = false;
        foreach ($kqht as $item){
            if($item->MaTT == 2){
                if($item->MaHLL == 1 || $item->MaRLL ==  1){
                    $item->MaRL = 1;
                }elseif(
                    (($item->MaHL == 1 && $item->MaHLL >= 2) && ($item->MaRL == 1 && $item->MaRLL >= 2)) ||
                    (($item->MaHL == 1 && $item->MaHLL >= 2) && ($item->MaRL >= 2)) ||
                    (($item->MaRL == 1 && $item->MaRLL >= 2) && ($item->MaHL >= 2))
                ){
                    $item->MaTT = (substr($MaLop, 5, 2) == 12) ? 4 : 3;
                }else{
                    $break = true;
                    break;
                }
            }elseif($item->MaHL != 1 && $item->MaRL !=  1){
                if($item->MaHL == 1 || $item->MaRL ==  1){
                    $item->MaTT = 2;
                }
                else {
                    $item->MaTT = (substr($MaLop, 5, 2) == 12) ? 4 : 3;
                }
            }
            $item->save();
        }
        if($break){
            DB::rollBack();
            return response()->json("Có học sinh chưa hoàn thành rèn luyện hè!",400);
        }
        DB::commit();
        return response()->json("Đã xét lên lớp thành công",200);
    }
    public function DSRenLuyenHe($MaLop){
        $rlh = HocLop::where('MaLop',$MaLop)->where("MaTT","2")->get();
    }
}