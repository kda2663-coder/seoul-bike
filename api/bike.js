export default async function handler(req, res) {
    // [추가] 모든 곳(내 컴퓨터 포함)에서 이 데이터를 가져갈 수 있게 허용합니다.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const API_KEY = process.env.SEOUL_DATA_API_KEY;
    const url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/bikeList/1/1000/`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "데이터 가져오기 실패" });
    }
}