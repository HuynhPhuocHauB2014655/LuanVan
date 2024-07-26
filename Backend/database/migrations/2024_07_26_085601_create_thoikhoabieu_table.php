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
        Schema::create('NgayTrongTuan', function (Blueprint $table) {
            $table->integer('MaNgay',10)->primary();
            $table->string('TenNgay');
            $table->timestamps();
        });
        Schema::create('TKB', function (Blueprint $table) {
            $table->integer('MaNgay',10);
            $table->integer('TietDay');
            $table->string('MaMH',10);
            $table->string('MaLop',10);
            $table->string('MSGV',10);
            $table->string('MaHK',10);
            $table->foreign('MaNgay')->references('MaNgay')->on('NgayTrongTuan');
            $table->foreign('MaMH')->references('MaMH')->on('MonHoc');
            $table->foreign('MaLop')->references('MaLop')->on('Lop');
            $table->foreign('MSGV')->references('MSGV')->on('GiaoVien');
            $table->foreign('MaHK')->references('MaHK')->on('HocKi');
            $table->primary(array(
                'MaNgay',
                'MaMH',
                'MaLop',
                'MSGV',
                'TietDay',
                'MaHK',
            ));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('NgayTrongTuan');
        Schema::dropIfExists('TKB');
    }
};
