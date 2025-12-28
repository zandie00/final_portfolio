// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    mobileMenuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
});

mobileMenuClose.addEventListener('click', closeMobileMenu);

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close mobile menu when clicking nav links
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Smooth scroll for all nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Carousel functionality
let nextButton = document.getElementById('next');
let prevButton = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let listHTML = document.querySelector('.carousel .list');

if (nextButton) {
    nextButton.onclick = function(){
        showSlider('next');
    }
}

if (prevButton) {
    prevButton.onclick = function(){
        showSlider('prev');
    }
}

let unAcceptClick;
const showSlider = (type) => {
    nextButton.style.pointerEvents = 'none';
    prevButton.style.pointerEvents = 'none';

    carousel.classList.remove('prev', 'next');
    let items = document.querySelectorAll('.carousel .list .item');
    if (type === 'next'){
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    } else {
        let positionLast = items.length - 1;
        listHTML.prepend(items[positionLast]);
        carousel.classList.add('prev');
    }

    clearTimeout(unAcceptClick);
    unAcceptClick = setTimeout(() => {
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.info-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Theme Toggle - FIXED VERSION
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';

// Apply the appropriate class on page load
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
} else {
    body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
    // Toggle between dark and light mode
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
});

// Fade in mission cards when scrolled into view
const missionCards = document.querySelectorAll('.mission-card');
missionCards.forEach(card => observer.observe(card));

const scrollElements = document.querySelectorAll('.scroll-animate');
const scrollObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    },
    { threshold: 0.15 }
);
scrollElements.forEach(el => {
    scrollObserver.observe(el);
});

// Artifact Modal + Filter
const modal = document.getElementById("artifactModal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.querySelector(".modal-close");
const filter = document.getElementById('artifactFilter');
const artifactCards = document.querySelectorAll('.artifact-card');


document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        const src = btn.dataset.src;
        let content = "";

        if(type === "video") {
            content = `<video controls autoplay style="max-width:100%; height:auto;">
                           <source src="${src}" type="video/mp4">
                       </video>`;
        } else if(type === "image") {
            content = `<img src="${src}" alt="Artifact Image" style="max-width:100%; height:auto;">`;
        } else if(type === "ppt") {
            // Handle Google Slides embed links or local PPTX
            if(src.includes("docs.google.com/presentation")) {
                // Use src directly (assume it's a published embed link)
                content = `<iframe src="${src}" frameborder="0" style="width:100%; height:500px;" allowfullscreen></iframe>`;
            } else {
                // Local pptx: use Office Online Viewer
                const embedURL = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + '/' + src)}`;
                content = `<iframe src="${embedURL}" frameborder="0" style="width:100%; height:500px;" allowfullscreen></iframe>`;
            }
       } else if (type === "doc" || type === "module") {
    content = `
        <iframe 
            src="${src}"
            style="width:100%; height:80vh;" 
            frameborder="0">
        </iframe>
    `;
}


        modalContent.innerHTML = content;
        modal.style.display = "flex";
    });
});


modalClose.addEventListener("click", () => {
    modal.style.display = "none";
    modalContent.innerHTML = "";
});

window.addEventListener("click", (e) => {
    if(e.target === modal) {
        modal.style.display = "none";
        modalContent.innerHTML = "";
    }
});

// Artifact Filter
filter.addEventListener('change', () => {
    const type = filter.value;
    artifactCards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});