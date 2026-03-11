// Products Page - Category Filter
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const productsGrid = document.getElementById('productsGrid');

    // Category filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Add loading state
            productsGrid.classList.add('loading');
            
            // Filter products with smooth animation
            setTimeout(() => {
                productCards.forEach(card => {
                    if (category === 'all') {
                        card.classList.remove('hidden');
                    } else {
                        if (card.getAttribute('data-category') === category) {
                            card.classList.remove('hidden');
                        } else {
                            card.classList.add('hidden');
                        }
                    }
                });
                
                // Remove loading state
                productsGrid.classList.remove('loading');
            }, 200);
        });
    });

    // Smooth scroll to top when filter changes
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productsSection = document.querySelector('.products-section');
            const offset = 150; // Offset for sticky header
            const elementPosition = productsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all product cards
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
