import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";


const categories = [
    { name: "Tech", sub: ["React"] },
    { name: "Health", sub: ["Achilles"] },
//    { name: "Life", sub: ["Traveling", "Food", "Health"] },
//    { name: "Travel", sub: ["Asia", "Europe", "America"] },
//    { name: "Music", sub: ["Pop", "Jazz", "Classical"] },
];

export default function Home() {
    const [openCategory, setOpenCategory] = useState(null);

    const toggleCategory = (name) => {
        setOpenCategory(openCategory === name ? null : name);
    };

    return (
        <Layout>
            <h1>카테고리</h1>
            <ul style={{
                listStyle: "none",
                padding: 0
            }}>
                {categories.map((cat) => (
                    <li key={cat.name} style={{
                        marginBottom: "0.5rem",
                        borderRadius: "999px",       // 타원형
                        background: "#ffe4e1",       // 연한 핑크
                        padding: "0.5rem 1rem",      // 내부 여백
                        cursor: "pointer"
                    }}>
                        <div
                            onClick={() => toggleCategory(cat.name)}
                            style={{
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                                color: "#222",
                            }}
                        >
                            {cat.name}
                        </div>

                        {openCategory === cat.name && (
                            <ul style={{
                                listStyle: "circle",
                                marginLeft: "1rem",
                                marginTop: "0.3rem"
                            }}>
                                {cat.sub.map((sub) => (
                                    <li key={sub} style={{ marginBottom: "0.3rem" }}>
                                        <Link
                                            to={`/category/${cat.name.toLowerCase()}/${sub.toLowerCase()}`}
                                            style={{ color: "#007acc", textDecoration: "none" }}
                                        >
                                            {sub}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

        </Layout>
    );
}
