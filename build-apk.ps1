param(
    [switch]$SkipNgBuild
)

# PowerShell Android APK Builder for PickLab Mobile
$ErrorActionPreference = "Stop"

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SCRIPT_DIR

if (-not $SkipNgBuild) {
    Write-Host "=== 1. Compilando aplicación móvil Angular ===" -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error compilando Angular"
        exit 1
    }
} else {
    Write-Host "=== 1. Omitiendo build de Angular (-SkipNgBuild especificado) ===" -ForegroundColor Yellow
}

Write-Host "=== 2. Preparando empaquetado Android ===" -ForegroundColor Cyan
$BUILD_DIR = "$env:TEMP\picklab-android-build"
if (Test-Path $BUILD_DIR) {
    Remove-Item -Recurse -Force $BUILD_DIR
}

New-Item -ItemType Directory -Force -Path "$BUILD_DIR\src\com\picklab\app" | Out-Null
New-Item -ItemType Directory -Force -Path "$BUILD_DIR\res\values" | Out-Null
New-Item -ItemType Directory -Force -Path "$BUILD_DIR\res\values-v28" | Out-Null
New-Item -ItemType Directory -Force -Path "$BUILD_DIR\res\drawable" | Out-Null
New-Item -ItemType Directory -Force -Path "$BUILD_DIR\assets\www" | Out-Null
New-Item -ItemType Directory -Force -Path "$BUILD_DIR\gen" | Out-Null
New-Item -ItemType Directory -Force -Path "$BUILD_DIR\classes" | Out-Null
New-Item -ItemType Directory -Force -Path "$BUILD_DIR\dex" | Out-Null

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# AndroidManifest.xml
$manifestContent = @'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.picklab.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true"
        android:theme="@style/Theme.PickLab.EdgeToEdge">

        <activity
            android:name="com.picklab.app.MainActivity"
            android:exported="true"
            android:windowLayoutInDisplayCutoutMode="shortEdges"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
'@
[System.IO.File]::WriteAllText("$BUILD_DIR\AndroidManifest.xml", $manifestContent, $utf8NoBom)

# strings.xml
$stringsContent = @'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">PickLab</string>
</resources>
'@
[System.IO.File]::WriteAllText("$BUILD_DIR\res\values\strings.xml", $stringsContent, $utf8NoBom)

# styles.xml
$stylesContent = @'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.PickLab.EdgeToEdge" parent="@android:style/Theme.DeviceDefault.Light.NoActionBar">
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowDrawsSystemBarBackgrounds">true</item>
        <item name="android:windowLightStatusBar">true</item>
    </style>
</resources>
'@
[System.IO.File]::WriteAllText("$BUILD_DIR\res\values\styles.xml", $stylesContent, $utf8NoBom)

# values-v28/styles.xml
$stylesV28Content = @'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.PickLab.EdgeToEdge" parent="@android:style/Theme.DeviceDefault.Light.NoActionBar">
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowDrawsSystemBarBackgrounds">true</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
    </style>
</resources>
'@
[System.IO.File]::WriteAllText("$BUILD_DIR\res\values-v28\styles.xml", $stylesV28Content, $utf8NoBom)

Write-Host "=== Generando iconos oficiales de la app con el logo PickLab ===" -ForegroundColor Cyan
python "$SCRIPT_DIR\scripts\generate_launcher_icons.py" "$SCRIPT_DIR\src\assets\logo.png" "$BUILD_DIR\res"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Icon generator had a warning or non-zero exit code"
}

# MainActivity.java
$mainActivityContent = @'
package com.picklab.app;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.util.Log;
import java.io.InputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        // Edge-To-Edge: Render behind camera notch, status bar & nav bar
        Window window = getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS | WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.getAttributes().layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        }

        View decorView = window.getDecorView();
        int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                  | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                  | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        }
        decorView.setSystemUiVisibility(flags);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage cm) {
                Log.d("PickLabJS", cm.message() + " [Line " + cm.lineNumber() + " of " + cm.sourceId() + "]");
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost();
                if ("localhost".equals(host) || "appassets.androidplatform.net".equals(host)) {
                    String path = uri.getPath();
                    if (path == null || path.isEmpty() || "/".equals(path)) {
                        path = "/index.html";
                    }
                    try {
                        String assetPath = "www" + path;
                        InputStream stream = getAssets().open(assetPath);
                        String mimeType = getMimeType(path);
                        Map<String, String> headers = new HashMap<>();
                        headers.put("Access-Control-Allow-Origin", "*");
                        return new WebResourceResponse(mimeType, "UTF-8", 200, "OK", headers, stream);
                    } catch (IOException e) {
                        try {
                            InputStream fallback = getAssets().open("www/index.html");
                            Map<String, String> headers = new HashMap<>();
                            headers.put("Access-Control-Allow-Origin", "*");
                            return new WebResourceResponse("text/html", "UTF-8", 200, "OK", headers, fallback);
                        } catch (IOException ex) {
                            return null;
                        }
                    }
                }
                return super.shouldInterceptRequest(view, request);
            }

            private String getMimeType(String path) {
                if (path.endsWith(".js") || path.endsWith(".mjs")) return "application/javascript";
                if (path.endsWith(".css")) return "text/css";
                if (path.endsWith(".html")) return "text/html";
                if (path.endsWith(".json")) return "application/json";
                if (path.endsWith(".png")) return "image/png";
                if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
                if (path.endsWith(".svg")) return "image/svg+xml";
                if (path.endsWith(".ico")) return "image/x-icon";
                if (path.endsWith(".woff2")) return "font/woff2";
                if (path.endsWith(".woff")) return "font/woff";
                if (path.endsWith(".ttf")) return "font/ttf";
                return "application/octet-stream";
            }
        });

        webView.loadUrl("https://localhost/index.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
'@
[System.IO.File]::WriteAllText("$BUILD_DIR\src\com\picklab\app\MainActivity.java", $mainActivityContent, $utf8NoBom)

Write-Host "=== Copiando bundle compilado a los assets ===" -ForegroundColor Cyan
Copy-Item -Path "$SCRIPT_DIR\dist\mobile\browser\*" -Destination "$BUILD_DIR\assets\www" -Recurse -Force

Write-Host "=== 3. Compilando y empaquetando APK ===" -ForegroundColor Cyan
$SDK_ROOT = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { "C:\Users\perez\AppData\Local\Android\Sdk" }
$BUILD_TOOLS = "$SDK_ROOT\build-tools\35.0.0"
$PLATFORM_JAR = "$SDK_ROOT\platforms\android-35\android.jar"
$aapt2 = "$BUILD_TOOLS\aapt2.exe"
$d8 = "$BUILD_TOOLS\d8.bat"
$zipalign = "$BUILD_TOOLS\zipalign.exe"
$apksigner = "$BUILD_TOOLS\apksigner.bat"

Write-Host "Compilando recursos con aapt2..."
& $aapt2 compile --dir "$BUILD_DIR\res" -o "$BUILD_DIR\compiled_res.zip"
if ($LASTEXITCODE -ne 0) { throw "Error en aapt2 compile" }

Write-Host "Enlazando recursos y assets con aapt2 link..."
& $aapt2 link -I "$PLATFORM_JAR" `
  --manifest "$BUILD_DIR\AndroidManifest.xml" `
  -o "$BUILD_DIR\picklab_res.apk" `
  -A "$BUILD_DIR\assets" `
  --java "$BUILD_DIR\gen" `
  "$BUILD_DIR\compiled_res.zip"
if ($LASTEXITCODE -ne 0) { throw "Error en aapt2 link" }

Write-Host "Compilando código Java (target Java 17)..."
& javac -source 17 -target 17 -cp "$PLATFORM_JAR;$BUILD_DIR\gen" `
  -d "$BUILD_DIR\classes" `
  "$BUILD_DIR\src\com\picklab\app\MainActivity.java" "$BUILD_DIR\gen\com\picklab\app\R.java"
if ($LASTEXITCODE -ne 0) { throw "Error en javac" }

Write-Host "Generando dex con d8..."
$classFiles = (Get-ChildItem -Path "$BUILD_DIR\classes" -Filter "*.class" -Recurse).FullName
& $d8 --lib "$PLATFORM_JAR" --output "$BUILD_DIR\dex" $classFiles
if ($LASTEXITCODE -ne 0) { throw "Error en d8" }

Write-Host "Integrando classes.dex al APK..."
jar -uf "$BUILD_DIR\picklab_res.apk" -C "$BUILD_DIR\dex" classes.dex
if ($LASTEXITCODE -ne 0) { throw "Error integrando classes.dex con jar" }

Write-Host "Alineando APK con zipalign..."
& $zipalign -v -p 4 "$BUILD_DIR\picklab_res.apk" "$BUILD_DIR\picklab_aligned.apk"
if ($LASTEXITCODE -ne 0) { throw "Error en zipalign" }

Write-Host "Generando keystore de depuración si no existe..."
$keystore = "$BUILD_DIR\debug.keystore"
if (-not (Test-Path $keystore)) {
    keytool -genkey -v -keystore $keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
}

$OUTPUT_APK = "$SCRIPT_DIR\picklab-mobile.apk"
Write-Host "Firmando APK con apksigner..."
& $apksigner sign `
  --ks $keystore --ks-pass pass:android `
  --ks-key-alias androiddebugkey --key-pass pass:android `
  --out $OUTPUT_APK `
  "$BUILD_DIR\picklab_aligned.apk"
if ($LASTEXITCODE -ne 0) { throw "Error firmando APK" }

Write-Host "Verificando firma del APK..."
& $apksigner verify -v $OUTPUT_APK
if ($LASTEXITCODE -ne 0) { throw "Firma de APK no válida" }

$apkItem = Get-Item $OUTPUT_APK
Write-Host "=== APK GENERADO CON ÉXITO ===" -ForegroundColor Green
Write-Host "Ruta: $OUTPUT_APK" -ForegroundColor Green
Write-Host "Tamaño: $([math]::Round($apkItem.Length / 1MB, 2)) MB" -ForegroundColor Green
