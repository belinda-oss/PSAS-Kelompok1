<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobApplicationController extends Controller
{
    /**
     * List every job application for the admin dashboard.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = JobApplication::query();

        if ($request->filled('reviewed')) {
            $query->where('is_reviewed', $request->boolean('reviewed'));
        }

        if ($request->filled('search')) {
            $search = '%' . $request->string('search') . '%';
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', $search)
                    ->orWhere('email', 'like', $search)
                    ->orWhere('position', 'like', $search);
            });
        }

        $applications = $query->latest('created_at')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar lamaran kerja berhasil dimuat.',
            'count' => $applications->count(),
            'data' => $applications->map(fn (JobApplication $application) => $application->toApiArray())->values(),
        ]);
    }

    /**
     * Perbarui status moderasi dan/atau catatan admin.
     *
     * @param  Request  $request
     * @param  JobApplication  $jobApplication
     * @return JsonResponse
     */
    public function update(Request $request, JobApplication $jobApplication): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'is_reviewed' => 'sometimes|required|boolean',
            'admin_notes' => 'sometimes|nullable|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $jobApplication->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => "Lamaran dari '{$jobApplication->full_name}' berhasil diperbarui.",
            'data' => $jobApplication->fresh()->toApiArray(),
        ]);
    }

    /**
     * Hapus lamaran kerja secara permanen.
     *
     * @param  JobApplication  $jobApplication
     * @return JsonResponse
     */
    public function destroy(JobApplication $jobApplication): JsonResponse
    {
        $name = $jobApplication->full_name;
        $jobApplication->delete();

        return response()->json([
            'success' => true,
            'message' => "Lamaran dari '{$name}' telah dihapus.",
        ]);
    }
}
