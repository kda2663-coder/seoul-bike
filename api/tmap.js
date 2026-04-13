export default async function handler(req, res) {
    // 👈 허가증 추가 (CORS 해결)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { startX, startY, endX, endY } = req.query;
    const url = 'https://apis.openapi.sk.com/tmap/routes/bicycle?version=1&format=json';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appKey': process.env.TMAP_API_KEY
            },
            body: JSON.stringify({
                startX, startY, endX, endY,
                reqCoordType: "WGS84GEO",
                resCoordType: "WGS84GEO",
                searchOption: 0
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Tmap 호출 실패" });
    }
}