<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Administrator - Shofi Eyelash</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --ink: #20241f;
            --ink-soft: #3a4039;
            --paper: #f3efe9;
            --paper-light: #f7f4ef;
            --line: #d8d1c4;
            --muted: #6f746c;
            --faint: #9a9e96;
            --accent: #a1876a;
            --danger: #a13c2f;
        }

        body {
            font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--paper);
            color: var(--ink);
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1.05fr 1fr;
        }

        /* Panel kiri */
        .brand-panel {
            position: relative;
            overflow: hidden;
            background-color: #171a16;
            color: #ffffff;
            padding: 64px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .brand-panel::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(circle at 18% 22%, rgba(161, 135, 106, 0.35), transparent 45%),
                radial-gradient(circle at 82% 78%, rgba(217, 195, 165, 0.18), transparent 42%),
                linear-gradient(135deg, #1b1f1a 0%, #10130f 100%);
        }

        .brand-panel::after {
            content: '';
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(
                115deg,
                transparent 0,
                transparent 46px,
                rgba(255, 255, 255, 0.025) 46px,
                rgba(255, 255, 255, 0.025) 47px
            );
        }

        .brand-panel > * {
            position: relative;
            z-index: 1;
        }

        .brand-mark {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            color: rgba(255, 255, 255, 0.78);
            text-decoration: none;
            width: fit-content;
        }

        .brand-monogram {
            width: 38px;
            height: 38px;
            border: 1px solid rgba(255, 255, 255, 0.25);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 15px;
            color: #ffffff;
        }

        .brand-name {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.32em;
            text-transform: uppercase;
        }

        .brand-copy {
            max-width: 420px;
        }

        .brand-kicker {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: #d9c3a5;
        }

        .brand-copy h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(2.5rem, 4vw, 3.4rem);
            font-weight: 500;
            line-height: 1.12;
            margin-top: 16px;
            color: #ffffff;
        }

        .brand-copy h1 em {
            color: #e6d6bf;
            font-weight: 400;
        }

        .brand-copy p {
            margin-top: 20px;
            font-size: 14px;
            line-height: 1.7;
            color: rgba(255, 255, 255, 0.62);
            max-width: 360px;
        }

        .brand-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 40px;
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.4);
        }

        .brand-meta::before {
            content: '';
            width: 40px;
            height: 1px;
            background-color: rgba(255, 255, 255, 0.3);
        }

        .brand-foot {
            font-size: 10px;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.4);
        }

        /* Panel kanan */
        .form-panel {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 32px 48px;
        }

        .form-top {
            display: flex;
            justify-content: flex-end;
        }

        .back-link {
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--faint);
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .back-link:hover { color: var(--ink); }

        .login-box {
            width: 100%;
            max-width: 380px;
            margin: 0 auto;
            padding: 40px 0;
        }

        .login-kicker {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: var(--accent);
        }

        .login-box h2 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 2.35rem;
            font-weight: 500;
            line-height: 1.15;
            margin-top: 12px;
            color: var(--ink);
        }

        .login-subtitle {
            margin-top: 12px;
            font-size: 13px;
            line-height: 1.65;
            color: var(--muted);
        }

        .alert {
            margin-top: 24px;
            padding: 12px 14px;
            border-left: 2px solid var(--danger);
            background-color: rgba(161, 60, 47, 0.06);
            color: #8a3227;
            font-size: 13px;
            line-height: 1.5;
        }

        .alert-success {
            border-left-color: #3f7d5a;
            background-color: rgba(63, 125, 90, 0.08);
            color: #2f5f44;
        }

        form { margin-top: 30px; }

        .form-group { margin-bottom: 24px; }

        .form-group label {
            display: block;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: #7c817a;
            margin-bottom: 8px;
        }

        .input-wrap { position: relative; }

        .form-group input[type="email"],
        .form-group input[type="password"],
        .form-group input[type="text"] {
            width: 100%;
            padding: 10px 0;
            background: transparent;
            border: none;
            border-bottom: 1px solid var(--line);
            border-radius: 0;
            color: var(--ink);
            font-family: inherit;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease;
        }

        .form-group input::placeholder { color: #a8aca4; }

        .form-group input:focus { border-bottom-color: var(--ink); }

        .toggle-password {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            border: none;
            background: transparent;
            color: var(--faint);
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            padding: 4px;
        }

        .toggle-password:hover { color: var(--ink); }

        .form-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 24px;
        }

        .form-checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            color: var(--muted);
            cursor: pointer;
            user-select: none;
        }

        .form-checkbox input {
            accent-color: var(--ink);
            width: 14px;
            height: 14px;
            cursor: pointer;
        }

        .btn-submit {
            width: 100%;
            padding: 14px 20px;
            background-color: var(--ink);
            color: #ffffff;
            border: none;
            border-radius: 0;
            font-family: inherit;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .btn-submit:hover { background-color: var(--ink-soft); }
        .btn-submit:active { transform: translateY(1px); }

        .security-note {
            margin-top: 34px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
            font-size: 11px;
            line-height: 1.6;
            color: var(--faint);
        }

        .security-note svg { flex-shrink: 0; margin-top: 1px; }

        .form-foot {
            width: 100%;
            max-width: 380px;
            margin: 0 auto;
            padding-top: 20px;
            border-top: 1px solid var(--line);
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--faint);
        }

        @media (max-width: 900px) {
            body { grid-template-columns: 1fr; }
            .brand-panel { display: none; }
            .form-panel { padding: 28px 24px; min-height: 100vh; }
        }
    </style>
</head>
<body>
    <aside class="brand-panel">
        <a href="{{ url('/') }}" class="brand-mark">
            <span class="brand-monogram">S</span>
            <span class="brand-name">Shofi Eyelash</span>
        </a>

        <div class="brand-copy">
            <p class="brand-kicker">Portal internal</p>
            <h1>Ruang kerja<br><em>tim Shofi.</em></h1>
            <p>Kelola ulasan, layanan, katalog nail art, dan lamaran kerja dalam satu panel yang tenang dan teratur.</p>
            <div class="brand-meta">PT Giandra Sadawira Utama</div>
        </div>

        <div class="brand-foot">Akses terbatas untuk staf</div>
    </aside>

    <main class="form-panel">
        <div class="form-top">
            <a href="{{ url('/') }}" class="back-link">Kembali ke situs</a>
        </div>

        <div class="login-box">
            <p class="login-kicker">Administrasi</p>
            <h2>Masuk ke panel</h2>
            <p class="login-subtitle">Gunakan akun administrator yang terdaftar untuk melanjutkan.</p>

            @if(session('error'))
                <div class="alert">{{ session('error') }}</div>
            @endif

            @if(session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif

            @if($errors->any())
                <div class="alert">
                    @foreach($errors->all() as $error)
                        <div>{{ $error }}</div>
                    @endforeach
                </div>
            @endif

            <form action="{{ route('admin.login.submit') }}" method="POST">
                @csrf

                <div class="form-group">
                    <label for="email">Email administrator</label>
                    <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username" placeholder="nama@perusahaan.co.id">
                </div>

                <div class="form-group">
                    <label for="password">Kata sandi</label>
                    <div class="input-wrap">
                        <input type="password" id="password" name="password" required autocomplete="current-password" placeholder="Masukkan kata sandi">
                        <button type="button" class="toggle-password" id="togglePassword" aria-label="Tampilkan kata sandi">Lihat</button>
                    </div>
                </div>

                <div class="form-row">
                    <label class="form-checkbox">
                        <input type="checkbox" name="remember" value="1">
                        <span>Ingat sesi di perangkat ini</span>
                    </label>
                </div>

                <button type="submit" class="btn-submit">Masuk</button>
            </form>

            <div class="security-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Koneksi aman. Jangan bagikan kredensial Anda kepada siapa pun.</span>
            </div>
        </div>

        <div class="form-foot">
            <span>&copy; {{ date('Y') }} PT GSU</span>
            <span>Panel Admin</span>
        </div>
    </main>

    <script>
        (function () {
            var input = document.getElementById('password');
            var toggle = document.getElementById('togglePassword');

            toggle.addEventListener('click', function () {
                var show = input.type === 'password';
                input.type = show ? 'text' : 'password';
                toggle.textContent = show ? 'Sembunyi' : 'Lihat';
                toggle.setAttribute('aria-label', show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
            });
        })();
    </script>
</body>
</html>
