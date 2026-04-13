export default async function handler(req, res) {
    const API_KEY = process.env.SEOUL_DATA_API_KEY;
    const url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/bikeList/1/1000/`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // 브라우저에 데이터를 잘 전달하겠다는 마지막 인사입니다.
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "데이터 가져오기 실패", details: error.message });
    }
}