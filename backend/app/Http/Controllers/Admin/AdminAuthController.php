<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class AdminAuthController extends Controller
{
    /**
     * Show admin login form view.
     *
     * @return View|RedirectResponse
     */
    public function showLoginForm()
    {
        if (Auth::check() && Auth::user()->is_admin) {
            return redirect()->route('admin.reviews.index');
        }

        return view('admin.auth.login');
    }

    /**
     * Handle admin login request (session based, for the Blade dashboard).
     *
     * @param Request $request
     * @return JsonResponse|RedirectResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user();

            if ($user && $user->is_admin) {
                $request->session()->regenerate();

                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Login admin berhasil.',
                        'redirect' => route('admin.reviews.index'),
                    ]);
                }

                return redirect()->intended(route('admin.reviews.index'));
            }

            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        // Selalu gunakan pesan yang sama agar tidak membocorkan keberadaan akun.
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau kata sandi salah.',
            ], 422);
        }

        return redirect()->back()
            ->withInput($request->only('email'))
            ->with('error', 'Email atau kata sandi salah.');
    }

    /**
     * Authenticate an admin and issue a Sanctum API token for the SPA panel.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function apiLogin(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password) || ! $user->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau kata sandi salah.',
            ], 422);
        }

        // Satu sesi aktif per akun: token lama dicabut saat login baru.
        $user->tokens()->delete();

        $token = $user->createToken('admin-panel', ['admin'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Return the currently authenticated admin (used to validate the session).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function apiMe(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Revoke the current admin API token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function apiLogout(Request $request): JsonResponse
    {
        $token = $request->user()?->currentAccessToken();

        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Anda telah keluar dari panel admin.',
        ]);
    }

    /**
     * Change the authenticated admin password.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function apiChangePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'current_password.required' => 'Kata sandi saat ini wajib diisi.',
            'password.required' => 'Kata sandi baru wajib diisi.',
            'password.min' => 'Kata sandi baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kata sandi saat ini tidak sesuai.',
                'errors' => [
                    'current_password' => ['Kata sandi saat ini tidak sesuai.'],
                ],
            ], 422);
        }

        $user->forceFill([
            'password' => Hash::make($data['password']),
        ])->save();

        // Cabut token lain agar sesi di perangkat lain ikut berakhir.
        $currentToken = $user->currentAccessToken();
        $user->tokens()
            ->when($currentToken, fn ($query) => $query->where('id', '!=', $currentToken->id))
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kata sandi berhasil diperbarui.',
        ]);
    }

    /**
     * Handle admin logout request (session based).
     *
     * @param Request $request
     * @return JsonResponse|RedirectResponse
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Logout berhasil.',
            ]);
        }

        return redirect()->route('admin.login')->with('success', 'Anda telah berhasil logout.');
    }
}
