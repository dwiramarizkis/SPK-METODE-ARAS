<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Test Page</title>
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body style="margin: 0; padding: 20px; background: #f0f0f0;">
    <h1 style="color: red;">HTML is working!</h1>
    <div id="app"></div>
    <script>
        console.log('Script is running');
        console.log('App div:', document.getElementById('app'));
    </script>
</body>
</html>
