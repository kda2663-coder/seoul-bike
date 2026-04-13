export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { startX, startY, endX, endY } = req.query;
    
    // 🚶 가장 확실한 '보행자 경로' 주소로 고정합니다.
    const url = 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appKey': process.env.TMAP_API_KEY // Vercel에 등록한 키
            },
            body: JSON.stringify({
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY,
                startName: "출발지", // 필수값
                endName: "목적지",   // 필수값
                reqCoordType: "WGS84GEO",
                resCoordType: "WGS84GEO"
            })
        });

        const data = await response.json();

        // 에러 발생 시 상세 내용을 브라우저 콘솔에 찍어주기 위해 status 전달
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "통신 실패", message: error.message });
    }
}