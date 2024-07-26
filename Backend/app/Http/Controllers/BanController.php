<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Ban;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $bans = Ban::all();
        return response()->json($bans, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $ban = Ban::create($request->all());

        return response()->json($ban, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param Products $product
     * @return \Illuminate\Http\Response
     */
    public function show(Products $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param Products $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $MaBan)
    {
        $ban = Ban::find($MaBan);
        if (!$ban) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $ban->update($request->all());
        return response()->json($ban, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Products $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($MaBan)
    {
        $data = Ban::find($MaBan);
        if (!$data) {
            return response()->json(['error' => 'Data not found'], Response::HTTP_NOT_FOUND);
        }
        $data->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
