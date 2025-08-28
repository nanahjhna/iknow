import Layout from "../../../components/Layout";
import React, { useEffect, useRef, useState, useMemo } from "react";

/**
 * MiniDefenseGame - 단일 파일 미니 디펜스 게임 (React + Canvas)
 *
 * 사용 방법:
 * 1) Vite/CRA 프로젝트의 아무 페이지에서 <MiniDefenseGame /> 렌더링
 * 2) 캔버스를 클릭하면 해당 타일에 포탑을 설치 (설치 비용 50)
 * 3) Start Wave 버튼으로 적 웨이브 시작
 * 4) 포탑은 자동으로 사격, 적이 끝까지 도달하면 라이프 감소
 *
 * 모바일 최적화:
 * - 반응형 캔버스(부모 너비에 맞춰 조정)
 * - 터치 입력 지원
 */
export default function DefenseGamePost() {
    // ----------- 기본 설정 -----------
    const tileSizeBase = 56; // 기본 타일 픽셀(반응형에서 스케일됨)
    const gridCols = 12;
    const gridRows = 8;
    const pathPoints = useMemo(
        () => [
            { x: 0, y: 0 },   // 시작 (왼쪽 위)
            { x: 11, y: 0 },  // 오른쪽으로 이동
            { x: 11, y: 7 },  // 아래로 이동
            { x: 1, y: 7},   // 왼쪽으로 이동
        ],
        []
    );

    // ----------- 상태 -----------
    const [gold, setGold] = useState(150);
    const [lives, setLives] = useState(10);
    const [wave, setWave] = useState(0);
    const [running, setRunning] = useState(false);
    const [message, setMessage] = useState("Start Wave를 누르세요");

    // 게임 오브젝트들 (렌더 빈도 높아 useRef로 보관)
    const towersRef = useRef([]); // {col,row, x,y, range, fireRate, lastShot}
    const enemiesRef = useRef([]); // {x,y, speed, hp, pathIndex, progress}
    const bulletsRef = useRef([]); // {x,y, vx,vy, damage, targetId}

    // 캔버스/반응형
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const [scale, setScale] = useState(1);
    const tileSize = tileSizeBase * scale;

    // ----------- 유틸 -----------
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }
    function worldFromCell(col, row) {
        return { x: col * tileSize + tileSize / 2, y: row * tileSize + tileSize / 2 };
    }
    function cellFromWorld(px, py) {
        const col = Math.floor(px / tileSize);
        const row = Math.floor(py / tileSize);
        return { col, row };
    }
    function distance(ax, ay, bx, by) {
        const dx = ax - bx;
        const dy = ay - by;
        return Math.hypot(dx, dy);
    }

    // ----------- 반응형 스케일 -----------
    useEffect(() => {
        function handleResize() {
            if (!wrapperRef.current) return;
            const w = wrapperRef.current.clientWidth;
            const desiredWidth = gridCols * tileSizeBase;
            const s = Math.max(0.6, Math.min(1.2, w / desiredWidth));
            setScale(s);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ----------- 입력: 클릭/터치로 포탑 설치 -----------
    // 포탑 설치 함수
    function placeTowerAt(px, py) {
        if (gold < 50) {
            setMessage("Gold가 부족합니다 (50 필요)");
            return;
        }
        const { col, row } = cellFromWorld(px, py);

        // 1행 차단
        if (row === 1 || row === 6 || col === 10) {
            setMessage(row + "행에는 포탑을 설치할 수 없습니다");
            return;
        }

        // 경로 위에는 설치 금지
        if (isPathCell(col, row)) {
            setMessage("경로 위에는 설치할 수 없습니다");
            return;
        }

        // 이미 포탑 있는지 체크
        if (towersRef.current.some(t => t.col === col && t.row === row)) {
            setMessage("이미 포탑이 있습니다");
            return;
        }

        const { x, y } = worldFromCell(col, row);
        towersRef.current.push({
            col,
            row,
            x,
            y,
            range: tileSize * 2.2,
            fireRate: 0.5, // 초당 발사(쿨다운 2초)
            lastShot: 0,
        });
        setGold(g => g - 50);
        setMessage("포탑 설치 완료");
    }

    // 캔버스 클릭/터치
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const onClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left);
            const y = (e.clientY - rect.top);
            placeTowerAt(x, y);
        };
        const onTouch = (e) => {
            const rect = canvas.getBoundingClientRect();
            const t = e.touches[0];
            const x = (t.clientX - rect.left);
            const y = (t.clientY - rect.top);
            placeTowerAt(x, y);
        };
        canvas.addEventListener("click", onClick);
        canvas.addEventListener("touchstart", onTouch, { passive: true });
        return () => {
            canvas.removeEventListener("click", onClick);
            canvas.removeEventListener("touchstart", onTouch);
        };
    }, [tileSize, gold]);

    // ----------- 경로 타일 판정 -----------
    function isPathCell(col, row) {
        // pathPoints 사이를 잇는 직선들 중에 현재 셀의 중심이 가까우면 경로로 간주
        const center = worldFromCell(col, row);
        const threshold = tileSize * 0.45; // 대략 타일 폭의 절반
        for (let i = 0; i < pathPoints.length - 1; i++) {
            const a = pathPoints[i];
            const b = pathPoints[i + 1];
            const ax = (a.x + 0.5) * tileSize;
            const ay = (a.y + 0.5) * tileSize;
            const bx = (b.x + 0.5) * tileSize;
            const by = (b.y + 0.5) * tileSize;
            // 점에서 선분까지의 거리
            const proj = pointToSegmentDistance(center.x, center.y, ax, ay, bx, by);
            if (proj < threshold) return true;
        }
        return false;
    }
    function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let t = lenSq ? dot / lenSq : -1;
        t = Math.max(0, Math.min(1, t));
        const x = x1 + t * C;
        const y = y1 + t * D;
        return Math.hypot(px - x, py - y);
    }

    // ----------- 웨이브 스폰 -----------
    function startWave() {
        if (running) return;
        setRunning(true);
        setWave(w => w + 1);
        setMessage(`Wave ${wave + 1} 시작!`);

        // 웨이브 적 스폰: 12마리, 체력/속도는 웨이브에 따라 증가
        const count = 12;
        const hpBase = 20 + wave * 8;
        const speedBase = 40 + wave * 4; // px/초

        let spawned = 0;
        const spawnInterval = setInterval(() => {
            if (spawned >= count) {
                clearInterval(spawnInterval);
                return;
            }
            const start = pathPoints[0];
            const sx = (start.x + 0.5) * tileSize;
            const sy = (start.y + 0.5) * tileSize;
            enemiesRef.current.push({
                x: sx,
                y: sy,
                speed: speedBase,
                hp: hpBase,
                pathIndex: 0,
                progress: 0,
                id: cryptoRandomId(),
            });
            spawned++;
        }, 500);
    }

    function cryptoRandomId() {
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
    }

    // ----------- 게임 루프 -----------
    const lastTimeRef = useRef(0);
    useEffect(() => {
        let raf;
        function loop(t) {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            const now = t / 1000;
            const dt = Math.min(0.05, now - (lastTimeRef.current || now));
            lastTimeRef.current = now;

            update(dt);
            draw(ctx);
            raf = requestAnimationFrame(loop);
        }
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tileSize, running]);

    function update(dt) {
        // 적 이동
        const enemies = enemiesRef.current;
        for (let e of enemies) {
            // 다음 경로 포인트로 이동
            const i = e.pathIndex;
            const a = pathPoints[i];
            const b = pathPoints[i + 1];
            if (!b) {
                // 도착
                e.reached = true;
                continue;
            }
            const ax = (a.x + 0.5) * tileSize;
            const ay = (a.y + 0.5) * tileSize;
            const bx = (b.x + 0.5) * tileSize;
            const by = (b.y + 0.5) * tileSize;
            const segLen = Math.hypot(bx - ax, by - ay);
            const move = e.speed * dt;

            // 현재 a->b 구간에서 진행도(progress)를 거리 기준으로 증가
            const distToGo = segLen * (1 - e.progress);
            const step = Math.min(move, distToGo);
            const stepT = segLen ? step / segLen : 0;
            e.progress += stepT;
            const nx = lerp(ax, bx, e.progress);
            const ny = lerp(ay, by, e.progress);
            e.x = nx;
            e.y = ny;
            if (e.progress >= 1) {
                e.pathIndex++;
                e.progress = 0;
            }
        }

        // 목적지 도달 처리
        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            if (e.reached) {
                enemies.splice(i, 1);
                setLives((v) => Math.max(0, v - 1));
                setMessage("적이 통과했습니다…");
            }
        }

        // 포탑 사격
        const bullets = bulletsRef.current;
        const timeNow = lastTimeRef.current || 0;
        for (let t of towersRef.current) {
            if (timeNow - t.lastShot < 1 / t.fireRate) continue;
            // 사거리 내 가장 가까운 적을 찾음
            let best = null;
            let bestDist = Infinity;
            for (let e of enemies) {
                const d = distance(t.x, t.y, e.x, e.y);
                if (d <= t.range && d < bestDist) {
                    best = e;
                    bestDist = d;
                }
            }
            if (best) {
                const dirX = best.x - t.x;
                const dirY = best.y - t.y;
                const len = Math.hypot(dirX, dirY) || 1;
                const speed = 320 * scale; // 탄 속도
                bullets.push({
                    x: t.x,
                    y: t.y,
                    vx: (dirX / len) * speed,
                    vy: (dirY / len) * speed,
                    damage: 12,
                    targetId: best.id,
                });
                t.lastShot = timeNow;
            }
        }

        // 탄 업데이트 & 피격
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            // 타겟 근접 체크
            let hit = false;
            for (let j = enemies.length - 1; j >= 0; j--) {
                const e = enemies[j];
                if (distance(b.x, b.y, e.x, e.y) < tileSize * 0.3) {
                    e.hp -= b.damage;
                    hit = true;
                    if (e.hp <= 0) {
                        enemies.splice(j, 1);
                        setGold((g) => g + 10);
                    }
                    break;
                }
            }
            // 화면 밖 제거 또는 명중 시 제거
            if (
                hit ||
                b.x < -50 ||
                b.y < -50 ||
                b.x > gridCols * tileSize + 50 ||
                b.y > gridRows * tileSize + 50
            ) {
                bullets.splice(i, 1);
            }
        }

        // 게임오버/웨이브 종료 체크
        if (lives <= 0) {
            // 게임오버: 루프는 계속 돌지만 메시지 갱신
            setMessage("Game Over! 새로고침(F5)으로 재시작");
            setRunning(false);
            enemies.length = 0;
            bullets.length = 0;
        } else if (running) {
            // 남은 적이 없고, 스폰도 끝났다면 웨이브 종료
            // 간단 체크: 일정 시간 적이 없으면 종료 메시지
            if (enemies.length === 0) {
                setRunning(false);
                setMessage(`Wave ${wave} 클리어! Start Wave로 다음 웨이브`);
            }
        }
    }

    // ----------- 그리기 -----------
    function draw(ctx) {
        const W = gridCols * tileSize;
        const H = gridRows * tileSize;
        // 배경
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#f8f4f6"; // 은은한 배경
        ctx.fillRect(0, 0, W, H);

        // 그리드 타일
        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                const x = c * tileSize;
                const y = r * tileSize;
                ctx.strokeStyle = "#ead9df";
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, tileSize, tileSize);
            }
        }

        // 경로
        ctx.strokeStyle = "#d6b7be";
        ctx.lineWidth = Math.max(10, tileSize * 0.4);
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let i = 0; i < pathPoints.length; i++) {
            const p = pathPoints[i];
            const x = (p.x + 0.5) * tileSize;
            const y = (p.y + 0.5) * tileSize;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 포탑
        for (let t of towersRef.current) {
            ctx.fillStyle = "#8f5d9a";
            ctx.beginPath();
            ctx.arc(t.x, t.y, tileSize * 0.28, 0, Math.PI * 2);
            ctx.fill();
            // 사거리 표시(연한)
            ctx.strokeStyle = "rgba(143,93,154,0.18)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 적
        for (let e of enemiesRef.current) {
            // HP 바
            const w = tileSize * 0.6;
            const h = 6;
            ctx.fillStyle = "#333";
            ctx.fillRect(e.x - w / 2, e.y - tileSize * 0.45, w, h);
            const hpRatio = Math.max(0, Math.min(1, e.hp / (20 + (wave - 1) * 8)));
            ctx.fillStyle = "#7bd389";
            ctx.fillRect(e.x - w / 2, e.y - tileSize * 0.45, w * hpRatio, h);

            // 본체
            ctx.fillStyle = "#3f3d56";
            ctx.beginPath();
            ctx.arc(e.x, e.y, tileSize * 0.22, 0, Math.PI * 2);
            ctx.fill();
        }

        // 탄환
        ctx.fillStyle = "#ff7b7b";
        for (let b of bulletsRef.current) {
            ctx.beginPath();
            ctx.arc(b.x, b.y, 4 + 2 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ----------- 캔버스 크기 -----------
    const width = gridCols * tileSize;
    const height = gridRows * tileSize;

    return (
        <div
            ref={wrapperRef}
            style={{
                maxWidth: "100%",
                margin: "0 auto",
                padding: "12px",
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <h2 style={{ margin: 0 }}>🛡️ Mini Defense</h2>
                <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
                    <Badge label={`Wave ${wave}`} />
                    <Badge label={`Gold ${gold}`} />
                    <Badge label={`Lives ${lives}`} color="#ff6b6b" />
                </div>
            </div>

            <p style={{ margin: "6px 0 12px", color: "#555" }}>
                빈 타일을 클릭/터치하면 <strong>포탑(50G)</strong>을 설치합니다. 적이 우측 끝에 도달하기 전에 제거하세요.
            </p>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <button
                    onClick={startWave}
                    disabled={running || lives <= 0}
                    style={primaryBtnStyle(running || lives <= 0)}
                >
                    Start Wave
                </button>
                <button
                    onClick={() => {
                        // 간단 리셋
                        towersRef.current = [];
                        enemiesRef.current = [];
                        bulletsRef.current = [];
                        setGold(150);
                        setLives(10);
                        setWave(0);
                        setRunning(false);
                        setMessage("Start Wave를 누르세요");
                    }}
                    style={ghostBtnStyle}
                >
                    Reset
                </button>
            </div>

            <div style={{ position: "relative", width: width, height: height }}>
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    style={{
                        width: width,
                        height: height,
                        touchAction: "manipulation",
                        borderRadius: 12,
                        background: "#f8f4f6",
                    }}
                />
            </div>

            <div
                style={{
                    marginTop: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "#fff6f8",
                    color: "#80324a",
                    fontSize: 14,
                    border: "1px solid #f3d1da",
                }}
            >
                {message}
            </div>

            <ul style={{ fontSize: 14, color: "#666", marginTop: 10, lineHeight: 1.6 }}>
                <li>포탑 비용: 50 Gold, 적 처치: +10 Gold</li>
                <li>웨이브마다 적 HP/속도 증가</li>
                <li>모바일에서도 터치로 설치 가능</li>
            </ul>
        </div>
    );
}

function Badge({ label, color = "#6c5ce7" }) {
    return (
        <span
            style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 999,
                background: hexToRGBA(color, 0.12),
                color: color,
                fontWeight: 600,
                fontSize: 14,
            }}
        >
            {label}
        </span>
    );
}

function primaryBtnStyle(disabled) {
    return {
        padding: "10px 14px",
        borderRadius: 10,
        border: "none",
        background: disabled ? "#b7b7d1" : "#6c5ce7",
        color: "#fff",
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: "0 6px 14px rgba(108,92,231,0.3)",
    };
}
const ghostBtnStyle = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
    color: "#333",
    fontWeight: 600,
    cursor: "pointer",
};

function hexToRGBA(hex, a) {
    const h = hex.replace("#", "");
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}