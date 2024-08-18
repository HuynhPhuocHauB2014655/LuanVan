<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Diem;
use App\Models\LoaiDiem;
use App\Models\TBMonCN;
use App\Models\HocSinh;
use App\Models\Lop;
use Illuminate\Http\Response;
use App\Http\Controllers\TaiKhoanController;
class DiemController extends Controller
{
    public function loaiDiem()
    {
        $loaiDiem = LoaiDiem::orderBy('created_at', 'desc')->get();
        return response()->json($loaiDiem, Response::HTTP_OK);
    }
    public function diemCN(Request $request)
    {
        $diem = Diem::with(['hocSinh.lop'])
        ->whereHas('hocSinh.lop', function($query) use ($request) {
            $query->where('lop.MaLop', $request->MaLop);
        })
        ->where('MaHK', $request->MaHK)
        ->where('MaMH', $request->MaMH)
        ->where('MaLoai',"tbcn")
        ->get();
        return response()->json($diem, Response::HTTP_OK);
    }
    public function diemCNLopHoc(Request $request)
    {
        $diem = Diem::with(['hocSinh.lop'])
        ->whereHas('hocSinh.lop', function($query) use ($request) {
            $query->where('lop.MaLop', $request->MaLop);
        })
        ->where('MaNK', $request->MaNK)->orderBy('MSHS')
        ->get();
        return response()->json($diem, Response::HTTP_OK);
    }
    public function diemMH(Request $request)
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
    public function diemLH(Request $request)
    {
        $diem = Diem::with(['hocSinh.lop'])
        ->whereHas('hocSinh.lop', function($query) use ($request) {
            $query->where('lop.MaLop', $request->MaLop);
        })
        ->where('MaHK', $request->MaHK)->orderBy('MSHS')
        ->get();
        return response()->json($diem, Response::HTTP_OK);
    }
    public function AddDiem(Request $request)
    {
        if($request->MaLoai == "tx")
        {
            $txCount = Diem::where('MSHS',$request->MSHS)
                            ->where('MaHK',$request->MaHK)
                            ->where('MaMH',$request->MaMH)
                            ->where('MaLoai',$request->MaLoai)
                            ->count();
            if($txCount >= 4){
                return response()->json("Đã đạt số cột điểm tối đa", 409);
            }
            $diem = Diem::create($request->all());
            return response()->json("Đã thêm điểm thành công", 200);
        }else{
            $exits = Diem::where('MSHS',$request->MSHS)
                            ->where('MaHK',$request->MaHK)
                            ->where('MaMH',$request->MaMH)
                            ->where('MaLoai',$request->MaLoai)->first();
            if($exits == null){
                $diem = Diem::create($request->all());
                return response()->json("Đã thêm điểm thành công", 200);
            }else{
                return response()->json("Đã đạt số cột điểm tối đa", 409);
            }
        }
    }
    public function updateDiem(Request $request)
    {
        $diem = Diem::find($request->id);
        if($diem){
            $diem->update($request->all());
            return response()->json("Đã cập nhật điểm thành công", 200);
        }
        else{
            return response()->json("Điểm không tồn tại", 404);
        }
    }
    public function deleteDiem($id)
    {
        $diem = Diem::find($id);
        if($diem){
            $diem->delete();
            return response()->json("Đã cập nhật điểm thành công", 200);
        }
        else{
            return response()->json("Điểm không tồn tại", 404);
        }
    }
    public function TongKetDiemHK(Request $request)
    {
        $lop = Lop::where("MaLop",$request->MaLop)->first();
        $hocsinh = $lop->hocSinh;
        $tongTx = 0;
        foreach ($hocsinh as $hs) {
            $diemTX = Diem::where('MSHS', $hs->MSHS)
                ->where('MaHK', $request->MaHK)
                ->where('MaMH', $request->MaMH)
                ->where('MaLoai', 'tx')
                ->get();
            $diemGK = Diem::where('MSHS', $hs->MSHS)
                ->where('MaHK', $request->MaHK)
                ->where('MaMH', $request->MaMH)
                ->where('MaLoai', 'gk')
                ->first();
    
            $diemCK = Diem::where('MSHS', $hs->MSHS)
                ->where('MaHK', $request->MaHK)
                ->where('MaMH', $request->MaMH)
                ->where('MaLoai', 'ck')
                ->first();
    
            if ($diemTX->isNotEmpty()) {
                $tongTx = $diemTX->sum('Diem');
                $tbhk = round(($tongTx + ($diemGK->Diem * 2) + ($diemCK->Diem * 3)) / ($diemTX->count() + 5),1);
            } else {
                $tbhk = 0;
            }
            $checkDiemHK = Diem::where('MSHS',$hs->MSHS)
            ->where('MaHK',$request->MaHK)
            ->where('MaMH',$request->MaMH)
            ->where('MaLoai',substr($request->MaHK, 0, 1) == "1" ? "tbhk1" : "tbhk2")->first();
            if($checkDiemHK){
                $checkDiemHK->Diem = $tbhk;
                $checkDiemHK->save();
            }else{
                $diemHk = new Diem();
                $diemHk->MSHS = $hs->MSHS;
                $diemHk->MaHK = $request->MaHK;
                $diemHk->MaMH = $request->MaMH;
                $diemHk->MaLoai = substr($request->MaHK, 0, 1) == "1" ? "tbhk1" : "tbhk2";
                $diemHk->Diem = $tbhk;
                $diemHk->save();
            }
        }
        return response()->json("Đã tính điểm thành công!",200);
    }
    public function TongKetDiemCN(Request $request){
        $lop = Lop::where("MaLop",$request->MaLop)->first();
        $hocsinh = $lop->hocSinh;
        foreach ($hocsinh as $hs){
            $tbhk1 = Diem::where('MSHS', $hs->MSHS)
            ->where('MaHK','1'. $request->MaNK)
            ->where('MaMH', $request->MaMH)
            ->where('MaLoai', 'tbhk1')
            ->first();
            $tbhk2 = Diem::where('MSHS', $hs->MSHS)
            ->where('MaHK','2' . $request->MaNK)
            ->where('MaMH', $request->MaMH)
            ->where('MaLoai', 'tbhk2')
            ->first();
            $tbcn = round(($tbhk1->Diem + $tbhk2->Diem*2)/3,1);
            $checkCN = Diem::where('MSHS',$hs->MSHS)
            ->where('MaHK','2' . $request->MaNK)
            ->where('MaMH',$request->MaMH)
            ->where('MaLoai','tbcn')->first();
            if($checkCN){
                $checkCN->Diem = $tbcn;
                $checkCN->save();
            }else
            {
                $diemCN = new Diem();
                $diemCN->MSHS = $hs->MSHS;
                $diemCN->MaHK = '2' . $request->MaNK;
                $diemCN->MaMH = $request->MaMH;
                $diemCN->Diem = $tbcn;
                $diemCN->MaLoai = "tbcn";
                $diemCN->save();
            }
        }
        return response()->json("Đã cập nhật điểm thành công",200);
    } 
}