<?php

namespace App\Http\Requests\ProductManage;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => 'required',
            'name' => 'required',
            'description' => 'sometimes',
            'regular_price' => 'required',

            'discount_properties' => 'sometimes|array',
            'discount_properties.type' => 'sometimes|in:percentage,flat',
            'discount_properties.value' => 'sometimes',

            'is_featured' => 'sometimes|boolean',
            'attachments' => 'sometimes|array',
            'status' => 'required|in:active,inactive',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        if ($this->wantsJson() || $this->ajax()) {
            throw new HttpResponseException(validateError($validator->errors()));
        }
        parent::failedValidation($validator);
    }
}
