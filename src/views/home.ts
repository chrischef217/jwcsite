// Home 페이지 컨텐츠

export function homeContent() {
  return `
    <!-- Company Info Section -->
    <section class="content-section" style="padding: 80px 20px; background: #f5f5f5;">
        <div class="container">
            <div class="company-info">
                <div class="info-card">
                    <div class="info-icon">💡</div>
                    <h3>Innovation</h3>
                    <p>끊임없는 연구와 혁신으로 최고의 제품을 만듭니다.</p>
                </div>
                <div class="info-card">
                    <div class="info-icon">⭐</div>
                    <h3>Quality</h3>
                    <p>엄격한 품질 관리로 신뢰할 수 있는 제품을 제공합니다.</p>
                </div>
                <div class="info-card">
                    <div class="info-icon">🤝</div>
                    <h3>Trust</h3>
                    <p>고객과의 신뢰를 최우선으로 생각합니다.</p>
                </div>
            </div>
        </div>
    </section>
    
    <style>
        .company-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .info-card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .info-card:hover {
            transform: translateY(-5px);
        }
        
        .info-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .info-card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #333;
        }
        
        .info-card p {
            color: #666;
            line-height: 1.6;
        }
    </style>`;
}
