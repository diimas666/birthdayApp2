import WidgetKit

@objc public class WidgetReloader: NSObject {
  @objc public static func reloadWidgets() {
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }
}
