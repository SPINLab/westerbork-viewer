export function useOverflowFade(element, options = { fadeHeight: 100 }) {
  function getOverflown() {
    return element.scrollHeight > element.clientHeight;
  }

  function getFadePosition() {
    const atTop = element.scrollTop <= 1;
    const atBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight <= 1;

    if (!atTop && !atBottom) return 'both';
    if (!atTop) return 'top';
    if (!atBottom) return 'bottom';

    return null;
  }

  function setMaskStyle(maskImage, maskPosition, maskSize, maskRepeat) {
    element.style.maskImage = maskImage;
    element.style.webkitMaskImage = maskImage;
    element.style.maskPosition = maskPosition;
    element.style.webkitMaskPosition = maskPosition;
    element.style.maskSize = maskSize;
    element.style.webkitMaskSize = maskSize;
    element.style.maskRepeat = maskRepeat;
    element.style.webkitMaskRepeat = maskRepeat;
  }

  function setMask(position) {
    if (!position) {
      setMaskStyle(null, null, null, null);
      return;
    }

    let maskImage;
    let maskPosition;
    let maskSize;
    const maskRepeat =
      position === 'both'
        ? 'no-repeat, no-repeat, no-repeat'
        : 'no-repeat, no-repeat';

    if (position === 'both') {
      maskImage =
        'linear-gradient(180deg, rgba(255, 255, 255, 0), black), linear-gradient(180deg, black, black), linear-gradient(180deg, black, rgba(255, 255, 255, 0))';
      maskPosition = `center top, center ${options.fadeHeight}px, center bottom`;
      maskSize = `100% ${options.fadeHeight}px, 100% calc(100% - 2 * ${options.fadeHeight}px), 100% ${options.fadeHeight}px`;
    } else if (position === 'top') {
      maskImage =
        'linear-gradient(180deg, rgba(255, 255, 255, 0), black), linear-gradient(180deg, black, black)';
      maskPosition = 'center top, center bottom';
      maskSize = `100% ${options.fadeHeight}px, 100% calc(100% - ${options.fadeHeight}px)`;
    } else if (position === 'bottom') {
      maskImage =
        'linear-gradient(180deg, black, rgba(255, 255, 255, 0)), linear-gradient(180deg, black, black)';
      maskPosition = 'center bottom, center top';
      maskSize = `100% ${options.fadeHeight}px, 100% calc(100% - ${options.fadeHeight}px)`;
    }

    if (maskImage && maskPosition && maskSize) {
      setMaskStyle(maskImage, maskPosition, maskSize, maskRepeat);
    }
  }

  function checkFadeNeeded() {
    const overflown = getOverflown();
    if (overflown) {
      const fadePosition = getFadePosition();
      setMask(fadePosition);
    }
  }

  const resizeObserver = new ResizeObserver(checkFadeNeeded);
  resizeObserver.observe(element);
  element.addEventListener('scroll', checkFadeNeeded);
  checkFadeNeeded();

  return checkFadeNeeded;
}
