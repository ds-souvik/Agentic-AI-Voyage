/**
 * FOCUSED ROOM - Input Component
 * 
 * A beautiful text input with validation states and psychology-driven UX.
 * 
 * States:
 * - Default (neutral gray border)
 * - Focus (teal border, feels positive)
 * - Error (red border, clear but not harsh)
 * - Success (green border, positive reinforcement)
 * - Disabled (muted, clear)
 * 
 * Features:
 * - Floating label animation
 * - Helper text (instructions or errors)
 * - Character counter (optional)
 * - Password visibility toggle
 * - Icon support (left/right)
 * 
 * Psychology:
 * - Focus state uses calming teal (inviting, not demanding)
 * - Error state uses muted red (clear but not alarming)
 * - Success state provides positive reinforcement
 * - Smooth animations reduce cognitive load
 * 
 * Accessibility:
 * - Proper labels for screen readers
 * - Error messages announced
 * - High contrast text
 * - Keyboard navigation support
 * 
 * @format
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../theme';

interface InputProps extends TextInputProps {
  /** Input label */
  label: string;
  
  /** Helper text (shown below input) */
  helperText?: string;
  
  /** Error message (shown below input, replaces helperText) */
  error?: string;
  
  /** Success state */
  success?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Show character counter */
  showCounter?: boolean;
  
  /** Maximum character count */
  maxLength?: number;
  
  /** Password input (with visibility toggle) */
  isPassword?: boolean;
  
  /** Custom style */
  style?: any;
  
  /** Test ID */
  testID?: string;
}

/**
 * Input Component
 * 
 * Usage:
 * ```tsx
 * <Input
 *   label="Email"
 *   value={email}
 *   onChangeText={setEmail}
 *   error={emailError}
 *   keyboardType="email-address"
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  success = false,
  disabled = false,
  showCounter = false,
  maxLength,
  isPassword = false,
  value,
  onChangeText,
  onFocus,
  onBlur,
  style,
  testID,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [currentLength, setCurrentLength] = useState(value?.length || 0);

  // Animation for label
  const labelAnim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    setCurrentLength(text.length);
    onChangeText?.(text);
  };

  // Get border color based on state
  const getBorderColor = () => {
    if (disabled) return theme.colors.neutral[300];
    if (error) return theme.colors.danger[500];
    if (success) return theme.colors.accent.green;
    if (isFocused) return theme.colors.primary[500];
    return theme.colors.neutral[300];
  };

  // Label position and size animation
  const labelStyle = {
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -8],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
  };

  return (
    <View style={[styles.container, style]}>
      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() },
          disabled && styles.disabled,
        ]}
      >
        {/* Floating Label */}
        <Animated.Text
          style={[
            styles.label,
            labelStyle,
            {
              color: error
                ? theme.colors.danger[500]
                : isFocused
                ? theme.colors.primary[500]
                : theme.colors.text.muted,
            },
          ]}
        >
          {label}
        </Animated.Text>

        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text.primary },
          ]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          secureTextEntry={isPassword && !isPasswordVisible}
          maxLength={maxLength}
          placeholderTextColor={theme.colors.text.muted}
          testID={testID}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          {...rest}
        />

        {/* Password Visibility Toggle */}
        {isPassword && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            <Text style={styles.passwordToggleText}>
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Helper Text / Error / Counter Row */}
      <View style={styles.bottomRow}>
        {/* Helper Text or Error */}
        <View style={styles.helperContainer}>
          {error && (
            <Text
              style={[styles.helperText, { color: theme.colors.danger[500] }]}
              accessibilityLiveRegion="polite"
            >
              {error}
            </Text>
          )}
          {!error && helperText && (
            <Text style={[styles.helperText, { color: theme.colors.text.muted }]}>
              {helperText}
            </Text>
          )}
        </View>

        {/* Character Counter */}
        {showCounter && maxLength && (
          <Text
            style={[
              styles.counter,
              {
                color:
                  currentLength > maxLength
                    ? theme.colors.danger[500]
                    : theme.colors.text.muted,
              },
            ]}
          >
            {currentLength}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[4],
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    backgroundColor: theme.colors.white,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: theme.spacing[4],
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[1],
    fontWeight: theme.typography.weights.medium as any,
  },
  input: {
    fontSize: theme.typography.sizes.base,
    paddingTop: theme.spacing[2],
    paddingBottom: 0,
    minHeight: 24,
  },
  passwordToggle: {
    position: 'absolute',
    right: theme.spacing[4],
    top: '50%',
    marginTop: -12,
  },
  passwordToggleText: {
    fontSize: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
  },
  helperContainer: {
    flex: 1,
  },
  helperText: {
    fontSize: theme.typography.sizes.xs,
    lineHeight: 16,
  },
  counter: {
    fontSize: theme.typography.sizes.xs,
    marginLeft: theme.spacing[2],
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: theme.colors.neutral[100],
  },
});

export default Input;

