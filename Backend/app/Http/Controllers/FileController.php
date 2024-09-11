<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class FileController extends Controller
{
    public function store(Request $request)
    {
        // Store the uploaded file
        $file = $request->file('file');

        if ($file) {
            $fileName = time() . '.' . $file->getClientOriginalExtension();
            $destinationPath = 'avatars';
            try {
                $file->storeAs($destinationPath, $fileName, 'public');

                // Store file information in the database
                $uploadedFile = new File();
                $uploadedFile->FileName = $fileName;
                $uploadedFile->save();

                // Return a JSON response with success message
                return response()->json(['message' => "File uploaded successfully.", 'file_name' => $fileName], 200);
            } catch (\Exception $e) {
                // Return a JSON response with error message
                return response()->json(['message' => "Failed to upload the file.", 'error' => $e->getMessage()], 500);
            }
        } else {
            // Return a JSON response if no file was uploaded
            return response()->json(['message' => "No file uploaded."], 400);
        }
    }
    public function getFileName(){
        $fName = File::first();
        return response()->json($fName, 200);
    }
    public function getAvatar($filename)
    {
        $filePath = 'avatars/' . $filename;

        if (Storage::disk('public')->exists($filePath)) {
            return Storage::disk('public')->response($filePath);
        } else {
            return response()->json(['message' => 'File not found.'], 404);
        }
    }
}