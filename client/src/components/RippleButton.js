import { useRef, useState } from 'react';
import './RippleButton.css';

const RippleButton = ({
    as: Component = 'button',
    children,
    rippleColor = '#ef4444',
    className = '',
    style = {},
    disabled = false,
    onClick,
    ...props
}) => {
    const [ripples, setRipples] = useState([]);
    const idRef = useRef(0);

    const handleClick = (event) => {
        if (disabled) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        const id = idRef.current++;

        setRipples((prev) => [...prev, { id, x, y, size }]);

        window.setTimeout(() => {
            setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
        }, 650);

        if (onClick) {
            onClick(event);
        }
    };

    return (
        <Component
            {...props}
            onClick={handleClick}
            disabled={disabled}
            className={`ripple-button ${disabled ? 'ripple-button--disabled' : ''} ${className}`.trim()}
            style={{ '--ripple-color': rippleColor, ...style }}
        >
            <span className="ripple-button__label">{children}</span>
            <span className="ripple-button__surface" aria-hidden="true">
                {ripples.map((ripple) => (
                    <span
                        key={ripple.id}
                        className="ripple-button__wave"
                        style={{
                            width: `${ripple.size}px`,
                            height: `${ripple.size}px`,
                            left: `${ripple.x}px`,
                            top: `${ripple.y}px`,
                        }}
                    />
                ))}
            </span>
        </Component>
    );
};

export default RippleButton;
