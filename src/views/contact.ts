// Contact 페이지 컨텐츠

export function contactContent() {
  return `
    <!-- Contact Content Section -->
    <section class="content-section" style="padding: 80px 20px;">
        <div class="container">
            <div class="contact-grid">
                <div class="contact-form">
                    <h2>문의하기</h2>
                    <form id="contactForm">
                        <div class="form-group">
                            <label for="name">이름</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">이메일</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="subject">제목</label>
                            <input type="text" id="subject" name="subject" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="message">메시지</label>
                            <textarea id="message" name="message" rows="6" required></textarea>
                        </div>
                        
                        <button type="submit" class="submit-btn">보내기</button>
                    </form>
                </div>
                
                <div class="contact-info">
                    <h2>연락처</h2>
                    <div class="info-item">
                        <div class="info-icon">📍</div>
                        <div>
                            <h3>주소</h3>
                            <p>서울특별시 강남구</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">📞</div>
                        <div>
                            <h3>전화</h3>
                            <p>02-1234-5678</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">✉️</div>
                        <div>
                            <h3>이메일</h3>
                            <p>contact@jwc.com</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">🕐</div>
                        <div>
                            <h3>운영시간</h3>
                            <p>평일 09:00 - 18:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <style>
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        @media (max-width: 768px) {
            .contact-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .contact-form,
        .contact-info {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .contact-form h2,
        .contact-info h2 {
            font-size: 2rem;
            margin-bottom: 30px;
            color: #333;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            font-family: inherit;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .submit-btn {
            width: 100%;
            padding: 15px;
            background: #333;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .submit-btn:hover {
            background: #555;
        }
        
        .info-item {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .info-icon {
            font-size: 2rem;
            flex-shrink: 0;
        }
        
        .info-item h3 {
            font-size: 1.2rem;
            margin-bottom: 5px;
            color: #333;
        }
        
        .info-item p {
            color: #666;
        }
    </style>
    
    <script>
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
            e.target.reset();
        });
    </script>`;
}
