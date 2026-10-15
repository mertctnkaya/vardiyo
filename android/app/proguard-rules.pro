# Project specific ProGuard rules for Vardiyo

# Preserve line numbers and source file names for crash reporting
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# JavaScript Interface preservation for Capacitor WebViews
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Capacitor Core & Plugin Bridge
-keep public class * extends com.getcapacitor.Plugin
-keep public class * extends com.getcapacitor.Bridge
-keep public class * extends com.getcapacitor.PluginMethod
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public *;
}
-keepclassmembers class com.getcapacitor.Bridge {
    public *;
}
-keepclassmembers class com.getcapacitor.BridgeWebView {
    public *;
}

# Capacitor Official Plugins
-keep class com.capacitorjs.plugins.app.** { *; }
-keep class com.capacitorjs.plugins.haptics.** { *; }
-keep class com.capacitorjs.plugins.localnotifications.** { *; }
-keep class com.capacitorjs.plugins.share.** { *; }
-keep class com.capacitorjs.plugins.filesystem.** { *; }

# Capawesome In-App Update Plugin
-keep class io.capawesome.capacitorjs.plugins.appupdate.** { *; }

# RevenueCat Capacitor SDK & Google Play Billing
-keep class com.revenuecat.purchases.** { *; }
-keep class com.android.billingclient.** { *; }
-dontwarn com.revenuecat.purchases.**

# Kotlin Coroutines & Serialization
-dontwarn kotlinx.coroutines.**
