<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Administrator - PSAS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #fbfbfb;
            color: #1f2421;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            overflow: hidden;
        }

        /* Floating gold sparkle accents (PT GSU signature) */
        .sparkle {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.5;
        }
        .sparkle-1 { width: 10px; height: 10px; background: rgba(196, 154, 108, 0.5); top: 12%; left: 8%; animation: float 4s ease-in-out infinite; }
        .sparkle-2 { width: 12px; height: 12px; background: rgba(212, 175, 55, 0.45); bottom: 15%; right: 10%; animation: float 4.5s ease-in-out 1.6s infinite; }
        .sparkle-3 { width: 7px; height: 7px; background: rgba(196, 154, 108, 0.4); top: 60%; left: 90%; animation: float 5s ease-in-out 0.8s infinite; }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
        }

        .login-card {
            background-color: #ffffff;
            border: 1px solid #f0f0f0;
            width: 100%;
            max-width: 440px;
            padding: 40px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
            animation: cardUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .login-header {
            text-align: center;
            margin-bottom: 24px;
        }

        .login-header .brand {
            font-family: 'Lora', Georgia, serif;
            font-size: 2.6rem;
            font-style: italic;
            font-weight: 700;
            letter-spacing: 0.05em;
            color: #1f2421;
            line-height: 1;
            display: inline-block;
            animation: fadeDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeDown {
            from { opacity: 0; transform: translateY(-14px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .login-header .sub-brand {
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #9ca3af;
            margin: 10px 0 26px;
        }

        .login-header h1 {
            font-family: 'Lora', Georgia, serif;
            font-size: 20px;
            font-weight: 500;
            letter-spacing: 0.03em;
            color: #1f2421;
            margin-bottom: 6px;
        }

        .login-header p {
            font-size: 12px;
            color: #6b7280;
            line-height: 1.6;
        }

        .alert {
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 13px;
            margin-bottom: 20px;
            line-height: 1.4;
            animation: fadeDown 0.35s ease both;
        }
        .alert-error { background-color: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.25); color: #b91c1c; }
        .alert-success { background-color: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); color: #047857; }

        .form-group { margin-bottom: 18px; }
        .form-group label {
            display: block;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #6b7280;
            margin-bottom: 8px;
        }
        .form-group input[type="email"],
        .form-group input[type="password"] {
            width: 100%;
            padding: 12px 14px;
            background-color: #fbfbfb;
            border: 1px solid #e5e7eb;
            border-radius: 0;
            color: #1f2421;
            font-family: 'Poppins', sans-serif;
            font-size: 13px;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }
        .form-group input:focus {
            border-color: #c49a6c;
            background-color: #ffffff;
            box-shadow: 0 0 0 3px rgba(196, 154, 108, 0.12);
        }
        .form-checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 24px;
            cursor: pointer;
        }
        .form-checkbox:hover { color: #1f2421; }
        .form-checkbox input { accent-color: #1f2421; width: 15px; height: 15px; cursor: pointer; }

        .btn-submit {
            width: 100%;
            padding: 14px;
            background-color: #1f2421;
            color: #ffffff;
            border: none;
            border-radius: 0;
            font-family: 'Poppins', sans-serif;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            cursor: pointer;
            transition: background-color 0.25s ease, color 0.25s ease, transform 0.15s ease;
        }
        .btn-submit:hover { background-color: #c49a6c; }
        .btn-submit:active { transform: scale(0.99); }

        .divider {
            display: flex;
            align-items: center;
            gap: 14px;
            margin: 28px 0 20px;
            color: #9ca3af;
            font-size: 9px;
            font-weight: 600;
            letter-spacing: 0.2em;
            text-transform: uppercase;
        }
        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #f0f0f0;
        }

        .footer-info {
            text-align: center;
            color: #9ca3af;
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="sparkle sparkle-1"></div>
    <div class="sparkle sparkle-2"></div>
    <div class="sparkle sparkle-3"></div>

    <div class="login-card">
        <div class="login-header">
            <span class="brand">GSU</span>
            <p class="sub-brand">• SHOFI EYELASH ADMIN •</p>

            <h1>Login Administrasi</h1>
            <p>Masuk untuk mengelola & memoderasi ulasan</p>
        </div>

        @if(session('error'))
            <div class="alert alert-error">
                {{ session('error') }}
            </div>
        @endif

        @if(session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        @if($errors->any())
            <div class="alert alert-error">
                @foreach($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        <form action="{{ route('admin.login.submit') }}" method="POST">
            @csrf
            <div class="form-group">
                <label for="email">Email Administrator</label>
                <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus placeholder="admin@example.com">
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required placeholder="••••••••">
            </div>

            <label class="form-checkbox">
                <input type="checkbox" name="remember" value="1">
                <span>Ingat Saya</span>
            </label>

            <button type="submit" class="btn-submit">Masuk ke Dashboard Admin</button>
        </form>

        <div class="divider">Akses Terotentikasi</div>

        <p class="footer-info">Sistem Terintegrasi PT GSU</p>
    </div>
</body>
</html>