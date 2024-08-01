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
        Schema::create('Ban', function (Blueprint $table) {
            $table->string('MaBan',2)->primary();
            $table->string('TenBan',10);
            $table->timestamps();
        });
        Schema::create('HocSinh', function (Blueprint $table) {
            $table->string('MSHS',10)->primary();
            $table->string('Hoten');
            $table->string('Ngaysinh');
            $table->string('GioiTinh',3);
            $table->string('QueQuan');
            $table->string('DanToc');
            $table->string('TonGiao');
            $table->string('DiaChi');
            $table->string('SDT',10);
            $table->string('MaBan',2);
            $table->foreign('MaBan')->references('MaBan')->on('Ban');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Ban');
        Schema::dropIfExists('HocSinh');
    }
};
