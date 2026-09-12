import { useState, useEffect } from 'react';

/**
 * Breakpoints aligned with Control Center architecture:
 * - Phone / Compact: < 768px (320px, 375px, 390px, 414px, 430px)
 * - Tablet: 768px - 1023px (768px, 820px, 834px, 1024px portrait)
 * - Laptop: 1024px - 1439px (1280px, 1366px, 1440px)
 * - Desktop: >= 1440px (1600px, 1920px)
 * - Wide: >= 1920px (2560px)
 */

export const BREAKPOINTS = {
  TABLET: 768,
  LAPTOP: 1024,
  DESKTOP: 1440,
  WIDE: 1920,
};

/**
 * Pure function to compute current device state & capabilities.
 * Safe for SSR / Node environments.
 */
export function getDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return {
      breakpoint: 'desktop',
      isPhone: false,
      isTablet: false,
      isLaptop: true,
      isDesktop: false,
      isWide: false,
      isTouch: false,
      isHoverCapable: true,
      orientation: 'landscape',
      width: 1280,
      height: 800,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  const isPhone = width < BREAKPOINTS.TABLET;
  const isTablet = width >= BREAKPOINTS.TABLET && width < BREAKPOINTS.LAPTOP;
  const isLaptop = width >= BREAKPOINTS.LAPTOP && width < BREAKPOINTS.DESKTOP;
  const isDesktop = width >= BREAKPOINTS.DESKTOP;
  const isWide = width >= BREAKPOINTS.WIDE;

  let breakpoint = 'phone';
  if (isTablet) breakpoint = 'tablet';
  else if (isLaptop) breakpoint = 'laptop';
  else if (isDesktop) breakpoint = 'desktop';

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const isHoverCapable = window.matchMedia('(hover: hover)').matches;
  const orientation = window.matchMedia('(orientation: landscape)').matches
    ? 'landscape'
    : 'portrait';

  return {
    breakpoint,
    isPhone,
    isTablet,
    isLaptop,
    isDesktop,
    isWide,
    isTouch,
    isHoverCapable,
    orientation,
    width,
    height,
  };
}

/**
 * React hook that returns live, reactive device information.
 */
export function useResponsiveDevice() {
  const [device, setDevice] = useState(getDeviceCapabilities);

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDevice(getDeviceCapabilities());
      }, 60);
    };

    const orientationMedia = window.matchMedia('(orientation: portrait)');
    const pointerMedia = window.matchMedia('(pointer: coarse)');

    window.addEventListener('resize', handleResize, { passive: true });
    if (orientationMedia.addEventListener) {
      orientationMedia.addEventListener('change', handleResize);
      pointerMedia.addEventListener('change', handleResize);
    } else {
      // Fallback for older browsers
      orientationMedia.addListener(handleResize);
      pointerMedia.addListener(handleResize);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      if (orientationMedia.removeEventListener) {
        orientationMedia.removeEventListener('change', handleResize);
        pointerMedia.removeEventListener('change', handleResize);
      } else {
        orientationMedia.removeListener(handleResize);
        pointerMedia.removeListener(handleResize);
      }
    };
  }, []);

  return device;
}

export default useResponsiveDevice;
