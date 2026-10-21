import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'transition-all duration-200 bg-white dark:bg-[#131b17] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-white/20 rounded-xl shadow-sm focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0c120f] ' +
                className
            }
            style={{
                outline: 'none',
                '--tw-ring-color': 'var(--primary-color)',
            }}
            ref={localRef}
        />
    );
});
