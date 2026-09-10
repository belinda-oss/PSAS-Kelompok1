<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
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
            'name' => 'required|string|max:100',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'required|string|max:1000',
        ];
    }

    /**
     * Custom validation messages in Indonesian.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.max' => 'Nama tidak boleh lebih dari 100 karakter.',
            'rating.required' => 'Silakan beri nilai rating (1-5 bintang).',
            'rating.integer' => 'Nilai rating harus berupa angka bulat.',
            'rating.between' => 'Nilai rating harus antara 1 sampai 5.',
            'comment.required' => 'Komentar ulasan wajib diisi.',
            'comment.max' => 'Komentar ulasan tidak boleh melebihi 1000 karakter.',
        ];
    }
}
