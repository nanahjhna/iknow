import { Link } from "react-router-dom";

export default function Layout({ children }) {
    return (
        <div className="container">
            {/* 상단 */}
            <header style={{
                padding: "1rem",
                background: "#e8d5d5",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                position: "sticky",
                top: 0,
                zIndex: 100
            }}>
                {/*<h1 style={{ margin: 0, fontSize: "1.5rem", color: "#222" }}>My Blog</h1>*/}
                <nav style={{ marginTop: "0.5rem" }}>
                    <Link to="/" style={{ marginRight: "1rem", color: "#007acc" }}>홈으로</Link>
                </nav>
            </header>

            {/* 중단 (본문) */}
            <main style={{ padding: "1rem", background: "#fdfdfd", minHeight: "60vh" }}>
                {children}
            </main>

            {/* 하단 */}
            <footer style={{
                padding: "1rem",
                background: "#e8d5d5",
                textAlign: "center",
                marginTop: "1rem"
            }}>
                <p style={{ margin: 0, color: "#555" }}>© 2025 My Blog. All rights reserved.</p>
            </footer>
        </div>
    );
}
