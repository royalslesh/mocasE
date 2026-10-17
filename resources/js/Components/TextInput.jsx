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
                'transition-all duration-300 bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/10 rounded-xl shadow-sm focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[var(--dark-bg)] ' +
                className
            }
            style={{
                outline: 'none',
                '--tw-ring-color': 'var(--primary-color)',
                borderColor: 'var(--primary-color)'
            }}
            ref={localRef}
        />
    );
});
