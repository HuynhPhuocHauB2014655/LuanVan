<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GiaoVien;
use Illuminate\Http\Response;
class GiaoVienController extends Controller
{
    public function index()
    {
        $giaovien = GiaoVien::with('monHoc')->paginate(10);
        return response()->json($giaovien, Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $giaovien = GiaoVien::create($request->all());

        return response()->json($giaovien, Response::HTTP_CREATED);
    }

    public function show($MSGV)
    {
        $giaovien = GiaoVien::find($MSGV);
        if (!$giaovien) {
            return response()->json(['message' => 'Data not found'], Response::HTTP::NOT_FOUND);
        }
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
        $data->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
