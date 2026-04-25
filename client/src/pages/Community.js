import Particles from '../components/Particles';

const Community = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                background: '#0f1419',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                }}
            >
                <Particles
                    particleCount={250}
                    particleSpread={15}
                    speed={0.05}
                    particleColors={['#ffffff', '#f3f4f6', '#e5e7eb']}
                    moveParticlesOnHover={true}
                    particleHoverFactor={2.5}
                    alphaParticles={true}
                    particleBaseSize={150}
                    sizeRandomness={1.2}
                />
            </div>

            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <h1 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 700 }}>
                    community
                </h1>
            </div>
        </div>
    );
};

export default Community;