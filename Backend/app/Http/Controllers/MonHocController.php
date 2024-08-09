<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MonHoc;
use Illuminate\Http\Response;
class MonHocController extends Controller
{
    public function index()
    {
        $monhoc = MonHoc::all();
        return response()->json($monhoc, Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $monhoc = MonHoc::create($request->all());

        return response()->json($monhoc, Response::HTTP_CREATED);
    }

    public function monHocTN(){
        $monhoc = MonHoc::with('giaoVien')->where('MaMH','like','CB%')
        ->orWhere('MaMH','like','TN%')
        ->orWhere("maMH",'=','XH1')
        ->orWhere('MaMH','=','TC2')->get();
        return response()->json($monhoc, Response::HTTP_OK);
    }
    public function monHocXH(){
        $monhoc = MonHoc::with('giaoVien')->where('MaMH','like','CB%')
        ->orWhere('MaMH','like','XH%')
        ->orWhere("maMH",'=','TN1')
        ->orWhere('MaMH','=','TC1')->get();
        return response()->json($monhoc, Response::HTTP_OK);
    }
    public function show($maMH)
    {
        $monhoc = MonHoc::find($maMH);
        if (!$monhoc) {
            return response()->json(['message' => 'Data not found'], Response::HTTP::NOT_FOUND);
        }
        return response()->json($monhoc, Response::HTTP_OK);
    }

    public function update(Request $request, $maMH)
    {
        $monhoc = MonHoc::find($maMH);
        if (!$monhoc) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $monhoc->update($request->all());
        return response()->json($monhoc, Response::HTTP_OK);
    }

    public function destroy($maMH)
    {
        $data = MonHoc::find($maMH);
        if (!$data) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $data->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
