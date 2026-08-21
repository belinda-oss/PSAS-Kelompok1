<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel React Project</title>

    {{-- Script wajib agar Vite React bekerja --}}
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    {{-- Tempat komponen React ditampilkan --}}
    <div id="app"></div>
</body>
</html>