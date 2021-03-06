import { Box as ReakitBox } from 'reakit';

import { useClassName, createComponent, createElement, createHook } from '../utils';
import { Modal, ModalProps } from '../Modal';

import * as styles from './styles';

export type LocalDrawerProps = {
  /** Indicates if the drawer should span the whole width/height of the screen. */
  isFullScreen?: boolean;
};
export type DrawerProps = ModalProps & LocalDrawerProps;

const useProps = createHook<Partial<DrawerProps>>(
  (props, { themeKey, themeKeyOverride }) => {
    const modalProps = Modal.useProps({ ...props }, { themeKey: 'Drawer' });

    const className = useClassName({
      style: styles.Drawer,
      styleProps: props,
      themeKey,
      themeKeyOverride,
      prevClassName: modalProps.className,
    });

    return { ...modalProps, className };
  },
  { defaultProps: { duration: '0.2s', placement: 'left' }, themeKey: 'Drawer' }
);

export const Drawer = createComponent<Partial<DrawerProps>>(
  (props) => {
    const textProps = useProps(props);
    return createElement({ children: props.children, component: ReakitBox, use: props.use, htmlProps: textProps });
  },
  {
    attach: {
      useProps,
      displayName: 'Drawer',
    },
    themeKey: 'Drawer',
  }
);
