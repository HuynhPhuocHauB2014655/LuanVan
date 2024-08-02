<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HocKi;
use Illuminate\Http\Response;
class HocKiController extends Controller
{
    public function index()
    {
        $hocki = HocKi::all();
        return response()->json($hocki, Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $hocki = HocKi::create($request->all());

        return response()->json($hocki, Response::HTTP_CREATED);
    }

    public function show($maHK)
    {
        $hocki = HocKi::find($maHK);
        if (!$hocki) {
            return response()->json(['message' => 'Data not found'], Response::HTTP::NOT_FOUND);
        }
        return response()->json($hocki, Response::HTTP_OK);
    }

    public function update(Request $request, $maHK)
    {
        $hocki = HocKi::find($maHK);
        if (!$hocki) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $hocki->update($request->all());
        return response()->json($hocki, Response::HTTP_OK);
    }

    public function destroy($maHK)
    {
        $data = HocKi::find($maHK);
        if (!$data) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $data->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
