import Layout from "../../../components/Layout";

export default function AchillesPost() {
    const importantTextStyle = { color: 'red', textDecoration: 'underline' };
    return (
        <Layout>
        <div className="mx-auto max-w-3xl p-6 space-y-6 text-gray-900">
            <section className="bg-white rounded-2xl shadow p-5 space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">급성 아킬레스건 파열의 비수술적 치료와 수술적 치료 비교</h1>
                <p>
                    급성 아킬레스건 파열 환자를 대상으로 <strong>비수술적 치료</strong>, <strong>개방적 봉합술</strong>, <strong>최소 침습 수술</strong>의 효과와
                    안전성을 비교한 다기관, 무작위 대조 임상시험입니다.
                </p>
            </section>


            {/* 연구 주요 내용 */}
            <section className="bg-white rounded-2xl shadow p-5 space-y-4">
                <h2 className="text-xl font-semibold">연구의 주요 내용</h2>


                <div>
                    <h3 className="font-semibold mb-2">배경</h3>
                    <p>
                        급성 아킬레스건 파열 치료 시 <strong>수술적 방법(개방적 또는 최소 침습적)</strong>이
                        <strong> 비수술적 방법</strong>보다 더 나은 결과를 가져오는지는 명확히 밝혀지지 않았습니다.
                    </p>
                </div>


                <div>
                    <h3 className="font-semibold mb-2">연구 방법</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>총 526명의 성인 환자를 세 그룹으로 무작위 배정</li>
                        <li><strong>비수술 치료 그룹:</strong> 깁스·보조기 고정 후 재활</li>
                        <li><strong>개방적 봉합술 그룹:</strong> 피부 절개 후 힘줄 직접 봉합</li>
                        <li><strong>최소 침습 수술 그룹:</strong> 작은 절개를 통한 봉합</li>
                        <li>주요 평가지표: 치료 후 12개월 시점 ATRS (0~100점, 점수↑ = 기능↑)</li>
                        <li>부수적 평가지표: 재파열률, 신경 손상 등 합병증</li>
                    </ul>
                </div>


                <div>
                    <h3 className="font-semibold mb-2">연구 결과</h3>


                    <h4 className="font-semibold mt-2">1. 기능적 결과 (ATRS 점수)</h4>
                    <p>12개월 후 세 그룹 간 유의미한 차이 없음.</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>비수술: -17.0점</li>
                        <li>개방 수술: -16.0점</li>
                        <li>최소 침습 수술: -14.7점</li>
                    </ul>


                    <h4 className="font-semibold mt-2">2. 재파열률</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>비수술: 6.2%</li>
                        <li>개방 수술: 0.6%</li>
                        <li>최소 침습 수술: 0.6%</li>
                    </ul>
                    <p>→ 비수술 치료군에서 재파열 위험이 현저히 높음.</p>


                    <h4 className="font-semibold mt-2">3. 합병증 (신경 손상)</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>최소 침습 수술: 5.2%</li>
                        <li>개방 수술: 2.8%</li>
                        <li>비수술: 0.6%</li>
                    </ul>
                    <p>→ 최소 침습 수술에서 신경 손상 위험이 가장 높음.</p>
                </div>
            </section>


            {/* Conclusion */}
            <section className="bg-white rounded-2xl shadow p-5 space-y-2">
                <h2 className="text-xl font-semibold">결론</h2>
                <p>
                    급성 아킬레스건 파열 환자에서 12개월 추적 관찰 결과,
                    <strong> 수술적 치료(개방·최소 침습)</strong>는 <strong>비수술적 치료보다 기능적 결과가 더 낫지 않았다</strong>.
                </p>
                <p>
                    다만 <strong>비수술 치료는 재파열 위험</strong>이 높고, <strong>수술 치료는 신경 손상 합병증</strong> 위험이 존재했다.
                </p>
                <p>
                    따라서 환자의 연령, 활동 수준, 재파열 vs 합병증 위험 등을 고려한 <strong>개별화된 치료 선택</strong>이 필요하다.
                    예: 젊고 활동적인 환자 → 수술적 치료 / 수술 위험을 피하고 싶은 환자 → 비수술적 치료.
                </p>
            </section>
            </div>
        </Layout>
    );
}
