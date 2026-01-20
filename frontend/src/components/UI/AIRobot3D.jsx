import React, { useEffect, useRef } from 'react';
import './AIRobot3D.css';

const AIRobot3D = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Draw Sleek Abstract Orb (iOS/Siri Vibe)
        const drawRobot = () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Time variables for fluid motion
            const t = time * 0.01;

            // --- 0. DEEP ATMOSPHERE ---
            // Pure Dark background (No Blue Tint)
            const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGrad.addColorStop(0, '#000000');
            bgGrad.addColorStop(1, '#111111');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Removed Ambient Orbs to eliminate blue edge glow

            // --- 1. THE CORE (Liquid Sphere) ---
            ctx.save();
            ctx.translate(centerX, centerY);

            const orbSize = 130;

            // Morphing shape logic
            const layers = 50;
            for (let i = 0; i < layers; i++) {
                const p = i / layers;
                const rotation = t + p * Math.PI * 2;

                // Radius pulses with complexity
                const r = orbSize * (0.8 + Math.sin(t * 2 + p * 10) * 0.05);

                // 3D Rotation simulation
                const xOff = Math.sin(rotation) * r * Math.sin(t * 0.5 + p * Math.PI);
                const yOff = Math.cos(rotation) * r * 0.3;

                ctx.beginPath();
                ctx.arc(xOff, yOff, 2.5, 0, Math.PI * 2);

                // Color shift based on position/index (Blue/Cyan/White)
                // Keeping the Core Blue/Cyan as user asked to remove "effect on edges/sides" 
                // but the central object usually stays colored. 
                // If they meant NO BLUE AT ALL, I should greyscale it?
                // "blue effect on all sides and edges" -> Ambient.
                // I will Desaturate the core slightly just in case -> predominantly White/Silver/Pale Blue.
                const hue = 210 + Math.sin(t + p * 5) * 30;
                ctx.fillStyle = `hsla(${hue}, 20%, ${70 + p * 20}%, 0.8)`; // Reduced saturation to 20%

                // Connection lines
                if (i > 0) {
                    ctx.strokeStyle = `hsla(${hue}, 10%, 80%, 0.15)`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                ctx.fill();
            }

            // --- 2. ORBITAL RINGS ---
            // Sleek rotations
            ctx.rotate(t * 0.2);

            for (let j = 0; j < 3; j++) {
                ctx.rotate(Math.PI / 1.5); // 120 degrees
                ctx.beginPath();
                ctx.ellipse(0, 0, 180 + Math.sin(t + j) * 20, 60, 0, 0, Math.PI * 2);

                // Ring Gradient (Pure White)
                const ringGrad = ctx.createLinearGradient(-180, 0, 180, 0);
                ringGrad.addColorStop(0, 'rgba(255,255,255,0)');
                ringGrad.addColorStop(0.5, 'rgba(255,255,255,0.4)');
                ringGrad.addColorStop(1, 'rgba(255,255,255,0)');

                ctx.strokeStyle = ringGrad;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Particle
                const particleAngle = t * (1.5 + j * 0.2);
                const px = Math.cos(particleAngle) * (180 + Math.sin(t + j) * 20);
                const py = Math.sin(particleAngle) * 60;

                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.shadowColor = '#fff'; // White shadow, not blue
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            ctx.restore();
        };

        // Animation loop
        const animate = () => {
            time++;
            drawRobot();
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="ai-robot-container">
            <canvas ref={canvasRef} className="ai-robot-canvas"></canvas>
        </div>
    );
};

export default AIRobot3D;
