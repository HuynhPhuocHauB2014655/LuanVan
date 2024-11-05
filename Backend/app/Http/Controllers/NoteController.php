<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NoteController extends Controller
{
    public function show($userName){
        $note = NoTe::where("UserName",$userName)->get();
        return response()->json($note,200);
    }
    public function create(Request $rq){
        $note = Note::create($rq->all());
        return response()->json($note,200);
    }
    public function update(Request $rq){
        $note = Note::find($rq->id);
        if(!$note){
            return response()->json('Note not found',404);
        }
        $note->update($rq->all());
        return response()->json($note,200);
    }
    public function delete($id){
        $note = Note::find($id);
        if(!$note){
            return response()->json('Note not found',404);
        }
        $note->delete();
        return response()->json("Đã xóa thành công!",200);
    }
}