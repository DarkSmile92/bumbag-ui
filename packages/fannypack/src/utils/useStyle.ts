import * as React from 'react';
import _kebabCase from 'lodash/kebabCase';

import { css } from '../styled';
import { useTheme } from './useTheme';
import { border, borderRadius, breakpoint, fontSize, palette, space, fontWeight } from './theme';

import { cssProps as cssPropsMap, pickCSSProps } from './cssProps';
import { useColorMode } from './useColorMode';

const borderAttributes = ['border'];
const borderRadiusAttributes = ['borderRadius'];
const colorAttributes = [
  'color',
  'backgroundColor',
  'borderBlockEndColor',
  'borderBlockStartColor',
  'borderBottomColor',
  'borderColor',
  'borderInlineEndColor',
  'borderInline-startColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'borderBottomColor',
  'caretColor',
  'columnRuleColor',
  'outlineColor',
  'textDecorationColor',
  'textEmphasisColor',
];
const spaceAttributes = [
  'margin',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'marginX',
  'marginY',
  'padding',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'paddingX',
  'paddingY',
  'top',
  'left',
  'bottom',
  'right',
  'grid-gap',
  'grid-column-gap',
  'grid-row-gap',
];
const fontSizeAttributes = ['fontSize'];
const fontWeightAttributes = ['fontWeight'];

const attributeMaps = {
  marginY: ['marginTop', 'marginBottom'],
  paddingY: ['paddingTop', 'paddingBottom'],
  marginX: ['marginLeft', 'marginRight'],
  paddingX: ['paddingLeft', 'paddingRight'],
};

function getBorderValue({ theme, value }) {
  const borderValue = border(value)({ theme });
  if (borderValue) {
    return `${borderValue.width} solid ${borderValue.color}`;
  }
  return value;
}

function getBorderRadiusValue({ theme, value }) {
  const borderRadiusValue = borderRadius(value)({ theme });
  if (borderRadiusValue) {
    return borderRadiusValue;
  }
  return value;
}

function getColorValue({ colorMode, theme, value }) {
  const color = palette(value)({ colorMode, theme });
  if (color) {
    return color;
  }
  return value;
}

function getSpaceValue({ theme, value }) {
  const spacing = space(value)({ theme });
  if (spacing) {
    return `${spacing}rem`;
  }
  return value;
}

function getFontSizeValue({ theme, value }) {
  const size = fontSize(value)({ theme });
  if (size) {
    return `${size}rem`;
  }
  return value;
}

function getFontWeightValue({ theme, value }) {
  const weight = fontWeight(value)({ theme });
  if (weight) {
    return weight;
  }
  return value;
}

function getStyleFromProps(props, theme, colorMode) {
  let style = { ...props };
  if (style) {
    let styleEntries = Object.entries(style);
    styleEntries = styleEntries.reduce((prevStyle, [attribute, value]) => {
      let entries = [[attribute, value]];
      if (attributeMaps[attribute]) {
        entries = attributeMaps[attribute].map((attribute) => [attribute, value]);
      }
      return [...prevStyle, ...entries];
    }, []);

    style = styleEntries.reduce((prevStyle, [attribute, value]) => {
      let newValue = value;
      if (typeof newValue === 'string') {
        newValue = { default: value };
      }
      if (attribute.includes('_')) {
        const pseudoSelector = cssPropsMap[attribute];
        return css`
          ${prevStyle};

          ${pseudoSelector} {
            ${getStyleFromProps(value, theme, colorMode)};
          }
        `;
      }
      const newStyle = Object.entries(newValue || {}).reduce((prevStyle, [bp, value]) => {
        let newValue = value;
        if (borderAttributes.includes(attribute)) {
          newValue = getBorderValue({ theme, value });
        }
        if (borderRadiusAttributes.includes(attribute)) {
          newValue = getBorderRadiusValue({ theme, value });
        }
        if (colorAttributes.includes(attribute)) {
          newValue = getColorValue({ colorMode, theme, value });
        }
        if (spaceAttributes.includes(attribute)) {
          newValue = getSpaceValue({ theme, value });
        }
        if (fontSizeAttributes.includes(attribute)) {
          newValue = getFontSizeValue({ theme, value });
        }
        if (fontWeightAttributes.includes(attribute)) {
          newValue = getFontWeightValue({ theme, value });
        }
        if (bp === 'default') {
          // @ts-ignore
          return css`
            ${prevStyle}
            ${_kebabCase(attribute)}: ${newValue} !important;
          `;
        }
        return css`
          ${prevStyle};
          ${breakpoint(
            bp,
            // @ts-ignore
            css`
              ${_kebabCase(attribute)}: ${newValue} !important;
            `
          )({ theme })};
        `;
      }, css``);
      return css`
        ${prevStyle} ${newStyle};
      `;
    }, css``);
  }

  return style;
}

export function useStyle(props) {
  const { theme } = useTheme();
  const { colorMode } = useColorMode();
  const cssProps = pickCSSProps(props);
  return React.useMemo(() => getStyleFromProps(cssProps, theme, colorMode), [theme, colorMode, ...Object.values(cssProps)]); // eslint-disable-line
}
