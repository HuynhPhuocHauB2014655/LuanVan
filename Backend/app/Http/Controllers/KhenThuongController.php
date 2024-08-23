<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\HocSinh;
use App\Models\Lop;
use App\Models\KhenThuong;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
class KhenThuongController extends Controller
{
    public function index(){
        $kt = KhenThuong::with(['hocSinh','lop','nienKhoa'])->orderBy('MaNK')->get();
        return response()->json($kt,200);
    }

    public function create(Request $rq)
    {
        $kt = KhenThuong::create($rq->all());
        return response()->json($kt,201);
    }
    public function getLop($MaLop)
    {
        $kt = KhenThuong::with(['hocSinh','lop','nienKhoa'])->where("MaLop",$MaLop)->get();
        return response()->json($kt,200);
    }
    public function update(Request $rq)
    {
        $kt = KhenThuong::find($rq->id);
        $kt->update($rq->all());
        return response()->json("Đã cập nhật thành công!",200);
    }
}