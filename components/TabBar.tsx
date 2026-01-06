import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const totalWidth = width;
  const tabWidth = totalWidth / state.routes.length;
  
  // Animated value for the position of the wave
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, {
       damping: 15,
       stiffness: 100,
    });
  }, [state.index, tabWidth]);

  // SVG Wave Path - Concave "Dip" for "Outside Circle" effect
  // We want the circle to float *above* the bar, sitting in a "notch".
  // Or if "outside circle" means the wave should curve AROUND the circle (convex notch?).
  // Let's go with a Concave Dip. This means the path goes DOWN.
  // Standard bar height 70.
  // The Path needs to draw the full shape of the active tab background "notch".
  // Actually, to make a seamless wave "hole" moving, we'd need to mask the bar or draw the bar as chunks.
  // EASIER APPROACH: Draw the moving shape as a convex HUMP that COVERS the bar gap? 
  // OR Draw the moving shape as the "Mask" that connects?
  
  // Let's stick to the previous Hump but invert it to be "around" if that's what is meant.
  // "wave should outside circle" -> The circle is physically outside the main wave shape?
  // Let's interpret as: Curve downwards (Dip) so the circle sits in it.
  
  const height = 60;
  const curveHeight = 15; // Depth of the dip
  const circleRadius = 30; // Radius of the gap roughly
  
  // Path: A rectangle with a bite taken out of the top.
  // But we are moving a "Cursor".
  // If the bar is solid white, and the cursor is white, we can't see it moving unless it has a shadow or different color.
  // User said "white background", "icon color also".
  // If the bar is white, and the background is white, the bar blends in.
  // We need a shadow on the bar.
  
  // Let's just make the "Hump" (Convex) inverted -> Concave?
  // Actually, standard "Tab Bar with Floating Button" usually has a HOLE in the bar.
  // Implementation: We'll draw the Bar Background with a hole at the active position? 
  // No, that requires re-rendering the whole path every frame or complex mask.
  
  // Alternative Interpretation: "Wave should outside circle" -> The wave IS a circle OUTSIDE (above) the bar?
  // Let's stick to: The moving cursor is a Hump (convex) and the Circle sits ON TOP of it.
  // But maybe the user meant "Don't put the circle inside the wave, put it above?"
  // Let's refine the Hump path to be smoother and ensure the circle floats HIGH above it.
  
  // UPDATED DESIGN:
  // A White Bar.
  // A "Cursor" (Active Tab Background) isn't needed if the background is uniform white.
  // Wait, if it's "white background", then a moving white "hump" on a white bar is invisible.
  // We likely need an ACTIVE INDICATOR (e.g., colored circle?).
  // Re-read: "wave should outside circle". 
  // Maybe the "Wave" is the shape of the tab bar border?
  
  // Let's try:
  // 1. The Circle floats UP (outside the bar rect).
  // 2. The Wave is an SVG that sits behind the circle to connect it to the bar (like a liquid droplet).
  
  // Path for Liquid Connection (Droplet Hump)
  // This will be white, same as bar.
  // We add a shadow to the whole assembly or just the top border?
  
  // Revised Path for a "Convex Hump" (Mountain/Hill shape)
  // "Corners attached to top of bottom bar" -> Base at y=35 (if top is 0 in SVG)
  // "Middle part visible to top" -> Peak at y=0
  
  const humpHeight = 35; 
  const totalSvgHeight = height + humpHeight; // 70 + 35 = 105
  // Note: 'height' var in component is 60, but styles say 70. Let's align.
  // Using 60 as base height in SVG logic.
  
  // Coordinates:
  // y=35 is the "Line" of the bar top.
  // y=0 is the Peak.
  
  const d = `
    M0,${totalSvgHeight} 
    L0,${humpHeight} 
    C${tabWidth * 0.25},${humpHeight} ${tabWidth * 0.35},0 ${tabWidth * 0.5},0
    C${tabWidth * 0.65},0 ${tabWidth * 0.75},${humpHeight} ${tabWidth},${humpHeight} 
    L${tabWidth},${totalSvgHeight} 
    Z
  `;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      
      {/* Moving Background Wave / Cursor */}
      <Animated.View style={[
          styles.cursorContainer, 
          { width: tabWidth, left: 0, top: -humpHeight }, // Shift up by hump height
          animatedStyle
      ]}>
          <Svg width={tabWidth} height={totalSvgHeight} style={styles.cursorSvg}>
              <Path 
                d={d}
                fill={COLORS.white} 
              />
          </Svg>
      </Animated.View>

      {/* Tab Items */}
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem 
                key={index} 
                isFocused={isFocused} 
                options={options} 
                onPress={onPress} 
                width={tabWidth}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabItem = ({ isFocused, options, onPress, width }: any) => {
    // Animation for the icon
    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: withSpring(isFocused ? -25 : 0) }, // Float up into the hump
                { scale: withSpring(isFocused ? 1 : 1) } 
            ]
        };
    });
    
    // Circle Container for the active icon to give it a background?
    // User: "change the icon color also".
    // Let's make the Active Icon White inside a Black Circle? Or Black Icon inside White Circle?
    // User: "white color as background".
    // Let's try: Active = Black Circle with White Icon.
    
    return (
        <TouchableOpacity 
            onPress={onPress} 
            activeOpacity={1}
            style={[styles.tabItem, { width: width }]}
        >
            <Animated.View style={[
                styles.iconContainer, 
                animatedIconStyle,
                isFocused && styles.activeIconContainer // Conditional Style
            ]}>
                 {options.tabBarIcon({ 
                      focused: isFocused, 
                      color: isFocused ? COLORS.white : COLORS.textLight, // White icon when focused (inside black circle)
                      size: 24 
                 })}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: COLORS.white, // White Bar
    height: 70, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderTopWidth: 0,
  },
  cursorContainer: {
      position: 'absolute',
      // top: -30, // Controlled by inline style now
      // height: 100, // Controlled by SVG height
      justifyContent: 'flex-end',
      alignItems: 'center',
      zIndex: 0, 
  },
  cursorSvg: {
     // Optional shadow for the hump if we can match the bar shadow
  },
  tabsRow: {
      flexDirection: 'row',
      height: '100%',
      alignItems: 'center',
  },
  tabItem: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1, 
  },
  iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
  },
  activeIconContainer: {
      backgroundColor: COLORS.primary, // Black Circle
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
  }
});

export default TabBar;
