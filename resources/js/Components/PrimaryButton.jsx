export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center border border-transparent px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-25 ` + className
            }
            style={{
                backgroundColor: 'var(--primary-color)',
                boxShadow: `0 10px 15px -3px var(--shadow-color)`
            }}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
