<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProductCSVData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    private $fields;
    private $products;

    /**
     * Create a new job instance.
     */
    public function __construct($fields, $products)
    {
        $this->fields   = $fields;
        $this->products = $products;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        foreach ($this->products as $product) {
            $payload = array_combine($this->fields, $product);
            Product::create($payload);
        }
    }
}
