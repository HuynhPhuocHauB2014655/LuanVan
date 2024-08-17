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
        Schema::create('DanhGia', function (Blueprint $table) {
            $table->id();
            $table->string('DanhGia', 10);
            $table->string('MSHS',10);
            $table->string('MaMH',10);
            $table->string('MaHK',10);
            $table->foreign('MSHS')->references('MSHS')->on('HocSinh');
            $table->foreign('MaMH')->references('MaMH')->on('MonHoc');
            $table->foreign('MaHK')->references('MaHK')->on('HocKi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('DanhGia');
    }
};
