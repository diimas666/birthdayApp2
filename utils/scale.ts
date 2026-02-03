import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Базовые размеры дизайна (iPhone 14/15 Pro)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Масштабирует значение пропорционально ширине экрана
 */
export const scale = (size: number): number => {
    return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Масштабирует значение пропорционально высоте экрана
 */
export const verticalScale = (size: number): number => {
    return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Умеренное масштабирование (для лучшей адаптации на больших экранах)
 * @param size - базовый размер
 * @param factor - коэффициент масштабирования (0 = не масштабировать, 0.5 = умеренно, 1 = полностью)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
    return size + (scale(size) - size) * factor;
};

/**
 * Масштабирует шрифт с учетом плотности пикселей и настроек пользователя
 */
export const scaleFont = (size: number): number => {
    const scaled = moderateScale(size, 0.3);
    return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

// Готовые константы для отступов (spacing)
export const spacing = {
    xxs: moderateScale(2),
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(16),
    lg: moderateScale(24),
    xl: moderateScale(32),
    xxl: moderateScale(48),
    xxxl: moderateScale(64),
};

// Размеры шрифтов
export const fontSize = {
    xs: scaleFont(10),
    sm: scaleFont(12),
    md: scaleFont(14),
    base: scaleFont(16),
    lg: scaleFont(18),
    xl: scaleFont(20),
    xxl: scaleFont(24),
    xxxl: scaleFont(32),
    huge: scaleFont(48),
};

// Размеры border radius
export const borderRadius = {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(24),
    full: 9999,
};

// Информация об экране
export const dimensions = {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isSmallDevice: SCREEN_WIDTH < 375,
    isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
    isLargeDevice: SCREEN_WIDTH >= 414,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
};

// Общие размеры элементов
export const sizes = {
    icon: {
        xs: moderateScale(12),
        sm: moderateScale(16),
        md: moderateScale(24),
        lg: moderateScale(32),
        xl: moderateScale(48),
    },
    button: {
        height: {
            sm: verticalScale(36),
            md: verticalScale(48),
            lg: verticalScale(56),
        },
    },
    input: {
        height: verticalScale(48),
    },
    header: {
        height: verticalScale(56),
    },
};
