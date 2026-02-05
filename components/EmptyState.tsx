import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import {
  spacing,
  fontSize,
  verticalScale,
  moderateScale,
  borderRadius,
} from "../utils/scale";

interface EmptyStateProps {
  message: string;
  subMessage?: string;
  emoji?: string;
  image?: ImageSourcePropType;
  textColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  subMessage,
  emoji,
  image,
  textColor,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          {image ? (
            <Image source={image} style={styles.image} resizeMode="contain" />
          ) : emoji ? (
            <Text style={styles.emoji}>{emoji}</Text>
          ) : (
            <Text style={styles.emoji}>🎈</Text>
          )}
        </View>
        <Text
          style={[styles.title, textColor ? { color: textColor } : undefined]}
        >
          {message}
        </Text>
        {subMessage && <Text style={styles.subtitle}>{subMessage}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    width: "90%",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#f3efff",
  },
  iconCircle: {
    width: moderateScale(160),
    height: moderateScale(120),
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,

    overflow: "hidden",
  },
  emoji: {
    fontSize: moderateScale(52),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: "#2e1065",
    textAlign: "center",
    marginBottom: spacing.sm,
    lineHeight: moderateScale(28),
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: "#7c3aed",
    textAlign: "center",
    opacity: 0.6,
    lineHeight: moderateScale(24),
    fontWeight: "500",
  },
});
