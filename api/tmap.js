export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { startX, startY, endX, endY } = req.query;
    
    // 🚲 Tmap 자전거 경로 API 정식 주소
    const url = 'https://apis.openapi.sk.com/tmap/routes/bicycle?version=1&format=json';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appKey': process.env.TMAP_API_KEY
            },
            body: JSON.stringify({
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY,
                // 블로그 힌트: 한글 이름은 반드시 포함되어야 하며, 인코딩이 필요할 수 있음
                startName: "출발지",
                endName: "목적지",
                reqCoordType: "WGS84GEO",
                resCoordType: "WGS84GEO",
                searchOption: "0" // 0: 최적경로
            })
        });

        const data = await response.json();
        
        // 서버 로그 확인용 (Vercel 대시보드에서 보임)
        if (!response.ok) {
            console.error("Tmap API Error:", data);
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "통신 실패", message: error.message });
    }
}