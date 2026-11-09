#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$DIR"

echo "=== 1. Compilando aplicación móvil Angular ==="
cd "$DIR"
npm run build

echo "=== 2. Preparando empaquetado Android ==="
BUILD_DIR="/tmp/android-apk-build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/src/com/picklab/app" "$BUILD_DIR/res/values" "$BUILD_DIR/res/values-v28" "$BUILD_DIR/res/drawable" "$BUILD_DIR/assets/www" "$BUILD_DIR/gen" "$BUILD_DIR/classes" "$BUILD_DIR/dex"

# Copiar manifiesto y recursos
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
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
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_launcher"
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
EOF

cat << 'EOF' > "$BUILD_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">PickLab</string>
</resources>
EOF

cat << 'EOF' > "$BUILD_DIR/res/values/styles.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.PickLab.EdgeToEdge" parent="@android:style/Theme.DeviceDefault.Light.NoActionBar">
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowDrawsSystemBarBackgrounds">true</item>
        <item name="android:windowLightStatusBar">true</item>
    </style>
</resources>
EOF

cat << 'EOF' > "$BUILD_DIR/res/values-v28/styles.xml"
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
EOF

cat << 'EOF' > "$BUILD_DIR/res/drawable/ic_launcher.xml"
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#072D24"
        android:pathData="M0,0h108v108h-108z"/>
    <path
        android:fillColor="#22C55E"
        android:pathData="M30,30h20c11,0 20,9 20,20s-9,20 -20,20h-10v18h-10zM40,40v20h10c5.5,0 10,-4.5 10,-10s-4.5,-10 -10,-10z"/>
</vector>
EOF

cat << 'EOF' > "$BUILD_DIR/src/com/picklab/app/MainActivity.java"
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

        // Edge-To-Edge: Render behind camera notch, status bar & nav bar (like Facebook/Instagram)
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
EOF

# Copiar bundle compilado a los assets
cp -r "$DIR/dist/mobile/browser/"* "$BUILD_DIR/assets/www/"

echo "=== 3. Compilando y empaquetando APK ==="
SDK_ROOT="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/home/antigravity/android-sdk}}"
BUILD_TOOLS="$(find "$SDK_ROOT/build-tools" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort -V | tail -n 1)"
PLATFORM_JAR="$(find "$SDK_ROOT/platforms" -name "android.jar" 2>/dev/null | sort -V | tail -n 1)"

if [ -z "$BUILD_TOOLS" ] || [ -z "$PLATFORM_JAR" ]; then
  BUILD_TOOLS="/home/antigravity/android-sdk/build-tools/34.0.0"
  PLATFORM_JAR="/home/antigravity/android-sdk/platforms/android-35/android.jar"
fi

"$BUILD_TOOLS/aapt2" compile --dir "$BUILD_DIR/res" -o "$BUILD_DIR/compiled_res.zip"
"$BUILD_TOOLS/aapt2" link -I "$PLATFORM_JAR" \
  --manifest "$BUILD_DIR/AndroidManifest.xml" \
  -o "$BUILD_DIR/picklab_res.apk" \
  -A "$BUILD_DIR/assets" \
  --java "$BUILD_DIR/gen" \
  "$BUILD_DIR/compiled_res.zip"

javac -cp "$PLATFORM_JAR:$BUILD_DIR/gen" \
  -d "$BUILD_DIR/classes" \
  "$BUILD_DIR/src/com/picklab/app/MainActivity.java" "$BUILD_DIR/gen/com/picklab/app/R.java"

"$BUILD_TOOLS/d8" \
  --lib "$PLATFORM_JAR" \
  --output "$BUILD_DIR/dex" \
  $(find "$BUILD_DIR/classes" -name "*.class")

(cd "$BUILD_DIR/dex" && zip -u "$BUILD_DIR/picklab_res.apk" classes.dex)

"$BUILD_TOOLS/zipalign" -v -p 4 \
  "$BUILD_DIR/picklab_res.apk" "$BUILD_DIR/picklab_aligned.apk"

keytool -genkey -v -keystore "$BUILD_DIR/debug.keystore" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"

OUTPUT_APK="$ROOT_DIR/picklab-mobile.apk"
"$BUILD_TOOLS/apksigner" sign \
  --ks "$BUILD_DIR/debug.keystore" --ks-pass pass:android \
  --ks-key-alias androiddebugkey --key-pass pass:android \
  --out "$OUTPUT_APK" \
  "$BUILD_DIR/picklab_aligned.apk"

"$BUILD_TOOLS/apksigner" verify -v "$OUTPUT_APK"

echo "=== APK GENERADO CON ÉXITO EN: $OUTPUT_APK ==="
