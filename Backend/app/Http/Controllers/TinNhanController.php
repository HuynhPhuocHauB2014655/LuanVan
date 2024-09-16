<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TinNhan;
use App\Models\NhomTinNhan;
use App\Models\HocSinh;
use App\Models\GiaoVien;
use App\Models\PhuHuynh;
use App\Models\ThanhVienNhom;
use App\Models\Lop;
use App\Events\sendMessage;
use Illuminate\Http\Response;

class TinNhanController extends Controller
{
    public function index($NguoiNhan)
    {
        $tinNhan = TinNhan::where("NguoiNhan",$NguoiNhan)->get();
        return response()->json($tinNhan,200);
    }
    public function getGroup($id){
        $nhom = NhomTinNhan::with(['thanhVien'])->whereHas('thanhVien', function ($query) use ($id) {
            $query->where('MaTV', $id);
        })
        ->get();
        return response()->json($nhom,200);
    }
    public function getTN($id){
        $tinNhan = TinNhan::where('Nhom_id',$id)->get();
        return response()->json($tinNhan,200);
    }
    public function store(Request $rq)
    {
        $TVNhom = ThanhVienNhom::where("Nhom_id","=",$rq->Nhom_id)->where("MaTV","!=",explode('-', $rq->NguoiGui)[0])->get();
        $tinNhan = new TinNhan();
        $tinNhan->NguoiGui = $rq->NguoiGui;
        $tinNhan->NguoiNhan = $rq->Nhom_id;
        $tinNhan->TinNhan = $rq->TinNhan;
        $tinNhan->Nhom_id = $rq->Nhom_id;
        $tinNhan->save();
        foreach($TVNhom as $tv){
            $hs = HocSinh::find($tv->MaTV);
            $gv = GiaoVien::find($tv->MaTV);
            $ph = PhuHuynh::where("TaiKhoan",$tv->MaTV)->first();
            $tinNhan = new TinNhan();
            $tinNhan->NguoiGui = $rq->NguoiGui;
            if($hs){
                $tinNhan->NguoiNhan = $hs->MSHS."-".$hs->HoTen;
            }elseif($gv){
                $tinNhan->NguoiNhan = $gv->MSGV."-".$gv->TenGV;
            }else{
                $hocsinh = HocSinh::find($ph->MSHS);
                $tinNhan->NguoiNhan = $ph->TaiKhoan."- Phụ huynh ".$hocsinh->HoTen;
            }
            $tinNhan->TinNhan = $rq->TinNhan;
            $tinNhan->Nhom_id = $rq->Nhom_id;
            $tinNhan->save();
            event(new sendMessage("Bạn có tin nhắn mới",$tv->MaTV));
        }
        return response()->json("Đã gửi tin nhắn thành công");
    }

    public function makeGroup()
    {
        $lop = Lop::with("hocSinh")->get();
        foreach ($lop as $lop){
            $newN = NhomTinNhan::create([
                "TenNhom" => $lop->TenLop."_".$lop->MaNK,
                "MaLop" => $lop->MaLop,
            ]);
            ThanhVienNhom::insert([
                "Nhom_id" => $newN->id,
                "MaTV" => $lop->MSGV
            ]);
            foreach ($lop->hocSinh as $hs)
            {
                $TV = new ThanhVienNhom();
                $TV->MaTV = $hs->MSHS;
                $TV->Nhom_id = $newN->id;
                $TV->save();
            }
        }
    }
    public function getName($id)
    {
        $hocsinh = HocSinh::find($id);
        if($hocsinh){
            return response()->json($hocsinh->HoTen, Response::HTTP_OK);
        }
        $giaovien = GiaoVien::find($id);
        if($giaovien){
            return response()->json($giaovien->TenGV." (Giáo viên)", Response::HTTP_OK);
        }
        $ph = PhuHuynh::where("TaiKhoan",$id)->first();
        if($ph){
            $hs = HocSinh::find($ph->MSHS);
            $ten = "Phụ huynh ". $hs->HoTen;
            return response()->json($ten, Response::HTTP_OK);
        }
    }
}