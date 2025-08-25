import Layout from "../../../components/Layout";

export default function AchillesPost() {
    return (
        <Layout>
            <div className="p-6 space-y-6 bg-gray-50 text-gray-800">
                <h1 className="text-2xl font-bold text-blue-800">
                    급성 아킬레스건 파열: 비수술적 치료 요약
                </h1>

                {/* 서론 */}
                <section className="bg-white p-4 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold text-blue-700">1. 서론</h2>
                    <p>
                        아킬레스건은 인체에서 가장 크고 강력한 힘줄로 최근 스포츠 활동 증가로
                        파열 빈도가 늘어나고 있습니다.
                    </p>
                    <ul className="list-disc list-inside">
                        <li>주로 남성, 30~40대에서 발생</li>
                        <li>혈류가 적은 부위(3~6cm 근위부)에서 잘 발생</li>
                        <li>위험 요인: 스테로이드, 고콜레스테롤혈증, 류마티스, 퀴놀론계 항생제 등</li>
                    </ul>
                </section>

                {/* 치료 방법 논란 */}
                <section className="bg-white p-4 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold text-blue-700">2. 치료 방법 논란</h2>

                    <h3 className="mt-2 font-semibold">(1) 수술적 치료</h3>
                    <ul className="list-disc list-inside">
                        <li>장점: 빠른 근력 회복, 낮은 재파열률 보고</li>
                        <li>
                            단점:{" "}
                            <span className="bg-blue-100 px-1 rounded">
                                창상 감염, 신경 손상 등 합병증 위험 (최대 10%)
                            </span>
                        </li>
                        <li>최소 절개/경피 봉합법 시도 중이나 건 길이(Elongation) 문제는 여전</li>
                    </ul>

                    <h3 className="mt-4 font-semibold">(2) 비수술적 치료</h3>
                    <ul className="list-disc list-inside">
                        <li>
                            <span className="bg-blue-100 px-1 rounded">
                                단기 고정(약 2주) + 조기 재활
                            </span>{" "}
                            시 수술과 유사한 결과
                        </li>
                        <li>임상 결과 및 재파열률: 수술군과 차이 없음</li>
                        <li>합병증 위험 ↓</li>
                        <li>여성·고령에서는 기능 회복 저하 가능성</li>
                    </ul>
                </section>

                {/* 장기 추적 연구 */}
                <section className="bg-white p-4 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold text-blue-700">3. 장기 추적 연구</h2>
                    <p>수술군 vs 비수술군을 7년 이상 추시:</p>
                    <ul className="list-disc list-inside">
                        <li>2년까지는 근력 차이 있었으나 7년 이후 유의미한 차이 없음</li>
                        <li>뒤꿈치 들기 횟수만 수술군이 우세, 나머지는 동일</li>
                    </ul>
                </section>

                {/* 임상 적용 */}
                <section className="bg-white p-4 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold text-blue-700">4. 임상 적용</h2>
                    <ul className="list-disc list-inside">
                        <li>전문 운동선수: 수술 선호되기도 하나 건 길이 문제로 무조건 우위 아님</li>
                        <li>열상 아닌 급성 파열 → 대부분 비수술적 치료 가능</li>
                        <li>
                            프로토콜 예시:
                            <ul className="list-disc list-inside ml-4">
                                <li>2주간 발목 족저굴곡 상태 고정</li>
                                <li>보조기 착용 + 체중부하 시작</li>
                                <li>점진적 근력 강화 운동</li>
                                <li>약 3개월째 뒤꿈치 들기 가능 목표</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                {/* 결론 */}
                <section className="bg-white p-4 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold text-blue-700">5. 결론</h2>
                    <p>
                        비수술적 조기 재활 치료는 수술과{" "}
                        <strong>재파열률 및 기능 회복 면에서 큰 차이가 없으며</strong>, 수술
                        합병증을 피할 수 있다는 장점이 있습니다.
                        <br />
                        따라서 수술 여부는 환자의 특성과 위험도를 고려하여 충분한 상의 후
                        결정해야 하며,
                        <br />
                        장기간 고정은 피하고{" "}
                        <span className="bg-blue-100 px-1 rounded">단기 고정 + 조기 재활</span>이
                        권장됩니다.
                    </p>
                </section>
            </div>
        </Layout>
    );
}
