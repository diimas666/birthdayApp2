import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  Linking,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import ConfettiCannon from "react-native-confetti-cannon";
import { Birthday, BirthdayWithAge } from "../types";
import { getBirthdays, saveBirthday } from "../utils/storage";
import {
  getBirthdaysByFilter,
  getTodaysBirthdays,
  enrichBirthday,
  getBirthdaysInMonth,
  getBirthdaysInQuarter,
} from "../utils/dateHelpers";
import { GreetingModal } from "../components/GreetingModal";
import { rescheduleAllNotifications } from "../utils/notifications";
import {
  getLastConfettiDate,
  setLastConfettiDate,
} from "../utils/settingsStorage";
import { FestiveBirthdayCard } from "../components/FestiveBirthdayCard";
import { SearchBar } from "../components/SearchBar";
import { FilterDropdowns } from "../components/FilterDropdowns";
import { BirthdayModal } from "../components/BirthdayModal";
import { EmptyState } from "../components/EmptyState";
import { GiftBottomSheet, type GiftBottomSheetRef } from "../components/GiftBottomSheet";
import { GiftWebViewModal } from "../components/GiftWebViewModal";
import { useTranslation } from "../hooks/useTranslation";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const bg = isDark ? "#0a0a14" : "#FFFFFF";
  const cardBg = isDark ? "#2a2a3e" : "#fff";
  const textColor = isDark ? "#fff" : "#000";
  const secondaryText = isDark ? "#a78bfa" : "#666";
  const chipBg = isDark ? "#2a2a3e" : "#eee";
  const chipText = isDark ? "#fff" : "#333";
  const statsBg = isDark ? "#2a2a5e" : "#f0e6ff";
  const statsBorder = isDark ? "#8b5cf6" : "#8b5cf6";
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "today" | "week" | "month" | "year"
  >("today");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [heroGreetingVisible, setHeroGreetingVisible] = useState(false);
  const [heroGreetingBirthday, setHeroGreetingBirthday] =
    useState<BirthdayWithAge | null>(null);
  const [giftWebViewUrl, setGiftWebViewUrl] = useState<string | null>(null);
  const giftSheetRef = useRef<GiftBottomSheetRef>(null);

  const loadBirthdays = async () => {
    const loaded = await getBirthdays();
    setBirthdays(loaded);

    const todayList = getTodaysBirthdays(loaded);
    if (todayList.length > 0) {
      const todayStr = new Date().toDateString();
      const lastConfetti = await getLastConfettiDate();
      if (lastConfetti !== todayStr) {
        await setLastConfettiDate(todayStr);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const filteredBirthdays = useMemo(() => {
    let filtered = getBirthdaysByFilter(birthdays, activeFilter);
    if (selectedTag) {
      filtered = filtered.filter((b) => b.tags?.includes(selectedTag));
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          (b.note && b.note.toLowerCase().includes(query))
      );
    }
    return filtered;
  }, [birthdays, activeFilter, searchQuery, selectedTag]);

  const currentDate = useMemo(() => t("currentDateFormatted") as string, [t]);

  const todaysList = useMemo(() => getTodaysBirthdays(birthdays), [birthdays]);
  const enrichedAll = useMemo(
    () =>
      birthdays.map(enrichBirthday).sort((a, b) => a.daysUntil - b.daysUntil),
    [birthdays]
  );
  const nearestBirthday = enrichedAll[0] ?? null;

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const countThisYear = enrichedAll.length;
    const countThisMonth = getBirthdaysInMonth(birthdays, currentMonth);
    const nearest = nearestBirthday;
    return { countThisYear, countThisMonth, nearest };
  }, [birthdays, enrichedAll, nearestBirthday]);

  useFocusEffect(
    useCallback(() => {
      loadBirthdays();
    }, [])
  );

  const handleSave = async (
    birthdayData: Omit<Birthday, "id" | "createdAt">
  ) => {
    const newBirthday: Birthday = {
      ...birthdayData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    await saveBirthday(newBirthday);
    await rescheduleAllNotifications([...birthdays, newBirthday]);
    await loadBirthdays();
    setModalVisible(false);
  };

  const renderBirthdayCard = ({ item }: { item: BirthdayWithAge }) => {
    return <FestiveBirthdayCard birthday={item} />;
  };

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
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: width / 2, y: 0 }}
          fadeOut={true}
        />
      )}

      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: textColor }]}>
              {t("homeGreeting")}
            </Text>
            <Text style={[styles.greetingSubtext, { color: secondaryText }]}>
              {t("greetingSubtext")}
            </Text>
          </View>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t("searchPlaceholder")}
        />
        <FilterDropdowns
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
        />
        <Text style={[styles.dateText, { color: textColor }]}>
          {currentDate}
        </Text>

        {/* Hero: фокус дня */}
        <View
          style={[
            styles.heroBlock,
            {
              backgroundColor: isDark ? "#3a2a5e" : "#8b5cf6",
              borderColor: isDark ? "#5a4a7e" : "#7c3aed",
            },
          ]}
        >
          {todaysList.length > 0 ? (
            <>
              <Text style={styles.heroEmoji}>🎉</Text>
              <Text style={styles.heroTitle}>{t("heroTodayTitle")}</Text>
              <Text style={styles.heroName}>
                {todaysList[0].name} — {todaysList[0].age}{" "}
                {t("yearWord", todaysList[0].age) as string}
              </Text>
              <Text style={styles.heroDays}>⏳ {t("heroTodayDays")}</Text>
              <View style={styles.heroButtons}>
                <TouchableOpacity
                  style={styles.heroButton}
                  onPress={() => {
                    setHeroGreetingBirthday(todaysList[0]);
                    setHeroGreetingVisible(true);
                  }}
                >
                  <Text style={styles.heroButtonText}>
                    {t("heroButtonGreet")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.heroButton}
                  onPress={() =>
                    giftSheetRef.current?.present(todaysList[0].name)
                  }
                >
                  <Text style={styles.heroButtonText}>
                    {t("heroButtonGift")}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : nearestBirthday ? (
            <>
              <Text style={styles.heroEmoji}>📅</Text>
              <Text style={styles.heroTitle}>{t("heroNearestTitle")}</Text>
              <Text style={styles.heroName}>
                {nearestBirthday.name} —{" "}
                {nearestBirthday.daysUntil === 1
                  ? t("tomorrow")
                  : t("inDays", nearestBirthday.daysUntil)}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.heroEmoji}>📅</Text>
              <Text style={styles.heroTitle}>{t("heroNearestTitle")}</Text>
              <Text style={styles.heroName}>{t("noUpcomingBirthdays")}</Text>
            </>
          )}
        </View>

        {/* Статистика — свернутая карточка */}
        <TouchableOpacity
          style={[
            styles.statsCollapsedBlock,
            { backgroundColor: statsBg, borderColor: statsBorder },
          ]}
          onPress={() => setStatsExpanded(!statsExpanded)}
          activeOpacity={0.8}
        >
          <View style={styles.statsCollapsedRow}>
            <Text style={[styles.statsCollapsedTitle, { color: statsBorder }]}>
              📊 {t("statsCollapsed")}
            </Text>
            <Ionicons
              name={statsExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={statsBorder}
            />
          </View>
          {statsExpanded && (
            <View style={styles.statsExpandedContent}>
              <View style={styles.statsRow}>
                <Text style={[styles.statsLabel, { color: secondaryText }]}>
                  {t("statsThisMonthShort")}:
                </Text>
                <Text style={[styles.statsValue, { color: textColor }]}>
                  {stats.countThisMonth}
                </Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={[styles.statsLabel, { color: secondaryText }]}>
                  {t("statsThisYearShort")}:
                </Text>
                <Text style={[styles.statsValue, { color: textColor }]}>
                  {stats.countThisYear}
                </Text>
              </View>
              {stats.nearest && (
                <View style={styles.statsRow}>
                  <Text style={[styles.statsLabel, { color: secondaryText }]}>
                    {t("statsNearestShort")}:
                  </Text>
                  <Text style={[styles.statsValue, { color: textColor }]}>
                    {stats.nearest.name} —{" "}
                    {stats.nearest.daysUntil === 0
                      ? t("todayShort")
                      : stats.nearest.daysUntil === 1
                        ? t("tomorrow")
                        : t("inDays", stats.nearest.daysUntil)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.content, { backgroundColor: bg }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredBirthdays.length > 0 ? (
          <View style={styles.section}>
            <Text
              style={[
                activeFilter === "today"
                  ? styles.sectionTitleToday
                  : styles.sectionTitle,
                { color: textColor },
              ]}
            >
              {activeFilter === "today"
                ? t("todaysBirthdays")
                : t("sectionBirthdays")}
            </Text>
            {filteredBirthdays.map((item) => (
              <FestiveBirthdayCard
                key={item.id}
                birthday={item}
                onGiftPress={(name) => giftSheetRef.current?.present(name)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            {activeFilter === "today" && !searchQuery ? (
              <Text style={[styles.todayEmptyText, { color: secondaryText }]}>
                {t("todayEmptyState")}
              </Text>
            ) : (
              <EmptyState
                message={
                  searchQuery ? t("noResults") : t("noBirthdaysInPeriod")
                }
                emoji="🎂"
                textColor={secondaryText}
              />
            )}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>🎂</Text>
      </TouchableOpacity>

      <BirthdayModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />

      {heroGreetingBirthday && (
        <GreetingModal
          visible={heroGreetingVisible}
          birthday={heroGreetingBirthday}
          onClose={() => {
            setHeroGreetingVisible(false);
            setHeroGreetingBirthday(null);
          }}
        />
      )}

      <GiftBottomSheet
        ref={giftSheetRef}
        onSelect={(query) => {
          setGiftWebViewUrl(
            `https://www.google.com/search?q=${encodeURIComponent(query)}`
          );
        }}
      />
      <GiftWebViewModal
        visible={!!giftWebViewUrl}
        url={giftWebViewUrl}
        onClose={() => setGiftWebViewUrl(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#fff",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 14,
    color: "#666",
  },
  dateText: {
    fontSize: 14,
    color: "#000",
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  heroBlock: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  heroEmoji: { fontSize: 32, marginBottom: 8 },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  heroName: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.95,
    marginBottom: 4,
    textAlign: "center",
  },
  heroDays: { fontSize: 14, color: "#fff", opacity: 0.9, marginBottom: 12 },
  heroButtons: { flexDirection: "row", gap: 12 },
  heroButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  heroButtonText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  statsCollapsedBlock: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  statsCollapsedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsCollapsedTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsExpandedContent: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(139,92,246,0.3)",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 4,
  },
  statsLabel: { fontSize: 12, color: "#666", marginRight: 6 },
  statsValue: { fontSize: 12, color: "#000", fontWeight: "500" },
  content: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  section: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitleToday: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  todayEmptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  fabText: {
    fontSize: 32,
  },
});
