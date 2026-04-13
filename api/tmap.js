export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { startX, startY, endX, endY } = req.query;
    const url = 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json';

    // 1. 키가 비어있는지 서버 로그로 확인
    if (!process.env.TMAP_API_KEY) {
        return res.status(500).json({ error: "서버 설정 오류", detail: "TMAP_API_KEY가 설정되지 않았습니다." });
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appKey': process.env.TMAP_API_KEY.trim() // 공백 제거
            },
            body: JSON.stringify({
                startX, startY, endX, endY,
                reqCoordType: "WGS84GEO",
                resCoordType: "WGS84GEO",
                searchOption: 0
            })
        });

        const data = await response.json();

        // 2. Tmap 응답이 성공이 아닐 경우 상세 보고
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "Tmap 서버 거부", 
                detail: data, 
                statusCode: response.status 
            });
        }

        res.status(200).json(data);
    } catch (error) {
        // 3. fetch 자체가 실패한 경우
        res.status(500).json({ error: "네트워크 통신 실패", detail: error.message });
    }
}