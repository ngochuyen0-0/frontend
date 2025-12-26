import React, { useEffect } from "react";
import './403.css'

const Error403: React.FC = () => {
    useEffect(() => {
        const root = document.documentElement;
        const eyef = document.getElementById("eyef");

        const handleMouseMove = (evt: MouseEvent) => {
            if (!eyef) return;
            const x = evt.clientX / window.innerWidth;
            const y = evt.clientY / window.innerHeight;

            root.style.setProperty("--mouse-x", x.toString());
            root.style.setProperty("--mouse-y", y.toString());

            const cx = 115 + 30 * x;
            const cy = 50 + 30 * y;

            eyef.setAttribute("cx", cx.toString());
            eyef.setAttribute("cy", cy.toString());
        };

        const handleTouchMove = (touchHandler: TouchEvent) => {
            if (!eyef) return;
            const x = touchHandler.touches[0].clientX / window.innerWidth;
            const y = touchHandler.touches[0].clientY / window.innerHeight;

            root.style.setProperty("--mouse-x", x.toString());
            root.style.setProperty("--mouse-y", y.toString());
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
        }

    }, []);

    return (
        <div className="error-page">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                id="robot-error"
                viewBox="0 0 260 118.9"
                role="img"
            >
                <title xmlLang="en">403 Error</title>
                <defs>
                    <clipPath id="white-clip">
                        <circle
                            id="white-eye"
                            fill="#cacaca"
                            cx="130"
                            cy="65"
                            r="20"
                        />
                    </clipPath>
                    <text id="text-s" className="error-text" y="106">
                        403
                    </text>
                </defs>
                <path
                    className="alarm"
                    fill="#e62326"
                    d="M120.9 19.6V9.1c0-5 4.1-9.1 9.1-9.1h0c5 0 9.1 4.1 9.1 9.1v10.6"
                />
                <use xlinkHref="#text-s" x="-0.5px" y="-1px" fill="black"></use>
                <use xlinkHref="#text-s" fill="#2b2b2b"></use>
                <g id="robot">
                    <g id="eye-wrap">
                        <use xlinkHref="#white-eye"></use>
                        <circle
                            id="eyef"
                            className="eye"
                            clipPath="url(#white-clip)"
                            fill="#000"
                            stroke="#2aa7cc"
                            strokeWidth="2"
                            strokeMiterlimit="10"
                            cx="130"
                            cy="65"
                            r="11"
                        />
                        <ellipse
                            id="white-eye"
                            fill="#2b2b2b"
                            cx="130"
                            cy="40"
                            rx="18"
                            ry="12"
                        />
                    </g>
                    <circle
                        className="lightblue"
                        cx="105"
                        cy="32"
                        r="2.5"
                        id="tornillo"
                    />
                    <use xlinkHref="#tornillo" x="50"></use>
                    <use xlinkHref="#tornillo" x="50" y="60"></use>
                    <use xlinkHref="#tornillo" y="60"></use>
                </g>
            </svg>

            <h1>You are not allowed to enter here</h1>
            <h2>
                Go{" "}
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="/"
                >
                    Home!
                </a>
            </h2>
        </div>
    );
};

export default Error403;