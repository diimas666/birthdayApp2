import WidgetKit
import SwiftUI

private let kWidgetSuiteName = "group.com.birthdayapp1.widget"
private let kKeyTitle = "widget_title"
private let kKeyEmptyText = "empty_text"
private let kKeyNames = "today_names"

struct BirthdayEntry: TimelineEntry {
  let date: Date
  let title: String
  let namesText: String
  let emptyText: String
}

struct BirthdayProvider: TimelineProvider {
  private func defaults() -> UserDefaults? {
    UserDefaults(suiteName: kWidgetSuiteName)
  }

  func placeholder(in context: Context) -> BirthdayEntry {
    BirthdayEntry(date: Date(), title: "Сьогодні святкують", namesText: "", emptyText: "Ніхто не святкує сьогодні")
  }

  func getSnapshot(in context: Context, completion: @escaping (BirthdayEntry) -> Void) {
    let d = defaults()
    let title = d?.string(forKey: kKeyTitle) ?? "Сьогодні святкують"
    let namesText = d?.string(forKey: kKeyNames) ?? ""
    let emptyText = d?.string(forKey: kKeyEmptyText) ?? "Ніхто не святкує сьогодні"
    completion(BirthdayEntry(date: Date(), title: title, namesText: namesText, emptyText: emptyText))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<BirthdayEntry>) -> Void) {
    let d = defaults()
    let title = d?.string(forKey: kKeyTitle) ?? "Сьогодні святкують"
    let namesText = d?.string(forKey: kKeyNames) ?? ""
    let emptyText = d?.string(forKey: kKeyEmptyText) ?? "Ніхто не святкує сьогодні"
    let entry = BirthdayEntry(date: Date(), title: title, namesText: namesText, emptyText: emptyText)
    let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date()) ?? Date()
    completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
  }
}

struct BirthdayWidgetView: View {
  var entry: BirthdayEntry
  @Environment(\.widgetFamily) var family

  var body: some View {
    let displayText = entry.namesText.isEmpty ? entry.emptyText : entry.namesText
    VStack(alignment: .leading, spacing: 6) {
      Text(entry.title)
        .font(.caption)
        .fontWeight(.semibold)
        .foregroundColor(.purple)
      Text(displayText)
        .font(family == .systemSmall ? .caption2 : .subheadline)
        .lineLimit(family == .systemSmall ? 2 : 4)
        .foregroundColor(.primary)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .padding()
  }
}

@main
struct BirthdayWidgetBundle: WidgetBundle {
  var body: some Widget {
    BirthdayWidget()
  }
}

struct BirthdayWidget: Widget {
  let kind: String = "BirthdayWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BirthdayProvider()) { entry in
      BirthdayWidgetView(entry: entry)
    }
    .configurationDisplayName("Дні народження")
    .description("Хто святкує сьогодні")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
