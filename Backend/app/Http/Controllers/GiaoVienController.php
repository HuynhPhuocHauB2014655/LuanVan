<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GiaoVien;
use App\Models\PhanCong;
use App\Models\TKB;
use App\Models\TKGiaoVien;
use Illuminate\Http\Response;
use App\Http\Controllers\TaiKhoanController;
class GiaoVienController extends Controller
{
    protected $tkGiaoVien;
    public function __construct(TaiKhoanController $tkGiaoVien)
    {
        $this->tkGiaoVien = $tkGiaoVien;
    }
    public function allGV()
    {
        $giaovien = GiaoVien::with('monHoc')->paginate(10);
        return response()->json($giaovien, Response::HTTP_OK);
    }
    public function index()
    {
        $giaovien = GiaoVien::with('monHoc')->where("TrangThai",0)->paginate(10);
        return response()->json($giaovien, Response::HTTP_OK);
    }
    public function indexWithAccount($MSGV)
    {
        $hocsinh = Giaovien::with('taiKhoan')->find($MSGV);
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function store(Request $request)
    {
        $giaovien = GiaoVien::create($request->all());
        TKGiaoVien::create([

            'MSGV' => $giaovien->MSGV,
            'MatKhau' => $giaovien->MSGV . "123",
        ]);
        return response()->json($giaovien, Response::HTTP_CREATED);
    }

    public function show($MSGV)
    {
        $giaovien = GiaoVien::with(['monHoc','lop.hocSinh'])->find($MSGV);
        return response()->json($giaovien, Response::HTTP_OK);
    }
    public function showChuNhiem(Request $rq)
{
    $giaovien = GiaoVien::with(['monHoc', 'lop.hocSinh'])
        ->where('MSGV', $rq->MSGV)
        ->whereHas('lop', function($query) use ($rq) {
            $query->where('MaNK', $rq->MaNK);
        })
        ->first();

    return response()->json($giaovien, Response::HTTP_OK);
}
    public function showTeaching(Request $rq){
        // "23-24" -> "2324"
        $nienKhoa = str_replace("-","",$rq->MaNK);
        $class = PhanCong::with(['lop.hocSinh','monHoc'])->where('MSGV',$rq->MSGV)->where('MaLop','like',"%{$nienKhoa}%")->get();
        return response()->json($class, Response::HTTP_OK);
    }
    public function findByName($name)
    {
        $giaovien = GiaoVien::with('monHoc')->where('TenGV','like','%'.$name.'%')->get();
        return response()->json($giaovien, Response::HTTP_OK);
    }
    public function lastTeacher(){
        $giaovien = GiaoVien::latest()->pluck('MSGV')->first();
        return response()->json($giaovien, Response::HTTP_OK);
    }
    public function update(Request $request, $MSGV)
    {
        $giaovien = GiaoVien::find($MSGV);
        if (!$giaovien) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $giaovien->update($request->all());
        return response()->json($giaovien, Response::HTTP_OK);
    }

    public function destroy($MSGV)
    {
        $data = GiaoVien::find($MSGV);
        if (!$data) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $data->TrangThai = 1;
        $data->save();
        return response()->json("Đã xóa thành công", Response::HTTP_NO_CONTENT);
    }
    public function getTKB(Request $rq){
        $tkb = TKB::with(['lop','monHoc'])->where("MSGV",$rq->MSGV)->where("MaNK",$rq->MaNK)->get();
        return response()->json($tkb, Response::HTTP_OK);
    }
}
