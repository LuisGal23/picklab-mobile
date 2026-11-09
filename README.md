# PickLab Mobile (Android App) 📱

Aplicación móvil oficial de **PickLab** diseñada específicamente para Android con soporte nativo **Edge-to-Edge**, pantalla completa sobre cortes de cámara (gota de agua / notch), animación de apertura (Splash Screen), login y visualización de partidos auditados con simulación Monte Carlo (100,000 iteraciones).

---

## ✨ Características Principales

- **📱 Diseño Edge-to-Edge Nativo**: La interfaz se extiende por detrás de la cámara frontal (corte gota de agua o notch) aprovechando el 100% del panel AMOLED/LCD con barras de sistema transparentes, idéntico a Facebook o Instagram.
- **⚡ Splash Screen con Logo Animado**: Pantalla de carga fluida con la insignia de PickLab y ondas de telemetría deportiva.
- **🔐 Flujo de Login y Acceso de Invitado**: Inicio de sesión móvil seguro y acceso directo sin registro previo.
- **⚽ Tarjetas de Partidos y Picks**: Enfoque 100% en partidos de fútbol, NBA y NFL con probabilidades congeladas, cuotas en vivo y auditoría SHA-256.
- **📊 Modal de Análisis Profundo**: Desglose de rendimiento, percentiles Monte Carlo y métricas de valor esperado (+EV).
- **🧭 Navegación Flotante**: Barra inferior de 5 pestañas adaptada a los gestos de navegación de Android (`env(safe-area-inset-bottom)`).

---

## 📥 Descarga de la APK

Puedes descargar la última versión compilada y lista para instalar en tu teléfono Android:

1. Ve a la sección [**Releases**](https://github.com/LuisGal23/picklab-mobile/releases) en GitHub.
2. Descarga el archivo **`picklab-mobile.apk`**.
3. Abre el archivo en tu dispositivo Android e instálalo (permite instalar apps de fuentes desconocidas si tu navegador te lo solicita).

---

## 🛠️ Compilación Local

```bash
# Instalar dependencias
npm install

# Compilar Angular
npm run build

# Empaquetar y firmar el APK
npm run build:apk
```

El binario generado se ubicará en la raíz del proyecto como `picklab-mobile.apk`.
