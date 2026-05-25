import { useEffect, useRef, useState } from 'react';

const INTRO_STORAGE_KEY = 'chameleon-intro-seen';

interface ChameleonIntroProps {
  onFinished?: () => void;
}

export function ChameleonIntro({ onFinished }: ChameleonIntroProps) {
  const forceReplay = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('intro-test') === '1';
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (forceReplay) return true;
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== 'true';
  });
  const wordmarkRef = useRef<SVGSVGElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) {
      onFinished?.();
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !forceReplay;

    if (reduceMotion) {
      const timer = window.setTimeout(() => {
        if (!forceReplay) window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
        setVisible(false);
        onFinished?.();
      }, 320);

      return () => window.clearTimeout(timer);
    }

    const finishTimer = window.setTimeout(() => {
      if (!forceReplay) window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
      setVisible(false);
      onFinished?.();
    }, 5150);

    const wordmark = wordmarkRef.current;
    const symbolLines = Array.from(shellRef.current?.querySelectorAll<SVGPathElement>('.intro-symbol-line path') ?? []);
    const letters = Array.from(wordmark?.querySelectorAll<SVGPathElement>('path') ?? []);

    try {
      symbolLines.forEach((path, index) => {
        path.style.setProperty('--len', path.getTotalLength().toFixed(2));
        path.style.setProperty('--draw-delay', `${0.18 + index * 0.12}s`);
        path.style.setProperty('--erase-delay', `${1.88 + index * 0.1}s`);
      });

      letters
        .map((path) => ({
          path,
          x: path.getBBox().x,
          len: path.getTotalLength().toFixed(2),
        }))
        .sort((a, b) => a.x - b.x)
        .forEach(({ path, len }, index) => {
          path.style.setProperty('--len', len);
          path.style.setProperty('--i', String(index));
        });
    } catch {
      symbolLines.forEach((path, index) => {
        path.style.setProperty('--draw-delay', `${0.18 + index * 0.12}s`);
        path.style.setProperty('--erase-delay', `${1.88 + index * 0.1}s`);
      });
      letters.forEach((path, index) => path.style.setProperty('--i', String(index)));
    }

    return () => window.clearTimeout(finishTimer);
  }, [onFinished, visible]);

  if (!visible) return null;

  return (
    <div
      ref={shellRef}
      className={`chameleon-intro${forceReplay ? ' chameleon-intro--force' : ''}`}
      aria-label="CHAMELEON MAGAZINE animated loading screen"
    >
      <section className="chameleon-intro-composition">
        <div className="chameleon-intro-symbol" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.67 37.29">
            <g className="intro-symbol-line">
              <path d="M31.02,5.69c1.85,2.02,3.52,4.73,3.93,7.49.11.79.17,1.09-.22,1.79-1.07,1.95-4.34,4.68-6.62,4.82-.12,0-.44-.06-.47,0l-.02,2.94c-.06.28-.14.46-.45.49-1.16.13-3.85-1.3-4.84-1.99-.36-.25-.64-.56-.97-.81-.05-.04-.06-.09-.14-.07,0,.68-.01,1.37,0,2.05,0,.41.21.95-.41,1.05-.77.12-2.88-.95-3.6-1.36-.84-.48-1.67-1.05-2.34-1.76-.07-.08-.19-.31-.3-.3-.04,0-.62.33-.71.38-3.79,2.26-3.78,7.56.36,9.46,7.64,3.5,19.56-4.27,20.03-12.5.02-.36-.17-1.78.48-1.67.3.05.51.99.57,1.27,2,9.1-4.21,17.9-13.1,19.88C8.52,39.89-4.04,26.55,1.23,13.18,4.1,5.9,11.85,1.56,19.59,2.6c.07-.03.07-.09.07-.16.04-.42,0-1.07,0-1.51,0-.37-.25-.86.3-.92.73-.07,2.04.2,2.76.39,3.16.83,6.11,2.9,8.29,5.28h.01ZM25.23,12.9c1.27,1.26,3.33,1.12,4.48-.22,2.13-2.5-.54-6.35-3.66-4.89-1.95.91-2.32,3.61-.81,5.11" />
              <path d="M27.94,9.35c1.88-.18,1.94,2.88-.05,2.56-1.38-.22-1.37-2.43.05-2.56" />
            </g>
            <g className="intro-symbol-fill">
              <path d="M31.02,5.69c1.85,2.02,3.52,4.73,3.93,7.49.11.79.17,1.09-.22,1.79-1.07,1.95-4.34,4.68-6.62,4.82-.12,0-.44-.06-.47,0l-.02,2.94c-.06.28-.14.46-.45.49-1.16.13-3.85-1.3-4.84-1.99-.36-.25-.64-.56-.97-.81-.05-.04-.06-.09-.14-.07,0,.68-.01,1.37,0,2.05,0,.41.21.95-.41,1.05-.77.12-2.88-.95-3.6-1.36-.84-.48-1.67-1.05-2.34-1.76-.07-.08-.19-.31-.3-.3-.04,0-.62.33-.71.38-3.79,2.26-3.78,7.56.36,9.46,7.64,3.5,19.56-4.27,20.03-12.5.02-.36-.17-1.78.48-1.67.3.05.51.99.57,1.27,2,9.1-4.21,17.9-13.1,19.88C8.52,39.89-4.04,26.55,1.23,13.18,4.1,5.9,11.85,1.56,19.59,2.6c.07-.03.07-.09.07-.16.04-.42,0-1.07,0-1.51,0-.37-.25-.86.3-.92.73-.07,2.04.2,2.76.39,3.16.83,6.11,2.9,8.29,5.28h.01ZM25.23,12.9c1.27,1.26,3.33,1.12,4.48-.22,2.13-2.5-.54-6.35-3.66-4.89-1.95.91-2.32,3.61-.81,5.11" />
              <path d="M27.94,9.35c1.88-.18,1.94,2.88-.05,2.56-1.38-.22-1.37-2.43.05-2.56" />
            </g>
          </svg>
        </div>

        <div className="chameleon-intro-wordmark" aria-label="CHAMELEON MAGAZINE">
          <svg ref={wordmarkRef} width="1120" height="158" viewBox="0 0 1120 158" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
            <title>CHAMELEON MAGAZINE</title>
            <path d="M1084.56 23.8325V66.8632H1112.73V88.9303H1084.56V134.168H1120V156.235H1064.04V1.76544H1120V23.8325H1084.56Z" />
            <path d="M1037.61 156.235L1012.05 44.3548V156.235H993.59V1.76544H1019.33L1040.4 94.2264V1.76544H1058.68V156.235H1037.61Z" />
            <path d="M967.584 156.235V1.76544H988.101V156.235H967.584Z" />
            <path d="M906.57 1.76544H964.763V23.3911L925.781 134.168H964.763V156.235H904.705V134.609L943.687 23.8325H906.57V1.76544Z" />
            <path d="M886.758 1.76544L907.648 156.235H886.945L883.401 128.21H858.222L854.678 156.235H835.84L856.729 1.76544H886.758ZM870.718 29.1286L860.833 107.246H880.603L870.718 29.1286Z" />
            <path d="M808.856 92.2402V70.1732H837.579V119.162C837.579 143.877 827.134 158 806.991 158C786.847 158 776.402 143.877 776.402 119.162V38.838C776.402 14.1229 786.847 0 806.991 0C827.134 0 837.579 14.1229 837.579 38.838V53.8436H818.182V37.2933C818.182 26.2598 814.078 22.067 807.55 22.067C801.022 22.067 796.919 26.2598 796.919 37.2933V120.707C796.919 131.74 801.022 135.712 807.55 135.712C814.078 135.712 818.182 131.74 818.182 120.707V92.2402H808.856Z" />
            <path d="M756.963 1.76544L777.853 156.235H757.15L753.606 128.21H728.427L724.883 156.235H706.045L726.935 1.76544H756.963ZM740.923 29.1286L731.038 107.246H750.808L740.923 29.1286Z" />
            <path d="M648.223 1.76544L663.331 111.439L677.319 1.76544H705.856V156.235H686.459V45.4582L672.284 156.235H652.886L637.592 47.0029V156.235H619.687V1.76544H648.223Z" />
            <path d="M573.798 156.235L548.245 44.3548V156.235H529.78V1.76544H555.519L576.595 94.2264V1.76544H594.874V156.235H573.798Z" />
            <path d="M484.18 37.2933V120.707C484.18 131.74 488.283 135.933 494.811 135.933C501.339 135.933 505.442 131.74 505.442 120.707V37.2933C505.442 26.2598 501.339 22.067 494.811 22.067C488.283 22.067 484.18 26.2598 484.18 37.2933ZM463.663 119.162V38.838C463.663 14.1229 474.667 0 494.811 0C514.955 0 525.959 14.1229 525.959 38.838V119.162C525.959 143.877 514.955 158 494.811 158C474.667 158 463.663 143.877 463.663 119.162Z" />
            <path d="M426.517 23.8325V66.8632H454.68V88.9303H426.517V134.168H461.954V156.235H406V1.76544H461.954V23.8325H426.517Z" />
            <path d="M352.122 156.235V1.76544H372.639V134.168H406.398V156.235H352.122Z" />
            <path d="M313.297 23.8325V66.8632H341.461V88.9303H313.297V134.168H348.735V156.235H292.78V1.76544H348.735V23.8325H313.297Z" />
            <path d="M229.548 1.76544L244.656 111.439L258.645 1.76544H287.181V156.235H267.784V45.4582L253.609 156.235H234.211L218.917 47.0029V156.235H201.012V1.76544H229.548Z" />
            <path d="M180.081 1.76544L200.97 156.235H180.267L176.723 128.21H151.544L148 156.235H129.162L150.052 1.76544H180.081ZM164.04 29.1286L154.155 107.246H173.926L164.04 29.1286Z" />
            <path d="M84.8164 90.0336V156.235H64.2998V1.76544H84.8164V67.9666H108.131V1.76544H129.02V156.235H108.131V90.0336H84.8164Z" />
            <path d="M41.7792 98.6397H61.1767V119.162C61.1767 143.877 50.7319 158 30.5884 158C10.4448 158 0 143.877 0 119.162V38.838C0 14.1229 10.4448 0 30.5884 0C50.7319 0 61.1767 14.1229 61.1767 38.838V53.8436H41.7792V37.2933C41.7792 26.2598 37.6759 22.067 31.1479 22.067C24.6199 22.067 20.5166 26.2598 20.5166 37.2933V120.707C20.5166 131.74 24.6199 135.712 31.1479 135.712C37.6759 135.712 41.7792 131.74 41.7792 120.707V98.6397Z" />
          </svg>
        </div>
      </section>
    </div>
  );
}
