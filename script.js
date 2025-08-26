// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
	// Initialize AOS (Animate On Scroll)
	initAOS();
	
	// Initialize other functionality
	initActiveLinkHighlighting();
	initMobileMenu();
	initCurrentYear();
});

// Initialize AOS with reduced motion support
function initAOS() {
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	
	if (typeof AOS !== 'undefined') {
		AOS.init({
			duration: prefersReduced ? 0 : 600,
			offset: 80,
			easing: 'ease-out-cubic',
			once: true
		});
	}
}



// Active link highlighting using IntersectionObserver
function initActiveLinkHighlighting() {
	const sections = ['about', 'education', 'skills', 'projects', 'contact'];
	const navLinks = Array.from(document.querySelectorAll('.nav-link'));
	const sectionToLink = new Map();
	
	// Map sections to their corresponding nav links
	for (const id of sections) {
		const section = document.getElementById(id);
		if (section) {
			const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
			if (link) {
				sectionToLink.set(section, link);
			}
		}
	}
	
	// Create observer for active link highlighting
	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			const link = sectionToLink.get(entry.target);
			if (!link) return;
			
			if (entry.isIntersecting) {
				// Remove active state from all links
				navLinks.forEach(a => {
					a.classList.remove('text-gray-900', 'font-semibold');
					a.classList.add('text-gray-600');
				});
				
				// Add active state to current link
				link.classList.remove('text-gray-600');
				link.classList.add('text-gray-900', 'font-semibold');
			}
		});
	}, { 
		rootMargin: '-40% 0px -50% 0px', 
		threshold: 0.1 
	});
	
	// Observe all sections
	sectionToLink.forEach((_, section) => observer.observe(section));
}

// Mobile menu functionality
function initMobileMenu() {
	const menuBtn = document.getElementById('mobileMenuBtn');
	const mobileMenu = document.getElementById('mobileMenu');
	
	if (menuBtn && mobileMenu) {
		// Toggle mobile menu
		menuBtn.addEventListener('click', () => {
			mobileMenu.classList.toggle('hidden');
			
			// Update button aria-label
			const isOpen = !mobileMenu.classList.contains('hidden');
			menuBtn.setAttribute('aria-label', isOpen ? 'Close Menu' : 'Open Menu');
		});
		
		// Close mobile menu when clicking on nav links
		const mobileNavLinks = document.querySelectorAll('#mobileNavLinks a');
		mobileNavLinks.forEach(link => {
			link.addEventListener('click', () => {
				mobileMenu.classList.add('hidden');
				menuBtn.setAttribute('aria-label', 'Open Menu');
			});
		});
		
		// Close mobile menu when clicking outside
		document.addEventListener('click', (event) => {
			if (!menuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
				mobileMenu.classList.add('hidden');
				menuBtn.setAttribute('aria-label', 'Open Menu');
			}
		});
	}
}

// Set current year in footer
function initCurrentYear() {
	const yearElement = document.getElementById('year');
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear();
	}
}

// Smooth scrolling for navigation links
document.addEventListener('click', function(event) {
	if (event.target.matches('a[href^="#"]')) {
		event.preventDefault();
		const targetId = event.target.getAttribute('href');
		const targetElement = document.querySelector(targetId);
		
		if (targetElement) {
			const headerHeight = document.querySelector('header').offsetHeight;
			const targetPosition = targetElement.offsetTop - headerHeight - 20;
			
			window.scrollTo({
				top: targetPosition,
				behavior: 'smooth'
			});
		}
	}
});

// Add loading states to buttons
document.addEventListener('click', function(event) {
	if (event.target.matches('button, .btn-primary')) {
		const button = event.target;
		const originalText = button.textContent;
		
		// Add loading state
		button.disabled = true;
		button.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Loading...';
		
		// Reset after 2 seconds (simulate action)
		setTimeout(() => {
			button.disabled = false;
			button.textContent = originalText;
		}, 2000);
	}
});

// Add scroll progress indicator
function initScrollProgress() {
	const progressBar = document.createElement('div');
	progressBar.className = 'fixed top-0 left-0 w-0 h-1 bg-primary-600 z-50 transition-all duration-300';
	document.body.appendChild(progressBar);
	
	window.addEventListener('scroll', () => {
		const scrollTop = window.pageYOffset;
		const docHeight = document.body.scrollHeight - window.innerHeight;
		const scrollPercent = (scrollTop / docHeight) * 100;
		
		progressBar.style.width = scrollPercent + '%';
	});
}

// Initialize scroll progress on load
window.addEventListener('load', initScrollProgress);

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
	// Escape key closes mobile menu
	if (event.key === 'Escape') {
		const mobileMenu = document.getElementById('mobileMenu');
		if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
			mobileMenu.classList.add('hidden');
			document.getElementById('mobileMenuBtn').setAttribute('aria-label', 'Open Menu');
		}
	}
	
	// Tab key navigation improvements
	if (event.key === 'Tab') {
		document.body.classList.add('keyboard-navigation');
	}
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', function() {
	document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
	// Any scroll-based functionality can go here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Add error boundary for section loading
window.addEventListener('error', function(event) {
	console.error('Global error caught:', event.error);
	
	// Show user-friendly error message
	const errorDiv = document.createElement('div');
	errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
	errorDiv.textContent = 'Something went wrong. Please refresh the page.';
	document.body.appendChild(errorDiv);
	
	// Remove error message after 5 seconds
	setTimeout(() => {
		errorDiv.remove();
	}, 5000);
});
