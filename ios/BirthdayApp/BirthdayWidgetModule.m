#import "BirthdayWidgetModule.h"
#import <React/RCTBridgeModule.h>
#if __has_include("BirthdayApp-Swift.h")
#import "BirthdayApp-Swift.h"
#endif

static NSString *const kWidgetSuiteName = @"group.com.birthdayapp1.widget";
static NSString *const kKeyTitle = @"widget_title";
static NSString *const kKeyEmptyText = @"empty_text";
static NSString *const kKeyNames = @"today_names";

@implementation BirthdayWidgetModule

RCT_EXPORT_MODULE(BirthdayWidget);

RCT_EXPORT_METHOD(updateWidget:(NSArray *)names
                  emptyText:(NSString *)emptyText
                  title:(NSString *)title)
{
  NSUserDefaults *defaults = [[NSUserDefaults alloc] initWithSuiteName:kWidgetSuiteName];
  if (!defaults) return;
  NSString *namesStr = [names count] > 0 ? [names componentsJoinedByString:@", "] : @"";
  [defaults setObject:title ?: @"" forKey:kKeyTitle];
  [defaults setObject:emptyText ?: @"" forKey:kKeyEmptyText];
  [defaults setObject:namesStr forKey:kKeyNames];
  [defaults synchronize];
#if __has_include("BirthdayApp-Swift.h")
  if ([WidgetReloader respondsToSelector:@selector(reloadWidgets)]) {
    [WidgetReloader reloadWidgets];
  }
#endif
}

@end
