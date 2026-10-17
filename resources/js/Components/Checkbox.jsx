export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 shadow-sm focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[var(--dark-bg)] ' +
                className
            }
            style={{
                color: 'var(--primary-color)',
                '--tw-ring-color': 'var(--primary-color)'
            }}
        />
    );
}
