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
        Schema::create('TaiKhoanHS', function (Blueprint $table) {
            $table->string('MSHS',10)->primary();
            $table->string('MatKhau');
            $table->foreign('MSHS')->references('MSHS')->on('HocSinh');
            $table->timestamps();
        });
        Schema::create('TaiKhoanGV', function (Blueprint $table) {
            $table->string('MSGV',10)->primary();
            $table->string('MatKhau');
            $table->foreign('MSGV')->references('MSGV')->on('GiaoVien');
            $table->timestamps();
        });
        Schema::create('admin', function (Blueprint $table) {
            $table->string('MaBaoMat')->primary();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('TaiKhoanHS');
        Schema::dropIfExists('TaiKhoaGV');
        Schema::dropIfExists('admin');
    }
};
