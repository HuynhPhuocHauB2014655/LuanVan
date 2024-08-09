<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TKB;
use App\Models\Lop;
use App\Models\GiaoVien;
use App\Models\MonHoc;
use App\Models\NgayTrongTuan;
use App\Models\PhanCong;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
class TKBController extends Controller
{
    public function index(){
        $tkb = TKB::all();
        return response()->json($tkb);
    }
    public function createPhanCong(Request $request){
        $data = PhanCong::create($request->all());
        return response()->json($data);
    }
    public function create(Request $request, $nk)
    {
    // Convert academic year format
    $nienKhoa = str_replace('-', '', $nk);

    // Fetch subjects
    $monhocXH = MonHoc::where('MaMH', 'like', 'XH%')
                    ->orWhere('MaMH', 'like', 'CB%')
                    ->orWhere('MaMH', '=', 'TN1')
                    ->orWhere('MaMH', '=', 'TC1')
                    ->inRandomOrder()
                    ->get();

    // Retrieve classes
    $lopTN = Lop::doesntHave('tkb')
                ->where('MaLop', 'like', 'TN'.$nienKhoa.'%')
                ->inRandomOrder()
                ->get();

    $lopXH = Lop::doesntHave('tkb')
                ->where('MaLop', 'like', 'XH'.$nienKhoa.'%')
                ->inRandomOrder()
                ->get();
    foreach ($lopTN as $lop) {
        $monhocTN = MonHoc::where('MaMH', 'like', 'TN%')
                        ->orWhere('MaMH', 'like', 'CB%')
                        ->orWhere('MaMH', '=', 'XH1')
                        ->orWhere('MaMH', '=', 'TC2')
                        ->inRandomOrder()
                        ->get();

            while ($monhocTN->isNotEmpty()) {
                $monHoc = $monhocTN->shift();
                $phanCong = PhanCong::where('MaLop', $lop->MaLop)
                                    ->where('MaMH', $monHoc->MaMH)
                                    ->first();
                if ($phanCong) {
                    for ($i = 2; $i < 8; $i++) {
                        for ($j = 1; $j < 5; $j++) {
                            if (($i == 2 && $j == 1) || ($i == 7 && $j == 4)) {
                                continue;
                            }
                
                            $check = TKB::where('MaNgay', $i)
                                        ->where('TietDay', $j)
                                        ->where('MaLop', $lop->MaLop)
                                        ->where('MaNK', $nk)
                                        ->first();
                
                            if (is_null($check)) {
                                $checkTKB = TKB::where('MaMH', $monHoc->MaMH)
                                               ->where('MSGV', $phanCong->MSGV)
                                               ->where('MaNgay', $i)
                                               ->where('TietDay', $j)
                                               ->where('MaNK', $nk)
                                               ->first();
                
                                if (is_null($checkTKB)) {
                                    $tkb = new TKB();
                                    $tkb->MaNK = $nk;
                                    $tkb->MaMH = $monHoc->MaMH;
                                    $tkb->MSGV = $phanCong->MSGV;
                                    $tkb->MaLop = $lop->MaLop;
                                    $tkb->MaNgay = $i;
                                    $tkb->TietDay = $j;
                                    $tkb->save();
                                    break 2; // Break both loops
                                }
                            }
                        }
                }
            }
        }
    }
    return response()->json("OK");
}

}