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
        Schema::create('TBMonCN', function (Blueprint $table) {
            $table->id();
            $table->string('MSHS',10);
            $table->string('MaMH',10);
            $table->string('MaNK',10);
            $table->float('Diem');
            $table->foreign('MSHS')->references('MSHS')->on('HocSinh');
            $table->foreign('MaMH')->references('MaMH')->on('MonHoc');
            $table->foreign('MaNK')->references('MaNK')->on('NienKhoa');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('TBMonCN');
    }
};