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
        $nhom = NhomTinNhan::with(['thanhVien', 'tinNhan' => function ($query) {
            $query->latest('created_at')
                  ->limit(1);
        }])
        ->whereHas('thanhVien', function ($query) use ($id) {
            $query->where('MaTV', $id);
        })
        ->select('NhomTinNhan.*')
        ->orderBy(
            \DB::raw('(SELECT MAX(created_at) FROM TinNhan WHERE TinNhan.Nhom_id = NhomTinNhan.id)'),
            'desc'
        )
        ->get();
        return response()->json($nhom,200);
    }
    public function getAllGroup(){
        $nhom = NhomTinNhan::with(['thanhVien', 'tinNhan'])
        ->select('NhomTinNhan.*')
        ->orderBy(
            \DB::raw('(SELECT MAX(created_at) FROM TinNhan WHERE TinNhan.Nhom_id = NhomTinNhan.id)'),
            'desc'
        )
        ->get();
        return response()->json($nhom,200);
    }
    public function getAllTN($id){
        $tinNhan = TinNhan::where('Nhom_id',$id)->where("NguoiNhan",$id)->get();
        return response()->json($tinNhan,200);
    }
    public function getTN($id){
        $tinNhan = TinNhan::where('Nhom_id',$id)->get();
        return response()->json($tinNhan,200);
    }
    public function getNew(Request $rq){
        $tinNhan = TinNhan::where('Nhom_id',$id)->get();
        return response()->json($tinNhan,200);
    }
    public function countNotSeen($id){
        $count = NhomTinNhan::whereHas('thanhVien', function ($query) use ($id) {
            $query->where('MaTV', $id);
        })
        ->withCount(['tinNhan as unread_count' => function ($query) use ($id) {
            $query->where('TrangThai', 0)
                  ->where('NguoiNhan', "like", $id . "%");
        }])
        ->get();
        return response()->json($count,200);
    }
    public function setSeen(Request $rq){
        $tn = TinNhan::where('NguoiNhan',$rq->NguoiNhan)->where("Nhom_id",$rq->Nhom_id)->where('TrangThai',0)->get();
        foreach($tn as $tn){
            $tn->TrangThai = 1;
            $tn->save();
        }
        return response()->json("OK",200);
    }
    public function store(Request $rq)
    {
        $TVNhom = ThanhVienNhom::where("Nhom_id","=",$rq->Nhom_id)->where("MaTV","!=",explode('-', $rq->NguoiGui)[0])->get();
        $tn = new TinNhan();
        $tn->NguoiGui = $rq->NguoiGui;
        $tn->NguoiNhan = $rq->Nhom_id;
        $tn->TinNhan = $rq->TinNhan;
        $tn->Nhom_id = $rq->Nhom_id;
        $tn->save();
        foreach($TVNhom as $tv){
            $tinNhan = new TinNhan();
            $tinNhan->NguoiGui = $rq->NguoiGui;
            if(substr($tv->MaTV,0,2) == 'GV'){
                $gv = GiaoVien::find($tv->MaTV);
                $tinNhan->NguoiNhan = $gv->MSGV."-".$gv->TenGV;
            }elseif(substr($tv->MaTV,0,2) == 'PH'){
                $ph = PhuHuynh::where("TaiKhoan",$tv->MaTV)->first();
                $hocsinh = HocSinh::find($ph->MSHS);
                $tinNhan->NguoiNhan = $ph->TaiKhoan."-Phụ huynh ".$hocsinh->HoTen;
            }else{
                $hs = HocSinh::find($tv->MaTV);
                $tinNhan->NguoiNhan = $hs->MSHS."-".$hs->HoTen;
            }
            $tinNhan->TinNhan = $rq->TinNhan;
            $tinNhan->Nhom_id = $rq->Nhom_id;
            $tinNhan->save();
            event(new sendMessage($tinNhan,$tv->MaTV));
        }
        return response()->json($tn);
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
