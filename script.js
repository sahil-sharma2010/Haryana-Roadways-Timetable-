// === AUTH GUARD ===
if (localStorage.getItem('hr_logged_in') !== 'true') {
    window.location.href = 'login.html';
}

document.addEventListener("DOMContentLoaded", async () => {
    // Welcome Popup
    if (localStorage.getItem('hr_welcome_shown') !== 'true') {
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

    // Init Supabase & EmailJS
    let supabase = null;
    try {
        emailjs.init("K6cs_matxXu2begVg"); 
        const SUPABASE_URL = 'https://wapxdmpwvhcsrnfiodjd.supabase.co'; 
        const SUPABASE_ANON_KEY = 'sb_publishable_odtRBN3c0mV917RGbwCCKA_JuwKHVUU'; 
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) { console.error("Database connection failed", error); }

    // Logout Logic inside Settings
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('hr_logged_in');
            localStorage.removeItem('hr_welcome_shown');
            window.location.href = 'login.html';
        });
    }

    // =========================================================
    // SETTINGS MODAL & TABS LOGIC
    // =========================================================
    const btnOpenSettings = document.getElementById('btnOpenSettings');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const navItems = document.querySelectorAll('.setting-nav-item');
    const tabContents = document.querySelectorAll('.settings-tab-content');

    let currentUserData = null; // Store user details

    // Open Settings & Fetch Details
    if (btnOpenSettings) {
        btnOpenSettings.addEventListener('click', async () => {
            settingsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Fetch User Details logic using logged-in username
            if (supabase && !currentUserData) {
                const userName = localStorage.getItem('hr_user_name');
                if (userName) {
                    const { data } = await supabase.from('users').select('*').eq('name', userName).order('id', {ascending: false}).limit(1).maybeSingle();
                    if (data) {
                        currentUserData = data;
                        document.getElementById('dispName').innerText = data.name;
                        document.getElementById('dispMobile').innerText = "+91 " + data.mobile;
                        document.getElementById('dispEmail').innerText = data.email;
                    }
                }
            }
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Tab Switching
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            item.classList.add('active');
            const targetTab = document.getElementById(item.getAttribute('data-tab'));
            if(targetTab) targetTab.classList.add('active');
        });
    });

    // Theme Toggle Logic inside Settings
    const themeToggle = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');
    const themeStatusText = document.getElementById('themeStatusText');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                iconSun.style.opacity = '1'; iconMoon.style.opacity = '0.5';
                themeStatusText.innerText = "Light Mode";
            } else {
                document.body.setAttribute('data-theme', 'dark');
                iconSun.style.opacity = '0.5'; iconMoon.style.opacity = '1';
                themeStatusText.innerText = "Dark Mode";
            }
        });
    }

    // Routes Logic inside Settings
    const cityBtns = document.querySelectorAll(".city-btn");
    const hisarRoutesList = document.getElementById("hisarRoutesList");

    cityBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const city = btn.getAttribute("data-city");
            if (city === "Jind" || city === "Bhiwani") {
                if(hisarRoutesList) hisarRoutesList.classList.add("hidden");
                Swal.fire({
                    icon: 'warning', title: 'Under Maintenance', text: `Sorry, routes from ${city} are currently under maintenance.`, confirmButtonColor: '#0b4595', customClass: { popup: 'glass-swal', title: 'glass-swal-title', htmlContainer: 'glass-swal-text' }
                });
            } else if (city === "Hisar") {
                if(hisarRoutesList) hisarRoutesList.classList.remove("hidden");
            }
        });
    });

    // =========================================================
    // UPDATE INFORMATION LOGIC (Name, Phone, Email)
    // =========================================================
    
    // 1. Update Name (1 time per month limit without OTP)
    const btnUpdateName = document.getElementById('btnUpdateName');
    if (btnUpdateName) {
        btnUpdateName.addEventListener('click', async () => {
            if (!currentUserData || !supabase) return;
            const newName = document.getElementById('updateNameInput').value.trim();
            if (newName.length < 2) return Swal.fire('Invalid', 'Enter a valid name.', 'warning');

            const lastUpdate = localStorage.getItem('hr_name_update_time');
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
            
            if (lastUpdate && (Date.now() - parseInt(lastUpdate)) < thirtyDays) {
                const daysLeft = Math.ceil((thirtyDays - (Date.now() - parseInt(lastUpdate))) / (1000 * 60 * 60 * 24));
                return Swal.fire('Limit Reached', `You can only change your name once a month. Try again in ${daysLeft} days.`, 'error');
            }

            btnUpdateName.innerText = "Updating...";
            const { error } = await supabase.from('users').update({ name: newName }).eq('email', currentUserData.email);
            if (!error) {
                localStorage.setItem('hr_name_update_time', Date.now());
                localStorage.setItem('hr_user_name', newName); // Update local active session
                currentUserData.name = newName;
                document.getElementById('dispName').innerText = newName;
                Swal.fire('Success', 'Name updated successfully!', 'success');
            } else {
                Swal.fire('Error', 'Failed to update name.', 'error');
            }
            btnUpdateName.innerText = "Update";
        });
    }

    // 2. Update Phone (OTP Required)
    const btnSendPhoneOtp = document.getElementById('btnSendPhoneOtp');
    const btnVerifyPhoneUpdate = document.getElementById('btnVerifyPhoneUpdate');
    let phoneUpdateOTP = null;

    if (btnSendPhoneOtp) {
        btnSendPhoneOtp.addEventListener('click', async () => {
            if (!currentUserData) return;
            const newPhone = document.getElementById('updatePhoneInput').value.trim();
            if (newPhone.length !== 10) return Swal.fire('Invalid', 'Enter valid 10-digit mobile.', 'warning');

            // Duplicate check
            const { data } = await supabase.from('users').select('mobile').eq('mobile', newPhone).maybeSingle();
            if (data) return Swal.fire('Already Exists', 'This number is already registered.', 'warning');

            btnSendPhoneOtp.disabled = true; btnSendPhoneOtp.innerText = "Sending...";
            phoneUpdateOTP = Math.floor(1000 + Math.random() * 9000).toString();

            // Send OTP to Current Email for Authorization
            emailjs.send("service_ecofefq", "template_grujfl8", { to_email: currentUserData.email, user_name: currentUserData.name, otp: phoneUpdateOTP }).then(() => {
                document.getElementById('phoneOtpBox').classList.remove('hidden');
                btnSendPhoneOtp.innerText = "Sent to Email ✓";
                Swal.fire('OTP Sent', `OTP sent to your registered Email: ${currentUserData.email} for verification.`, 'success');
            });
        });
    }

    if (btnVerifyPhoneUpdate) {
        btnVerifyPhoneUpdate.addEventListener('click', async () => {
            const enteredOtp = document.getElementById('phoneOtpInput').value.trim();
            const newPhone = document.getElementById('updatePhoneInput').value.trim();
            
            if (enteredOtp === phoneUpdateOTP) {
                btnVerifyPhoneUpdate.innerText = "Saving...";
                const { error } = await supabase.from('users').update({ mobile: newPhone }).eq('email', currentUserData.email);
                if (!error) {
                    currentUserData.mobile = newPhone;
                    document.getElementById('dispMobile').innerText = "+91 " + newPhone;
                    Swal.fire('Success', 'Phone number updated securely!', 'success');
                    document.getElementById('phoneOtpBox').classList.add('hidden');
                } else {
                    Swal.fire('Error', 'Update failed.', 'error');
                }
                btnVerifyPhoneUpdate.innerText = "Verify & Save";
            } else {
                Swal.fire('Error', 'Incorrect OTP', 'error');
            }
        });
    }

    // 3. Update Email (OTP Required)
    const btnSendEmailOtp = document.getElementById('btnSendEmailOtp');
    const btnVerifyEmailUpdate = document.getElementById('btnVerifyEmailUpdate');
    let emailUpdateOTP = null;

    if (btnSendEmailOtp) {
        btnSendEmailOtp.addEventListener('click', async () => {
            if (!currentUserData) return;
            const newEmail = document.getElementById('updateEmailInput').value.trim();
            if (!newEmail.includes('@')) return Swal.fire('Invalid', 'Enter valid email.', 'warning');

            // Duplicate check
            const { data } = await supabase.from('users').select('email').eq('email', newEmail).maybeSingle();
            if (data) return Swal.fire('Already Exists', 'This email is already registered.', 'warning');

            btnSendEmailOtp.disabled = true; btnSendEmailOtp.innerText = "Sending...";
            emailUpdateOTP = Math.floor(1000 + Math.random() * 9000).toString();

            // Send OTP to Current Email for Authorization
            emailjs.send("service_ecofefq", "template_grujfl8", { to_email: currentUserData.email, user_name: currentUserData.name, otp: emailUpdateOTP }).then(() => {
                document.getElementById('emailOtpBox').classList.remove('hidden');
                btnSendEmailOtp.innerText = "Sent to Old Email ✓";
                Swal.fire('OTP Sent', `Authorization OTP sent to your CURRENT Email: ${currentUserData.email}.`, 'success');
            });
        });
    }

    if (btnVerifyEmailUpdate) {
        btnVerifyEmailUpdate.addEventListener('click', async () => {
            const enteredOtp = document.getElementById('emailOtpInput').value.trim();
            const newEmail = document.getElementById('updateEmailInput').value.trim();
            
            if (enteredOtp === emailUpdateOTP) {
                btnVerifyEmailUpdate.innerText = "Saving...";
                const { error } = await supabase.from('users').update({ email: newEmail }).eq('mobile', currentUserData.mobile); // Identifying by mobile now since email changes
                if (!error) {
                    currentUserData.email = newEmail;
                    document.getElementById('dispEmail').innerText = newEmail;
                    Swal.fire('Success', 'Email Address updated securely!', 'success');
                    document.getElementById('emailOtpBox').classList.add('hidden');
                } else {
                    Swal.fire('Error', 'Update failed.', 'error');
                }
                btnVerifyEmailUpdate.innerText = "Verify & Save";
            } else {
                Swal.fire('Error', 'Incorrect OTP', 'error');
            }
        });
    }


    // =========================================================
    // SEARCH, MARQUEE & TIMETABLE LOGIC
    // =========================================================
    const busData = [
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
            const agreeTncModal = document.getElementById('agreeTncModal'); // For fallback check
            
            // If T&C is NOT accepted, show popup and stop
            if (!tncAccepted) {
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

    // Modal Background Clicks
    const tncModal = document.getElementById('tncModal');
    const closeTncBtn = document.getElementById('closeTncBtn');
    if (closeTncBtn && tncModal) closeTncBtn.addEventListener('click', () => tncModal.classList.remove('active'));

    const acceptTncBtn = document.getElementById('acceptTncBtn');
    const agreeTncModal = document.getElementById('agreeTncModal');

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

    window.addEventListener("click", (e) => {
        if (e.target === tncModal) tncModal.classList.remove('active');
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
