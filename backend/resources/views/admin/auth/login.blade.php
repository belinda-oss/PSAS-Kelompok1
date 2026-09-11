<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Administrator - PSAS</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #121212; color: #e0e0e0; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .login-card { background-color: #1e1e1e; border: 1px solid #333; border-radius: 12px; width: 100%; max-width: 400px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .login-header { text-align: center; margin-bottom: 24px; }
        .login-header h1 { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
        .login-header p { font-size: 13px; color: #888888; }
        .alert { padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; line-height: 1.4; }
        .alert-error { background-color: rgba(220, 38, 38, 0.15); border: 1px solid rgba(220, 38, 38, 0.4); color: #fca5a5; }
        .alert-success { background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #6ee7b7; }
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #aaaaaa; margin-bottom: 8px; }
        .form-group input[type="email"], .form-group input[type="password"] { width: 100%; padding: 12px 14px; background-color: #141414; border: 1px solid #333; border-radius: 8px; color: #ffffff; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .form-group input:focus { border-color: #c49a6c; }
        .form-checkbox { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #aaaaaa; margin-bottom: 24px; cursor: pointer; }
        .form-checkbox input { accent-color: #c49a6c; width: 16px; height: 16px; cursor: pointer; }
        .btn-submit { width: 100%; padding: 14px; background-color: #c49a6c; color: #121212; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background-color 0.2s; }
        .btn-submit:hover { background-color: #b08556; }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="login-header">
            <h1>Login Admin</h1>
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
    </div>
</body>
</html>
