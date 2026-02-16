import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Birthday, BirthdayWithAge } from "../types";
import {
  getBirthdays,
  deleteBirthday,
  updateBirthday,
  saveBirthday,
} from "../utils/storage";
import {
  enrichBirthday,
  formatDate,
  formatDateShort,
} from "../utils/dateHelpers";
import { getZodiacSign } from "../utils/zodiac";
import { rescheduleAllNotifications } from "../utils/notifications";
import { BirthdayModal } from "../components/BirthdayModal";
import { EmptyState } from "../components/EmptyState";
import AdBanner from "../components/AdBanner";
import { useTranslation } from "../hooks/useTranslation";
import { useTheme } from "../contexts/ThemeContext";
import {
  spacing,
  fontSize,
  borderRadius,
  moderateScale,
  verticalScale,
} from "../utils/scale";

type SortType = "date" | "name" | "age";

export const ListScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const bg = isDark ? "#0a0a14" : "#F5F5F5";
  const cardBg = isDark ? "#2a2a3e" : "#fff";
  const textColor = isDark ? "#fff" : "#000";
  const secondaryText = isDark ? "#a78bfa" : "#666";
  const sortTabBg = isDark ? "#2a2a3e" : "#eee";
  const listItemBg = isDark ? "#2a2a3e" : "#fff";
  const listItemBorder = isDark ? "#3a3a4e" : "#e8e8e8";
  const daysBadgeBg = isDark ? "#3a3a4e" : "#f0e6ff";
  const daysBadgeTextColor = isDark ? "#fff" : "#333";
  const [birthdays, setBirthdays] = useState<BirthdayWithAge[]>([]);
  const [sortBy, setSortBy] = useState<SortType>("date");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

  const loadBirthdays = async () => {
    const loaded = await getBirthdays();
    const enriched = loaded.map(enrichBirthday);
    enriched.sort((a, b) => a.daysUntil - b.daysUntil);
    setBirthdays(enriched);
  };

  const sortedBirthdays = React.useMemo(() => {
    const list = [...birthdays];
    if (sortBy === "date") list.sort((a, b) => a.daysUntil - b.daysUntil);
    else if (sortBy === "name")
      list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "age") list.sort((a, b) => b.age - a.age);
    return list;
  }, [birthdays, sortBy]);

  useFocusEffect(
    useCallback(() => {
      loadBirthdays();
    }, []),
  );

  const handleDelete = async (id: string) => {
    Alert.alert(t("deleteBirthday"), t("deleteConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          await deleteBirthday(id);
          const updated = birthdays.filter((b) => b.id !== id);
          await rescheduleAllNotifications(updated);
          await loadBirthdays();
        },
      },
    ]);
  };

  const handleEdit = (birthday: BirthdayWithAge) => {
    setEditingBirthday(birthday);
    setModalVisible(true);
  };

  const handleSave = async (
    birthdayData: Omit<Birthday, "id" | "createdAt">,
  ) => {
    if (editingBirthday) {
      await updateBirthday(editingBirthday.id, birthdayData);
    } else {
      const newBirthday: Birthday = {
        ...birthdayData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      await saveBirthday(newBirthday);
    }
    await loadBirthdays();
    const allBirthdays = await getBirthdays();
    await rescheduleAllNotifications(allBirthdays);
    setModalVisible(false);
    setEditingBirthday(null);
  };

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    _dragX: Animated.AnimatedInterpolation<number>,
    item: BirthdayWithAge,
  ) => {
    return (
      <View style={styles.rightAction}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteButtonText}>{t("delete")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }: { item: BirthdayWithAge }) => {
    const getDaysText = () => {
      if (item.daysUntil === 0) return t("todayShort");
      if (item.daysUntil === 1) return t("tomorrow");
      return t("inDays", item.daysUntil);
    };

    return (
      <View style={styles.listItemWrap}>
        <Swipeable
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, item)
          }
          overshootRight={false}
          friction={2}
          rightThreshold={40}
        >
          <TouchableOpacity
            style={[
              styles.listItem,
              { backgroundColor: listItemBg, borderColor: listItemBorder },
            ]}
            onPress={() => handleEdit(item)}
            activeOpacity={0.7}
          >
            <View style={styles.listItemContent}>
              <View style={styles.listItemLeft}>
                <View style={styles.listItemNameRow}>
                  <Text style={[styles.listItemName, { color: textColor }]}>
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.listItemZodiac, { color: secondaryText }]}
                  >
                    {getZodiacSign(new Date(item.dateOfBirth)).symbol}
                  </Text>
                </View>
                <Text
                  style={[styles.listItemDetails, { color: secondaryText }]}
                >
                  {item.hideYear
                    ? `${t("birthdayLabel")} • ${formatDateShort(item.nextBirthday)}`
                    : `${t("turns", item.age + 1)} • ${formatDate(item.nextBirthday)}`}
                </Text>
                {item.note && (
                  <Text style={styles.listItemNote}>{item.note}</Text>
                )}
              </View>
              <View style={styles.listItemRight}>
                <View
                  style={[
                    styles.daysBadge,
                    {
                      backgroundColor:
                        item.daysUntil === 0 ? undefined : daysBadgeBg,
                    },
                    item.daysUntil === 0 && styles.daysBadgeToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.daysBadgeText,
                      {
                        color:
                          item.daysUntil === 0 ? "#fff" : daysBadgeTextColor,
                      },
                      item.daysUntil === 0 && styles.daysBadgeTextToday,
                    ]}
                  >
                    {getDaysText()}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      </View>
    );
  };

  if (birthdays.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: bg }]}
        edges={["top"]}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={bg}
          translucent={false}
        />
        <EmptyState
          message={t("noBirthdaysYet")}
          emoji="🎂"
          textColor={secondaryText}
        />
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={moderateScale(32)} color="#fff" />
        </TouchableOpacity>
        <BirthdayModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingBirthday(null);
          }}
          onSave={handleSave}
          editingBirthday={editingBirthday}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bg }]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={bg}
        translucent={false}
      />
      <View style={[styles.sortRow, { backgroundColor: cardBg }]}>
        <Text style={[styles.sortLabel, { color: secondaryText }]}>
          {t("sortBy")}:
        </Text>
        <View style={styles.sortTabs}>
          {(["date", "name", "age"] as const).map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.sortTab,
                { backgroundColor: sortTabBg },
                sortBy === key && styles.sortTabActive,
              ]}
              onPress={() => setSortBy(key)}
            >
              <Text
                style={[
                  styles.sortTabText,
                  { color: daysBadgeTextColor },
                  sortBy === key && styles.sortTabTextActive,
                ]}
              >
                {key === "date"
                  ? t("sortByDate")
                  : key === "name"
                    ? t("sortByName")
                    : t("sortByAge")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={sortedBirthdays}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingBirthday(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={moderateScale(32)} color="#fff" />
      </TouchableOpacity>
      <BirthdayModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingBirthday(null);
        }}
        onSave={handleSave}
        editingBirthday={editingBirthday}
      />
      <AdBanner />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    backgroundColor: "#fff",
  },
  sortLabel: { fontSize: fontSize.md, color: "#666" },
  sortTabs: { flexDirection: "row", gap: spacing.sm },
  sortTab: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: "#eee",
  },
  sortTabActive: { backgroundColor: "#8b5cf6" },
  sortTabText: { fontSize: fontSize.md, color: "#333" },
  sortTabTextActive: { fontWeight: "600", color: "#fff" },
  list: {
    padding: spacing.md,
    paddingBottom: verticalScale(80),
  },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: moderateScale(20),
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(32),
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(12),
    elevation: 10,
  },
  fabText: { fontSize: fontSize.xxxl },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    overflow: "hidden",
  },
  listItemContent: {
    flexDirection: "row",
    padding: spacing.md,
    alignItems: "center",
  },
  listItemLeft: {
    flex: 1,
  },
  listItemNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xxs,
  },
  listItemName: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: "#000",
  },
  listItemZodiac: {
    fontSize: fontSize.lg,
  },
  listItemDetails: {
    fontSize: fontSize.md,
    color: "#8b5cf6",
    marginBottom: spacing.xxs,
  },
  listItemNote: {
    fontSize: fontSize.sm,
    color: "#999",
    marginTop: spacing.xs,
    fontStyle: "italic",
  },
  listItemRight: {
    marginLeft: spacing.md,
  },
  daysBadge: {
    backgroundColor: "#f0e6ff",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  daysBadgeToday: {
    backgroundColor: "#8b5cf6",
  },
  daysBadgeText: {
    color: "#333",
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  daysBadgeTextToday: {
    color: "#fff",
  },
  listItemWrap: {
    marginBottom: spacing.sm,
  },
  rightAction: {
    width: moderateScale(110),
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    minHeight: verticalScale(72),
    paddingHorizontal: moderateScale(14),
    borderRadius: borderRadius.lg,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: fontSize.base,
    fontWeight: "bold",
    textAlign: "center",
  },
});
