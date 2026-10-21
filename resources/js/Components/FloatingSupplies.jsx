import React from 'react';

const FloatingSupplies = () => {
    // Custom images from public folder (fichiers existants réels)
    const supplies = [
        '/1.png',
        '/2.png',
        '/3.png',
        '/4.png',
        '/5.png',
        '/6.png',
        '/7.png'
    ];

    // Optimisation mobile : 8 éléments légers au lieu de 30 pour éliminer la lenteur
    const floatingItems = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        src: supplies[i % supplies.length],
        left: `${(i * 12.5) + Math.random() * 5}%`,
        animationDuration: `${Math.random() * 15 + 25}s`,
        animationDelay: `-${Math.random() * 20}s`,
        size: `${Math.random() * 3 + 2}rem`,
        opacity: 0.06,
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
