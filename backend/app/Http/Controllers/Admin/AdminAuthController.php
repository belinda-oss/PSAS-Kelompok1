<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
     * Handle admin login request.
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
            'password.required' => 'Password wajib diisi.',
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

            // Not an admin user
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak. Akun Anda bukan akun admin.',
                ], 403);
            }

            return redirect()->back()
                ->withInput($request->only('email'))
                ->with('error', 'Akses ditolak. Akun Anda bukan akun admin.');
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 422);
        }

        return redirect()->back()
            ->withInput($request->only('email'))
            ->with('error', 'Email atau password salah.');
    }

    /**
     * Handle admin logout request.
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
