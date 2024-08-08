<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TKB;
use App\Models\Lop;
use App\Models\GiaoVien;
use App\Models\MonHoc;
use App\Models\NgayTrongTuan;
use Illuminate\Http\Response;
class TKBController extends Controller
{
    public function index(){
        $tkb = TKB::all();
        return response()->json($tkb);
    }

}
