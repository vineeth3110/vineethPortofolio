
document.addEventListener("DOMContentLoaded", function () {

    // 1. Update the scroll progress bar

    const progressBar = document.getElementById("scrollProgressBar");

    function updateScrollProgress() {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progressBar.style.width = progress + "%";
    }

    window.addEventListener("scroll", updateScrollProgress, {
        passive: true
    });

    window.addEventListener("resize", updateScrollProgress);
    updateScrollProgress();


    // 2. Reveal sections and cards when they enter the screen

    const revealSelectors = [
        ".section-heading",
        ".about-text",
        ".stat",
        ".skill-card",
        ".tools",
        ".project-card",
        ".timeline-item",
        ".certificate",
        ".contact-intro",
        ".contact-card"
    ];

    const revealElements = document.querySelectorAll(
        revealSelectors.join(", ")
    );

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -25px 0px"
            }
        );

        revealElements.forEach(function (element, index) {

            element.classList.add("js-reveal");

            element.style.setProperty(
                "--reveal-delay",
                (index % 3) * 100 + "ms"
            );

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });

    }


    // 3. Animate statistic numbers when they become visible

    const counters = document.querySelectorAll("[data-count]");

    function animateCounter(counter) {

        const target = Number(counter.dataset.count);
        const start = Number(counter.dataset.start || 0);
        const decimals = Number(counter.dataset.decimals || 0);
        const suffix = counter.dataset.suffix || "";
        const duration = 1500;
        const startTime = performance.now();

        function updateNumber(currentTime) {

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out makes the animation slow down near the end
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue =
                start + (target - start) * easedProgress;

            counter.textContent =
                currentValue.toFixed(decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                counter.textContent =
                    target.toFixed(decimals) + suffix;
            }

        }

        requestAnimationFrame(updateNumber);
    }

    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }

                });

            },
            { threshold: 0.6 }
        );

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });

    }


    // 4. Mobile navigation menu

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    menuToggle.addEventListener("click", function () {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";

    });

    // Close the menu after clicking a navigation link

    navLinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });

    });


    // 5. Highlight the current navigation section

    const sections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll(".nav-links a");

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        navigationLinks.forEach(function (link) {
                            link.classList.remove("active");
                        });

                        const activeLink = document.querySelector(
                            '.nav-links a[href="#' + entry.target.id + '"]'
                        );

                        if (activeLink) {
                            activeLink.classList.add("active");
                        }

                    }

                });

            },
            {
                rootMargin: "-30% 0px -60% 0px"
            }
        );

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });

    }


    // 6. Automatically update the footer year

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

});
