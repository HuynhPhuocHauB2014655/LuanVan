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
        Schema::create('PhanCongDay', function (Blueprint $table) {
            $table->id();
            $table->string('MaLop',10);
            $table->string('MSGV',10);
            $table->string('MaMH',10);
            $table->foreign('MaLop')->references('MaLop')->on('Lop');
            $table->foreign('MSGV')->references('MSGV')->on('GiaoVien');
            $table->foreign('MaMH')->references('MaMH')->on('MonHoc');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phancongday');
    }
};
