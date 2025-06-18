document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    const body = document.body;
    
    let isScrolling = false;
    let scrollTimer = null;

    // Toggle sidebar on hamburger click
    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        
        // Prevent body scroll on mobile when sidebar is open
        if (window.innerWidth <= 430) {
            if (sidebar.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        }
    });

    // Handle sidebar dropdown toggles
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const category = this.getAttribute('data-category');
            const dropdown = document.getElementById(category + '-dropdown');

            if (!dropdown) return;

            const isCurrentlyOpen = dropdown.style.maxHeight && dropdown.style.maxHeight !== '0px';

            // Close all dropdowns first
            sidebarBtns.forEach(otherBtn => {
                const otherCategory = otherBtn.getAttribute('data-category');
                const otherDropdown = document.getElementById(otherCategory + '-dropdown');
                if (otherDropdown) {
                    otherDropdown.style.maxHeight = '0px';
                    otherBtn.classList.remove('active');
                }
            });

            // Toggle current dropdown
            if (!isCurrentlyOpen) {
                dropdown.style.maxHeight = dropdown.scrollHeight + "px";
                btn.classList.add('active');
            }
        });
    });

    // Function to show content and close sidebar/dropdowns on mobile
    function showContent(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show the selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Always close dropdowns
        sidebarBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.sidebar-dropdown').forEach(dropdown => {
            dropdown.style.maxHeight = '0px';
        });

        // On mobile, close sidebar and restore body scroll
        if (window.innerWidth <= 430) {
            sidebar.classList.remove('active');
            body.style.overflow = '';
        }
    }

    // Handle all navigation links
    document.querySelectorAll('a[data-section]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const section = this.getAttribute('data-section');
            const anchor = this.getAttribute('data-anchor');

            if (section) {
                showContent(section);

                if (anchor) {
                    // Scroll to anchor inside the section
                    setTimeout(() => {
                        const anchorTarget = document.getElementById(anchor);
                        if (anchorTarget) {
                            anchorTarget.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 300);
                }
            }
        });
    });

    // Detect if user is scrolling within sidebar
    sidebar.addEventListener('scroll', function() {
        isScrolling = true;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            isScrolling = false;
        }, 150);
    });

    // Improved outside click handler
    document.addEventListener('click', function (e) {
        // Don't close if user is scrolling
        if (isScrolling) return;
        
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnHamburger = hamburger.contains(e.target);

        if (!isClickInsideSidebar && !isClickOnHamburger && window.innerWidth <= 430) {
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                body.style.overflow = '';
                
                // Close dropdowns
                sidebarBtns.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.sidebar-dropdown').forEach(dropdown => {
                    dropdown.style.maxHeight = '0px';
                });
            }
        }
    });

    // Prevent sidebar interactions from bubbling
    sidebar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Handle touch events to prevent accidental closes during scrolling
    let touchStartY = 0;
    let touchEndY = 0;

    sidebar.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
        e.stopPropagation();
    });

    sidebar.addEventListener('touchmove', function(e) {
        e.stopPropagation();
    });

    sidebar.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        const touchDiff = Math.abs(touchEndY - touchStartY);
        
        // If there was significant touch movement, consider it scrolling
        if (touchDiff > 10) {
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 300);
        }
        
        e.stopPropagation();
    });

    // Resize handler
    function handleResize() {
        if (window.innerWidth > 430) {
            // Desktop view - restore body scroll and ensure sidebar behavior is correct
            body.style.overflow = '';
            sidebar.classList.remove('active');
        } else {
            // Mobile view - close sidebar
            if (sidebar.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                sidebar.classList.remove('active');
                body.style.overflow = '';
            }
        }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup function for dropdowns (optional, for better performance)
    function cleanupDropdowns() {
        document.querySelectorAll('.sidebar-dropdown').forEach(dropdown => {
            if (dropdown.style.maxHeight === '0px') {
                dropdown.style.maxHeight = null;
            }
        });
    }

    // Run cleanup periodically
    setInterval(cleanupDropdowns, 30000); // Every 30 seconds
});

// Standalone function for info boxes (unchanged)
function toggleInfo(id) {
    const box = document.getElementById(id);
    if (box) {
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }
}
