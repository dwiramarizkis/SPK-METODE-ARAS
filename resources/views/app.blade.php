<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>
    @vite(['resources/css/app.css', 'resources/js/main.tsx'])
    <style>
        /* Fallback styles jika CSS tidak load */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Consolas', 'Courier New', monospace;
        }
        #app {
            min-height: 100vh;
        }
        /* Loading indicator */
        #loading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            width: 400px;
            max-width: 90%;
        }
        #loading-card {
            background: white;
            border: 2px solid #000;
            border-radius: 8px;
            padding: 40px 30px;
            box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
        }
        #loading-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #000;
        }
        #loading-subtitle {
            font-size: 14px;
            color: #666;
            margin-bottom: 30px;
        }
        #progress-container {
            width: 100%;
            height: 20px;
            background: #e5e5e5;
            border: 2px solid #000;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        #progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #ff7a05 0%, #ff9933 100%);
            border-right: 2px solid #000;
            transition: width 0.3s ease;
            width: 0%;
        }
        #progress-text {
            margin-top: 15px;
            font-size: 12px;
            color: #999;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .pulse {
            animation: pulse 1.5s ease-in-out infinite;
        }
    </style>
</head>
<body>
    <div id="app">
        <div id="loading">
            <div id="loading-card">
                <div id="loading-title">Kelompok 2</div>
                <div id="loading-subtitle">Metode ARAS</div>
                <div id="progress-container">
                    <div id="progress-bar"></div>
                </div>
                <div id="progress-text" class="pulse">Loading application...</div>
            </div>
        </div>
    </div>
    
    <script>
        // Animate progress bar smoothly from 0 to 100%
        let progress = 0;
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const duration = 2000; // 2 seconds
        const interval = 20; // Update every 20ms
        const increment = (100 / duration) * interval;
        
        const progressInterval = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                if (progressText) {
                    progressText.textContent = 'Ready!';
                }
            }
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        }, interval);
        
        // Remove loading after 5 seconds if React doesn't load
        setTimeout(() => {
            const loading = document.getElementById('loading');
            if (loading && loading.parentElement) {
                loading.innerHTML = `
                    <div id="loading-card" style="background: #ff7a05; color: white; border-color: #000;">
                        <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">React Failed to Load</div>
                        <div style="font-size: 14px; text-align: left; margin-bottom: 20px;">
                            <p><strong>Possible issues:</strong></p>
                            <ul style="margin-left: 20px;">
                                <li>Vite dev server not running</li>
                                <li>JavaScript error (check Console)</li>
                                <li>Network issue</li>
                            </ul>
                        </div>
                        <div style="background: white; color: #000; padding: 10px; border-radius: 4px; border: 2px solid #000; font-weight: bold;">
                            Run: npm run dev
                        </div>
                    </div>
                `;
            }
        }, 5000);
        

    </script>
</body>
</html>
