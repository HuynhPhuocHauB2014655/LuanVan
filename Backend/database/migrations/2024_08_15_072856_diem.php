<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('Diem', function (Blueprint $table) {
            $table->id();
            $table->string('MSHS',10);
            $table->string('MaMH',10);
            $table->string('MaHK',10);
            $table->string('MaLoai',10);
            $table->float('Diem');
            $table->foreign('MSHS')->references('MSHS')->on('HocSinh');
            $table->foreign('MaMH')->references('MaMH')->on('MonHoc');
            $table->foreign('MaHK')->references('MaHK')->on('HocKi');
            $table->foreign('MaLoai')->references('MaLoai')->on('LoaiDiem');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Diem');
    }
};
