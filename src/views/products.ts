// Products 페이지 컨텐츠

export function productsContent() {
  return `
    <!-- Products Content Section -->
    <section class="content-section" style="padding: 80px 20px;">
        <div class="container">
            <div class="products-header">
                <h2>제품 카테고리</h2>
                <div class="filter-buttons">
                    <button class="filter-btn active">전체</button>
                    <button class="filter-btn">스킨케어</button>
                    <button class="filter-btn">메이크업</button>
                    <button class="filter-btn">바디케어</button>
                </div>
            </div>
            
            <div class="products-grid">
                <div class="product-placeholder">
                    <div class="placeholder-icon">📦</div>
                    <h3>제품 준비중</h3>
                    <p>관리자 페이지에서 제품을 추가해주세요.</p>
                </div>
            </div>
        </div>
    </section>
    
    <style>
        .products-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .products-header h2 {
            font-size: 2.5rem;
            margin-bottom: 30px;
            color: #333;
        }
        
        .filter-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 10px 25px;
            border: 2px solid #333;
            background: white;
            color: #333;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s;
        }
        
        .filter-btn:hover,
        .filter-btn.active {
            background: #333;
            color: white;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 30px;
        }
        
        .product-placeholder {
            background: white;
            padding: 60px 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            grid-column: 1 / -1;
        }
        
        .placeholder-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .product-placeholder h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #333;
        }
        
        .product-placeholder p {
            color: #666;
        }
    </style>`;
}
