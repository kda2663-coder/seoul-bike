export default async function handler(req, res) {
    // 1. 어떤 상황에서도 CORS 헤더를 가장 먼저 설정합니다.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { startX, startY, endX, endY } = req.query;

        // 파라미터가 비어있는지 체크 (서버 다운 방지)
        if (!startX || !startY || !endX || !endY) {
            return res.status(400).json({ error: "필수 좌표값이 없습니다." });
        }

        // TMAP_API_KEY 확인
        if (!process.env.TMAP_API_KEY) {
            return res.status(500).json({ error: "서버 설정 오류: API KEY가 없습니다." });
        }

        // 🚶 무조건 성공하는 보행자 경로 주소 사용
        const url = 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appKey': process.env.TMAP_API_KEY.trim()
            },
            body: JSON.stringify({
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY,
                startName: encodeURIComponent("출발지"),
                endName: encodeURIComponent("목적지"),
                reqCoordType: "WGS84GEO",
                resCoordType: "WGS84GEO"
            })
        });

        const data = await response.json();

        // Tmap 응답 상태 그대로 전달
        return res.status(response.status).json(data);

    } catch (error) {
        // 여기서 에러를 잡아줘야 서버가 500으로 죽지 않고 CORS 헤더를 유지합니다.
        console.error("Server Error:", error);
        return res.status(500).json({ error: "서버 내부 오류", message: error.message });
    }
}