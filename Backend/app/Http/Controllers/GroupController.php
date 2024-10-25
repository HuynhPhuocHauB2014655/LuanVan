<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GroupMessage;
use App\Models\CustomGroup;
use App\Models\HocSinh;
use App\Models\GiaoVien;
use App\Models\PhuHuynh;
use App\Models\GroupMember;
use App\Models\Lop;
use App\Events\sendMessage;
use Illuminate\Http\Response;

class GroupController extends Controller
{
    public function index($NguoiNhan)
    {
        $message = GroupMessage::where("NguoiNhan",$NguoiNhan)->get();
        return response()->json($message,200);
    }
    public function getGroup($id){
        $nhom = CustomGroup::with(['member', 'message' => function ($query) {
            $query->latest('created_at')
                  ->limit(1);
        }])
        ->whereHas('member', function ($query) use ($id) {
            $query->where('MaTV', $id);
        })
        ->select('CustomGroup.*')
        ->orderBy(
            \DB::raw('(SELECT MAX(created_at) FROM GroupMessage WHERE GroupMessage.Nhom_id = CustomGroup.id)'),
            'desc'
        )
        ->get();
        return response()->json($nhom,200);
    }
    public function getAllGroup(){
        $nhom = CustomGroup::with(['member', 'message'])
        ->select('CustomGroup.*')
        ->orderBy(
            \DB::raw('(SELECT MAX(created_at) FROM GroupMessage WHERE GroupMessage.Nhom_id = CustomGroup.id)'),
            'desc'
        )
        ->get();
        return response()->json($nhom,200);
    }
    public function getAllTN($id){
        $message = GroupMessage::where('Nhom_id',$id)->where("NguoiNhan",$id)->get();
        return response()->json($message,200);
    }
    public function getTN($id){
        $message = GroupMessage::where('Nhom_id',$id)->get();
        return response()->json($message,200);
    }
    public function getNew(Request $rq){
        $message = GroupMessage::where('Nhom_id',$id)->get();
        return response()->json($message,200);
    }
    public function countNotSeen($id){
        $count = CustomGroup::whereHas('member', function ($query) use ($id) {
            $query->where('MaTV', $id);
        })
        ->withCount(['message as unread_count' => function ($query) use ($id) {
            $query->where('TrangThai', 0)
                  ->where('NguoiNhan', "like", $id . "%");
        }])
        ->get();
        return response()->json($count,200);
    }
    public function create(Request $rq){
        $newG = CustomGroup::create($rq->all());
        return response()->json($newG,200);
    }
    public function addMember(Request $rq){
        $group = MhomTinNhan::find($rq->groupId);
        if(!$group){
            return response()->json('Group not found', 404);
        }
        $list = $rq->list;
        foreach($list as $item){
            $group->member()->attach($item);
        }
        return response()->json("Đã thêm thành viên thành công!",200);
    }
    public function setSeen(Request $rq){
        $tn = GroupMessage::where('NguoiNhan',$rq->NguoiNhan)->where("Nhom_id",$rq->Nhom_id)->where('TrangThai',0)->get();
        foreach($tn as $tn){
            $tn->TrangThai = 1;
            $tn->save();
        }
        return response()->json("OK",200);
    }
    public function store(Request $rq)
    {
        $TVNhom = GroupMember::where("Nhom_id","=",$rq->Nhom_id)->where("MaTV","!=",explode('-', $rq->NguoiGui)[0])->get();
        $tn = new GroupMessage();
        $tn->NguoiGui = $rq->NguoiGui;
        $tn->NguoiNhan = $rq->Nhom_id;
        $tn->GroupMessage = $rq->GroupMessage;
        $tn->Nhom_id = $rq->Nhom_id;
        $tn->save();
        foreach($TVNhom as $tv){
            $message = new GroupMessage();
            $message->NguoiGui = $rq->NguoiGui;
            if(substr($tv->MaTV,0,2) == 'GV'){
                $gv = GiaoVien::find($tv->MaTV);
                $message->NguoiNhan = $gv->MSGV."-".$gv->TenGV;
            }elseif(substr($tv->MaTV,0,2) == 'PH'){
                $ph = PhuHuynh::where("TaiKhoan",$tv->MaTV)->first();
                $hocsinh = HocSinh::find($ph->MSHS);
                $message->NguoiNhan = $ph->TaiKhoan."-Phụ huynh ".$hocsinh->HoTen;
            }else{
                $hs = HocSinh::find($tv->MaTV);
                $message->NguoiNhan = $hs->MSHS."-".$hs->HoTen;
            }
            $message->GroupMessage = $rq->GroupMessage;
            $message->Nhom_id = $rq->Nhom_id;
            $message->save();
            event(new sendMessage($message,$tv->MaTV));
        }
        return response()->json($tn);
    }

    public function getName($id)
    {
        $hocsinh = HocSinh::find($id);
        if($hocsinh){
            return response()->json($hocsinh->HoTen, Response::HTTP_OK);
        }
        $giaovien = GiaoVien::find($id);
        if($giaovien){
            return response()->json($giaovien->TenGV." (Giáo viên)", Response::HTTP_OK);
        }
        $ph = PhuHuynh::where("TaiKhoan",$id)->first();
        if($ph){
            $hs = HocSinh::find($ph->MSHS);
            $ten = "Phụ huynh ". $hs->HoTen;
            return response()->json($ten, Response::HTTP_OK);
        }
    }
}
