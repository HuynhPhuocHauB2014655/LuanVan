<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NienKhoa;
use App\Models\NienKhoaHienTai;
use Illuminate\Http\Response;
class NienKhoaController extends Controller
{
    public function index()
    {
        $nienkhoa = NienKhoa::all();
        return response()->json($nienkhoa, Response::HTTP_OK);
    }

    public function setNienKhoaHienTai(Request $request){
        NienKhoaHienTai::truncate();
        $nk_now = new NienKhoaHienTai();
        $nk_now->NienKhoa = $request->nk;
        $nk_now->TenNK = $request->tennk;
        $nk_now->NgayBD = $request->ngaybd;
        $nk_now->HanSuaDiem = $request->hansuadiem;
        $nk_now->save();
        return response()->json("Đã thêm niên khóa hiện tại thành công", Response::HTTP_OK);
    }
    public function getNienKhoaHienTai(Request $request){
        $nienkhoa = NienKhoaHienTai::first();
        return response()->json($nienkhoa, Response::HTTP_OK);
    }
    public function store(Request $request)
    {
        $nienkhoa = NienKhoa::create($request->all());

        return response()->json($nienkhoa, Response::HTTP_CREATED);
    }

    public function show($maNK)
    {
        $nienkhoa = NienKhoa::find($maNK);
        if (!$nienkhoa) {
            return response()->json(['message' => 'Data not found'], Response::HTTP::NOT_FOUND);
        }
        return response()->json($nienkhoa, Response::HTTP_OK);
    }

    public function update(Request $request, $maNK)
    {
        $nienkhoa = NienKhoa::find($maNK);
        if (!$nienkhoa) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $nienkhoa->update($request->all());
        return response()->json($nienkhoa, Response::HTTP_OK);
    }

    public function destroy($maNK)
    {
        $data = NienKhoa::find($maNK);
        if (!$data) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $data->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
