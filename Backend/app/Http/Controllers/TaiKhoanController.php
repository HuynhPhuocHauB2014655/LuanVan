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
use Carbon\Carbon;

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
        $tkhocsinh->MatKhau = $request->password;
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
        $tkgiaovien->MatKhau = $request->password;
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
    public function changeAdmin(Request $request)
    {
        $admin = Admin::find($request->TaiKhoan);
        if(!Hash::check($request->old_password,$admin->MatKhau))
        {
            return response()->json("Mã bảo mật không chính xác", 401);
        }
        $admin->MatKhau = $request->new_password;
        $admin->save();
        return response()->json("Đã cập nhật mã bảo mật thành công", 200);
    }
    public function checkTime($id)
    {
        $admin = Admin::find($id);
        return response()->json($admin->created_at, 200);
    }
    public function adminLogin(Request $request){
        $admin = Admin::find($request->TaiKhoan);
        if(!$admin){
            return response()->json("Không tìm thấy tài khoản", 404);
        }
        if(Hash::check($request->MatKhau,$admin->MatKhau))
        {
            return response()->json($admin->TaiKhoan, 200);
        }
        return response()->json("Mật khẩu không chính xác",401);
    }
    public function findHocSinh($MSHS)
    {
        $hocsinh = TKHocSinh::with(['hocSinh' => function($query) {
            $query->select('HoTen','MSHS');
        }])->select('MSHS','updated_at')->find($MSHS);
        if($hocsinh)
        {
            return response()->json($hocsinh, Response::HTTP_OK);
        }
        return response()->json("not found",404);
    }
    public function findGiaoVien($MSGV)
    {
        $giaovien = TKGiaoVien::with(['giaoVien' => function($query) {
            $query->select('TenGV','MSGV');
        }])->select('MSGV','updated_at')->find($MSGV);
        if($giaovien)
        {
            return response()->json($giaovien, Response::HTTP_OK);
        }
        return response()->json("not found",404);
    }
    public function changePassHSAdmin(Request $request)
    {
        $hocsinh = TKHocSinh::find($request->MSHS);
        $hocsinh->MatKhau = $request->password;
        $hocsinh->save();
        return response()->json("Đổi mật khẩu thành công", 200);
    }
    public function changePassGVAdmin(Request $request)
    {
        $giaovien = TKGiaoVien::find($request->MSGV);
        $giaovien->MatKhau = $request->password;
        $giaovien->save();
        return response()->json("Đổi mật khẩu thành công", 200);
    }
    public function changePassGV(Request $request)
    {
        $giaovien = TKGiaoVien::find($request->MSGV);
        if(!Hash::check($request->oldPassword, $giaovien->MatKhau))
        {
            return response()->json("Mật khẩu cũ không đúng", 401);
        }
        $giaovien->MatKhau = $request->newPassword;
        $giaovien->save();
        return response()->json("Đổi mật khẩu thành công", 200);
    }
    public function changePassHS(Request $request)
    {
        $hocsinh = TKHocSinh::find($request->MSHS);
        if(!Hash::check($request->oldPassword, $hocsinh->MatKhau))
        {
            return response()->json("Mật khẩu cũ không đúng", 401);
        }
        $hocsinh->MatKhau = $request->newPassword;
        $hocsinh->save();
        return response()->json("Đổi mật khẩu thành công", 200);
    }
    public function HSLogin(Request $request)
    {
        $hocsinh = TKHocSinh::where('MSHS', $request->MSHS)->first();
        if(!$hocsinh){
            return response()->json("Sai mã học sinh", 401);
        }
        if(!Hash::check($request->password, $hocsinh->MatKhau))
        {
            return response()->json("Sai mật khẩu", 401);
        }
        return response()->json($hocsinh->MSHS, 200);
    }
    public function GVLogin(Request $request)
    {
        $giaovien = TKGiaoVien::where('MSGV', $request->MSGV)->first();
        if(!$giaovien){
            return response()->json("Sai mã học sinh", 401);
        }
        if(!Hash::check($request->MatKhau, $giaovien->MatKhau))
        {
            return response()->json("Sai mật khẩu", 401);
        }
        return response()->json($giaovien->MSGV, 200);
    }
    public function test(){
        $admin = Admin::create([
            'TaiKhoan' => "admin",
            'MatKhau' => "123456",
        ]);
        $daoTao = Admin::create([
            'TaiKhoan' => "daotao",
            'MatKhau' => "123456",
        ]);
        $nhanSu = Admin::create([
            'TaiKhoan' => "nhansu",
            'MatKhau' => "123456",
        ]);
        return response()->json("OK",200);
    }
}