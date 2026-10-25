# 국경 관계 토큰 에셋 제작 사양

제작 방식: 내장 이미지 생성 도구. 각 에셋을 개별 생성했고 배경 투명화를 요청했다. 아래는 공통 디자인과 종류별 최종 제작 명세다. 텍스트나 국기 없이 색과 상징만으로 구분한다.

## 공통 프롬프트

Use case: stylized-concept. A single premium fantasy strategy-game diplomatic status token, perfectly front-facing circular enamel medallion, ornate polished silver rim with four small pointed accents, highly detailed metal craftsmanship but a strong simple silhouette readable at 40 pixels. Centered complete object, generous transparent margin, fully transparent background outside the token. Consistent collection style. No text, letters, numbers, logo, watermark, scene, cards or additional icons.

## 종류별 상징

| 파일 | 관계 | 공통 사양에 추가한 핵심 디자인 |
| --- | --- | --- |
| `war.png` | 전쟁 중 | Crimson red enamel, crossed steel swords and a small flame, no skulls. |
| `hostile.png` | 적대 관계 | Amber enamel, cracked shield and opposing dagger tips, tense hostile symbolism. |
| `neutral.png` | 중립 관계 | Pearl-gray enamel, a balanced pair of silver scales, calm symmetrical composition. |
| `friendly.png` | 우호 관계 | Emerald green enamel, a clear handshake and olive sprig. |
| `alliance.png` | 동맹 관계 | Sapphire blue enamel, two overlapping shields and a laurel branch. |
| `blood.png` | 혈맹 관계 | Amethyst purple enamel, two armored hands clasped in a sworn oath, a central ruby accent. |
| `vassal.png` | 종속 관계 | Gold enamel, a large crown above a smaller crown joined by a chain, clear hierarchical composition. |

## 원본 출력

출력 폴더: `public/images/diplomacy/`. 모두 투명 PNG, 1254 x 1254. 앱에서는 최대 32 화면 픽셀로 표시하고 가까운 토큰이 있으면 축소한다. 관계 편집창에서는 56px 프리뷰를 사용한다. 이름은 별도의 접근성 텍스트와 툴팁으로 제공한다.

도구 원본은 `C:/Users/GEM12/.codex/generated_images/019f54b7-6e3b-7f00-85bd-4d897c05d6eb/`에 있다.

| 파일 | 도구 원본 파일 |
| --- | --- |
| war | exec-62321f50-4aeb-42f8-9d24-737f9797b1c5.png |
| hostile | exec-d74ab3a2-0e91-49a5-adf9-ce9f8b3d2b73.png |
| neutral | exec-b40dc911-c733-4654-a53e-f67fa468ff16.png |
| friendly | exec-cd0f947e-b2ca-469d-8639-3352606cb8a9.png |
| alliance | exec-364b43d4-8b3e-438e-8909-729dbebe32e3.png |
| blood | exec-34cf9471-84ed-496c-8c7c-2739d78f7485.png |
| vassal | exec-5565a43e-27b3-4173-aeed-cdd8d78e7d56.png |
