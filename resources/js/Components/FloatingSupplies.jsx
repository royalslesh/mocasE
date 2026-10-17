import React from 'react';

const FloatingSupplies = () => {
    // Custom images from public folder
    const supplies = [
        '/1.png',
        '/2.png',
        '/3.png',
        '/4.png',
        '/5 - Copie.png',
        '/6 - Copie.png',
        '/7 - Copie.png'
    ];

    // Generate items with negative delay to fill the screen immediately
    const floatingItems = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        src: supplies[Math.floor(Math.random() * supplies.length)],
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 25 + 20}s`,
        animationDelay: `-${Math.random() * 30}s`, // Negative delay starts them mid-animation
        size: `${Math.random() * 6 + 1.5}rem`, // Much more variety (from 1.5rem to 7.5rem)
        opacity: Math.random() * 0.12 + 0.05,
        rotate: Math.random() * 360,
    }));

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <style>
                {`
                @keyframes floatUp {
                    0% {
                        transform: translateY(110vh) rotate(0deg);
                    }
                    100% {
                        transform: translateY(-20vh) rotate(360deg);
                    }
                }
                .floating-item {
                    position: absolute;
                    bottom: 0px;
                    animation: floatUp linear infinite;
                    background-color: var(--primary-color);
                    transition: background-color 0.5s ease;
                }
                `}
            </style>

            {floatingItems.map((item) => (
                <div
                    key={item.id}
                    className="floating-item"
                    style={{
                        left: item.left,
                        width: item.size,
                        height: item.size,
                        opacity: item.opacity,
                        maskImage: `url(${item.src})`,
                        WebkitMaskImage: `url(${item.src})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        backgroundColor: 'var(--primary-color)',
                        boxShadow: 'var(--theme-glow)',
                        animationDuration: `calc(var(--theme-speed, 30s) * ${0.8 + Math.random() * 0.4})`,
                        animationDelay: item.animationDelay,
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingSupplies;
