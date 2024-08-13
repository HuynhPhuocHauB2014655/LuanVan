<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\HocSinh;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
class HSController extends Controller
{
    public function index()
    {
        $hocsinh = HocSinh::with(['ban', 'lop'])->paginate(10);
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function indexWithAccount($MSHS)
    {
        $hocsinh = HocSinh::with(['taiKhoan' => function($query) {
            $query->select('updated_at','MSHS');
        }])->find($MSHS);
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function store(Request $request)
    {
        $hocsinh = HocSinh::create($request->all());

        return response()->json($hocsinh, Response::HTTP_CREATED);
    }
    public function newStudents(){
        $hocsinh = HocSinh::with(['ban','lop'])->doesntHave('lop')->get();
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function findByName($name)
    {
        $name = "%".$name."%";
        $hocsinh = HocSinh::where('HoTen','like',$name)->with('ban')->get();
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function show($mshs)
    {
        $hocsinh = HocSinh::with(['ban','taiKhoan'])->find($mshs);
        if (!$hocsinh) {
            return response()->json(['message' => 'Học sinh không tồn tại'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($hocsinh, Response::HTTP_OK);
    }
    public function lastStudent(){
        $hocsinh = HocSinh::latest()->pluck('MSHS')->first();
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
        $data->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
