import * as React from 'react';

import { IdProvider } from '../utils/uniqueId';
import { ThemeProvider as EmotionProvider } from '../styled';
import buildTheme from '../theme';
import { LayoutBreakpoint, ThemeConfig } from '../types';
import { ToastProvider } from '../Toast';
import { PageProvider } from '../Page/PageContext';
import { Box } from '../Box';

import GlobalStyles from './GlobalStyles';
import { FannypackThemeContext } from './ThemeContext';
import { Provider as ColorModeProvider } from './ColorModeContext';

export type ProviderProps = {
  children: React.ReactNode;
  isStandalone?: boolean;
  collapseBelow?: LayoutBreakpoint;
  colorMode?: string;
  theme?: ThemeConfig;
};

Provider.defaultProps = {
  colorMode: 'default',
};

export function Provider(props: ProviderProps) {
  const { children, colorMode, collapseBelow, isStandalone, theme: _theme } = props;

  ////////////////////////////////////////////////

  const [theme, setTheme] = React.useState(_theme);
  React.useEffect(() => {
    setTheme(_theme);
  }, [_theme]);

  ////////////////////////////////////////////////

  const derivedTheme = React.useMemo(() => {
    if (theme && isStandalone) {
      return theme;
    }
    return buildTheme(theme);
  }, [isStandalone, theme]);

  ////////////////////////////////////////////////

  const themeContextValue = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  ////////////////////////////////////////////////

  return (
    <ColorModeProvider mode={colorMode}>
      <FannypackThemeContext.Provider value={themeContextValue}>
        <EmotionProvider theme={derivedTheme}>
          <IdProvider>
            <ToastProvider>
              <PageProvider collapseBelow={collapseBelow}>
                <React.Fragment>
                  {process.env.NODE_ENV !== 'test' && <GlobalStyles />}
                  {process.env.NODE_ENV === 'test' ? children : <Box>{children}</Box>}
                </React.Fragment>
              </PageProvider>
            </ToastProvider>
          </IdProvider>
        </EmotionProvider>
      </FannypackThemeContext.Provider>
    </ColorModeProvider>
  );
}
