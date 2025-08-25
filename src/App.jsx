import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

// Tech
import ReactPost from "./pages/posts/tech/React";

// ... 다른 카테고리도 동일하게
import AchillesPost from "./pages/posts/health/Achilles";

// ... 다른 카테고리도 동일하게
import AdhdPost from "./pages/posts/selftest/Adhd";


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            {/* Tech */}
            <Route path="/category/tech/react" element={<ReactPost />} />
            
            {/* 나머지 카테고리도 동일 */}
            <Route path="/category/health/achilles" element={<AchillesPost />} />

            {/* 나머지 카테고리도 동일 */}
            <Route path="/category/selftest/adhd" element={<AdhdPost />} />

        </Routes>
    );
}
