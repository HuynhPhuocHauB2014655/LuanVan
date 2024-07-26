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
        Schema::create('HocLuc', function (Blueprint $table) {
            $table->string('MaHL',10)->primary();
            $table->string('TenHL');
            $table->timestamps();
        });
        Schema::create('HanhKiem', function (Blueprint $table) {
            $table->string('MaHK',10)->primary();
            $table->string('TenHK');
            $table->timestamps();
        });
        Schema::create('HocLop', function (Blueprint $table) {
            $table->float('Diem_TB_HKI');
            $table->float('Diem_TB_HKII');
            $table->float('Diem_TB_CN');
            $table->string('MaHL',10);
            $table->string('MaHK',10);
            $table->string('MaLop',10);
            $table->string('MSHS',10);
            $table->string('MaNK',10);
            $table->foreign('MaHL')->references('MaHL')->on('HocLuc');
            $table->foreign('MaHK')->references('MaHK')->on('HanhKiem');
            $table->foreign('MaLop')->references('MaLop')->on('Lop');
            $table->foreign('MSHS')->references('MSHS')->on('HocSinh');
            $table->foreign('MaNK')->references('MaNK')->on('NienKhoa');
            $table->primary(array(
                'MSHS',
                'MaLop',
                'MaNK',
            ));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('HocLop');
        Schema::dropIfExists('HanhKiem');
        Schema::dropIfExists('HocLuc');
    }
};
