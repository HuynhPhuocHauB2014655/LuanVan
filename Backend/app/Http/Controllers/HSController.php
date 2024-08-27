<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\HocSinh;
use App\Models\HocLop;
use App\Models\TKHocSinh;
use App\Models\TKB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
class HSController extends Controller
{
    public function allHS()
    {
        $hocsinh = HocSinh::with(['ban', 'lop' => function ($query) {
            $query->latest();
        }])->paginate(20);
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function indexAll()
    {
        $hocsinh = HocSinh::with(['ban', 'lop' => function ($query) {
            $query->latest();
        }])->paginate(20);
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function index()
    {
        $hocsinh = HocSinh::with(['ban', 'lop'])->where("TrangThai",0)->paginate(10);
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function store(Request $request)
    {
        $hocsinh = HocSinh::create($request->all());
        TKHocSinh::create([

            'MSHS' => $hocsinh->MSHS,
            'MatKhau' => $hocsinh->MSHS . "123",
        ]);
        return response()->json($hocsinh, Response::HTTP_CREATED);
    }
    public function newStudents(){
        $hocsinh = HocSinh::with(['ban','lop'])->where("TrangThai",0)->doesntHave('lop')->get();
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function findByName($name)
    {
        $name = "%".$name."%";
        $hocsinh = HocSinh::where('HoTen','like',$name)->with(['ban', 'lop'])->get();
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function show($mshs)
    {
        $hocsinh = HocSinh::with(['ban','taiKhoan','lop' => function ($query) {
            $query->latest();
        }])->find($mshs);
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function lastStudent($MaNK){
        $hocsinh = HocSinh::where("MSHS", 'like', "%$MaNK%")
        ->orderBy('MSHS', 'desc') // Use 'desc' if you want the latest by MSHS order
        ->pluck('MSHS')
        ->first();
        if (!$hocsinh) {
            return response()->json("A2324000", Response::HTTP_OK);
        }
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function update(Request $request, $mshs)
    {
        $hocsinh = HocSinh::find($mshs);
        if (!$hocsinh) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $hocsinh->update($request->all());
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function destroy($mshs)
    {
        $data = HocSinh::find($mshs);
        if (!$data) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $data->TrangThai = 1;
        $data->save();
        return response()->json("Đã xóa thành công", Response::HTTP_NO_CONTENT);
    }
    public function oLaiLop($MaNK){
        $a = (int) substr($MaNK,0,2)-1 . "-" . substr($MaNK,0,2);
        $hs = HocLop::with(['lop','hocSinh.ban'])->where("MaNK",$a)->where("MaTT",1)->get();
        return response()->json($hs,200);
    }

    // check xem hoc sinh o lai lop co duoc them vao lop moi hay chua
    public function checkAdd(Request $rq){
        $hocsinh = $rq->hs;
        $newNK = substr($hocsinh['MaNK'],3,2) . "-" . substr($hocsinh['MaNK'],3,2) + 1;
        $hs = HocLop::where('MaNK',$newNK)->where('MSHS',$hocsinh["MSHS"])->first();
        if($hs){
            return response()->json(true,200);
        }
        return response()->json(false,200);
    }

    public function getTKB(Request $rq){
        $tkb = TKB::with(['lop','monHoc','giaoVien'])->where("MaLop",$rq->MaLop)->where("MaNK",$rq->MaNK)->get();
        return response()->json($tkb, Response::HTTP_OK);
    }

}
