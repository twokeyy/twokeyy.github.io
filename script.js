/* ============================================
   TWOCURRIAL LEARNING OPPORTUNITIES
   Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll-triggered Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach(el => {
        observer.observe(el);
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Parallax Effect on Hero Orbs ---
    const heroOrbs = document.querySelectorAll('.hero-orb');

    if (heroOrbs.length > 0 && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            heroOrbs.forEach((orb, i) => {
                const speed = (i + 1) * 10;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        }, { passive: true });
    }

    // --- Pricing Card Tilt Effect ---
    const pricingCards = document.querySelectorAll('.pricing-card');

    pricingCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = card.classList.contains('pricing-card-featured')
                ? `scale(1.03) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
                : `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = card.classList.contains('pricing-card-featured')
                ? 'scale(1.03)'
                : '';
        });
    });

    // --- Feature Card Glow on Hover ---
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(139, 92, 246, 0.06), var(--bg-card))`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });

    // --- Counter Animation for Stats ---
    const stats = document.querySelectorAll('.stat-number');
    let statAnimated = false;

    const animateStats = () => {
        if (statAnimated) return;
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            statAnimated = true;
            stats.forEach(stat => {
                stat.style.opacity = '0';
                stat.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    stat.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    stat.style.opacity = '1';
                    stat.style.transform = 'translateY(0)';
                }, 200 * Array.from(stats).indexOf(stat));
            });
        }
    };

    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats();

    console.log('🚀 Twocurrial Learning Opportunities — Loaded');
});
