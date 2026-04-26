import { useMemo, useRef, useState } from 'react';
import './ProfileCard.css';

const ProfileCard = ({ name, role, avatarUrl }) => {
    const cardRef = useRef(null);
    const [mouse, setMouse] = useState({ x: 50, y: 50, rotateX: 0, rotateY: 0 });

    const username = useMemo(() => (name && name.trim() ? name.trim() : 'Creator'), [name]);
    const subtitle = useMemo(() => (role && role.trim() ? role.trim() : 'Productivity Warrior'), [role]);

    const handlePointerMove = (event) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        const rotateY = ((x - 50) / 50) * 8;
        const rotateX = -((y - 50) / 50) * 8;

        setMouse({ x, y, rotateX, rotateY });
    };

    const resetPointer = () => {
        setMouse({ x: 50, y: 50, rotateX: 0, rotateY: 0 });
    };

    return (
        <div className="profile-card-shell">
            <div
                className="profile-card-glow"
                style={{
                    '--glow-x': `${mouse.x}%`,
                    '--glow-y': `${mouse.y}%`,
                }}
            />

            <div
                ref={cardRef}
                className="profile-card"
                onMouseMove={handlePointerMove}
                onMouseLeave={resetPointer}
                style={{
                    transform: `perspective(1000px) rotateX(${mouse.rotateX}deg) rotateY(${mouse.rotateY}deg)`,
                    '--pointer-x': `${mouse.x}%`,
                    '--pointer-y': `${mouse.y}%`,
                }}
            >
                <div className="profile-card-shimmer" />
                <div className="profile-card-glare" />

                <div
                    className="profile-avatar-wrap"
                    style={{
                        transform: `translate3d(${(mouse.x - 50) * 0.08}px, ${(mouse.y - 50) * 0.08}px, 0)`,
                    }}
                >
                    <img src={avatarUrl} alt={username} className="profile-avatar" />
                </div>

                <div className="profile-card-content">
                    <h2 className="profile-name">{username}</h2>
                    <p className="profile-role">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
