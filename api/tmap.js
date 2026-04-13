// calculateComplexRoute 함수 내부의 데이터 처리 부분
function drawFinalRoute(w1, b, w2) {
    polylines.forEach(p => p.setMap(null)); // 기존 선 지우기
    polylines = [];

    const drawLine = (data, color, style, weight) => {
        const path = [];
        if (data.features) {
            data.features.forEach(f => {
                if (f.geometry.type === "LineString") {
                    f.geometry.coordinates.forEach(c => path.push(new kakao.maps.LatLng(c[1], c[0])));
                }
            });
        }
        const line = new kakao.maps.Polyline({
            path: path,
            strokeColor: color,
            strokeStyle: style,
            strokeWeight: weight,
            strokeOpacity: 0.8
        });
        line.setMap(map);
        polylines.push(line);
        return path;
    };

    // 1구간: 도보 (회색 점선)
    const p1 = drawLine(w1, '#888', 'dash', 4);
    // 2구간: 자전거 (연두색 실선)
    const p2 = drawLine(b, '#2ecc71', 'solid', 7);
    // 3구간: 도보 (회색 점선)
    const p3 = drawLine(w2, '#888', 'dash', 4);

    // 모든 경로가 보이도록 지도 확장
    const bounds = new kakao.maps.LatLngBounds();
    [...p1, ...p2, ...p3].forEach(p => bounds.extend(p));
    map.setBounds(bounds);
}