import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const defaultCardData = [
  { color: '#120F17', title: 'Analytics', description: 'Track user behavior', label: 'Insights' },
  { color: '#120F17', title: 'Dashboard', description: 'Centralized data view', label: 'Overview' },
  { color: '#120F17', title: 'Collaboration', description: 'Work together seamlessly', label: 'Teamwork' },
  { color: '#120F17', title: 'Automation', description: 'Streamline workflows', label: 'Efficiency' },
  { color: '#120F17', title: 'Integration', description: 'Connect favorite tools', label: 'Connectivity' },
  { color: '#120F17', title: 'Security', description: 'Enterprise-grade protection', label: 'Protection' },
];

const calculateSpotlightValues = (radius) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento = ({
  cards,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  renderCard,
  className = '',
}) => {
  const gridRef = useRef(null);
  const [isHoveredCard, setIsHoveredCard] = useState(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const resolvedCards = useMemo(() => cards || defaultCardData, [cards]);

  useEffect(() => {
    if (!enableSpotlight || shouldDisableAnimations || !gridRef.current) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.18) 0%,
        rgba(${glowColor}, 0.10) 15%,
        rgba(${glowColor}, 0.05) 25%,
        rgba(${glowColor}, 0.03) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);

    const handleMouseMove = (e) => {
      if (!spotlight || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      const cardsEls = gridRef.current.querySelectorAll('.magic-bento-card');
      if (!mouseInside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        cardsEls.forEach((card) => card.style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cardsEls.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlight, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.12,
        ease: 'power2.out',
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlight, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      if (!gridRef.current) return;
      gridRef.current.querySelectorAll('.magic-bento-card').forEach((card) => {
        card.style.setProperty('--glow-intensity', '0');
      });
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlight.remove();
    };
  }, [enableSpotlight, shouldDisableAnimations, spotlightRadius, glowColor]);

  return (
    <div className={`bento-section ${className}`.trim()}>
      <div className="card-grid" ref={gridRef}>
        {resolvedCards.map((card, index) => {
          const cardStyle = {
            backgroundColor: card.color || '#120F17',
            '--glow-color': glowColor,
          };

          const handleMouseMove = (e) => {
            if (shouldDisableAnimations) return;
            const el = e.currentTarget;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            if (enableTilt) {
              const rotateX = ((y - centerY) / centerY) * -8;
              const rotateY = ((x - centerX) / centerX) * 8;
              gsap.to(el, { rotateX, rotateY, duration: 0.12, ease: 'power2.out', transformPerspective: 1000 });
            }

            if (enableMagnetism) {
              const magnetX = (x - centerX) * 0.03;
              const magnetY = (y - centerY) * 0.03;
              gsap.to(el, { x: magnetX, y: magnetY, duration: 0.25, ease: 'power2.out' });
            }

            updateCardGlowProperties(el, e.clientX, e.clientY, 1, spotlightRadius);
          };

          const handleMouseLeave = (e) => {
            if (shouldDisableAnimations) return;
            const el = e.currentTarget;
            if (enableTilt) {
              gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.25, ease: 'power2.out' });
            }
            if (enableMagnetism) {
              gsap.to(el, { x: 0, y: 0, duration: 0.25, ease: 'power2.out' });
            }
            el.style.setProperty('--glow-intensity', '0');
          };

          const handleClick = (e) => {
            if (!clickEffect || shouldDisableAnimations) return;
            const el = e.currentTarget;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const maxDistance = Math.max(
              Math.hypot(x, y),
              Math.hypot(x - rect.width, y),
              Math.hypot(x, y - rect.height),
              Math.hypot(x - rect.width, y - rect.height)
            );

            const ripple = document.createElement('div');
            ripple.style.cssText = `
              position: absolute;
              width: ${maxDistance * 2}px;
              height: ${maxDistance * 2}px;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.18) 30%, transparent 70%);
              left: ${x - maxDistance}px;
              top: ${y - maxDistance}px;
              pointer-events: none;
              z-index: 1000;
            `;
            el.appendChild(ripple);

            gsap.fromTo(ripple, { scale: 0, opacity: 1 }, {
              scale: 1,
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out',
              onComplete: () => ripple.remove(),
            });
          };

          return (
            <div
              key={card._id || index}
              className={`magic-bento-card ${textAutoHide ? 'magic-bento-card--text-autohide' : ''} ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''}`.trim()}
              style={cardStyle}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            >
              {renderCard ? renderCard(card, index, { isHoveredCard, setIsHoveredCard }) : (
                <>
                  <div className="magic-bento-card__header">
                    <div className="magic-bento-card__label">{card.label}</div>
                  </div>
                  <div className="magic-bento-card__content">
                    <h2 className="magic-bento-card__title">{card.title}</h2>
                    <p className="magic-bento-card__description">{card.description}</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MagicBento;
