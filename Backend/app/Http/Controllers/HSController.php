<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\HocSinh;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HSController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $hocsinh = HocSinh::with('ban')->get();
        return response()->json($hocsinh, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $hocsinh = HocSinh::create($request->all());

        return response()->json($hocsinh, Response::HTTP_CREATED);
    }

    public function findByName($name)
    {
        $name = "%".$name."%";
        $hocsinh = HocSinh::where('HoTen','like',$name)->with('ban')->get();
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    /**
     * Display the specified resource.
     *
     * @param Products $product
     * @return \Illuminate\Http\Response
     */
    public function show($mshs)
    {
        $hocsinh = HocSinh::with('ban')->find($mshs);
        if (!$hocsinh) {
            return response()->json(['message' => 'Học sinh không tồn tại'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($hocsinh, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param Products $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $mshs)
    {
        $hocsinh = HocSinh::find($mshs);
        if (!$hocsinh) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $hocsinh->update($request->all());
        return response()->json($hocsinh, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Products $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($mshs)
    {
        $data = HocSinh::find($mshs);
        if (!$data) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $data->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
