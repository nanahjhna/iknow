import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Layout({ children }) {

    // 카카오 광고 스크립트 로드
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="container" style={{ maxWidth: "960px", margin: "0 auto" }}>
            {/* 상단 */}
            <header style={{
                padding: "1rem",
                background: "#e8d5d5",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                position: "sticky",
                top: 0,
                zIndex: 100
            }}>
                <nav style={{ marginTop: "0.5rem" }}>
                    <Link to="/" style={{ marginRight: "1rem", color: "#007acc", textDecoration: "none" }}>홈으로</Link>
                </nav>
            </header>

            {/* 본문 */}
            <main style={{
                padding: "1rem",
                background: "#fdfdfd",
                minHeight: "60vh",
                boxSizing: "border-box"
            }}>
                {children}
            </main>

            {/* 하단 */}
            <footer style={{
                padding: "1rem",
                background: "#e8d5d5",
                textAlign: "center",
                marginTop: "1rem"
            }}>
                <ins className="kakao_ad_area"
                    style={{ display: "block", margin: "0 auto" }}
                    data-ad-unit="DAN-fQq66D94rJojosM8"
                    data-ad-width="320"
                    data-ad-height="100"></ins>
                <script type="text/javascript" src="//t1.daumcdn.net/kas/static/ba.min.js" async></script>
                <p style={{ margin: 0, color: "#555", marginTop: "0.5rem" }}>
                    © 2025 My Blog. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
