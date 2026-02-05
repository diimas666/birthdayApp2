import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "../hooks/useTranslation";
import { useTheme } from "../contexts/ThemeContext";
import { spacing, fontSize, borderRadius, moderateScale, verticalScale } from "../utils/scale";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TimeFilter = "today" | "week" | "month" | "year";

const TIME_KEYS: TimeFilter[] = ["today", "week", "month", "year"];
const TAG_KEYS = ["all", "family", "friends", "work", "other"] as const;
type TagKey = (typeof TAG_KEYS)[number];

interface FilterDropdownsProps {
  activeFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
}

const purple = "#8b5cf6";
const purpleLight = "#ede9fe";
const grayBg = "#f3f3f3";
const grayText = "#374151";
const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: moderateScale(2) },
  shadowOpacity: 0.1,
  shadowRadius: moderateScale(8),
  elevation: 4,
};

export const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  activeFilter,
  onFilterChange,
  selectedTag,
  onTagChange,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [timeOpen, setTimeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const timeTriggerRef = useRef<View>(null);
  const categoryTriggerRef = useRef<View>(null);
  const [timePanelLayout, setTimePanelLayout] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [categoryPanelLayout, setCategoryPanelLayout] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const measureTrigger = (ref: React.RefObject<View | null>, setLayout: (l: { x: number; y: number; w: number; h: number }) => void) => {
    ref.current?.measureInWindow((x, y, w, h) => setLayout({ x, y, w, h }));
  };

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    if (timeOpen) measureTrigger(timeTriggerRef, setTimePanelLayout);
    else setTimePanelLayout(null);
  }, [timeOpen]);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    if (categoryOpen) measureTrigger(categoryTriggerRef, setCategoryPanelLayout);
    else setCategoryPanelLayout(null);
  }, [categoryOpen]);

  const timeLabel = t(
    activeFilter === "today"
      ? "filterToday"
      : activeFilter === "week"
        ? "filterWeek"
        : activeFilter === "month"
          ? "filterMonth"
          : "filterYear"
  );
  const tagToKey = (tag: string | null): TagKey => {
    if (!tag) return "all";
    if (tag === t("tagFamily")) return "family";
    if (tag === t("tagFriends")) return "friends";
    if (tag === t("tagWork")) return "work";
    if (tag === t("tagOther")) return "other";
    return "all";
  };
  const categoryLabel = selectedTag ? selectedTag : t("categories");

  const bg = isDark ? "#2a2a3e" : "#fff";
  const panelBg = isDark ? "#1e1e2e" : "#fff";
  const inactiveBtnBg = isDark ? "#2a2a3e" : grayBg;
  const textInactive = isDark ? "#e5e5e5" : grayText;
  const selectedBgLight = isDark ? "#3a2a5e" : purpleLight;

  const toggleTime = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTimeOpen((v) => !v);
    if (categoryOpen) setCategoryOpen(false);
  };
  const toggleCategory = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCategoryOpen((v) => !v);
    if (timeOpen) setTimeOpen(false);
  };

  const selectTime = (key: TimeFilter) => {
    onFilterChange(key);
    setTimeOpen(false);
  };
  const selectTag = (key: TagKey) => {
    if (key === "all") {
      onTagChange(null);
    } else {
      onTagChange(
        key === "family"
          ? t("tagFamily")
          : key === "friends"
            ? t("tagFriends")
            : key === "work"
              ? t("tagWork")
              : t("tagOther")
      );
    }
    setCategoryOpen(false);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {/* Time filter */}
        <View ref={timeTriggerRef} style={styles.dropdownHalf} collapsable={false}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleTime}
            style={[
              styles.trigger,
              { backgroundColor: purple },
              shadow,
            ]}
          >
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.triggerTextActive} numberOfLines={1}>
              {timeLabel}
            </Text>
            <Ionicons
              name={timeOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          {timeOpen && Platform.OS !== "ios" && (
            <View style={[styles.panel, { backgroundColor: panelBg }, shadow]}>
              {TIME_KEYS.map((key) => {
                const selected = activeFilter === key;
                const timeIcon =
                  key === "today"
                    ? "time-outline"
                    : "calendar-outline";
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.7}
                    onPress={() => selectTime(key)}
                    style={[
                      styles.option,
                      { backgroundColor: selected ? selectedBgLight : bg },
                    ]}
                  >
                    <Ionicons
                      name={timeIcon}
                      size={18}
                      color={selected ? purple : textInactive}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        { color: selected ? purple : textInactive },
                        selected && styles.optionTextBold,
                      ]}
                    >
                      {t(
                        key === "today"
                          ? "filterToday"
                          : key === "week"
                            ? "filterWeek"
                            : key === "month"
                              ? "filterMonth"
                              : "filterYear"
                      )}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark" size={20} color={purple} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Category filter */}
        <View ref={categoryTriggerRef} style={styles.dropdownHalf} collapsable={false}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleCategory}
            style={[
              styles.trigger,
              {
                backgroundColor: selectedTag ? purple : inactiveBtnBg,
              },
              shadow,
            ]}
          >
            <View style={styles.threeDots}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: selectedTag ? "#fff" : "#eab308" },
                ]}
              />
              <View
                style={[
                  styles.dot,
                  { backgroundColor: selectedTag ? "#fff" : "#22c55e" },
                ]}
              />
              <View
                style={[
                  styles.dot,
                  { backgroundColor: selectedTag ? "#fff" : purple },
                ]}
              />
            </View>
            <Text
              style={[
                styles.triggerText,
                { color: selectedTag ? "#fff" : textInactive },
                selectedTag && styles.triggerTextActive,
              ]}
              numberOfLines={1}
            >
              {categoryLabel}
            </Text>
            <Ionicons
              name={categoryOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color={selectedTag ? "#fff" : textInactive}
            />
          </TouchableOpacity>
          {categoryOpen && Platform.OS !== "ios" && (
            <View style={[styles.panel, { backgroundColor: panelBg }, shadow]}>
              {TAG_KEYS.map((key) => {
                const isAll = key === "all";
                const tagValue =
                  key === "family"
                    ? t("tagFamily")
                    : key === "friends"
                      ? t("tagFriends")
                      : key === "work"
                        ? t("tagWork")
                        : key === "other"
                          ? t("tagOther")
                          : null;
                const selected =
                  isAll ? !selectedTag : selectedTag === tagValue;
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.7}
                    onPress={() => selectTag(key)}
                    style={[
                      styles.option,
                      {
                        backgroundColor: selected ? purple : bg,
                      },
                    ]}
                  >
                    {isAll ? (
                      <Ionicons
                        name="ellipse-outline"
                        size={18}
                        color={selected ? "#fff" : textInactive}
                      />
                    ) : key === "family" ? (
                      <Ionicons
                        name="heart"
                        size={18}
                        color={selected ? "#fff" : "#ec4899"}
                      />
                    ) : key === "friends" ? (
                      <Ionicons
                        name="person-outline"
                        size={18}
                        color={selected ? "#fff" : "#38bdf8"}
                      />
                    ) : key === "work" ? (
                      <Ionicons
                        name="briefcase-outline"
                        size={18}
                        color={selected ? "#fff" : "#f97316"}
                      />
                    ) : (
                      <View style={styles.threeDotsSmall}>
                        <View
                          style={[
                            styles.dotSmall,
                            {
                              backgroundColor: selected ? "#fff" : "#eab308",
                            },
                          ]}
                        />
                        <View
                          style={[
                            styles.dotSmall,
                            {
                              backgroundColor: selected ? "#fff" : "#22c55e",
                            },
                          ]}
                        />
                        <View
                          style={[
                            styles.dotSmall,
                            {
                              backgroundColor: selected ? "#fff" : purple,
                            },
                          ]}
                        />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        { color: selected ? "#fff" : textInactive },
                        selected && styles.optionTextBold,
                      ]}
                    >
                      {isAll ? t("allTags") : tagValue}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* iOS: выпадающие панели в Modal, чтобы не перекрывались контентом */}
      {Platform.OS === "ios" && timeOpen && timePanelLayout && (
        <Modal transparent visible animationType="fade">
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={toggleTime}
          />
          <View
            style={[
              styles.panel,
              styles.panelModal,
              {
                backgroundColor: panelBg,
                left: timePanelLayout.x,
                top: timePanelLayout.y + timePanelLayout.h + 4,
                width: timePanelLayout.w,
              },
              shadow,
            ]}
          >
              {TIME_KEYS.map((key) => {
                const selected = activeFilter === key;
                const timeIcon =
                  key === "today" ? "time-outline" : "calendar-outline";
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.7}
                    onPress={() => selectTime(key)}
                    style={[
                      styles.option,
                      { backgroundColor: selected ? selectedBgLight : bg },
                    ]}
                  >
                    <Ionicons
                      name={timeIcon}
                      size={18}
                      color={selected ? purple : textInactive}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        { color: selected ? purple : textInactive },
                        selected && styles.optionTextBold,
                      ]}
                    >
                      {t(
                        key === "today"
                          ? "filterToday"
                          : key === "week"
                            ? "filterWeek"
                            : key === "month"
                              ? "filterMonth"
                              : "filterYear"
                      )}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark" size={20} color={purple} />
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        </Modal>
      )}

      {Platform.OS === "ios" && categoryOpen && categoryPanelLayout && (
        <Modal transparent visible animationType="fade">
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={toggleCategory}
          />
          <View
            style={[
              styles.panel,
              styles.panelModal,
              {
                backgroundColor: panelBg,
                left: categoryPanelLayout.x,
                top: categoryPanelLayout.y + categoryPanelLayout.h + 4,
                width: categoryPanelLayout.w,
              },
              shadow,
            ]}
          >
              {TAG_KEYS.map((key) => {
                const isAll = key === "all";
                const tagValue =
                  key === "family"
                    ? t("tagFamily")
                    : key === "friends"
                      ? t("tagFriends")
                      : key === "work"
                        ? t("tagWork")
                        : key === "other"
                          ? t("tagOther")
                          : null;
                const selected =
                  isAll ? !selectedTag : selectedTag === tagValue;
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.7}
                    onPress={() => selectTag(key)}
                    style={[
                      styles.option,
                      { backgroundColor: selected ? purple : bg },
                    ]}
                  >
                    {isAll ? (
                      <Ionicons
                        name="ellipse-outline"
                        size={18}
                        color={selected ? "#fff" : textInactive}
                      />
                    ) : key === "family" ? (
                      <Ionicons
                        name="heart"
                        size={18}
                        color={selected ? "#fff" : "#ec4899"}
                      />
                    ) : key === "friends" ? (
                      <Ionicons
                        name="person-outline"
                        size={18}
                        color={selected ? "#fff" : "#38bdf8"}
                      />
                    ) : key === "work" ? (
                      <Ionicons
                        name="briefcase-outline"
                        size={18}
                        color={selected ? "#fff" : "#f97316"}
                      />
                    ) : (
                      <View style={styles.threeDotsSmall}>
                        <View
                          style={[
                            styles.dotSmall,
                            {
                              backgroundColor: selected ? "#fff" : "#eab308",
                            },
                          ]}
                        />
                        <View
                          style={[
                            styles.dotSmall,
                            {
                              backgroundColor: selected ? "#fff" : "#22c55e",
                            },
                          ]}
                        />
                        <View
                          style={[
                            styles.dotSmall,
                            {
                              backgroundColor: selected ? "#fff" : purple,
                            },
                          ]}
                        />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        { color: selected ? "#fff" : textInactive },
                        selected && styles.optionTextBold,
                      ]}
                    >
                      {isAll ? t("allTags") : tagValue}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: "visible",
    zIndex: 1000,
    elevation: 10,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    overflow: "visible",
  },
  dropdownHalf: {
    flex: 1,
    zIndex: 1,
    overflow: "visible",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(10),
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.sm,
  },
  triggerText: {
    fontSize: fontSize.md,
    fontWeight: "500",
    flex: 1,
  },
  triggerTextActive: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  threeDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(3),
  },
  dot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  threeDotsSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  dotSmall: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
  },
  panel: {
    position: "absolute",
    top: verticalScale(50),
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    overflow: "hidden",
  },
  panelModal: {
    right: undefined,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(10),
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xxs,
    gap: spacing.md,
  },
  optionText: {
    fontSize: fontSize.md,
    flex: 1,
  },
  optionTextBold: {
    fontWeight: "600",
  },
});
