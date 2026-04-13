export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { startX, startY, endX, endY } = req.query;
    
    // 🚶 보행자 경로용 주소 (자전거가 안 보일 때 가장 확실한 대안)
    const url = 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json';

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
                startName: encodeURIComponent("출발지"), // 👈 보행자 경로 필수값 추가
                endName: encodeURIComponent("목적지"),   // 👈 보행자 경로 필수값 추가
                reqCoordType: "WGS84GEO",
                resCoordType: "WGS84GEO"
            })
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "통신 실패", detail: error.message });
    }
}