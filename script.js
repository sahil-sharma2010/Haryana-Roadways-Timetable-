// === AUTH GUARD (Check if Logged In First) ===
if (localStorage.getItem('hr_logged_in') !== 'true') {
    window.location.href = 'login.html';
}

// === MULTI-LANGUAGE TOGGLE LOGIC FOR MODALS ===
window.toggleLang = function(modalType) {
    const en = document.getElementById(modalType + '-en');
    const hi = document.getElementById(modalType + '-hi');
    const btn = document.getElementById(modalType + '-btn');
    if (en && hi && btn) {
        if (en.style.display !== 'none') {
            en.style.display = 'none';
            hi.style.display = 'block';
            btn.innerText = 'English';
        } else {
            en.style.display = 'block';
            hi.style.display = 'none';
            btn.innerText = 'हिंदी';
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // PREMIUM WELCOME BACK POPUP LOGIC
    // =========================================================
    if (localStorage.getItem('hr_logged_in') === 'true' && localStorage.getItem('hr_welcome_shown') !== 'true') {
        const userName = localStorage.getItem('hr_user_name') || 'USER';
        Swal.fire({
            title: `WELCOME BACK ${userName.toUpperCase()}`,
            text: "Continue your journey.",
            confirmButtonText: "Thanks",
            confirmButtonColor: "#5eb063",
            customClass: { popup: 'glass-swal', title: 'glass-swal-title', htmlContainer: 'glass-swal-text' }
        });
        localStorage.setItem('hr_welcome_shown', 'true');
    }

    // Logout Logic
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('hr_logged_in');
            localStorage.removeItem('hr_welcome_shown'); // Reset welcome state
            window.location.href = 'login.html';
        });
    }

    // =========================================================
    // BUS TIMETABLE JSON FROM IMAGES (12-Hour AM/PM format)
    // =========================================================
    const busData = [
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "05:20 AM", time24: "05:20", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Sirsa", to: "Gurugram", via: "Hansi", departure: "07:53 AM", time24: "07:53", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "09:30 AM", time24: "09:30", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "10:00 AM", time24: "10:00", busType: "Haryana Roadways AC", arr: "TBD", fare: "Premium" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "10:40 AM", time24: "10:40", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Ganganagar", to: "Bahadurgarh", via: "Hansi", departure: "10:45 AM", time24: "10:45", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Sirsa", to: "Gurugram", via: "Hansi", departure: "11:00 AM", time24: "11:00", busType: "Haryana Roadways AC", arr: "TBD", fare: "Premium" },
        { from: "Hisar", to: "Bahadurgarh", via: "Hansi", departure: "11:15 AM", time24: "11:15", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Bahadurgarh", via: "Hansi", departure: "11:50 AM", time24: "11:50", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "12:00 PM", time24: "12:00", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Sirsa", to: "Gurugram", via: "Hansi", departure: "12:04 PM", time24: "12:04", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "12:10 PM", time24: "12:10", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Bahadurgarh", via: "Hansi", departure: "12:20 PM", time24: "12:20", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Palwal", via: "Hansi", departure: "12:30 PM", time24: "12:30", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Bahadurgarh", via: "Hansi", departure: "01:00 PM", time24: "13:00", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Bahadurgarh", via: "Hansi", departure: "01:10 PM", time24: "13:10", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "01:30 PM", time24: "13:30", busType: "Haryana Roadways AC", arr: "TBD", fare: "Premium" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "01:40 PM", time24: "13:40", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "02:00 PM", time24: "14:00", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Sirsa", to: "Bahadurgarh", via: "Hansi", departure: "02:10 PM", time24: "14:10", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "02:45 PM", time24: "14:45", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "03:10 PM", time24: "15:10", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "03:40 PM", time24: "15:40", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "03:45 PM", time24: "15:45", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Sirsa", to: "Gurugram", via: "Hansi", departure: "05:30 PM", time24: "17:30", busType: "Haryana Roadways AC", arr: "TBD", fare: "Premium" },
        { from: "Sirsa", to: "Gurugram", via: "Hansi", departure: "07:00 PM", time24: "19:00", busType: "Haryana Roadways AC", arr: "TBD", fare: "Premium" },

        // --- HISAR TO MUNDHAL & MUNDHAL TO HISAR ---
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "05:10 AM", time24: "05:10", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "05:45 AM", time24: "05:45", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "06:15 AM", time24: "06:15", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "06:40 AM", time24: "06:40", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "07:15 AM", time24: "07:15", busType: "Haryana Roadways AC", arr: "TBD", fare: "Premium" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "07:50 AM", time24: "07:50", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "08:20 AM", time24: "08:20", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "08:50 AM", time24: "08:50", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "09:15 AM", time24: "09:15", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "09:45 AM", time24: "09:45", busType: "Haryana Roadways AC", arr: "TBD", fare: "Premium" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "10:20 AM", time24: "10:20", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "10:50 AM", time24: "10:50", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "11:20 AM", time24: "11:20", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "11:55 AM", time24: "11:55", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "12:30 PM", time24: "12:30", busType: "Haryana Roadways AC", arr: "TBD", fare: "Premium" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "01:10 PM", time24: "13:10", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "01:45 PM", time24: "13:45", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "02:20 PM", time24: "14:20", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "03:00 PM", time24: "15:00", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "03:30 PM", time24: "15:30", busType: "Haryana Roadways AC", arr: "TBD", fare: "Premium" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "04:10 PM", time24: "16:10", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "04:45 PM", time24: "16:45", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "05:20 PM", time24: "17:20", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "05:55 PM", time24: "17:55", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "06:30 PM", time24: "18:30", busType: "Haryana Roadways AC", arr: "TBD", fare: "Premium" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "07:10 PM", time24: "19:10", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        { from: "Hisar", to: "Mundhal", via: "Hansi", departure: "08:00 PM", time24: "20:00", busType: "Haryana Roadways", arr: "TBD", fare: "Standard" },
        
    ];
    const form = document.getElementById('searchForm');
    const sourceInput = document.getElementById('source');
    const destInput = document.getElementById('destination');
    const swapBtn = document.getElementById('swapBtn');
    
    const errorPopup = document.getElementById('errorPopup');
    const loadingDiv = document.getElementById('loadingDiv');
    const resultsTableWrapper = document.getElementById('resultsTableWrapper');
    const tableBody = document.getElementById('tableBody');
    const resultHeaderText = document.getElementById('resultHeaderText');
    
    const themeToggle = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');
    const marqueeText = document.getElementById('marqueeText');

    // === SWAP BUTTON LOGIC ===
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            let temp = sourceInput.value;
            sourceInput.value = destInput.value;
            destInput.value = temp;
        });
    }

    // === T&C Modal Logic ===
    const tncModal = document.getElementById('tncModal');
    const openTncBtn = document.getElementById('openTncBtn');
    const closeTncBtn = document.getElementById('closeTncBtn');
    const agreeTncModalCheckbox = document.getElementById('agreeTncModal');
    const acceptTncBtn = document.getElementById('acceptTncBtn');

    if (agreeTncModalCheckbox && localStorage.getItem('hr_tnc_accepted') === 'true') {
        agreeTncModalCheckbox.checked = true;
        agreeTncModalCheckbox.disabled = true;
    }

    if (openTncBtn && tncModal) {
        openTncBtn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            tncModal.classList.add('active'); 
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeTncBtn && tncModal) {
        closeTncBtn.addEventListener('click', () => { 
            tncModal.classList.remove('active'); 
            document.body.style.overflow = 'auto';
        });
    }

    if (acceptTncBtn && tncModal && agreeTncModalCheckbox && errorPopup) {
        acceptTncBtn.addEventListener('click', () => {
            if (!agreeTncModalCheckbox.checked) {
                alert("Please tick the checkbox to agree to the Terms & Conditions.");
                return;
            }
            tncModal.classList.remove('active'); 
            document.body.style.overflow = 'auto';
            errorPopup.classList.remove('show'); 
        });
    }

    // === Live Bus Tracker for Marquee ===
    function updateLiveMarquee() {
        if (!marqueeText) return;
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();
        let upcomingBuses = "";
        let addedRoutes = new Set(); 

        busData.forEach(bus => {
            const parts = bus.time24.split(':');
            if(parts.length === 2) {
                const busHour = parseInt(parts[0], 10);
                const busMin = parseInt(parts[1], 10);
                const busTotalMins = (busHour * 60) + busMin;
                const diff = busTotalMins - currentMins;
                
                const routeName = `${bus.from}-${bus.to}`;

                if (diff > 0 && diff <= 60 && !addedRoutes.has(routeName)) {
                    upcomingBuses += ` &nbsp;&nbsp;&nbsp;&nbsp; 🚌 ${bus.from} &rarr; ${bus.to} | Departure in ${diff} Minutes | ${bus.departure} | Via: ${bus.via} `;
                    addedRoutes.add(routeName); 
                }
            }
        });

        if (upcomingBuses !== "") {
            marqueeText.innerHTML = `<span class="alert-text">${upcomingBuses}</span>`;
        } else {
            marqueeText.innerHTML = ``;
        }
    }
    updateLiveMarquee();
    setInterval(updateLiveMarquee, 30000); 

    // === Dark Mode ===
    if (themeToggle && iconSun && iconMoon) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.body.removeAttribute('data-theme');
                iconSun.style.opacity = '1'; iconMoon.style.opacity = '0.5';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                iconSun.style.opacity = '0.5'; iconMoon.style.opacity = '1';
            }
        });
    }

    // =========================================================
    // STRICT EXACT ROUTE VALIDATION & SEARCH SUBMISSION
    // =========================================================
    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = ''; 
        data.forEach((bus, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><i class="fa-regular fa-clock"></i> <strong style="color: var(--primary-blue);">${bus.departure}</strong></td>
                <td>${bus.from} &rarr; ${bus.to}</td>
                <td>${bus.via}</td>
                <td><span style="color: #4a914f; font-weight: 500;">${bus.busType}</span></td>
                <td>${bus.arr || 'TBD'}</td>
                <td>${bus.fare || 'Standard'}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            if (agreeTncModalCheckbox && !agreeTncModalCheckbox.checked) {
                if(errorPopup) {
                    errorPopup.classList.add('show');
                    setTimeout(() => { errorPopup.classList.remove('show'); }, 4000);
                }
                return; 
            }
            
            if (errorPopup) errorPopup.classList.remove('show'); 
            
            const fromVal = sourceInput ? sourceInput.value.trim().toLowerCase() : "";
            const toVal = destInput ? destInput.value.trim().toLowerCase() : "";

            // Clear previous results immediately
            if (resultsTableWrapper) resultsTableWrapper.style.display = 'none';
            if (tableBody) tableBody.innerHTML = '';

            // PREMIUM 5-SECOND ANIMATION LOADER
            if (loadingDiv) loadingDiv.style.display = 'flex';

            setTimeout(() => {
                if (loadingDiv) loadingDiv.style.display = 'none';

                // STRICT EXACT MATCHING: BOTH From and To must match perfectly
                const results = busData.filter(bus => {
                    const bFrom = bus.from.toLowerCase().trim();
                    const bTo = bus.to.toLowerCase().trim();
                    return bFrom === fromVal && bTo === toVal;
                });

                if (results.length > 0) {
                    if(resultHeaderText) resultHeaderText.innerText = `Search Results for: ${sourceInput.value.toUpperCase()} to ${destInput.value.toUpperCase()}`;
                    renderTable(results);
                    if (resultsTableWrapper) resultsTableWrapper.style.display = 'block';
                } else {
                    // SHOW PREMIUM SWEETALERT2 POPUP FOR UNKNOWN ROUTE
                    Swal.fire({
                        icon: 'info',
                        title: 'Route Unavailable',
                        text: 'Sorry, currently this route is under maintenance.',
                        timer: 4000,
                        timerProgressBar: true,
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#0b4595',
                        backdrop: `rgba(0,0,0,0.5)`,
                        customClass: { popup: 'glass-swal', title: 'glass-swal-title', htmlContainer: 'glass-swal-text' }
                    });
                }
            }, 5000); // Changed to exactly 5 seconds (5000ms)
        });
    }

    // =========================================================
    // GLASSMORPHISM MODALS (Privacy & Disclaimer)
    // =========================================================
    const openPrivacyBtn = document.getElementById("openPrivacyBtn");
    const openDisclaimerBtn = document.getElementById("openDisclaimerBtn");
    const privacyModal = document.getElementById("privacyModal");
    const disclaimerModal = document.getElementById("disclaimerModal");
    const closePrivacyBtn = document.getElementById("closePrivacyBtn");
    const closeDisclaimerBtn = document.getElementById("closeDisclaimerBtn");
    const closePrivacyAction = document.querySelector(".close-privacy-action");
    const closeDisclaimerAction = document.querySelector(".close-disclaimer-action");

    const openModal = (modal) => {
        if(modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; 
        }
    };
    
    const closeModal = (modal) => {
        if(modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto"; 
        }
    };

    if (openPrivacyBtn && privacyModal) {
        openPrivacyBtn.addEventListener("click", (e) => { e.preventDefault(); openModal(privacyModal); });
    }
    
    if (openDisclaimerBtn && disclaimerModal) {
        openDisclaimerBtn.addEventListener("click", (e) => { e.preventDefault(); openModal(disclaimerModal); });
    }

    if (closePrivacyBtn) closePrivacyBtn.addEventListener("click", () => closeModal(privacyModal));
    if (closePrivacyAction) closePrivacyAction.addEventListener("click", () => closeModal(privacyModal));
    if (closeDisclaimerBtn) closeDisclaimerBtn.addEventListener("click", () => closeModal(disclaimerModal));
    if (closeDisclaimerAction) closeDisclaimerAction.addEventListener("click", () => closeModal(disclaimerModal));

    window.addEventListener("click", (e) => {
        if (e.target === privacyModal) closeModal(privacyModal);
        if (e.target === disclaimerModal) closeModal(disclaimerModal);
        if (tncModal && e.target === tncModal) {
            tncModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (privacyModal && privacyModal.classList.contains("active")) closeModal(privacyModal);
            if (disclaimerModal && disclaimerModal.classList.contains("active")) closeModal(disclaimerModal);
            if (tncModal && tncModal.classList.contains('active')) {
                tncModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
});
