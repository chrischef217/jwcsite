// About 페이지 컨텐츠

export function aboutContent() {
  return `
    <!-- About Content Section -->
    <section class="content-section" style="padding: 80px 20px;">
        <div class="container">
            <div class="about-grid">
                <div class="about-card">
                    <h2>우리의 비전</h2>
                    <p>JWC는 고객의 아름다움과 건강을 최우선으로 생각하는 화장품 회사입니다. 
                    자연에서 얻은 순수한 성분과 첨단 과학기술을 결합하여, 
                    피부에 안전하면서도 효과적인 제품을 만들어갑니다.</p>
                </div>
                
                <div class="about-card">
                    <h2>우리의 미션</h2>
                    <p>모든 사람이 자신의 피부 타입과 고민에 맞는 완벽한 솔루션을 찾을 수 있도록, 
                    다양하고 전문적인 제품 라인을 제공합니다. 
                    지속 가능한 뷰티를 추구하며, 환경을 생각하는 기업이 되겠습니다.</p>
                </div>
                
                <div class="about-card">
                    <h2>핵심 가치</h2>
                    <p>품질, 혁신, 신뢰. 이 세 가지 핵심 가치를 바탕으로 
                    고객 만족을 위해 끊임없이 노력합니다. 
                    엄격한 품질 관리와 지속적인 연구개발을 통해 
                    업계 최고의 제품을 만들어갑니다.</p>
                </div>
            </div>
        </div>
    </section>
    
    <style>
        .about-grid {
            display: grid;
            gap: 40px;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .about-card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .about-card h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        
        .about-card p {
            color: #666;
            line-height: 1.8;
            font-size: 1.1rem;
        }
    </style>`;
}
