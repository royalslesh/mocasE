export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
