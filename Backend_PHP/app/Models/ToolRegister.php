<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolRegister extends Model
{
    protected $table="ToolRegisters";
    protected $fillable=['name','price','location'];
    use HasFactory;
}
