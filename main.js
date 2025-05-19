document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    const sidebarLinks = document.querySelectorAll('.sidebar-dropdown a');

    // Toggle sidebar on hamburger click
    hamburger.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    // Handle sidebar dropdown toggles
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // prevent bubbling so it doesn't trigger outside click
            const category = this.getAttribute('data-category');
            const dropdown = document.getElementById(category + '-dropdown');

            // Toggle this dropdown
            if (dropdown.style.maxHeight) {
                dropdown.style.maxHeight = null;
            } else {
                dropdown.style.maxHeight = dropdown.scrollHeight + "px";
            }

            // Close others
            sidebarBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    const otherCategory = otherBtn.getAttribute('data-category');
                    const otherDropdown = document.getElementById(otherCategory + '-dropdown');
                    if (otherDropdown) {
                        otherDropdown.style.maxHeight = null;
                    }
                }
            });
        });
    });

    // Function to show content and close sidebar/dropdowns on mobile
    function showContent(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show the one selected
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Always close dropdowns
        document.querySelectorAll('.sidebar-dropdown').forEach(dropdown => {
            dropdown.style.maxHeight = null;
        });

        // On mobile, close sidebar
        if (window.innerWidth <= 430) {
            sidebar.classList.remove('active');
        }
    }

    // More robust: target all links that have a data-section attribute
document.querySelectorAll('a[data-section]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

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

        // 🔒 Always close sidebar on mobile, even if section is invalid
        if (window.innerWidth <= 430) {
            sidebar.classList.remove('active');
            document.querySelectorAll('.sidebar-dropdown').forEach(dropdown => {
                dropdown.style.maxHeight = null;
            });
        }
    });
});


    // Close sidebar and dropdowns when clicking outside (on mobile only)
    document.addEventListener('click', function (e) {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnHamburger = hamburger.contains(e.target);

        if (!isClickInsideSidebar && !isClickOnHamburger && window.innerWidth <= 430) {
            // Close sidebar and dropdowns
            sidebar.classList.remove('active');
            document.querySelectorAll('.sidebar-dropdown').forEach(dropdown => {
                dropdown.style.maxHeight = null;
            });
        }
    });

    // Prevent sidebar clicks from bubbling up to the outside click handler
    sidebar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Initial screen setup
    function handleResize() {
        if (window.innerWidth <= 430) {
            sidebar.classList.remove('active'); // hide on mobile
        }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
});

function toggleInfo(id) {
    const box = document.getElementById(id);
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }
