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
        Schema::create('NienKhoa', function (Blueprint $table) {
            $table->string('MaNK',10)->primary();
            $table->string('TenNK');
        });
        Schema::create('HocKi', function (Blueprint $table) {
            $table->string('MaHK',10)->primary();
            $table->string('TenHK');
            $table->string('MaNK',10);
            $table->foreign('MaNK')->references('MaNK')->on('NienKhoa');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('NienKhoa');
        Schema::dropIfExists('HocKi');
    }
};
