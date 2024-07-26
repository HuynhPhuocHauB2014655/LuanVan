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
        Schema::create('GiaoVien', function (Blueprint $table) {
            $table->string('MSGV',10)->primary();
            $table->string('TenGV');
            $table->string('NgaySinh');
            $table->string('GioiTinh');
            $table->string('DiaChi');
            $table->string('SDT');
            $table->string('ChuyenMon',10);
            $table->foreign('ChuyenMon')->references('MaMH')->on('MonHoc');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('GiaoVien');
    }
};