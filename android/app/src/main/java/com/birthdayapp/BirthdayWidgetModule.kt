package com.birthdayapp

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray

const val WIDGET_PREFS = "birthday_widget"
const val KEY_NAMES = "today_names"
const val KEY_EMPTY_TEXT = "empty_text"
const val KEY_TITLE = "widget_title"

class BirthdayWidgetModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "BirthdayWidget"

    private fun prefs(): SharedPreferences =
        reactApplicationContext.getSharedPreferences(WIDGET_PREFS, Context.MODE_PRIVATE)

    @ReactMethod
    fun updateWidget(names: ReadableArray, emptyText: String, title: String) {
        val list = mutableListOf<String>()
        for (i in 0 until names.size()) {
            names.getString(i)?.let { list.add(it) }
        }
        prefs().edit()
            .putString(KEY_NAMES, list.joinToString(", "))
            .putString(KEY_EMPTY_TEXT, emptyText)
            .putString(KEY_TITLE, title)
            .apply()
        val appWidgetManager = AppWidgetManager.getInstance(reactApplicationContext)
        val componentName = ComponentName(reactApplicationContext, BirthdayWidgetProvider::class.java)
        val ids = appWidgetManager.getAppWidgetIds(componentName)
        if (ids.isNotEmpty()) {
            val views = BirthdayWidgetProvider.buildRemoteViews(reactApplicationContext, list, emptyText, title)
            ids.forEach { appWidgetManager.updateAppWidget(it, views) }
        }
    }
}
