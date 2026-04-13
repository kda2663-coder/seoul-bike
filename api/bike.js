export default async function handler(req, res) {
    // [추가] 모든 곳(내 컴퓨터 포함)에서 이 데이터를 가져갈 수 있게 허용합니다.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const API_KEY = process.env.SEOUL_DATA_API_KEY;
    
    // 서울시 대여소 전수를 가져오기 위해 1~3000번까지 3회 분할 호출
    const urls = [
        `http://openapi.seoul.go.kr:8088/${API_KEY}/json/bikeList/1/1000/`,
        `http://openapi.seoul.go.kr:8088/${API_KEY}/json/bikeList/1001/2000/`,
        `http://openapi.seoul.go.kr:8088/${API_KEY}/json/bikeList/2001/3000/`
    ];

    try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const dataResults = await Promise.all(responses.map(res => res.json()));
        
        // 데이터 병합
        let combinedRow = [];
        dataResults.forEach(data => {
            if (data.rentBikeStatus && data.rentBikeStatus.row) {
                combinedRow = combinedRow.concat(data.rentBikeStatus.row);
            }
        });

        res.status(200).json({
            rentBikeStatus: {
                list_total_count: combinedRow.length,
                RESULT: { CODE: "INFO-000", MESSAGE: "정상 처리되었습니다" },
                row: combinedRow
            }
        });
    } catch (error) {
        console.error("Bike API Error:", error);
        res.status(500).json({ error: "데이터 전량 가져오기 실패" });
    }
}