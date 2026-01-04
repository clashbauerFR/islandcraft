// ===== NAVIGATION FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');

    // Mobile Navigation Toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });

    // Back to top functionality
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ===== COPY TO CLIPBOARD FUNCTIONALITY =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // Show success feedback
        showNotification('Server-IP kopiert!', 'success');
    }).catch(function(err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Server-IP kopiert!', 'success');
    });
}

function copyServerIP() {
    copyToClipboard('islandcraft.cluehosting.de');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== FAQ FUNCTIONALITY =====
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items in the same category
    const category = faqItem.closest('.faq-category');
    const allItems = category.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current item
    if (isActive) {
        faqItem.classList.remove('active');
    } else {
        faqItem.classList.add('active');
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00ffa3, #00d4ff)' : '#333'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        font-weight: 500;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== SERVER STATUS CHECKER =====
async function checkServerStatus() {
    try {
        // Use a Minecraft server status API to get real data
        const response = await fetch(`https://api.mcsrvstat.us/3/islandcraft.cluehosting.de`);
        const data = await response.json();
        
        if (data.online) {
            const serverData = {
                online: true,
                players: {
                    online: data.players ? data.players.online : 0,
                    max: data.players ? data.players.max : 100,
                    list: data.players && data.players.list ? data.players.list.map(player => ({
                        name: player.name || player,
                        skin: `https://mc-heads.net/avatar/${player.name || player}/24`
                    })) : []
                }
            };
            updateServerStatus(serverData);
        } else {
            updateServerStatus({ online: false });
        }
    } catch (error) {
        console.error('Error checking server status:', error);
        // Show offline status on error
        updateServerStatus({ online: false });
    }
}

function updateServerStatus(data) {
    // Update main status display
    const mcCountElement = document.getElementById('mcCount');
    const playersCountElement = document.getElementById('playersCount');
    const playersListElement = document.getElementById('playersList');
    const serverPlayerCountElement = document.getElementById('serverPlayerCount');
    const footerStatusElement = document.getElementById('footerStatus');

    if (data.online) {
        if (mcCountElement) mcCountElement.textContent = `${data.players.online}/${data.players.max} Spieler`;
        if (playersCountElement) playersCountElement.textContent = data.players.online;
        if (serverPlayerCountElement) serverPlayerCountElement.textContent = `Online - ${data.players.online}/${data.players.max} Spieler`;
        if (footerStatusElement) {
            footerStatusElement.textContent = 'Online';
            footerStatusElement.className = 'value online';
        }

        // Update players list
        if (playersListElement) {
            if (data.players.list && data.players.list.length > 0) {
                playersListElement.innerHTML = data.players.list.map(player => `
                    <div class="player-item">
                        <img src="${player.skin}" alt="${player.name}" class="player-skin" onerror="this.style.display='none'">
                        <span class="player-name">${player.name}</span>
                    </div>
                `).join('');
            } else {
                playersListElement.innerHTML = '<div class="no-players">Keine Spieler online</div>';
            }
        }
    } else {
        if (mcCountElement) mcCountElement.textContent = 'Offline';
        if (playersCountElement) playersCountElement.textContent = '0';
        if (serverPlayerCountElement) serverPlayerCountElement.textContent = 'Offline';
        if (footerStatusElement) {
            footerStatusElement.textContent = 'Offline';
            footerStatusElement.className = 'value offline';
        }
        if (playersListElement) {
            playersListElement.innerHTML = '<div class="no-players">Server ist offline</div>';
        }
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.info-card, .feature-card, .step');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ===== PARTICLE SYSTEM (Optional Enhancement) =====
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 212, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
        `;
        hero.appendChild(particle);
    }
}

// ===== TYPING EFFECT FOR HERO SUBTITLE =====
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1500);
}

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 500);
        }
    }, 2000);
}

// ===== MODAL FUNCTIONALITY =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Modal event listeners
document.addEventListener('click', function(e) {
    // Close modal when clicking outside
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Close modal when clicking close button
    if (e.target.hasAttribute('data-close')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
});

// ===== COUNTDOWN TIMERS =====
function initCountdowns() {
    const countdowns = document.querySelectorAll('.event-countdown');
    
    countdowns.forEach(countdown => {
        const targetDate = new Date(countdown.getAttribute('data-date')).getTime();
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                const daysEl = countdown.querySelector('[data-days]');
                const hoursEl = countdown.querySelector('[data-hours]');
                const minutesEl = countdown.querySelector('[data-minutes]');
                const secondsEl = countdown.querySelector('[data-seconds]');
                
                if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
                if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
            } else {
                // Event has started/ended
                countdown.innerHTML = '<div class="countdown-ended">Event gestartet!</div>';
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

// ===== COOKIE BANNER =====
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    
    // Check if user has already made a choice
    if (!localStorage.getItem('cookieChoice')) {
        setTimeout(() => {
            if (cookieBanner) {
                cookieBanner.classList.add('show');
            }
        }, 3000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieChoice', 'accepted');
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
    showNotification('Cookies akzeptiert!', 'success');
}

function declineCookies() {
    localStorage.setItem('cookieChoice', 'declined');
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
    showNotification('Cookies abgelehnt!', 'info');
}

// ===== HERO CANVAS ANIMATION =====
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle system
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize hero canvas animation
    initHeroCanvas();
    
    // Initialize countdown timers
    initCountdowns();
    
    // Initialize cookie banner
    initCookieBanner();
    
    // Check server status on load
    checkServerStatus();
    
    // Update server status every 30 seconds
    setInterval(checkServerStatus, 30000);
    
    // Initialize scroll animations
    initScrollAnimations();
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-based animations can be added here
}, 16)); // ~60fps

// ===== EASTER EGGS =====
// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        // Easter egg activated!
        showNotification('🎉 Konami Code aktiviert! Du bist ein echter Gamer!', 'success');
        // Add some fun effects
        document.body.style.animation = 'rainbow 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
    // ===== STATS COUNTER ANIMATION =====
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-count'));
                    const duration = 2000; // 2 seconds
                    const increment = finalValue / (duration / 16); // 60fps
                    let current = 0;
                    
                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= finalValue) {
                            target.textContent = finalValue.toLocaleString();
                            clearInterval(counter);
                        } else {
                            target.textContent = Math.floor(current).toLocaleString();
                        }
                    }, 16);
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    // Initialize stats animation
    animateStats();

    // ===== ADVENTURE CARDS ANIMATION =====
    function initAdventureAnimations() {
        const adventureCards = document.querySelectorAll('.adventure-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        adventureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    // Initialize adventure animations
    initAdventureAnimations();

    // ===== PROGRESS BAR ANIMATION =====
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 300);
                    
                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    // Initialize progress bar animations
    animateProgressBars();

    // ===== ADVENTURE CARD HOVER EFFECTS =====
    document.querySelectorAll('.adventure-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== EPIC GLOW EFFECT =====
    function createGlowEffect() {
        const adventureCards = document.querySelectorAll('.adventure-card.legendary, .adventure-card.mythic');
        
        adventureCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
            });
        });
    }

    // Initialize glow effects
    createGlowEffect();