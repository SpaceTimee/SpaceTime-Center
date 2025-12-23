import React, { useEffect, useRef } from 'react';
import { profileData } from '../data';
import { Code2, Sparkles } from 'lucide-react';

const Header: React.FC = React.memo(() => {
  const headerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const pullDistance = useRef(0);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const resetTimer = useRef<number | null>(null);

  const targetParallaxOffset = useRef({ x: 0, y: 0 });
  const currentParallaxOffset = useRef({ x: 0, y: 0 });
  const parallaxAnimationFrameId = useRef<number | null>(null);

  const touchStartPos = useRef({ x: 0, y: 0 });
  const isWaveActive = useRef(false);
  const mouseMoveTicking = useRef(false);
  const dimensions = useRef({ width: 0, height: 0, left: 0, top: 0 });

  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

  const updateParallaxState = () => {
    if (!imageRef.current) return;

    const maxPull = 150;
    const ratio = Math.min(pullDistance.current / maxPull, 1);

    if (borderRef.current) {
      borderRef.current.style.opacity = `${1 - ratio}`;
    }

    if (waveRef.current) {
      const height = ratio * 60;
      waveRef.current.style.height = `${height}px`;
      waveRef.current.style.opacity = `${ratio}`;
    }

    const baseScale = 1.1;
    imageRef.current.style.transform = `scale(${baseScale}) translate(${currentParallaxOffset.current.x}px, ${currentParallaxOffset.current.y}px)`;
  };

  const animateParallax = () => {
    const ease = 0.1;
    const targetX = targetParallaxOffset.current.x;
    const targetY = targetParallaxOffset.current.y;

    const currentX = currentParallaxOffset.current.x;
    const currentY = currentParallaxOffset.current.y;

    const newX = lerp(currentX, targetX, ease);
    const newY = lerp(currentY, targetY, ease);

    currentParallaxOffset.current = { x: newX, y: newY };
    updateParallaxState();

    if (Math.abs(newX - targetX) > 0.01 || Math.abs(newY - targetY) > 0.01) {
      parallaxAnimationFrameId.current = requestAnimationFrame(animateParallax);
    } else {
      parallaxAnimationFrameId.current = null;
    }
  };

  const startParallaxAnimation = () => {
    if (!parallaxAnimationFrameId.current) {
      parallaxAnimationFrameId.current = requestAnimationFrame(animateParallax);
    }
  };

  const animateDecay = () => {
    if (!isDragging.current && pullDistance.current > 0) {
      pullDistance.current *= 0.999;
      if (pullDistance.current < 0.5) pullDistance.current = 0;

      updateParallaxState();

      if (pullDistance.current > 0) {
        animationFrameId.current = requestAnimationFrame(animateDecay);
      } else {
        animationFrameId.current = null;
      }
    } else {
      animationFrameId.current = null;
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        dimensions.current = {
          width: rect.width,
          height: rect.height,
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY
        };
      }
    };

    updateDimensions();

    let resizeTimer: number;
    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateDimensions, 150);
    };

    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (headerRef.current) {
          if (entry.isIntersecting) {
            headerRef.current.classList.remove('paused-animations');
          } else {
            headerRef.current.classList.add('paused-animations');
          }
        }
      });
    }, { threshold: 0 });

    if (headerRef.current) observer.observe(headerRef.current);

    const stopAnimation = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      if (parallaxAnimationFrameId.current) {
        cancelAnimationFrame(parallaxAnimationFrameId.current);
        parallaxAnimationFrameId.current = null;
      }
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
        resetTimer.current = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY === 0 && e.deltaY < 0) {
        pullDistance.current = Math.max(0, Math.min(pullDistance.current - e.deltaY * 0.6, 250));

        if (!animationFrameId.current) {
          animationFrameId.current = requestAnimationFrame(() => {
            updateParallaxState();
            animationFrameId.current = null;
          });
        }

        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = window.setTimeout(() => {
          if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
          animateDecay();
        }, 20);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      if (window.scrollY === 0) {
        isWaveActive.current = true;
        const currentVal = Math.max(0, pullDistance.current);
        const currentDelta = Math.pow(currentVal / 1.5, 1 / 0.85);
        startY.current = e.touches[0].clientY - currentDelta;

        stopAnimation();
      } else {
        isWaveActive.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;

        if (!animationFrameId.current) {
          animationFrameId.current = requestAnimationFrame(() => {
            const deltaX = clientX - touchStartPos.current.x;
            const deltaY = clientY - touchStartPos.current.y;

            const { width: offsetWidth, height: offsetHeight } = dimensions.current;
            const limitX = offsetWidth * 0.05;
            const limitY = offsetHeight * 0.05;
            const resistance = 30;

            if (limitX > 0 && limitY > 0) {
              const x = limitX * Math.tanh(deltaX / (limitX * resistance));
              const y = limitY * Math.tanh(deltaY / (limitY * resistance));

              targetParallaxOffset.current = { x, y };
              startParallaxAnimation();
            }

            if (isWaveActive.current && window.scrollY <= 0) {
              const deltaWave = clientY - startY.current;
              if (deltaWave > 0) {
                pullDistance.current = Math.min(Math.pow(deltaWave, 0.85) * 1.5, 250);
              } else {
                pullDistance.current = 0;
              }
            }

            updateParallaxState();
            animationFrameId.current = null;
          });
        }
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      isWaveActive.current = false;
      targetParallaxOffset.current = { x: 0, y: 0 };
      startParallaxAnimation();
      animateDecay();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) window.clearTimeout(resizeTimer);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);

      observer.disconnect();
      stopAnimation();
    };
  }, []);

  const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
    if (isDragging.current || e.gamma === null || e.beta === null) return;

    const maxTilt = 20;

    const gamma = Math.min(Math.max(e.gamma, -maxTilt), maxTilt);
    const beta = Math.min(Math.max(e.beta - 45, -maxTilt), maxTilt);

    const x = gamma * 0.625;
    const y = beta * 0.625;

    targetParallaxOffset.current = { x, y };
    startParallaxAnimation();
  };

  const [shakingTagIndex, setShakingTagIndex] = React.useState<number | null>(null);
  const [tagClicks, setTagClicks] = React.useState<Record<number, number>>({});
  const [fallingTags, setFallingTags] = React.useState<Set<number>>(new Set());
  const [collapsingTags, setCollapsingTags] = React.useState<Set<number>>(new Set());
  const [removedTags, setRemovedTags] = React.useState<Set<number>>(new Set());

  const handleTagClick = (index: number) => {
    if (shakingTagIndex !== null || fallingTags.has(index)) return;

    const currentClicks = (tagClicks[index] || 0) + 1;
    setTagClicks(prev => ({ ...prev, [index]: currentClicks }));

    if (currentClicks >= 10) {
      setFallingTags(prev => new Set(prev).add(index));
      setCollapsingTags(prev => new Set(prev).add(index));

      setTimeout(() => {
        setRemovedTags(prev => new Set(prev).add(index));
      }, 600);
    } else {
      setShakingTagIndex(index);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      setTimeout(() => {
        setShakingTagIndex(null);
      }, 500);
    }
  };

  useEffect(() => {
    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!headerRef.current || mouseMoveTicking.current) return;
    const { clientX, clientY } = e;

    mouseMoveTicking.current = true;
    requestAnimationFrame(() => {
      const rectLeft = dimensions.current.left - window.scrollX;
      const rectTop = dimensions.current.top - window.scrollY;
      const { width, height } = dimensions.current;

      const x = clientX - rectLeft - width / 2;
      const y = clientY - rectTop - height / 2;

      targetParallaxOffset.current = { x: x / 40, y: y / 40 };
      startParallaxAnimation();

      mouseMoveTicking.current = false;
    });
  };

  const handleMouseLeave = () => {
    targetParallaxOffset.current = { x: 0, y: 0 };
    startParallaxAnimation();
  };

  return (
    <header
      id="home"
      ref={headerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full pt-32 pb-12 lg:pt-40 lg:pb-20 px-6 overflow-hidden transition-colors duration-300"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imageRef}
          src="/banner.webp"
          alt="Banner"
          className="w-full h-full object-cover object-center will-change-transform"
          style={{ transform: 'scale(1.1)' }}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
        <div className="absolute inset-0 transition-colors duration-500 ease-in-out z-10 pointer-events-none bg-transparent dark:bg-gray-900/90"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="relative w-28 h-28 lg:w-40 lg:h-40">
            <div className="absolute inset-0 rounded-full bg-transparent shadow-[0_10px_40px_-10px_rgba(255,90,0,0.1)] peer-hover:shadow-[0_20px_40px_-10px_rgba(255,90,0,0.2)] peer-hover:scale-105 transition-all duration-300 z-0 pointer-events-none will-change-transform"></div>
            <a
              href="https://github.com/SpaceTimee"
              target="_blank"
              rel="noopener noreferrer"
              className="peer relative z-10 block w-full h-full rounded-full transform transition-all duration-300 hover:scale-105 will-change-transform"
              style={{ clipPath: 'circle(50%)', WebkitClipPath: 'circle(50%)' }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-orange-300 p-[3px] dark:bg-gray-800">
                <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  <img
                    src="/avatar.png"
                    alt="Avatar"
                    className="w-full h-full object-cover block dark:hidden mix-blend-multiply"
                    style={{ imageRendering: 'pixelated' }}
                    decoding="async"
                    fetchPriority="high"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                  <img
                    src="/avatar-dark.png"
                    alt="Avatar"
                    className="w-full h-full object-cover hidden dark:block"
                    style={{ imageRendering: 'pixelated' }}
                    decoding="async"
                    fetchPriority="high"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                </div>
              </div>
            </a>

            <a
              href="https://huggingface.co/SpaceTimee"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-200 z-20"
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </a>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-2 drop-shadow-[0_0px_6px_rgba(255,255,255,1)] dark:drop-shadow-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-indigo-700 dark:from-primary dark:via-purple-300 dark:to-indigo-300">
                  {profileData.name}
                </span>
                <span className="text-indigo-700 dark:text-indigo-300">.</span>
              </h1>
              <p className="text-lg lg:text-xl text-white dark:text-gray-400 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] dark:drop-shadow-none">
                {profileData.tagline}
              </p>
            </div>

            <div className={`flex flex-wrap -m-1.5 transition-all duration-700 ease-in-out overflow-hidden ${fallingTags.size === profileData.tags.length ? '!mt-0 !max-h-0 opacity-0' : 'mt-0 max-h-[500px] opacity-100'}`}>
              {profileData.tags.map((detail, index) => {
                if (removedTags.has(index)) return null;
                const isFalling = fallingTags.has(index);
                const isCollapsing = collapsingTags.has(index);
                const isShaking = shakingTagIndex === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleTagClick(index)}
                    className={`inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-600 shadow-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-all duration-300 m-1.5
                      ${isShaking ? 'animate-shake' : ''}
                      ${isFalling ? 'animate-fall' : ''}
                      ${isCollapsing ? '!max-w-0 !max-h-0 !p-0 !m-0 !border-0 opacity-0 overflow-hidden' : 'max-w-40 max-h-10'}`}
                    disabled={isFalling}
                  >
                    <Code2 className="w-3.5 h-3.5 mr-1.5 text-primary flex-shrink-0" />
                    <span className="whitespace-nowrap">{detail}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div
        ref={borderRef}
        className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-800"
      ></div>

      <div
        ref={waveRef}
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden z-30 pointer-events-none"
        style={{ height: 0, opacity: 0, willChange: 'height, opacity' }}
      >
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" className="fill-white/70 dark:fill-gray-900/70" />
            <use xlinkHref="#gentle-wave" x="48" y="3" className="fill-white/50 dark:fill-gray-900/50" />
            <use xlinkHref="#gentle-wave" x="48" y="5" className="fill-white/30 dark:fill-gray-900/30" />
            <use xlinkHref="#gentle-wave" x="48" y="7" className="fill-white dark:fill-gray-900" />
          </g>
        </svg>
      </div>
    </header>
  );
});

export default Header;