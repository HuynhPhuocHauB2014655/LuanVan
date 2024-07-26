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
        Schema::create('Khoi', function (Blueprint $table) {
            $table->integer('MaKhoi',10)->primary();
            $table->string('TenKhoi');
            $table->timestamps();
        });
        Schema::create('Lop', function (Blueprint $table) {
            $table->string('MaLop',10)->primary();
            $table->string('TenLop');
            $table->integer('MaKhoi');
            $table->string('MaNK',10);
            $table->foreign('MaKhoi')->references('MaKhoi')->on('Khoi');
            $table->foreign('MaNK')->references('MaNK')->on('NienKhoa');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Khoi');
        Schema::dropIfExists('Lop');
    }
};
