<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;
    
    /**
     * @var array<string>
     */
        protected $fillable = [
            'name',
            'description',
            'price',
            'stock',
            'image'
        ];

    /**
     * @var array<string>
     */
        protected $hidden = [
            'provider',
            'buyPrice'
        ];

    /**
     * @var array<string, string>
     */
        protected function casts(): array
        {
            return [
                'price' => 'decimal:2',
                'stock' => 'integer'
            ];
        }


}
