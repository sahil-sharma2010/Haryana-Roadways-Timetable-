// === AUTH GUARD ===
if (localStorage.getItem('hr_logged_in') !== 'true') {
    window.location.href = 'login.html';
}

document.addEventListener("DOMContentLoaded", () => {
    // Welcome Popup
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

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('hr_logged_in');
            localStorage.removeItem('hr_welcome_shown');
            window.location.href = 'login.html';
        });
    }

    // =========================================================
    // REAL LATEST BUS TIMETABLE DATA FROM IMAGES (WITH AM/PM)
    // =========================================================
    const busData = [
        // === HISAR TO GURUGRAM ===
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "05:10 AM", time24: "05:10", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "06:00 AM", time24: "06:00", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "06:40 AM", time24: "06:40", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "06:50 AM", time24: "06:50", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "07:00 AM", time24: "07:00", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "07:16 AM", time24: "07:16", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "07:40 AM", time24: "07:40", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "08:10 AM", time24: "08:10", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "08:40 AM", time24: "08:40", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "08:50 AM", time24: "08:50", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "09:08 AM", time24: "09:08", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "09:40 AM", time24: "09:40", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "10:40 AM", time24: "10:40", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "11:00 AM", time24: "11:00", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "11:30 AM", time24: "11:30", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "12:04 PM", time24: "12:04", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "KMP",   departure: "01:20 PM", time24: "13:20", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "KMP",   departure: "02:20 PM", time24: "14:20", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "KMP",   departure: "02:50 PM", time24: "14:50", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "KMP",   departure: "03:20 PM", time24: "15:20", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "KMP",   departure: "04:30 PM", time24: "16:30", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "05:20 PM", time24: "17:20", busType: "Ordinary", arr: "HR" },

        // === HISAR TO DELHI ===
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "12:50 AM", time24: "00:50", busType: "Ordinary", arr: "RSRTC" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "01:30 AM", time24: "01:30", busType: "Ordinary", arr: "RSRTC" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "02:03 AM", time24: "02:03", busType: "Ordinary", arr: "RSRTC" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "03:50 AM", time24: "03:50", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:00 AM", time24: "04:00", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:10 AM", time24: "04:10", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:18 AM", time24: "04:18", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:36 AM", time24: "04:36", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:44 AM", time24: "04:44", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:00 AM", time24: "05:00", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:10 AM", time24: "05:10", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:30 AM", time24: "05:30", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:40 AM", time24: "05:40", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:48 AM", time24: "05:48", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:10 AM", time24: "06:10", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:32 AM", time24: "06:32", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:40 AM", time24: "06:40", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:55 AM", time24: "06:55", busType: "HVAC", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:04 AM", time24: "07:04", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:12 AM", time24: "07:12", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:28 AM", time24: "07:28", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:36 AM", time24: "07:36", busType: "HVAC", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:44 AM", time24: "07:44", busType: "Ordinary", arr: "PRTC" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:00 AM", time24: "08:00", busType: "HVAC", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:24 AM", time24: "08:24", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "09:04 AM", time24: "09:04", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "09:20 AM", time24: "09:20", busType: "HVAC", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "10:00 AM", time24: "10:00", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "11:36 AM", time24: "11:36", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "12:08 PM", time24: "12:08", busType: "HVAC", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "01:28 PM", time24: "13:28", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "02:16 PM", time24: "14:16", busType: "HVAC", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "03:20 PM", time24: "15:20", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:00 PM", time24: "16:00", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:28 PM", time24: "16:28", busType: "HVAC", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:48 PM", time24: "16:48", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:45 PM", time24: "17:45", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:50 PM", time24: "18:50", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:05 PM", time24: "20:05", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "10:20 PM", time24: "22:20", busType: "Ordinary", arr: "HR" }
    ];

    const form = document.getElementById('searchForm');
    const sourceInput = document.getElementById('source');
    const destInput = document.getElementById('destination');
    const loadingDiv = document.getElementById('loadingDiv');
    const resultsTableWrapper = document.getElementById('resultsTableWrapper');
    const tableBody = document.getElementById('tableBody');
    const marqueeText = document.getElementById('marqueeText');

    function updateLiveMarquee() {
        if (!marqueeText) return;
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();
        let upcomingBuses = "";
        let addedRoutes = new Set(); 

        busData.forEach(bus => {
            const parts = bus.time24.split(':');
            if(parts.length === 2) {
                const busTotalMins = (parseInt(parts[0], 10) * 60) + parseInt(parts[1], 10);
                const diff = busTotalMins - currentMins;
                const routeName = `${bus.from}-${bus.to}`;

                if (diff > 0 && diff <= 60 && !addedRoutes.has(routeName)) {
                    upcomingBuses += ` &nbsp;&nbsp;&nbsp;&nbsp; 🚌 ${bus.from} &rarr; ${bus.to} | Departs in ${diff} Mins | ${bus.departure} | Type: ${bus.busType} `;
                    addedRoutes.add(routeName); 
                }
            }
        });
        marqueeText.innerHTML = upcomingBuses !== "" ? `<span class="alert-text">${upcomingBuses}</span>` : ``;
    }
    updateLiveMarquee();
    setInterval(updateLiveMarquee, 20000); 

    const themeToggle = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                iconSun.style.opacity = '1'; iconMoon.style.opacity = '0.5';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                iconSun.style.opacity = '0.5'; iconMoon.style.opacity = '1';
            }
        });
    }

    function renderTable(data) {
        tableBody.innerHTML = ''; 
        data.forEach((bus, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><i class="fa-regular fa-clock"></i> <strong style="color: var(--primary-blue);">${bus.departure}</strong></td>
                <td>${bus.from} &rarr; ${bus.to}</td>
                <td>${bus.via}</td>
                <td><span style="color: #4a914f; font-weight: 600;">${bus.busType}</span></td>
                <td>${bus.arr || 'TBD'}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            // Check Persistent T&C
            const tncAccepted = localStorage.getItem('hr_tnc_accepted') === 'true';
            const errorPopup = document.getElementById('errorPopup');
            const agreeTncModal = document.getElementById('agreeTncModal');
            
            if (!tncAccepted && agreeTncModal && !agreeTncModal.checked) {
                if(errorPopup) {
                    errorPopup.classList.add('show');
                    setTimeout(() => { errorPopup.classList.remove('show'); }, 4000);
                }
                return;
            }
            if(errorPopup) errorPopup.classList.remove('show');
            
            const fromVal = sourceInput.value.trim().toLowerCase();
            const toVal = destInput.value.trim().toLowerCase();

            resultsTableWrapper.style.display = 'none';
            tableBody.innerHTML = '';
            loadingDiv.style.display = 'flex'; 

            // 5 SECONDS DELAY
            setTimeout(() => {
                loadingDiv.style.display = 'none';

                // EXACT MATCHING
                const results = busData.filter(bus => {
                    const bFrom = bus.from.toLowerCase().trim();
                    const bTo = bus.to.toLowerCase().trim();
                    return bFrom === fromVal && bTo === toVal;
                });

                if (results.length > 0) {
                    renderTable(results);
                    resultsTableWrapper.style.display = 'block';
                } else {
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
            }, 5000); 
        });
    }

    // === SEE ALL ROUTES LOGIC ===
    const openSeeAllRoutesBtn = document.getElementById("openSeeAllRoutesBtn");
    const allRoutesModal = document.getElementById("allRoutesModal");
    const closeAllRoutesBtn = document.getElementById("closeAllRoutesBtn");
    const cityBtns = document.querySelectorAll(".city-btn");
    const hisarRoutesList = document.getElementById("hisarRoutesList");

    if (openSeeAllRoutesBtn && allRoutesModal) {
        openSeeAllRoutesBtn.addEventListener("click", () => {
            allRoutesModal.classList.add("active");
            hisarRoutesList.classList.add("hidden"); 
        });
    }
    if (closeAllRoutesBtn && allRoutesModal) {
        closeAllRoutesBtn.addEventListener("click", () => allRoutesModal.classList.remove("active"));
    }

    cityBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const city = btn.getAttribute("data-city");
            if (city === "Jind" || city === "Bhiwani") {
                hisarRoutesList.classList.add("hidden");
                Swal.fire({
                    icon: 'warning',
                    title: 'Under Maintenance',
                    text: `Sorry, routes from ${city} are currently under maintenance.`,
                    confirmButtonColor: '#0b4595',
                    customClass: { popup: 'glass-swal', title: 'glass-swal-title', htmlContainer: 'glass-swal-text' }
                });
            } else if (city === "Hisar") {
                hisarRoutesList.classList.remove("hidden");
            }
        });
    });

    // === Persistent T&C Handling ===
    const tncModal = document.getElementById('tncModal');
    const openTncBtn = document.getElementById('openTncBtn');
    const closeTncBtn = document.getElementById('closeTncBtn');
    if (openTncBtn && tncModal) openTncBtn.addEventListener('click', (e) => { e.preventDefault(); tncModal.classList.add('active'); });
    if (closeTncBtn && tncModal) closeTncBtn.addEventListener('click', () => tncModal.classList.remove('active'));

    const acceptTncBtn = document.getElementById('acceptTncBtn');
    const agreeTncModal = document.getElementById('agreeTncModal');
    
    // Auto check if already accepted
    if (agreeTncModal && localStorage.getItem('hr_tnc_accepted') === 'true') {
        agreeTncModal.checked = true;
    }

    if (acceptTncBtn && agreeTncModal) {
        acceptTncBtn.addEventListener('click', () => {
            if (!agreeTncModal.checked) {
                alert("Please tick the checkbox to agree to the Terms & Conditions.");
                return;
            }
            localStorage.setItem('hr_tnc_accepted', 'true'); // PERSIST T&C
            if(tncModal) tncModal.classList.remove('active');
            const errorPopup = document.getElementById('errorPopup');
            if(errorPopup) errorPopup.classList.remove('show');
        });
    }

    // Modal Background Clicks
    window.addEventListener("click", (e) => {
        if (e.target === tncModal) tncModal.classList.remove('active');
        if (e.target === allRoutesModal) allRoutesModal.classList.remove('active');
    });
});
