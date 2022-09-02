import { useDOMRef } from '@react-spectrum/utils';
import { useViewportSize } from '@react-aria/utils';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useModal, useOverlay, usePreventScroll } from '@react-aria/overlays';

import { BaseProps, Props, Styles, tasty } from 'tastycss';
import { mergeProps } from '@jenga-ui/utils';

import { OVERLAY_WRAPPER_STYLES } from './Modal';
import { Underlay } from './Underlay';
import { Overlay } from './Overlay';

import type { TrayProps } from '@react-types/overlays';

const TrayWrapperElement = tasty({
  qa: 'TrayWrapper',
  styles: {
    ...OVERLAY_WRAPPER_STYLES,
    placeContent: 'end center',
    placeItems: 'end center',
  },
});

const TrayElement = tasty({
  styles: {
    zIndex: 2,
    height: 'max (@jenga-visual-viewport-height * .9)',
    width: '288px 90vw',
    pointerEvents: 'auto',
    transition:
      'transform .25s ease-in-out, opacity .25s linear, visibility 0ms linear',
    opacity: {
      '': 0,
      open: '.9999',
    },
  },
});

export interface JengaTrayProps extends TrayProps {
  container?: HTMLElement;
  qa?: BaseProps['qa'];
  onClose?: (action?: string) => void;
  isFixedHeight?: boolean;
  isNonModal?: boolean;
  styles?: Styles;
}

interface JengaTrayWrapperProps extends JengaTrayProps {
  isOpen?: boolean;
  overlayProps?: Props;
}

function Tray(props: JengaTrayProps, ref) {
  let {
    qa,
    children,
    onClose,
    isFixedHeight,
    isNonModal,
    styles,
    ...otherProps
  } = props;
  let domRef = useDOMRef(ref);

  let { overlayProps, underlayProps } = useOverlay(
    { ...props, isDismissable: true },
    domRef,
  );

  return (
    <Overlay {...otherProps}>
      <Underlay {...underlayProps} />
      <TrayWrapper
        ref={domRef}
        qa={qa}
        overlayProps={overlayProps}
        isFixedHeight={isFixedHeight}
        isNonModal={isNonModal}
        styles={styles}
        onClose={onClose}
      >
        {children}
      </TrayWrapper>
    </Overlay>
  );
}

let TrayWrapper = forwardRef(function TrayWrapper(
  props: JengaTrayWrapperProps,
  ref,
) {
  let {
    qa,
    children,
    isOpen,
    styles,
    isFixedHeight,
    isNonModal,
    overlayProps,
    ...otherProps
  } = props;
  usePreventScroll();
  let { modalProps } = useModal({
    isDisabled: isNonModal,
  });

  // We need to measure the window's height in JS rather than using percentages in CSS
  // so that contents (e.g. menu) can inherit the max-height properly. Using percentages
  // does not work properly because there is nothing to base the percentage on.
  // We cannot use vh units because mobile browsers adjust the window height dynamically
  // when the address bar/bottom toolbars show and hide on scroll and vh units are fixed.
  // Also, the visual viewport is smaller than the layout viewport when the virtual keyboard
  // is up, so use the VisualViewport API to ensure the tray is displayed above the keyboard.
  let viewport = useViewportSize();
  let [height, setHeight] = useState(viewport.height);
  let timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // When the height is decreasing, and the keyboard is visible
    // (visual viewport smaller than layout viewport), delay setting
    // the new max height until after the animation is complete
    // so that there isn't an empty space under the tray briefly.
    if (viewport.height < height && viewport.height < window.innerHeight) {
      timeoutRef.current = setTimeout(() => {
        setHeight(viewport.height);
      }, 500);
    } else {
      setHeight(viewport.height);
    }
  }, [height, viewport.height]);

  let wrapperStyle = {
    '--jenga-visual-viewport-height': height + 'px',
  };

  let domProps = mergeProps(otherProps, overlayProps);

  return (
    <TrayWrapperElement
      mods={{
        open: isOpen,
      }}
      style={wrapperStyle}
    >
      <TrayElement
        qa={qa || 'Tray'}
        styles={styles}
        mods={{
          open: isOpen,
          'fixed-height': isFixedHeight,
        }}
        {...domProps}
        {...modalProps}
        ref={ref}
      >
        {children}
      </TrayElement>
    </TrayWrapperElement>
  );
});

let _Tray = forwardRef(Tray);
export { _Tray as Tray };