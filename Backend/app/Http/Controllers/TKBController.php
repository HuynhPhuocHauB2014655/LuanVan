<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TKB;
use App\Models\Lop;
use App\Models\GiaoVien;
use App\Models\MonHoc;
use App\Models\NgayTrongTuan;
use App\Models\PhanCong;
use App\Models\DiemDanh;
use App\Models\TietHoc;
use App\Models\HocLop;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
class TKBController extends Controller
{
    public function index($nk){
        $tkb = TKB::with(['ngayTrongTuan','monHoc','lop','giaoVien','nienKhoa'])->where("MaNK",$nk)->get();
        return response()->json($tkb);
    }
    public function indexDate(){
        $date = NgayTrongTuan::all();
        return response()->json($date);
    }
    public function createPhanCong(Request $request){
        $data = PhanCong::create($request->all());
        return response()->json($data);
    }
    public function getByDay(Request $rq){
        $data = TKB::with(['lop','monHoc','giaoVien'])->where("MaNgay",$rq->MaNgay)->where("MSGV",$rq->MSGV)->where("MaNK",$rq->MaNK)->get();
        if($data->isNotEmpty()){
            foreach ($data as $d){
                $th = TietHoc::where("MaLop",$d->MaLop)
                ->where("MaNgay",$d->MaNgay)
                ->where("TietDay",$d->TietDay)
                ->where("MSGV",$d->MSGV)
                ->where("MaMH",$d->MaMH)
                ->first();
                if(!$th){
                    $newTh = TietHoc::create([
                        'MaLop' => $d->MaLop,
                        'MaNgay' => $d->MaNgay,
                        'TietDay' => $d->TietDay,
                        'MSGV' => $d->MSGV,
                        'MaMH' => $d->MaMH,
                        'Ngay' => Carbon::now()->format('Y/m/d'),
                    ]);
                    $hs = HocLop::where("MaLop",$d->MaLop)->get();
                    foreach ($hs as $hs) {
                        DiemDanh::create([
                            'MSHS' => $hs->MSHS,
                            'TietHoc' => $newTh->id,
                        ]);
                    }
                }
            }
        }
        return response()->json($data);
    }
    public function getTietHoc(Request $rq){
        $th = TietHoc::with('diemDanh.hocSinh')->where("MaLop",$rq->MaLop)->where("MaNgay",$rq->MaNgay)->where("TietDay",$rq->TietDay)->where("MSGV",$rq->MSGV)->first();
        return response()->json($th);
    }
    public function getTHWeek(Request $rq){
        $data = TietHoc::with(['diemDanh.hocSinh','giaoVien','monHoc'])
        ->where("MaLop",$rq->MaLop)
        ->whereBetween("Ngay", [$rq->start, $rq->end])
        ->get();
        return response()->json($data,200);
    }
    public function updateTietHoc(Request $rq){
        $th = TietHoc::find($rq->id);
        if($th){
            $th->update([
                'NoiDung' => $rq->NoiDung,
                'DanhGia' => $rq->DanhGia
            ]);
            $dd = $rq->diem_danh;
            foreach ($dd as $d) {
                $diemDanh = DiemDanh::find($d['id']); 
                $diemDanh->TrangThai = $d['TrangThai'];
                $diemDanh->save();
            }
        }
        return response()->json("Đã lưu lại thành công!",200);
    }
    public function create(Request $request, $nk)
    {
        $nienKhoa = str_replace('-', '', $nk);
        $lopTN = Lop::doesntHave('tkb')
                    ->where('MaLop', 'like', 'A'.$nienKhoa.'%')
                    ->inRandomOrder()
                    ->get();

        $lopXH = Lop::doesntHave('tkb')
                    ->where('MaLop', 'like', 'C'.$nienKhoa.'%')
                    ->inRandomOrder()
                    ->get();
        foreach ($lopTN as $lop) {
            $soTietTuan = [
                'CB1' => 3,
                'CB2' => 3,
                'CB3' => 3,
                'CB4' => 2,
                'CB5' => 1,
                'TC1' => 1,
                'TC2' => 1,
                'TN1' => 2,
                'TN2' => 2,
                'TN3' => 2,
                'XH1' => 2,
                'XH2' => 2,
                'XH3' => 2,
            ];
            $monhocTN = MonHoc::where('MaMH', 'like', 'TN%')
            ->orWhereIn('MaMH', ['CB1', 'CB2', 'CB3', 'XH1', 'TC2'])
            ->inRandomOrder()
            ->get();
            $monhocChieu = MonHoc::whereIn('MaMH', ['CB4', 'CB5'])->inRandomOrder()->get();
            $this->LoopFunction($lop, $monhocTN, $soTietTuan,$nk,1);
            $this->LoopFunction($lop, $monhocChieu, $soTietTuan,$nk,5);
        }
        foreach ($lopXH as $lop) {
            $soTietTuan = [
                'CB1' => 3,
                'CB2' => 3,
                'CB3' => 3,
                'CB4' => 2,
                'CB5' => 1,
                'TC1' => 1,
                'TC2' => 1,
                'TN1' => 2,
                'TN2' => 2,
                'TN3' => 2,
                'XH1' => 2,
                'XH2' => 2,
                'XH3' => 2,
            ];
            $monhocXH = MonHoc::where('MaMH', 'like', 'XH%')
            ->orWhereIn('MaMH', ['CB1', 'CB2', 'CB3', 'TN1', 'TC1'])
            ->inRandomOrder()
            ->get();
            $monhocChieu = MonHoc::whereIn('MaMH', ['CB4', 'CB5'])->inRandomOrder()->get();
            $this->LoopFunction($lop, $monhocXH, $soTietTuan,$nk,1);
            $this->LoopFunction($lop, $monhocChieu, $soTietTuan,$nk,5);
        }
        return response()->json("OK");
    }
    private function LoopFunction($lop,$tongMonHoc,$soTietTuan,$nk,$tietBD)
    {
        for($t=0;$t<3;$t++){
            $dsMonHoc = $tongMonHoc->toArray();
            while (!empty($dsMonHoc)) {
                $flat = 0;
                $monHoc = array_shift($dsMonHoc);
                if($soTietTuan[$monHoc['MaMH']] <= 0)
                {
                    continue;
                }
                $phanCong = PhanCong::where('MaLop', $lop->MaLop)
                                    ->where('MaMH', $monHoc['MaMH'])
                                    ->first();
                for ($i = 2; $i < 8; $i++) {
                    for ($j = $tietBD; $j <= $tietBD + 3; $j++) {
                        if (($i == 2 && $j == 1) || ($i == 7 && $j == 4)) {
                            continue;
                        }
                        if($monHoc['MaMH'] != 'CB1' && $monHoc['MaMH'] != 'CB2'){
                            $checkCungNgay = TKB::where('MaNgay', $i)
                                    ->where('MaLop', $lop->MaLop)
                                    ->where('MaNK', $nk)
                                    ->where('MaMH', $monHoc['MaMH'])
                                    ->first();
                            if($checkCungNgay != null){
                                continue;
                            }
                        }
                        $check = TKB::where('MaNgay', $i)
                                    ->where('TietDay', $j)
                                    ->where('MaLop', $lop->MaLop)
                                    ->where('MaNK', $nk)
                                    ->first();
            
                        if (is_null($check)) {
                            $checkTKB = TKB::where('MaMH', $monHoc['MaMH'])
                                        ->where('MSGV', $phanCong->MSGV)
                                        ->where('MaNgay', $i)
                                        ->where('TietDay', $j)
                                        ->where('MaNK', $nk)
                                        ->first();
            
                            if (is_null($checkTKB) && $soTietTuan[$monHoc['MaMH']] > 0) {
                                $tkb = new TKB();
                                $tkb->MaNK = $nk;
                                $tkb->MaMH = $monHoc['MaMH'];
                                $tkb->MSGV = $phanCong->MSGV;
                                $tkb->MaLop = $lop->MaLop;
                                $tkb->MaNgay = $i;
                                $tkb->TietDay = $j;
                                $tkb->save();
                                if(($monHoc['MaMH'] == "CB1" || $monHoc['MaMH'] == "CB2") && ($soTietTuan[$monHoc['MaMH']] > 1) && ($j < 4))
                                {
                                    $checkTKB = TKB::where('MaMH', $monHoc['MaMH'])
                                        ->where('MSGV', $phanCong->MSGV)
                                        ->where('MaNgay', $i)
                                        ->where('TietDay', $j+1)
                                        ->where('MaNK', $nk)
                                        ->first();
                                    if (is_null($checkTKB)) {
                                        $tkb = new TKB();
                                        $tkb->MaNK = $nk;
                                        $tkb->MaMH = $monHoc['MaMH'];
                                        $tkb->MSGV = $phanCong->MSGV;
                                        $tkb->MaLop = $lop->MaLop;
                                        $tkb->MaNgay = $i;
                                        $tkb->TietDay = $j+1;
                                        $tkb->save();
                                        $soTietTuan[$monHoc['MaMH']] -= 1;
                                    }
                                }
                                $soTietTuan[$monHoc['MaMH']] -= 1;
                                $flat = 1;
                                break; // Break both loops
                            }
                        }
                    }
                    if($flat == 1){
                        break;
                    }
                }
            }
        }
    }
    public function update(Request $rq)
    {
        $c1 = TKB::find($rq->change1);
        $c2 = TKB::find($rq->change2);
        $tmpMH = $c1->MaMH;
        $tmpGV = $c1->MSGV;
        $c1->MaMH = $c2->MaMH;
        $c1->MSGV = $c2->MSGV;
        $c2->MaMH = $tmpMH;
        $c2->MSGV = $tmpGV;
        $c1->save();
        $c2->save();
        return response()->json("Đã cập nhật thời khóa biểu thành công",200);
    }
}
