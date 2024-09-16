<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lop;
use App\Models\HocSinh;
use App\Models\HocLop;
use App\Models\GiaoVien;
use App\Models\Diem;
use App\Models\KhenThuong;
use App\Models\NhomTinNhan;
use App\Models\ThanhVienNhom;
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
        $lops = Lop::with(['hocSinh', 'nienKhoa', 'giaoVien', 'tkb'])->orderBy('created_at','desc')->get();
        return response()->json($lops, Response::HTTP_OK);
    }

    public function indexWithStudentNow($MaNK)
    {
        $lop = Lop::with(['hocSinh','nienKhoa','giaoVien','tkb'])->where('MaNK','=',$MaNK)->orderBy('created_at','desc')->get();
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
            $check=null;
            do{
                $gvcn = $gvTN->random();
                $check = Lop::where("MSGV",$gvcn->MSGV)->where("MaNK",$request->MaNK)->first();
            }while($check);
            $lop = new Lop();
            $lop->MaLop = $maLop;
            $lop->TenLop = $tenLop;
            $lop->MaKhoi = "10";
            $lop->MaNK = $request->MaNK;
            $lop->MSGV = $gvcn->MSGV;
            $lop->save();
            $newN = NhomTinNhan::create([
                'MaLop' => $maLop,
                'TenNhom' => $tenLop . "_" . $request->MaNK
            ]);
            $newNPH = NhomTinNhan::create([
                'MaLop' => $maLop,
                'TenNhom' => "PH_".$tenLop . "_" . $request->MaNK
            ]);
            ThanhVienNhom::create([
                'Nhom_id' => $newN->id,
                'MaTV' => $gvcn->MSGV
            ]);
            ThanhVienNhom::create([
                'Nhom_id' => $newNPH->id,
                'MaTV' => $gvcn->MSGV
            ]);
            $hocsinhTN = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','TN')->where("TrangThai",0)->inRandomOrder()->limit($soHSTN)->pluck('MSHS');
            HocLop::insert(
                $hocsinhTN->map(fn($mshs) => [
                    'MaLop' => $maLop,
                    'MSHS' => $mshs,
                    'MaNK' => $request->MaNK,
                ])->toArray()
            );
            ThanhVienNhom::insert(
                $hocsinhTN->map(fn($mshs) => [
                    'Nhom_id' =>  $newN->id,
                    'MaTV' => $mshs,
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
                    ]
                );
                $newN = NhomTinNhan::where("MaLop",$randomClass)->first();
                ThanhVienNhom::insert([
                        'Nhom_id' =>  $newN->id,
                        'MaTV' =>$hocsinhTN[$i],
                    ]
                );
            }
        }


        for ($i=1; $i <= $request->soLopXH ; $i++) { 
            $maLop = "C" . $nienkhoa . "10" . $i;
            $tenLop = "10C" . $i;
            $check=null;
            do{
                $gvcn = $gvXH->random();
                $check = Lop::where("MSGV",$gvcn->MSGV)->where("MaNK",$request->MaNK)->first();
            }while($check);
            $lop = new Lop();
            $lop->MaLop = $maLop;
            $lop->TenLop = $tenLop;
            $lop->MaKhoi = "10";
            $lop->MaNK = $request->MaNK;
            $lop->MSGV = $gvcn->MSGV;
            $lop->save();
            $newN = NhomTinNhan::create([
                'MaLop' => $maLop,
                'TenNhom' => $tenLop . "_" . $request->MaNK
            ]);
            $newNPH = NhomTinNhan::create([
                'MaLop' => $maLop,
                'TenNhom' => "PH_".$tenLop . "_" . $request->MaNK
            ]);
            ThanhVienNhom::create([
                'Nhom_id' => $newN->id,
                'MaTV' => $gvcn->MSGV
            ]);
            ThanhVienNhom::create([
                'Nhom_id' => $newNPH->id,
                'MaTV' => $gvcn->MSGV
            ]);
            $hocsinhTXH = HocSinh::with(['ban','lop'])->doesntHave('lop')->where('MaBan','XH')->where("TrangThai",0)->inRandomOrder()->limit($soHSXH)->pluck('MSHS');
            HocLop::insert(
                $hocsinhTXH->map(fn($mshs) => [
                    'MaLop' => $maLop,
                    'MSHS' => $mshs,
                    'MaNK' => $request->MaNK,
                ])->toArray()
            );
            ThanhVienNhom::insert(
                $hocsinhTXH->map(fn($mshs) => [
                    'Nhom_id' =>  $newN->id,
                    'MaTV' => $mshs,
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
                    ]
                );
                $newN = NhomTinNhan::where("MaLop",$randomClass)->first();
                ThanhVienNhom::insert([
                        'Nhom_id' =>  $newN->id,
                        'MaTV' => $hocsinhXH[$i],
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
        return response()->json("Đã cập nhật thành công!", Response::HTTP_OK);
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

    public function DuyetKQHT($MaLop)
    {
        $lop = Lop::find($MaLop);
        $hocsinh = $lop->hocSinh;
        $lenlop = HocLop::where('MaLop',$MaLop)->where("MaTT",3)->get();
        $totnghiep = [];
        $ban = substr($MaLop, 0, 1);
        $MSGV = $lop->MSGV;
        $NK = substr($MaLop, 3, 2);
        $MaNK = $NK . "-" . $NK+1;
        $NK = $NK.$NK+1;
        $sttLop = substr($MaLop, 7, 1);
        $MaKhoi = $lop->MaKhoi+1;
        $MaLopMoi = $ban . $NK . $MaKhoi . $sttLop;
        $khenThuong = KhenThuong::where("MaLop",$MaLop)->get();
        if($khenThuong){
            foreach ($khenThuong as $kt) {
                $kt->TrangThai = 1;
                $kt->save();
            }
        }
        if($lop->MaKhoi == 12){
            $totnghiep = $lenlop = HocLop::where('MaLop',$MaLop)->where("MaTT",4)->get();
            foreach($totnghiep as $tn){
                $hs = HocSinh::find($tn->MSHS);
                $hs->TrangThai = 2;
                $hs->save();
            }
        }else{
            $lopmoi = Lop::create(
                [
                    'MaLop' => $MaLopMoi,
                    'MaKhoi' => $MaKhoi,
                    'TenLop' => $MaKhoi . $ban . $sttLop,
                    'MaNK' => $MaNK,
                    'MSGV' => $MSGV,
                ]
            );
            
            foreach ($lenlop as $hs) {
                HocLop::create([
                    'MaLop' => $MaLopMoi,
                    'MSHS' => $hs->MSHS,
                    'MaNK' => $MaNK,
                ]);
            }
        }
        $lop->TrangThai = 2;
        $lop->save();
        return response()->json("Đã duyệt thành công!",200);
    }
    // public function createDiem(){
    //     $diem = new Diem();
    //     $monhocTN = MonHoc::where('MaMH', 'like', 'TN%')
    //         ->orWhere('MaMH', 'like', 'CB%')
    //         ->orWhereIn('MaMH', ['XH1', 'TC2'])
    //         ->get();
    //     $monhocXH = MonHoc::where('MaMH', 'like', 'XH%')
    //         ->orWhere('MaMH', 'like', 'CB%')
    //         ->orWhereIn('MaMH', ['TN1', 'TC1'])
    //         ->get();
    //     $hocsinhTN = HocSinh::where('MaBan',"TN")->get();
    //     $hocsinhXH = HocSinh::where('MaBan',"XH")->get();
    //     foreach($hocsinhTN as $hocsinh)
    //     {
    //         foreach($monhocTN as $monhoc)
    //         {
    //             $diem->MaHS = $hocsinh->MSHS;
    //             $diem->MaMH = $monhoc->MaMH;
    //         }
    //     }
    // }
}
