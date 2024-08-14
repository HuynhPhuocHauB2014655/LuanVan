<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lop;
use App\Models\HocSinh;
use App\Models\HocLop;
use App\Models\GiaoVien;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
class LopController extends Controller
{
    public function index()
    {
        $lop = Lop::all();
        return response()->json($lop, Response::HTTP_OK);
    }
    public function indexWithTKB($nk)
    {
        $lop = Lop::with(
            'tkb.giaoVien',
            'tkb.monHoc',
            'tkb.ngayTrongTuan',
            'nienKhoa'
        )
        ->where('MaNK',$nk)->get();
        return response()->json($lop, Response::HTTP_OK);
    }
    public function indexTN($MaNK){
        $lop = Lop::where('MaLop','like','A%')->where('MaNK','=',$MaNK)->get();
        return response()->json($lop, Response::HTTP_OK);
    }
    public function indexXH($MaNK){
        $lop = Lop::where('MaLop','like','C%')->where('MaNK','=',$MaNK)->get();
        return response()->json($lop, Response::HTTP_OK);
    }
    public function indexWithoutTKB()
    {
        $lop = Lop::with(
            'phanCong.giaoVien',
            'phanCong.monHoc',
            'phanCong.lop',
            'nienKhoa')
            ->doesntHave('tkb')->get();
        return response()->json($lop, Response::HTTP_OK);
    }
    public function indexWithStudent()
    {
    $lops = Lop::with(['hocSinh', 'nienKhoa', 'giaoVien', 'tkb'])->get();

// Sort the lops collection by the name of the first student in the hocSinh relationship
$sortedLops = $lops->sortBy(function ($lop) {
    return $lop->hocSinh->first()->HoTen ?? '';
})->values()->all();

return response()->json($sortedLops, Response::HTTP_OK);
}

    public function indexWithStudentNow($MaNK)
    {
        $lop = Lop::with(['hocSinh','nienKhoa','giaoVien','tkb'])->where('MaNK','=',$MaNK)->get();
        $lop = $lop->sortBy(function ($item) {
            return $item->hocSinh->first()->HoTen ?? '';
        });
        return response()->json($lop, Response::HTTP_OK);
    }
    
    public function store(Request $request)
    {
        $lop = Lop::create($request->all());

        return response()->json($lop, Response::HTTP_CREATED);
    }

    public function assignStudentsToClass(Request $request)
    {
        $TNCount = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','TN')->where("TrangThai",0)->count();
        $XHCount = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','XH')->where("TrangThai",0)->count();
        $soHSTN = floor($TNCount/$request->soLopTN);
        $soHSXH = floor($XHCount/$request->soLopXH);
        $gvTN = GiaoVien::where(function($query){
            $query->whereIn('ChuyenMon',['CB1','TC1','CB4'])
            ->orWhere('ChuyenMon','like','TN%');
        })
        ->where(function($query){
            $query->where("TrangThai",0);
        })
        ->inRandomOrder()->get();
        $gvXH = GiaoVien::where(function($query){
            $query->whereIn('ChuyenMon',['CB2','TC2','CB5'])
            ->orWhere('ChuyenMon','like','XH%');
        })
        ->where(function($query){
            $query->where("TrangThai",0);
        })
        ->inRandomOrder()->get();
        $newClassTN = [];
        $newClassXH = [];
        $nienkhoa = Str::replace('-', '', $request->MaNK);
        for ($i=1; $i <= $request->soLopTN ; $i++) { 
            $maLop = "A" . $nienkhoa . "10" . $i;
            $tenLop = "10A" . $i;
            $gvcn = $gvTN->shift();
            $lop = new Lop();
            $lop->MaLop = $maLop;
            $lop->TenLop = $tenLop;
            $lop->MaKhoi = "10";
            $lop->MaNK = $request->MaNK;
            $lop->MSGV = $gvcn->MSGV;
            $lop->save();
            $hocsinhTN = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','TN')->where("TrangThai",0)->inRandomOrder()->limit($soHSTN)->pluck('MSHS');
            HocLop::insert(
                $hocsinhTN->map(fn($mshs) => [
                    'MaLop' => $maLop,
                    'MSHS' => $mshs,
                    'MaNK' => $request->MaNK,
                    'MaHL' => "0",
                    'MaHK' => "0",
                ])->toArray()
            );
        }
        $hocsinhTN = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','TN')->where("TrangThai",0)->inRandomOrder()->pluck('MSHS');
        if($hocsinhTN->count() > 0 && $hocsinhTN->count() < 10)
        {
            $malop = "A".$nienkhoa."10%";
            for ($i=0; $i < $hocsinhTN->count(); $i++) { 
                $randomClass = Lop::where('MaLop','like', $malop)->inRandomOrder()->limit(1)->pluck('MaLop')->first();
                DB::table('HocLop')->insert(
                    [
                        'MaLop' => $randomClass,
                        'MSHS' => $hocsinhTN[$i],
                        'MaNK' => $request->MaNK,
                        'MaHL' => "0",
                        'MaHK' => "0",
                    ]
                );
            }
        }


        for ($i=1; $i <= $request->soLopXH ; $i++) { 
            $maLop = "C" . $nienkhoa . "10" . $i;
            $tenLop = "10C" . $i;
            $gvcn = $gvXH->shift();
            $lop = new Lop();
            $lop->MaLop = $maLop;
            $lop->TenLop = $tenLop;
            $lop->MaKhoi = "10";
            $lop->MaNK = $request->MaNK;
            $lop->MSGV = $gvcn->MSGV;
            $lop->save();
            $hocsinhTXH = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','XH')->where("TrangThai",0)->inRandomOrder()->limit($soHSXH)->pluck('MSHS');
            HocLop::insert(
                $hocsinhTXH->map(fn($mshs) => [
                    'MaLop' => $maLop,
                    'MSHS' => $mshs,
                    'MaNK' => $request->MaNK,
                    'MaHL' => "0",
                    'MaHK' => "0",
                ])->toArray()
            );
        }
        $hocsinhXH = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','XH')->where("TrangThai",0)->inRandomOrder()->pluck('MSHS');
        if($hocsinhXH->count() > 0 && $hocsinhXH->count() < 10)
        {
            $malop = "C".$nienkhoa."10%";
            for ($i=0; $i < $hocsinhXH->count(); $i++) { 
                $randomClass = Lop::where('MaLop','like', $malop)->inRandomOrder()->limit(1)->pluck('MaLop')->first();
                DB::table('HocLop')->insert(
                    [
                        'MaLop' => $randomClass,
                        'MSHS' => $hocsinhXH[$i],
                        'MaNK' => $request->MaNK,
                        'MaHL' => "0",
                        'MaHK' => "0",
                    ]
                );
            }
        }
        return response()->json("Đã xếp lớp thành công");
    }
    public function show($MaLop)
    {
        $lop = Lop::find($MaLop);
        if (!$lop) {
            return response()->json(['message' => 'Data not found'], Response::HTTP::NOT_FOUND);
        }
        return response()->json($lop, Response::HTTP_OK);
    }
    public function addToClass(Request $request)
    {
        $hoclop = new HocLop();
        $hoclop->MaLop = $request->MaLop;
        $hoclop->MSHS = $request->MSHS;
        $hoclop->MaNK = $request->MaNK;
        $hoclop->MaHL = 0;
        $hoclop->MaHK = 0;
        $hoclop->save();
        return response()->json("Đã thêm thành công", Response::HTTP_OK);
    }
    public function update(Request $request, $MaLop)
    {
        $lop = Lop::find($MaLop);
        if (!$lop) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $lop->update($request->all());
        return response()->json($lop, Response::HTTP_OK);
    }

    public function destroy($MaLop)
    {
        $data = Lop::find($MaLop);
        if (!$data) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $data->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
