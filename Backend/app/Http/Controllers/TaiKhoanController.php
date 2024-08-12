<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\TKHocSinh;
use App\Models\TKGiaoVien;
use App\Models\Admin;
use App\Models\HocSinh;
use App\Models\GiaoVien;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

Class TaiKhoanController extends Controller
{
    public function indexHS()
    {
        $tkhocsinh = TKHocSinh::with('hocSinh')->get();
        return response()->json($tkhocsinh, 200);
    }
    public function indexGV()
    {
        $tkgiaocvien = TKHocSinh::with('giaoVien')->get();
        return response()->json($tkgiaocvien, 200);
    }
    public function createHS(Request $request)
    {
        $tkhocsinh = TKHocSinh::create($request->all());
        return response()->json($tkhocsinh, 201);
    }
    public function createGV(Request $request)
    {
        $tkgiaovien = TKGiaoVien::create($request->all());
        return response()->json($tkgiaovien, 201);
    }
    public function updateHS(Request $request)
    {
        $tkhocsinh = TKHocSinh::find($request->MSHS);
        if(!$tkhocsinh)
        {
            return response()->json("Không thể tìm thấy tài khoản",404);
        }
        $tkhocsinh->MatKhau = $request->MatKhau;
        $tkhocsinh->save();
        return response()->json($tkhocsinh, 200);
    }
    public function updateGV(Request $request)
    {
        $tkgiaovien = TKGiaoVien::find($request->MSGV);
        if(!$tkgiaocvien)
        {
            return response()->json("Không thể tìm thấy tài khoản",404);
        }
        $tkgiaovien->MatKhau = $request->MatKhau;
        $tkgiaovien->save();
        return response()->json($tkgiaovien, 200);
    }
    public function deleteHS($id)
    {
        $tkhocsinh = TKHocSinh::find($id);
        if(!$tkhocsinh)
        {
            return response()->json("Không thể tìm thấy tài khoản",404);
        }
        $tkhocsinh->delete();
        return response()->json("Xóa thành công", 200);
    }
    public function deleteGV($id)
    {
        $tkgiaovien = TKGiaoVien::find($id);
        if(!$tkgiaovien)
        {
            return response()->json("Không thể tìm thấy tài khoản",404);
        }
        $tkgiaovien->delete();
        return response()->json("Xóa thành công", 200);
    }
    public function changeAdmin($mabaomat)
    {
        $baomat = new Admin();
        $baomat->MaBaomat = $mabaomat;
        $baomat->save();
        return response()->json("Sửa thành công", 200);
    }
    public function adminLogin($maBaoMat){
        $admin = Admin::pluck('MaBaoMat')->first();
        if(Hash::check($maBaoMat,$admin))
        {
            return response()->json("Đăng nhập thành công", 200);
        }
        return response()->json("Mã bảo mật không chính xác",401);
    }
}