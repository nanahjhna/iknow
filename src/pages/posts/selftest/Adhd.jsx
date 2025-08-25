import { useState } from "react";
import Layout from "../../../components/Layout";

export default function AdhdPost() {
    // 질문 10개
    const questions = [
        "집중을 오래 유지하기 어렵다.",
        "사소한 실수를 자주 한다.",
        "물건을 자주 잃어버린다.",
        "차분히 앉아 있지 못한다.",
        "말이 많다는 얘기를 듣는다.",
        "충동적으로 행동한다.",
        "순서를 지키기 어렵다.",
        "일을 끝내지 못하고 방치한다.",
        "기다림이 힘들다.",
        "기분이 자주 변한다.",
    ];

    // 각 질문 답변 (null = 미선택)
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));

    // 답변 선택 핸들러
    const handleAnswer = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    // 모든 질문이 체크되었는지 확인
    const allAnswered = answers.every((ans) => ans !== null);

    // 결과 확인
    const handleResult = () => {
        const totalScore = answers.reduce((sum, val) => sum + val, 0);

        let message = "";
        if (totalScore <= 10) {
            message = "증상이 거의 없습니다. (경미)";
        } else if (totalScore <= 20) {
            message = "약간 주의가 필요합니다. (중간)";
        } else if (totalScore <= 30) {
            message = "꽤 증상이 보입니다. (심함)";
        } else {
            message = "전문가 상담이 필요할 수 있습니다. (매우 심함)";
        }

        alert(`총점: ${totalScore}점\n결과: ${message}`);
    };

    return (
        <Layout>
            <h1>ADHD 자가진단 (10문항)</h1>

            {questions.map((q, i) => (
                <div key={i} style={{ marginBottom: "1rem" }}>
                    <p>{i + 1}. {q}</p>

                    <label>
                        <input
                            type="radio"
                            name={`q${i}`}
                            value="0"
                            onChange={() => handleAnswer(i, 0)}
                        />
                        전혀 아니다 (0점)
                    </label>

                    <label style={{ marginLeft: "1rem" }}>
                        <input
                            type="radio"
                            name={`q${i}`}
                            value="1"
                            onChange={() => handleAnswer(i, 1)}
                        />
                        가끔 그렇다 (1점)
                    </label>

                    <label style={{ marginLeft: "1rem" }}>
                        <input
                            type="radio"
                            name={`q${i}`}
                            value="2"
                            onChange={() => handleAnswer(i, 2)}
                        />
                        자주 그렇다 (2점)
                    </label>

                    <label style={{ marginLeft: "1rem" }}>
                        <input
                            type="radio"
                            name={`q${i}`}
                            value="3"
                            onChange={() => handleAnswer(i, 3)}
                        />
                        매우 그렇다 (3점)
                    </label>
                </div>
            ))}

            {allAnswered && (
                <button
                    onClick={handleResult}
                    style={{
                        marginTop: "1rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#007acc",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    결과 확인하기
                </button>
            )}
        </Layout>
    );
}
