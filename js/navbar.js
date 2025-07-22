document.addEventListener("DOMContentLoaded", function () {
    const navSystems = ['#navbarTabs1', '#navbarTabs2', '#navbarTabs3', '#navbarTabs4'];

    navSystems.forEach(navId => {
        const nav = document.querySelector(navId);
        if (!nav) return;

        const navItems = nav.querySelectorAll('.nav-item');
        const underline = nav.querySelector('.underline');
        let activeItem = nav.querySelector('.nav-link.active')?.parentElement;

        function updateUnderline(el) {
            const containerRect = nav.getBoundingClientRect();
            const itemRect = el.getBoundingClientRect();    
            const offsetLeft = itemRect.left - containerRect.left;
            const offsetWidth = itemRect.width;

            if (!underline) return;
            underline.style.left = `${offsetLeft}px`;
            underline.style.width = `${offsetWidth}px`;
        }

        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const hasDropdown = link.getAttribute('data-bs-toggle') === 'dropdown';
            const dropdownIcon = link.querySelector('.dropdown');

            // Hover underline effect
            item.addEventListener("mouseenter", () => updateUnderline(item));
            item.addEventListener("mouseleave", () => {
                if (activeItem) updateUnderline(activeItem);
            });

            // Click to toggle dropdown and arrow
            link.addEventListener("click", function (e) {
                if (hasDropdown) {
                    e.preventDefault();

                    const isOpen = link.classList.contains('open');

                    // Close all other dropdowns in this nav
                    nav.querySelectorAll('.nav-link.open').forEach(openLink => {
                        if (openLink !== link) {
                            openLink.classList.remove('open');
                            const openIcon = openLink.querySelector('.dropdown');
                            if (openIcon) {
                                openIcon.style.transform = 'rotate(45deg)';
                            }
                        }
                    });

                    // Toggle current dropdown
                    if (isOpen) {
                        link.classList.remove('open');
                        if (dropdownIcon) dropdownIcon.style.transform = 'rotate(45deg)';
                    } else {
                        link.classList.add('open');
                        if (dropdownIcon) dropdownIcon.style.transform = 'rotate(226deg)';
                    }
                }

                // Active underline
                nav.querySelector('.nav-link.active')?.classList.remove("active");
                link.classList.add("active");
                activeItem = item;
                updateUnderline(item);
            });
        });

        // Underline on load and resize
        window.addEventListener("load", () => {
            if (activeItem) updateUnderline(activeItem);
        });

        window.addEventListener("resize", () => {
            if (activeItem) updateUnderline(activeItem);
        });
    });

    // Click outside to close dropdown and reset arrow
    document.addEventListener('click', function (event) {
        const openLinks = document.querySelectorAll('.nav-link.open');

        openLinks.forEach(link => {
            const navItem = link.closest('.nav-item');
            const dropdownMenu = navItem?.querySelector('.dropdown-menu');

            // If clicked outside the nav-link and its dropdown menu
            if (
                dropdownMenu &&
                !link.contains(event.target) &&
                !dropdownMenu.contains(event.target)
            ) {
                link.classList.remove('open');
                const icon = link.querySelector('.dropdown');
                if (icon) {
                    icon.style.transform = 'rotate(45deg)';
                }
            }
        });
    });
});
