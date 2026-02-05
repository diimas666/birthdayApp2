import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
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
import {
  GiftBottomSheet,
  type GiftBottomSheetRef,
} from "../components/GiftBottomSheet";
import { GiftWebViewModal } from "../components/GiftWebViewModal";
import { useTranslation } from "../hooks/useTranslation";
import { useTheme } from "../contexts/ThemeContext";
import {
  spacing,
  fontSize,
  borderRadius,
  moderateScale,
  verticalScale,
} from "../utils/scale";

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
  const [searchExpanded, setSearchExpanded] = useState(false);
  const giftSheetRef = useRef<GiftBottomSheetRef>(null);

  const toggleSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchExpanded((v) => {
      if (v) setSearchQuery("");
      return !v;
    });
  };

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
          (b.note && b.note.toLowerCase().includes(query)),
      );
    }
    return filtered;
  }, [birthdays, activeFilter, searchQuery, selectedTag]);

  const currentDate = useMemo(() => t("currentDateFormatted") as string, [t]);

  const todaysList = useMemo(() => getTodaysBirthdays(birthdays), [birthdays]);
  const enrichedAll = useMemo(
    () =>
      birthdays.map(enrichBirthday).sort((a, b) => a.daysUntil - b.daysUntil),
    [birthdays],
  );

  const [todayEmptyTitle, todayEmptySub] = useMemo(() => {
    const parts = (t("todayEmptyState") as string).split("\n");
    return [parts[0] || "", parts[1] || ""];
  }, [t]);

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
    }, []),
  );

  const handleSave = async (
    birthdayData: Omit<Birthday, "id" | "createdAt">,
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
          <View style={styles.greetingBlock}>
            <Text style={[styles.greeting, { color: textColor }]}>
              {t("homeGreeting")}
            </Text>
            <Text style={[styles.greetingSubtext, { color: secondaryText }]}>
              {t("greetingSubtext")}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.searchIconBtn, { backgroundColor: chipBg }]}
            onPress={toggleSearch}
            activeOpacity={0.7}
          >
            <Ionicons
              name="search"
              size={22}
              color={searchExpanded ? "#8b5cf6" : secondaryText}
            />
          </TouchableOpacity>
        </View>

        {searchExpanded && (
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("searchPlaceholder")}
          />
        )}
        <View style={{ marginTop: searchExpanded ? 0 : spacing.sm }}>
          <FilterDropdowns
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
          />
          <Text style={[styles.dateText, { color: textColor }]}>
            {currentDate}
          </Text>
        </View>

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
              <Text style={styles.heroTitle}>{t("heroTodayTitle")}</Text>
              <Text style={styles.heroName}>
                {todaysList[0].name} — {todaysList[0].age}{" "}
                {t("yearWord", todaysList[0].age) as string}
              </Text>
              {todaysList[0].daysUntil > 0 && (
                <Text style={styles.heroDays}>
                  ⏳ {t("inDays", todaysList[0].daysUntil)}
                </Text>
              )}
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
              <Feather
                name="calendar"
                size={fontSize.xxxl}
                color="#fff"
                style={styles.heroEmoji}
              />
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
              <Feather
                name="calendar"
                size={fontSize.xxxl}
                color="#fff"
                style={styles.heroEmoji}
              />
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
            <View style={styles.statsCollapsedTitleRow}>
              <Feather
                name="bar-chart-2"
                size={fontSize.xxl}
                color={statsBorder}
                style={{ marginRight: spacing.xs }}
              />
              <Text
                style={[styles.statsCollapsedTitle, { color: statsBorder }]}
              >
                {t("statsCollapsed")}
              </Text>
            </View>
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
              <EmptyState
                message={todayEmptyTitle}
                subMessage={todayEmptySub}
                image={require("../assets/images/birthday-cake.png")}
              />
            ) : (
              <EmptyState
                message={
                  searchQuery ? t("noResults") : t("noBirthdaysInPeriod")
                }
                image={require("../assets/images/birthday-cake.png")}
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
        <Ionicons name="add" size={moderateScale(32)} color="#fff" />
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
            `https://www.google.com/search?q=${encodeURIComponent(query)}`,
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  greetingBlock: {
    flex: 1,
  },
  searchIconBtn: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: "#000",
    marginBottom: spacing.xs,
  },
  greetingSubtext: {
    fontSize: fontSize.md,
    color: "#666",
  },
  dateText: {
    fontSize: fontSize.lg,
    color: "#000",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  heroBlock: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  heroEmoji: { fontSize: fontSize.xxxl, marginBottom: spacing.sm },
  heroTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#fff",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  heroName: {
    fontSize: fontSize.base,
    color: "#fff",
    opacity: 0.95,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  heroDays: {
    fontSize: fontSize.md,
    color: "#fff",
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  heroButtons: { flexDirection: "row", gap: spacing.md },
  heroButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: moderateScale(10),
    borderRadius: borderRadius.sm,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  heroButtonText: { fontSize: fontSize.md, fontWeight: "600", color: "#fff" },
  statsCollapsedBlock: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    // лёгкая тень, чтобы блок выглядел «дороже», но без огромного «провала» снизу
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.14,
    shadowRadius: moderateScale(8),
    elevation: 2,
  },
  statsCollapsedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsCollapsedTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsCollapsedTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  statsExpandedContent: {
    marginTop: moderateScale(10),
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(139,92,246,0.3)",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  statsLabel: {
    fontSize: fontSize.md,
    color: "#666",
    marginRight: spacing.xs,
  },
  statsValue: {
    fontSize: fontSize.md,
    color: "#000",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  section: {
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: "#000",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sectionTitleToday: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  todayEmptyText: {
    fontSize: fontSize.base,
    textAlign: "center",
    lineHeight: moderateScale(24),
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
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
  fabIconText: {
    fontSize: moderateScale(32),
  },
});
