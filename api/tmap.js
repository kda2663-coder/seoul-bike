export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { startX, startY, endX, endY, type } = req.query; // type 파라미터 추가
    
    // type에 따라 도보 혹은 자전거 API 주소 선택
    const url = type === 'pedestrian' 
        ? 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json'
        : 'https://apis.openapi.sk.com/tmap/routes/bicycle?version=1&format=json';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appKey': process.env.TMAP_API_KEY
            },
            body: JSON.stringify({
                startX, startY, endX, endY,
                startName: "출발지",
                endName: "목적지",
                reqCoordType: "WGS84GEO",
                resCoordType: "WGS84GEO",
                searchOption: "0"
            })
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "통신 실패", message: error.message });
    }
}