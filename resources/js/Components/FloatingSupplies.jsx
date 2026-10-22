import React, { useMemo } from 'react';

const FloatingSupplies = () => {
    const supplies = [
        '/1.png',
        '/2.png',
        '/3.png',
        '/4.png',
        '/5.png',
        '/6.png',
        '/7.png'
    ];
    // 12 éléments répartis harmonieusement sur tout l'écran
    const floatingItems = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        src: supplies[i % supplies.length],
        left: `${(i * 8.3) + 2}%`,
        duration: `${24 + (i % 5) * 4}s`,
        delay: `-${(i * 3.5) % 24}s`,
        size: `${2.5 + (i % 4) * 0.8}rem`,
        rotate: (i * 45) % 360,
    })), []);
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
            <style>
                {`
                @keyframes floatHarmonious {
                    0% {
                        transform: translateY(105vh) rotate(0deg);
                    }
                    100% {
                        transform: translateY(-15vh) rotate(360deg);
                }
                .floating-supply-item {
                    position: absolute;
                    bottom: 0;
                    animation: floatHarmonious linear infinite;
                    will-change: transform;
                `}
            </style>
            {floatingItems.map((item) => (
                <img
                    key={item.id}
                    src={item.src}
                    alt=""
                    loading="lazy"
                    className="floating-supply-item opacity-[0.06] dark:opacity-[0.10] filter grayscale contrast-125 dark:invert dark:opacity-[0.09] transition-opacity"
                    style={{
                        left: item.left,
                        width: item.size,
                        height: item.size,
                        animationDuration: item.duration,
                        animationDelay: item.delay,
                        transform: `rotate(${item.rotate}deg)`,
                    }}
                />
            ))}
        </div>
    );
};
export default FloatingSupplies;
