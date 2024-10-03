<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\ThongBao;
use App\Models\HocSinh;
use App\Models\GiaoVien;
use App\Models\Lop;
use App\Models\HocLop;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Events\sendNotify;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TBController extends Controller
{
    public function index()
    {
        $tb = ThongBao::all();
        return response()->json($tb, 200);
    }
    public function getGV($MSGV)
    {
        $tb = ThongBao::where("NguoiNhan",$MSGV)->orWhere("NguoiNhan","TT_{$MSGV}")->orWhere("NguoiNhan","GV_{$MSGV}")->orderBy("created_at","DESC")->get();
        return response()->json($tb, 200);
    }
    public function getSendedGV($MSGV)
    {
        $prefixes = ['GV_', 'HS_', 'TT_','L_'];
        $conditions = implode(' AND ', array_map(function ($prefix) {
            return "NguoiNhan NOT LIKE ?";
        }, $prefixes));
    
        $params = array_map(function ($prefix) {
            return "{$prefix}%";
        }, $prefixes);
        if($MSGV == "Nhà trường"){
            $tb = ThongBao::whereIn('NguoiGui', ["Nhà trường", "Phòng đào tạo", "Phòng nhân sự"])->whereRaw($conditions, $params)->orderBy("created_at","DESC")->get();
        }else{
            $tb = ThongBao::where('NguoiGui','like',"%{$MSGV}")->whereRaw($conditions, $params)->orderBy("created_at","DESC")->get();
        }
        return response()->json($tb, 200);
    }
    public function getHS($MSHS)
    {
        $tb = ThongBao::where("NguoiNhan",$MSHS)->orWhere("NguoiNhan","L_{$MSHS}")->orWhere("NguoiNhan","TT_{$MSHS}")->orWhere("NguoiNhan","_{$MSHS}")->orderBy("created_at","DESC")->get();
        return response()->json($tb, 200);
    }
    public function create(Request $rq)
    {
        $findHS = HocSinh::find($rq->NguoiNhan);
        $findLop = Lop::find($rq->NguoiNhan);
        if(!$findHS && !$findLop && $rq->NguoiNhan != "TT" && $rq->NguoiNhan != "GV" && $rq->NguoiNhan != "HS"){
            return response()->json('Người nhận không tồn tại',404);
        }
        if($rq->NguoiNhan == "TT"){
            $hs = HocSinh::where("TrangThai",0)->get();
            $gv = GiaoVien::where("TrangThai",0)->get();
            ThongBao::create([
                "NguoiGui"=>$rq->NguoiGui,
                "NguoiNhan"=>"TT",
                "NoiDung"=>$rq->NoiDung,
                "TrangThai"=>$rq->TrangThai,
                "TieuDe"=>$rq->TieuDe
            ]);
            foreach($hs as $hs){
                ThongBao::create([
                    "NguoiGui"=>$rq->NguoiGui,
                    "NguoiNhan"=>"TT_".$hs->MSHS,
                    "NoiDung"=>$rq->NoiDung,
                    "TrangThai"=>$rq->TrangThai,
                    "TieuDe"=>$rq->TieuDe
                ]);
                event(new sendNotify("Bạn có thông báo mới từ ".$rq->NguoiGui,$hs->MSHS));
            }
            foreach($gv as $gv){
                ThongBao::create([
                    "NguoiGui"=>$rq->NguoiGui,
                    "NguoiNhan"=>"TT_".$gv->MSGV,
                    "NoiDung"=>$rq->NoiDung,
                    "TrangThai"=>$rq->TrangThai,
                    "TieuDe"=>$rq->TieuDe
                ]);
                event(new sendNotify("Bạn có thông báo mới từ ".$rq->NguoiGui,$gv->MSGV));
            }
            return response()->json('Đã gửi thông báo thành công!', 200);
        }
        if($rq->NguoiNhan == "HS"){
            ThongBao::create([
                "NguoiGui"=>$rq->NguoiGui,
                "NguoiNhan"=>"HS",
                "NoiDung"=>$rq->NoiDung,
                "TrangThai"=>$rq->TrangThai,
                "TieuDe"=>$rq->TieuDe
            ]);
            $hs = HocSinh::where("TrangThai",0)->get();
            foreach($hs as $hs){
                ThongBao::create([
                    "NguoiGui"=>$rq->NguoiGui,
                    "NguoiNhan"=>"HS_".$hs->MSHS,
                    "NoiDung"=>$rq->NoiDung,
                    "TrangThai"=>$rq->TrangThai,
                    "TieuDe"=>$rq->TieuDe
                ]);
                event(new sendNotify("Bạn có thông báo mới từ ".$rq->NguoiGui,$hs->MSHS));
            }
            return response()->json('Đã gửi thông báo thành công!', 200);
        }
        if($rq->NguoiNhan == "GV"){
            ThongBao::create([
                "NguoiGui"=>$rq->NguoiGui,
                "NguoiNhan"=>"GV",
                "NoiDung"=>$rq->NoiDung,
                "TrangThai"=>$rq->TrangThai,
                "TieuDe"=>$rq->TieuDe
            ]);
            $gv = GiaoVien::where("TrangThai",0)->get();
            foreach($gv as $gv){
                ThongBao::create([
                    "NguoiGui"=>$rq->NguoiGui,
                    "NguoiNhan"=>"GV_".$gv->MSGV,
                    "NoiDung"=>$rq->NoiDung,
                    "TrangThai"=>$rq->TrangThai,
                    "TieuDe"=>$rq->TieuDe
                ]);
                event(new sendNotify("Bạn có thông báo mới từ ".$rq->NguoiGui,$gv->MSGV));
            }
            return response()->json('Đã gửi thông báo thành công!', 200);
        }
        if($findLop){
            $hocsinh = HocLop::where('MaLop',$findLop->MaLop)->get();
            ThongBao::create([
                "NguoiGui"=>$rq->NguoiGui,
                "NguoiNhan"=>$rq->NguoiNhan,
                "NoiDung"=>$rq->NoiDung,
                "TrangThai"=>$rq->TrangThai,
                "TieuDe"=>$rq->TieuDe
            ]);
            foreach($hocsinh as $hs){
                ThongBao::create([
                    "NguoiGui"=>$rq->NguoiGui,
                    "NguoiNhan"=>"L_".$hs->MSHS,
                    "NoiDung"=>$rq->NoiDung,
                    "TrangThai"=>$rq->TrangThai,
                    "TieuDe"=>$rq->TieuDe
                ]);
                event(new sendNotify("Bạn có thông báo mới từ ".$rq->NguoiGui,$hs->MSHS));
            }
            return response()->json('Đã gửi thông báo thành công!', 200);
        }
        ThongBao::create($rq->all());
        return response()->json('Đã gửi thông báo thành công!', 200);
    }
    public function update(Request $rq)
    {
        $tb = ThongBao::find($rq->id);
        if(!$tb)
        {
            return response()->json('Không tìm thấy thông báo!', 404);
        }
        $tb->update($rq->all());
        return response()->json('Cập nhật thông báo thành công!', 200);
    }
    public function delete($id)
    {
        $tb = ThongBao::find($id);
        if(!$tb)
        {
            return response()->json('Không tìm thấy thông báo!', 404);
        }
        $tb->delete();
        return response()->json('Xóa thông báo thành công!', 200);
    }
}