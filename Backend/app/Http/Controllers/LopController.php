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

    public function indexWithStudent()
    {
        $lop = Lop::with(['hocSinh','nienKhoa','giaoVien'])->get();
        $lop = $lop->sortBy(function ($item) {
            // Assuming 'hocSinh' is a collection and 'name' is the attribute to sort by
            return $item->hocSinh->first()->name ?? '';
        });
        return response()->json($lop, Response::HTTP_OK);
    }

    public function indexWithStudentNow($MaNK)
    {
        $lop = Lop::with(['hocSinh','nienKhoa','giaoVien'])->where('MaNK','=',$MaNK)->get();
        $lop = $lop->sortBy(function ($item) {
            // Assuming 'hocSinh' is a collection and 'name' is the attribute to sort by
            return $item->hocSinh->first()->name ?? '';
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
        $gvTN = GiaoVien::
        where('ChuyenMon','like','TN%')
        ->orWhere('ChuyenMon','=','CB1')
        ->orWhere('ChuyenMon','=','TC1')
        ->orWhere('ChuyenMon','=','CB4')
        ->inRandomOrder()->get();
        $gvXH = GiaoVien::
        where('ChuyenMon','like','XH%')
        ->orWhere('ChuyenMon','=','CB2')
        ->orWhere('ChuyenMon','=','TC2')
        ->orWhere('ChuyenMon','=','CB5')
        ->inRandomOrder()->get();
        $newClassTN = [];
        $newClassXH = [];
        $nienkhoa = Str::replace('-', '', $request->MaNK);
        for ($i=1; $i <= $request->soLopTN ; $i++) { 
            $maLop = "TN" . $nienkhoa . "10" . $i;
            $tenLop = "10A" . $i;
            $gvcn = $gvTN->shift();
            $lop = new Lop();
            $lop->MaLop = $maLop;
            $lop->TenLop = $tenLop;
            $lop->MaKhoi = "10";
            $lop->MaNK = $request->MaNK;
            $lop->MSGV = $gvcn->MSGV;
            $lop->save();
            $hocsinhTN = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','TN')->inRandomOrder()->limit(10)->pluck('MSHS');
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
        $hocsinhTN = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','TN')->inRandomOrder()->pluck('MSHS');
        if($hocsinhTN->count() > 0 && $hocsinh->count() < 10)
        {
            $malop = "TN".$nienkhoa."10%";
            for ($i=0; $i < $hocsinh->count(); $i++) { 
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
            $maLop = "XH" . $nienkhoa . "10" . $i;
            $tenLop = "10C" . $i;
            $gvcn = $gvXH->shift();
            $lop = new Lop();
            $lop->MaLop = $maLop;
            $lop->TenLop = $tenLop;
            $lop->MaKhoi = "10";
            $lop->MaNK = $request->MaNK;
            $lop->MSGV = $gvcn->MSGV;
            $lop->save();
            $hocsinhTXH = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','XH')->inRandomOrder()->limit(10)->pluck('MSHS');
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
        $hocsinhXH = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','XH')->inRandomOrder()->pluck('MSHS');
        if($hocsinhXH->count() > 0 && $hocsinhXH->count() < 10)
        {
            $malop = "XH".$nienkhoa."10%";
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
