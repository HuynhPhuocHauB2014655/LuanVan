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
        Schema::create('MonHoc', function (Blueprint $table) {
            $table->string('MaMH',10)->primary();
            $table->string('TenMH');
            $table->timestamps();
        });
        Schema::create('LoaiDiem', function (Blueprint $table) {
            $table->string('MaLoai',10)->primary();
            $table->string('TenLoai');
            $table->timestamps();
        });
        Schema::create('Diem', function (Blueprint $table) {
            $table->float('Diem',10);
            $table->string('MaMH',10);
            $table->string('MSHS',10);
            $table->string('MaLoai',10);
            $table->string('MaHK',10);
            $table->foreign('MaMH')->references('MaMH')->on('MonHoc');
            $table->foreign('MSHS')->references('MSHS')->on('HocSinh');
            $table->foreign('MaLoai')->references('MaLoai')->on('LoaiDiem');
            $table->foreign('MaHK')->references('MaHK')->on('HocKi');
            $table->primary(array(
                'MSHS',
                'MaMH',
                'MaHK'
            ));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_diem');
    }
};
