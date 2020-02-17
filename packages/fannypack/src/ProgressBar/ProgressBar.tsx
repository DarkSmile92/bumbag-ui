import * as React from 'react';
import { Box as ReakitBox } from 'reakit';

import { Size } from '../types';
import { useClassName, createComponent, createElement, createHook } from '../utils';
import { Box, BoxProps } from '../Box';

import * as styles from './styles';

export type LocalProgressBarProps = {
  color?: string;
  maxValue?: number;
  size?: Size;
  value?: number;
};
export type ProgressBarProps = BoxProps & LocalProgressBarProps;

function normalizeValue(value: number, maxValue: number) {
  let newValue = value;
  if (newValue > maxValue) newValue = maxValue;
  else if (newValue < 0) newValue = 0;
  return newValue;
}

const useProps = createHook<ProgressBarProps>(
  (props, { themeKey, themeKeyOverride }) => {
    const { maxValue, value, ...restProps } = props;
    const boxProps = Box.useProps(restProps);

    let newValue = value || 0;
    let newMaxValue = maxValue || 100;
    newValue = normalizeValue(newValue, newMaxValue);
    const percent = (newValue / newMaxValue) * 100;

    const className = useClassName({
      style: styles.ProgressBar,
      styleProps: props,
      themeKey,
      themeKeyOverride,
      prevClassName: boxProps.className
    });
    const indicatorClassName = useClassName({
      style: styles.ProgressBarIndicator,
      styleProps: { ...props, value: percent },
      themeKey,
      themeKeyOverride,
      themeKeySuffix: 'Indicator',
      prevClassName: boxProps.className
    });

    return {
      ...boxProps,
      'aria-valuenow': newValue,
      'aria-valuemin': 0,
      'aria-valuemax': newMaxValue,
      className,
      role: 'progressbar',
      children: <Box className={indicatorClassName} />
    };
  },
  { defaultProps: { color: 'primary', maxValue: 100, size: 'default', value: 0 }, themeKey: 'ProgressBar' }
);

export const ProgressBar = createComponent<ProgressBarProps>(
  props => {
    const textProps = useProps(props);
    return createElement({ children: props.children, component: ReakitBox, use: props.use, htmlProps: textProps });
  },
  {
    attach: {
      useProps
    },
    themeKey: 'ProgressBar'
  }
);
