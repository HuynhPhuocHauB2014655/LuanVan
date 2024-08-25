<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Diem;
use App\Models\LoaiDiem;
use App\Models\HocSinh;
use App\Models\Lop;
use App\Models\HocLop;
use App\Models\MonHoc;
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
        ->whereIn('MaLoai',["tbcn","rlh"])
        ->get();
        return response()->json($diem, Response::HTTP_OK);
    }
    public function diemCNLopHoc(Request $request)
    {
        $diem = Diem::with(['hocSinh.lop'])
        ->whereHas('hocSinh.lop', function($query) use ($request) {
            $query->where('lop.MaLop', $request->MaLop);
        })
        ->where('MaHK', $request->MaHK)->whereIn('MaLoai',["tbcn","rlh"])->orderBy('MSHS')
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
        $diem = Diem::with(['hocSinh.lop','monHoc'])
        ->whereHas('hocSinh.lop', function($query) use ($request) {
            $query->where('lop.MaLop', $request->MaLop);
        })
        ->where('MaHK', $request->MaHK)->orderBy('MSHS')
        ->get();
        return response()->json($diem, Response::HTTP_OK);
    }
    public function diemHS(Request $request)
    {
        $diem = Diem::with(['hocSinh','monHoc','hocKi.nienKhoa'])
        ->where('MaHK', $request->MaHK)->where('MSHS',$request->MSHS)
        ->get();
        return response()->json($diem, Response::HTTP_OK);
    }
    public function MonRLH(Request $request)
    {
        $diem1 = Diem::with(['hocSinh.lop','monHoc'])
        ->whereHas('hocSinh.lop', function($query) use ($request) {
            $query->where('lop.MaLop', $request->MaLop);
        })
        ->where('MaHK', $request->MaHK)->whereNotIn("MaMH",["CB4","CB5"])->where("MaLoai","tbcn")->where("Diem","<",5.0)->orderBy('MSHS')
        ->get();
        $diem2 = Diem::with(['hocSinh.lop','monHoc'])
        ->whereHas('hocSinh.lop', function($query) use ($request) {
            $query->where('lop.MaLop', $request->MaLop);
        })
        ->where('MaHK', $request->MaHK)->whereIn("MaMH",["CB4","CB5"])->where("MaLoai","tbcn")->where("Diem",0)->orderBy('MSHS')
        ->get();
        $mergedDiem = $diem1->merge($diem2);
        $mergedDiem = $mergedDiem->unique()->sortBy('MSHS');
        return response()->json($mergedDiem, Response::HTTP_OK);
    }
    public function DiemRLH(Request $request)
    {
        $monRLH = $request->input('monRLH', []);
        $diem = Diem::with(['hocSinh.lop','monHoc'])
        ->whereHas('hocSinh.lop', function($query) use ($request) {
            $query->where('lop.MaLop', $request->MaLop);
        })
        ->where('MaHK', $request->MaHK)->whereIn('MaMH', $monRLH)->where("MaLoai","rlh")->orderBy('MSHS')
        ->get();
        return response()->json($diem, Response::HTTP_OK);
    }
    public function DiemTB(Request $rq)
    {
        $diemTB = HocLop::with(['renLuyenLai','hocLucLai','hocSinh.lop','hocSinh','hocLuc','hocLucHK1','hocLucHK2','renLuyen','renLuyenHK1','renLuyenHK2','trangThai'])
        ->whereHas('hocSinh.lop', function($query) use ($rq) {
            $query->where('lop.MaLop', $rq->MaLop);
        })->where('MaLop',$rq->MaLop)->where("MaNK",$rq->MaNK)->get();
        return response()->json($diemTB, Response::HTTP_OK);
    }
    public function DiemTB_HS(Request $rq)
    {
        $diemTB = HocLop::with(['renLuyenLai','hocLucLai','hocSinh','hocLuc','hocLucHK1','hocLucHK2','renLuyen','renLuyenHK1','renLuyenHK2','trangThai'])
        ->where("MSHS",$rq->MSHS)->where('MaLop',$rq->MaLop)->where("MaNK",$rq->MaNK)->get();
        return response()->json($diemTB, Response::HTTP_OK);
    }
    public function AddDiem(Request $request)
    {
        $hocsinh = HocSinh::find($request->MSHS);
        if(!$hocsinh){
            return response()->json('Học sinh không tồn tại',404);
        };
        $exits = HocLop::where("MSHS",$request->MSHS)->where("MaLop",$request->MaLop)->first();
        if(!$exits){
            return response()->json('Học sinh không thuộc lớp này',401);
        }
        if($request->MaLoai == "rlh" && $exits->MaTT != 2){
            return response()->json('Học sinh này không rèn luyện hè',401);
        }
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
            if($request->MaLoai == 'rlh'){
                $exits = Diem::where('MSHS',$request->MSHS)
                            ->where('MaMH',$request->MaMH)
                            ->where('MaLoai',$request->MaLoai)->first();
                if($exits){
                    return response()->json('Đã nhập điểm rèn  luyện hè cho học sinh này', 409);
                }
            }
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
    public function TongKetMonHK(Request $request)
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
    
            if ($diemTX->isNotEmpty() && $diemGK && $diemCK) {
                $tongTx = $diemTX->sum('Diem');
                $tbhk = 0;
                if($request->MaMH == "CB4" || $request->MaMH == "CB5")
                {
                    $tong = $tongTx + $diemGK->Diem + $diemCK->Diem;
                    if($tong == $diemTX->count()+2){
                        $tbhk = 1;
                    }else{
                        $tbhk = 0;
                    }
                }else{
                    $tbhk = round(($tongTx + ($diemGK->Diem * 2) + ($diemCK->Diem * 3)) / ($diemTX->count() + 5),1);
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
            }else{
                return response()->json("Có học sinh chưa đủ cột điểm yêu cầu",402);
            }
        }
        return response()->json("Đã tính điểm thành công!",200);
    }
    public function TongKetMonCN(Request $request){
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
            if ($tbhk1 && $tbhk2) {
                $tbcn=0;
                if($request->MaMH == "CB4" || $request->MaMH == "CB5"){
                   $tbcn = $tbhk2->Diem;
                }else{
                    $tbcn = round(($tbhk1->Diem + $tbhk2->Diem*2)/3,1);
                };
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
            }else{
                return response()->json("Có học sinh chưa đủ cột điểm yêu cầu",402);
            }
        }
        return response()->json("Đã cập nhật điểm thành công",200);
    }
    public function TongKetHocKi(Request $rq){
        $MaLoai = substr($rq->MaHK, 0, 1) == "1" ? "tbhk1" : "tbhk2";
        $lop = Lop::where("MaLop",$rq->MaLop)->first();
        $hocsinh = $lop->hocSinh;
        foreach ($hocsinh as $hs){
            $data = HocLop::where('MSHS', $hs->MSHS)->where('MaLop',$rq->MaLop)
                ->where('MaNK', substr($rq->MaHK, 1, 6))
                ->first();
            $tbhk = Diem::where('MSHS', $hs->MSHS)->whereNotIn("MaMH",["CB4","CB5"])->where('MaHK',$rq->MaHK)->where('MaLoai', $MaLoai)->get();
            $danhgia = Diem::where('MSHS', $hs->MSHS)->whereIn("MaMH",["CB4","CB5"])->where('MaHK',$rq->MaHK)->where('MaLoai', $MaLoai)->get();
            if ($tbhk->count() === 8 && $danhgia->count() === 2) {
                $diemTbHk = round($tbhk->avg('Diem'),1);
                $hocLuc = 0;
                if($danhgia->sum("Diem") == 2 && $tbhk->where('Diem',"<",6.5)->isEmpty() && $tbhk->where('Diem',">=",8.0)->count() >= 6)
                {
                    $hocLuc = 4;
                }elseif ($danhgia->sum("Diem") == 2 && $tbhk->where('Diem',"<",5.0)->isEmpty() && $tbhk->where('Diem',">=",6.5)->count() >= 6) {
                    $hocLuc = 3;
                }elseif($danhgia->sum("Diem") == 1 && $tbhk->where('Diem',"<",3.5)->isEmpty() && $tbhk->where('Diem',">=",5.0)->count() >= 6){
                    $hocLuc = 2;
                }else{
                    $hocLuc = 1;
                }
                if($MaLoai == "tbhk1"){
                    $data->Diem_TB_HKI = $diemTbHk;
                    $data->MaHL_HK1 = $hocLuc;
                }else{
                    $data->Diem_TB_HKII = $diemTbHk;
                    $data->MaHL_HK2 = $hocLuc;
                }
                $data->save();
            }
            else{
                return response()->json("Có học sinh chưa đủ cột điểm yêu cầu",402);
            }
        }
        return response()->json("Đã cập nhật điểm thành công",200);
    }
    public function TongKetNamHoc(Request $rq){
        $lop = Lop::where("MaLop",$rq->MaLop)->first();
        $hocsinh = $lop->hocSinh;
        foreach ($hocsinh as $hs){
            $data = HocLop::where('MSHS', $hs->MSHS)->where('MaLop',$rq->MaLop)
                ->where('MaNK', $rq->MaNK)
                ->first();
            $tbcn = Diem::where('MSHS', $hs->MSHS)
            ->whereNotIn('MaMH', ['CB4', 'CB5'])
            ->where('MaHK', '2' . $rq->MaNK)
            ->where('MaLoai', 'tbcn')
            ->get();
            $rlh = Diem::where('MSHS', $hs->MSHS)
            ->whereNotIn('MaMH', ['CB4', 'CB5'])
            ->where('MaHK', '2' . $rq->MaNK)
            ->where('MaLoai', 'rlh')
            ->get()
            ->keyBy(function ($item) {
                return $item->MSHS . '-' . $item->MaMH;
            });
            $diemTK = $tbcn->map(function ($item) use ($rlh) {
                $key = $item->MSHS . '-' . $item->MaMH;
                return $rlh->has($key) ? $rlh->get($key) : $item;
            });
            $danhgia = Diem::where('MSHS', $hs->MSHS)
            ->whereIn('MaMH', ['CB4', 'CB5'])
            ->where('MaHK', '2' . $rq->MaNK)
            ->where('MaLoai', 'tbcn')
            ->get();
            $danhgiarlh = Diem::where('MSHS', $hs->MSHS)
            ->whereIn('MaMH', ['CB4', 'CB5'])
            ->where('MaHK', '2' . $rq->MaNK)
            ->where('MaLoai', 'rlh')
            ->get()
            ->keyBy(function ($item) {
                return $item->MSHS . '-' . $item->MaMH;
            });
            $danhgiaTK = $danhgia->map(function ($item) use ($danhgiarlh) {
                $key = $item->MSHS . '-' . $item->MaMH;
                return $danhgiarlh->has($key) ? $danhgiarlh->get($key) : $item;
            });
            $tbhk = HocLop::where("MSHS",$hs->MSHS)->where("MaNK",$rq->MaNK)->where("MaLop",$rq->MaLop)->first();
            if ($diemTK->count() === 8) {
                $cn = round(($tbhk->Diem_TB_HKI + ($tbhk->Diem_TB_HKII * 2))/3,1);
                $hocLuc = 0;
                if($danhgiaTK->sum("Diem") == 2 && $diemTK->where('Diem',"<",6.5)->isEmpty() && $diemTK->where('Diem',">=",8.0)->count() >= 6)
                {
                    $hocLuc = 4;
                }elseif ($danhgiaTK->sum("Diem") == 2 && $diemTK->where('Diem',"<",5.0)->isEmpty() && $diemTK->where('Diem',">=",6.5)->count() >= 6) {
                    $hocLuc = 3;
                }elseif($danhgiaTK->sum("Diem") == 1 && $diemTK->where('Diem',"<",3.5)->isEmpty() && $diemTK->where('Diem',">=",5.0)->count() >= 6){
                    $hocLuc = 2;
                }else{
                    $hocLuc = 1;
                }
                $data->Diem_TB_CN = $cn;
                if($rlh->isNotEmpty() || $danhgiarlh->isNotEmpty()){
                    $data->MaHLL = $hocLuc;
                }else{
                    $data->MaHL = $hocLuc;
                }
                $data->save();
            }
            else{
                return response()->json("Có học sinh chưa đủ cột điểm yêu cầu",402);
            }
        }
        return response()->json("Đã cập nhật điểm thành công",200);
    }
    
    // Ham test nhap diem

    public function NhapDiem(){
        $hs = HocSinh::all();
        foreach ($hs as $hs){
            if($hs->MaBan == "XH"){
                $monhoc = MonHoc::whereIn('MaMH',['CB1','CB2','CB3'])
                ->orWhere('MaMH', 'like', 'XH%')
                ->orWhere('MaMH', '=', 'TN1')
                ->orWhere('MaMH', '=', 'TC1')->get();
                foreach($monhoc as $mh){
                    $diemtx = new Diem();
                    $diemtx->MSHS = $hs->MSHS;
                    $diemtx->MaMH = $mh->MaMH;
                    $diemtx->MaHK = "222-23";
                    $diemtx->MaLoai = "tx";
                    $diemtx->Diem = rand(6,10);
                    $diemtx->save();
                    $diemgk = new Diem();
                    $diemgk->MSHS = $hs->MSHS;
                    $diemgk->MaMH = $mh->MaMH;
                    $diemgk->MaHK = "222-23";
                    $diemgk->MaLoai = "gk";
                    $diemgk->Diem = rand(6,10);
                    $diemgk->save();
                    $diemck = new Diem();
                    $diemck->MSHS = $hs->MSHS;
                    $diemck->MaMH = $mh->MaMH;
                    $diemck->MaHK = "222-23";
                    $diemck->MaLoai = "ck";
                    $diemck->Diem = rand(6,10);
                    $diemck->save();
                }
                $monhocDG = MonHoc::whereIn('MaMH',['CB4','CB5'])->get();
                foreach($monhocDG as $mh){
                    $diemtx = new Diem();
                    $diemtx->MSHS = $hs->MSHS;
                    $diemtx->MaMH = $mh->MaMH;
                    $diemtx->MaHK = "222-23";
                    $diemtx->MaLoai = "tx";
                    $diemtx->Diem = 1;
                    $diemtx->save();
                    $diemgk = new Diem();
                    $diemgk->MSHS = $hs->MSHS;
                    $diemgk->MaMH = $mh->MaMH;
                    $diemgk->MaHK = "222-23";
                    $diemgk->MaLoai = "gk";
                    $diemgk->Diem = 1;
                    $diemgk->save();
                    $diemck = new Diem();
                    $diemck->MSHS = $hs->MSHS;
                    $diemck->MaMH = $mh->MaMH;
                    $diemck->MaHK = "222-23";
                    $diemck->MaLoai = "ck";
                    $diemck->Diem = 1;
                    $diemck->save();
                }
            }else{
                $monhoc = MonHoc::whereIn('MaMH',['CB1','CB2','CB3'])
                ->orWhere('MaMH', 'like', 'TN%')
                ->orWhere('MaMH', '=', 'XH1')
                ->orWhere('MaMH', '=', 'TC2')->get();
                foreach($monhoc as $mh){
                    $diemtx = new Diem();
                    $diemtx->MSHS = $hs->MSHS;
                    $diemtx->MaMH = $mh->MaMH;
                    $diemtx->MaHK = "222-23";
                    $diemtx->MaLoai = "tx";
                    $diemtx->Diem = rand(6,10);
                    $diemtx->save();
                    $diemgk = new Diem();
                    $diemgk->MSHS = $hs->MSHS;
                    $diemgk->MaMH = $mh->MaMH;
                    $diemgk->MaHK = "222-23";
                    $diemgk->MaLoai = "gk";
                    $diemgk->Diem = rand(6,10);
                    $diemgk->save();
                    $diemck = new Diem();
                    $diemck->MSHS = $hs->MSHS;
                    $diemck->MaMH = $mh->MaMH;
                    $diemck->MaHK = "222-23";
                    $diemck->MaLoai = "ck";
                    $diemck->Diem = rand(6,10);
                    $diemck->save();
                }
                $monhocDG = MonHoc::whereIn("MaMH",['CB4','CB5'])->get();
                foreach($monhocDG as $mh){
                    $diemtx = new Diem();
                    $diemtx->MSHS = $hs->MSHS;
                    $diemtx->MaMH = $mh->MaMH;
                    $diemtx->MaHK = "222-23";
                    $diemtx->MaLoai = "tx";
                    $diemtx->Diem = 1;
                    $diemtx->save();
                    $diemgk = new Diem();
                    $diemgk->MSHS = $hs->MSHS;
                    $diemgk->MaMH = $mh->MaMH;
                    $diemgk->MaHK = "222-23";
                    $diemgk->MaLoai = "gk";
                    $diemgk->Diem = 1;
                    $diemgk->save();
                    $diemck = new Diem();
                    $diemck->MSHS = $hs->MSHS;
                    $diemck->MaMH = $mh->MaMH;
                    $diemck->MaHK = "222-23";
                    $diemck->MaLoai = "ck";
                    $diemck->Diem = 1;
                    $diemck->save();
                }
            }
        }
        return response()->json("OK",200);
    }
}