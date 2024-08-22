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
        $kt = new KhenThuong();
        
    }
}