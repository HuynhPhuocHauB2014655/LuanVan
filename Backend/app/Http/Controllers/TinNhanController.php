<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TinNhan;
use App\Models\NhomTinNhan;
use App\Models\ThanhVienNhom;
use App\Models\Lop;
use App\Events\sendMessage;

class TinNhanController extends Controller
{
    public function index($NguoiNhan)
    {
        $tinNhan = TinNhan::where("NguoiNhan",$NguoiNhan)->get();
        return response()->json($tinNhan,200);
    }
    public function store(Request $rq)
    {
        $tn = TinNhan::create($rq->all());
        event(new sendMessage("Bạn có tin nhắn mới",$rq->NguoiNhan));
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
}
