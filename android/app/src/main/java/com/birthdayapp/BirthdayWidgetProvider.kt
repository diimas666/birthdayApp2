package com.birthdayapp

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews

class BirthdayWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val prefs = context.getSharedPreferences(WIDGET_PREFS, Context.MODE_PRIVATE)
        val namesStr = prefs.getString(KEY_NAMES, null)
        val emptyText = prefs.getString(KEY_EMPTY_TEXT, "—") ?: "—"
        val title = prefs.getString(KEY_TITLE, "Birthdays today") ?: "Birthdays today"
        val names = if (namesStr.isNullOrBlank()) emptyList() else namesStr.split(", ").map { it.trim() }.filter { it.isNotEmpty() }
        val views = buildRemoteViews(context, names, emptyText, title)
        appWidgetIds.forEach { appWidgetManager.updateAppWidget(it, views) }
    }

    companion object {
        fun buildRemoteViews(context: Context, names: List<String>, emptyText: String, title: String): RemoteViews {
            val views = RemoteViews(context.packageName, R.layout.birthday_widget)
            val displayText = if (names.isEmpty()) emptyText else names.joinToString(", ")
            views.setTextViewText(R.id.widget_title, title)
            views.setTextViewText(R.id.widget_names, displayText)
            return views
        }
    }
}
