export default async function handler(req, res) {
  // 브라우저에서 보낸 위경도 데이터를 받습니다.
  const { startX, startY, endX, endY } = req.query;
  const TMAP_API_KEY = "NHa8cLApfM4A8owpzMlp95mVQAy2skok9hgHjZl7" ;

  const url = 'https://apis.openapi.sk.com/tmap/routes/bicycle?version=1&format=json';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'appKey': TMAP_API_KEY
      },
      body: JSON.stringify({
        startX, startY, endX, endY,
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        angle: 172,
        searchOption: 0
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "TMAP 호출 실패" });
  }
}