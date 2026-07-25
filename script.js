// === AUTH GUARD & AUTO-LOGOUT CHECKER ===
if (localStorage.getItem('hr_logged_in') !== 'true') {
    window.location.href = 'login.html';
} else {
    localStorage.setItem('hr_tnc_accepted', 'true');
}

// === AUTO DETECT DARK MODE ===
const currentHour = new Date().getHours();
if (currentHour >= 18 || currentHour < 6) {
    if (!localStorage.getItem('theme_manually_changed')) {
        document.body.setAttribute('data-theme', 'dark');
    }
}

// Using 'var' to prevent any SyntaxError (already declared) if pasted twice accidentally
var supabase = null;
var currentUserData = null;

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
    try {
        emailjs.init("K6cs_matxXu2begVg"); 
        const SUPABASE_URL = 'https://wapxdmpwvhcsrnfiodjd.supabase.co'; 
        const SUPABASE_ANON_KEY = 'sb_publishable_odtRBN3c0mV917RGbwCCKA_JuwKHVUU'; 
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) { console.error("Database connection failed", error); }

    // ==========================================
    // AUTO LOGOUT IF BLOCKED/SUSPENDED (Runs every 10 secs)
    // ==========================================
    setInterval(async () => {
        if (!supabase || !currentUserData) return;
        const { data } = await supabase.from('users').select('account_status, status').eq('email', currentUserData.email).maybeSingle();
        if (data) {
            const accStat = data.account_status ? data.account_status.toLowerCase() : 'active';
            const reqStat = data.status ? data.status.toLowerCase() : 'approved';
            
            if (accStat === 'blocked' || accStat === 'suspended' || reqStat !== 'approved') {
                localStorage.removeItem('hr_logged_in');
                localStorage.removeItem('hr_welcome_shown');
                window.location.href = 'login.html';
            }
        } else {
            // User deleted from DB
            localStorage.removeItem('hr_logged_in');
            window.location.href = 'login.html';
        }
    }, 10000);

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('hr_logged_in');
            localStorage.removeItem('hr_welcome_shown');
            window.location.href = 'login.html';
        });
    }

    // =========================================================
    // SETTINGS PAGE
    // =========================================================
    const btnOpenSettings = document.getElementById('btnOpenSettings');
    const settingsPage = document.getElementById('settingsPage');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const navItems = document.querySelectorAll('.setting-nav-item');
    const tabContents = document.querySelectorAll('.settings-tab-content');

    if (btnOpenSettings) {
        btnOpenSettings.addEventListener('click', async () => {
            settingsPage.classList.add('active');
            document.body.style.overflow = 'hidden'; 
            
            if (supabase && !currentUserData) {
                const userName = localStorage.getItem('hr_user_name');
                if (userName) {
                    const { data } = await supabase.from('users').select('*').eq('name', userName).order('id', {ascending: false}).limit(1).maybeSingle();
                    if (data) {
                        currentUserData = data;
                        document.getElementById('dispName').innerText = data.name;
                        document.getElementById('dispMobile').innerText = "+91 " + data.mobile;
                        document.getElementById('dispEmail').innerText = data.email;
                        updateLimitUI(); // Refresh limit UI
                    }
                }
            } else { updateLimitUI(); }
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsPage.classList.remove('active');
            document.body.style.overflow = 'auto'; 
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            item.classList.add('active');
            const targetTab = document.getElementById(item.getAttribute('data-tab'));
            if(targetTab) targetTab.classList.add('active');
        });
    });

    const themeToggle = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');
    const themeStatusText = document.getElementById('themeStatusText');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            localStorage.setItem('theme_manually_changed', 'true');
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

    // =========================================================
    // ADMIN AUTHENTICATION
    // =========================================================
    const btnUnlockAdmin = document.getElementById('btnUnlockAdmin');
    const adminPinInput = document.getElementById('adminPinInput');
    const adminPage = document.getElementById('adminPage');

    if (btnUnlockAdmin) {
        btnUnlockAdmin.addEventListener('click', () => {
            const enteredPin = adminPinInput.value.trim();
            if (enteredPin === '3806') {
                if (currentUserData && currentUserData.mobile === '7988300872') {
                    settingsPage.classList.remove('active'); 
                    adminPage.classList.add('active'); 
                    loadAdminData();
                } else {
                    Swal.fire({
                        icon: 'error', title: '⚠️ Unauthorized Access',
                        html: "Sorry! You don't have permission to view this page.<br><br>This admin dashboard is restricted to the authorized developer only.",
                        confirmButtonColor: '#d9534f', customClass: { popup: 'glass-swal' }
                    });
                }
            } else { Swal.fire('Error', 'Incorrect Password. Access Denied.', 'error'); }
            adminPinInput.value = ''; 
        });
    }

    const closeAdminBtn = document.getElementById('closeAdminBtn');
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminPage.classList.remove('active');
            settingsPage.classList.add('active'); 
        });
    }

    // Admin Tabs
    const tabUsersBtn = document.getElementById('tabUsersBtn');
    const tabReqBtn = document.getElementById('tabReqBtn');
    const adminUsersSection = document.getElementById('adminUsersSection');
    const adminReqSection = document.getElementById('adminReqSection');

    if (tabUsersBtn && tabReqBtn) {
        tabUsersBtn.addEventListener('click', () => {
            tabUsersBtn.style.background = 'var(--primary-blue)'; tabUsersBtn.style.color = 'white';
            tabReqBtn.style.background = '#cdd5df'; tabReqBtn.style.color = '#333';
            adminUsersSection.classList.remove('hidden'); adminReqSection.classList.add('hidden');
        });
        tabReqBtn.addEventListener('click', () => {
            tabReqBtn.style.background = 'var(--primary-blue)'; tabReqBtn.style.color = 'white';
            tabUsersBtn.style.background = '#cdd5df'; tabUsersBtn.style.color = '#333';
            adminReqSection.classList.remove('hidden'); adminUsersSection.classList.add('hidden');
        });
    }

    // =========================================================
    // ADMIN DATA & ACTION MANAGEMENT
    // =========================================================
    async function loadAdminData() {
        const adminTableBody = document.getElementById('adminTableBody');
        const adminRequestsBody = document.getElementById('adminRequestsBody');
        const totalUsersCount = document.getElementById('totalUsersCount');
        const reqCountBadge = document.getElementById('reqCountBadge');
        
        adminTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Loading Data...</td></tr>';
        adminRequestsBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Loading Requests...</td></tr>';
        
        try {
            const { data, error } = await supabase.from('users').select('*').order('id', {ascending: false});
            if (error) throw error;
            
            adminTableBody.innerHTML = '';
            adminRequestsBody.innerHTML = '';
            let approvedCount = 0; let pendingCount = 0;

            data.forEach(user => {
                const reqStatus = user.status ? user.status.toLowerCase() : 'approved';
                const accStatus = user.account_status ? user.account_status.toLowerCase() : 'active';

                if (reqStatus === 'pending') {
                    pendingCount++;
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.mobile}</td>
                        <td>${user.email}</td>
                        <td style="white-space:nowrap;">
                            <button class="btn-accept-req" onclick="acceptUserReq('${user.email}', '${user.name}', '${user.mobile}', '${user.password}')">Accept</button>
                            <button class="btn-reject-req" onclick="rejectUserReq('${user.email}', '${user.name}', '${user.mobile}')">Reject</button>
                        </td>
                    `;
                    adminRequestsBody.appendChild(tr);
                } else if (reqStatus === 'approved') {
                    approvedCount++;
                    // Show status indicator if not active
                    let statBadge = '';
                    if(accStatus === 'blocked') statBadge = '<span style="color:#d9534f;font-size:0.75rem;display:block;">[BLOCKED]</span>';
                    if(accStatus === 'suspended') statBadge = '<span style="color:#f39c12;font-size:0.75rem;display:block;">[SUSPENDED]</span>';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${user.name} ${statBadge}</td>
                        <td>${user.mobile}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="btn-show-pass" id="btn-show-${user.id}" onclick="revealPassword('${user.id}', '${user.password}')">VIEW</button>
                            <span id="pass-${user.id}" style="display:none;font-weight:bold;"></span>
                        </td>
                        <td>
                            <button class="btn-action-manage" onclick="manageUser('${user.email}', '${accStatus}')">Manage</button>
                        </td>
                    `;
                    adminTableBody.appendChild(tr);
                }
            });

            totalUsersCount.innerText = approvedCount;
            reqCountBadge.innerText = pendingCount;
            if(pendingCount === 0) adminRequestsBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No pending requests found.</td></tr>';
            if(approvedCount === 0) adminTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No active users found.</td></tr>';
        } catch (err) { }
    }

    // Attach to window so onclick works
    window.revealPassword = function(id, pass) {
        if (currentUserData && currentUserData.mobile === '7988300872') {
            document.getElementById(`btn-show-${id}`).style.display = 'none';
            const passSpan = document.getElementById(`pass-${id}`);
            passSpan.style.display = 'inline';
            passSpan.innerText = pass;
        } else {
            Swal.fire('Error', 'Unauthorized action!', 'error');
            document.getElementById('adminPage').classList.remove('active');
        }
    };

    window.manageUser = function(email, currentStatus) {
        Swal.fire({
            title: 'Manage Account Status',
            html: `Current Status: <strong style="text-transform:uppercase;">${currentStatus}</strong><br><br>Select Action:`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Block',
            denyButtonText: 'Suspend',
            cancelButtonText: 'Unblock',
            confirmButtonColor: '#d9534f',
            denyButtonColor: '#f39c12',
            cancelButtonColor: '#5eb063'
        }).then(async (result) => {
            let newStatus = null;
            if (result.isConfirmed) newStatus = 'Blocked';
            else if (result.isDenied) newStatus = 'Suspended';
            else if (result.dismiss === Swal.DismissReason.cancel) newStatus = 'Active';

            if (newStatus) {
                Swal.fire({title: 'Updating...', allowOutsideClick: false, didOpen: () => Swal.showLoading()});
                const { error } = await supabase.from('users').update({ account_status: newStatus }).eq('email', email);
                if (!error) {
                    Swal.fire('Success', `Account status updated to ${newStatus}`, 'success');
                    loadAdminData();
                } else { Swal.fire('Error', error.message, 'error'); }
            }
        });
    }

    window.acceptUserReq = async function(email, name, mobile, pass) {
        Swal.fire({title: 'Approving...', allowOutsideClick: false, didOpen: () => Swal.showLoading()});
        const { error } = await supabase.from('users').update({ status: 'Approved', account_status: 'Active' }).eq('email', email);
        if (!error) {
            Swal.fire('Success', 'User Approved.', 'success');
            loadAdminData();
        } else { Swal.fire('Error', error.message, 'error'); }
    };

    window.rejectUserReq = async function(email, name, mobile) {
        Swal.fire({title: 'Rejecting & Deleting...', allowOutsideClick: false, didOpen: () => Swal.showLoading()});
        const { error } = await supabase.from('users').delete().eq('email', email);
        if (!error) {
            Swal.fire('Declined', 'User request rejected and deleted from database.', 'info');
            loadAdminData();
        } else { Swal.fire('Error', error.message, 'error'); }
    };

    // =========================================================
    // LIMIT TRACKER & OTP UPDATES
    // =========================================================
    function getRemainingEdits(storageKey) {
        const limitData = JSON.parse(localStorage.getItem(storageKey)) || [];
        const now = Date.now();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const validData = limitData.filter(time => (now - time) < thirtyDays);
        localStorage.setItem(storageKey, JSON.stringify(validData));
        return 2 - validData.length;
    }

    function addUpdateRecord(storageKey) {
        const limitData = JSON.parse(localStorage.getItem(storageKey)) || [];
        limitData.push(Date.now());
        localStorage.setItem(storageKey, JSON.stringify(limitData));
    }

    function updateLimitUI() {
        const phoneLeft = getRemainingEdits('hr_phone_update_history');
        const phoneLimitText = document.getElementById('phoneLimitText');
        if(phoneLimitText) {
            if(phoneLeft <= 0) phoneLimitText.innerHTML = `(Limit Reached - Try again next month)`;
            else phoneLimitText.innerHTML = `(Limit: 2 Edits / Month - ${phoneLeft} left)`;
        }
    }

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
                localStorage.setItem('hr_user_name', newName); 
                currentUserData.name = newName;
                document.getElementById('dispName').innerText = newName;
                Swal.fire('Success', 'Name updated successfully!', 'success');
                document.getElementById('updateNameInput').value = "";
            } else { Swal.fire('Error', 'Failed to update name.', 'error'); }
            btnUpdateName.innerText = "Update";
        });
    }

    // Phone Update Logic
    const btnSendPhoneOtp = document.getElementById('btnSendPhoneOtp');
    const btnVerifyPhoneUpdate = document.getElementById('btnVerifyPhoneUpdate');
    let phoneUpdateOTP = null;

    if (btnSendPhoneOtp) {
        btnSendPhoneOtp.addEventListener('click', async () => {
            if (!currentUserData) return;
            
            // Check limits first before processing
            if (getRemainingEdits('hr_phone_update_history') <= 0) {
                return Swal.fire({ title: 'Limit Reached', text: 'You have reached your limit of 2 number changes per month. Please try again later.', icon: 'error' });
            }

            const oldPhone = document.getElementById('oldPhoneInput').value.trim();
            const newPhone = document.getElementById('updatePhoneInput').value.trim();
            
            if (oldPhone !== currentUserData.mobile) return Swal.fire('Security Error', 'Old mobile number does not match your current registered number.', 'error');
            if (newPhone.length !== 10) return Swal.fire('Invalid', 'Enter valid 10-digit new mobile number.', 'warning');
            if (oldPhone === newPhone) return Swal.fire('Warning', 'New number cannot be same as old number.', 'warning');

            const { data } = await supabase.from('users').select('mobile').eq('mobile', newPhone).maybeSingle();
            if (data) return Swal.fire('Already Exists', 'This new number is already registered to another account.', 'warning');

            btnSendPhoneOtp.disabled = true; btnSendPhoneOtp.innerText = "Sending...";
            phoneUpdateOTP = Math.floor(1000 + Math.random() * 9000).toString();

            emailjs.send("service_ecofefq", "template_grujfl8", { 
                to_email: currentUserData.email, user_name: currentUserData.name || "User", otp: phoneUpdateOTP 
            }).then(() => {
                document.getElementById('phoneOtpBox').classList.remove('hidden');
                btnSendPhoneOtp.innerText = "Sent to Email ✓";
                Swal.fire('OTP Sent', `Security OTP sent to your registered Email: ${currentUserData.email} to authorize number change.`, 'success');
            }).catch(err => {
                btnSendPhoneOtp.disabled = false; btnSendPhoneOtp.innerText = "Send OTP";
                Swal.fire('Error', 'Failed to send OTP email. Please try again.', 'error');
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
                    addUpdateRecord('hr_phone_update_history'); 
                    currentUserData.mobile = newPhone;
                    document.getElementById('dispMobile').innerText = "+91 " + newPhone;
                    Swal.fire('Success', 'Phone number changed securely!', 'success');
                    document.getElementById('phoneOtpBox').classList.add('hidden');
                    document.getElementById('updatePhoneInput').value = "";
                    document.getElementById('oldPhoneInput').value = "";
                    updateLimitUI();
                } else { Swal.fire('Error', 'Update failed.', 'error'); }
                btnVerifyPhoneUpdate.innerText = "Verify & Save";
            } else { Swal.fire('Error', 'Incorrect OTP', 'error'); }
        });
    }

    // =========================================================
    // SEARCH & TIMETABLE LOGIC
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

    const cityOptions = document.getElementById('cityOptions');
    const uniqueCities = new Set();
    busData.forEach(bus => { uniqueCities.add(bus.from); uniqueCities.add(bus.to); });
    uniqueCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        if(cityOptions) cityOptions.appendChild(option);
    });

    const form = document.getElementById('searchForm');
    const sourceInput = document.getElementById('source');
    const destInput = document.getElementById('destination');
    const skeletonLoader = document.getElementById('skeletonLoader');
    const emptyState = document.getElementById('emptyState');
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
            
            const fromVal = sourceInput.value.trim().toLowerCase();
            const toVal = destInput.value.trim().toLowerCase();

            resultsTableWrapper.style.display = 'none';
            emptyState.style.display = 'none';
            tableBody.innerHTML = '';
            
            skeletonLoader.style.display = 'flex'; 

            setTimeout(() => {
                skeletonLoader.style.display = 'none';
                
                const results = busData.filter(bus => {
                    const bFrom = bus.from.toLowerCase().trim();
                    const bTo = bus.to.toLowerCase().trim();
                    return bFrom === fromVal && bTo === toVal;
                });

                if (results.length > 0) {
                    renderTable(results);
                    resultsTableWrapper.style.display = 'block';
                    resultsTableWrapper.classList.add('slide-in-bottom');
                } else {
                    emptyState.style.display = 'block';
                }
            }, 2500); 
        });
    }

    // MODALS
    const modalsInfo = [
        { btn: 'openTncBtn', modal: 'tncModal', close: 'closeTncBtn' },
        { btn: 'openPrivacyBtn', modal: 'privacyModal', close: 'closePrivacyBtn' },
        { btn: 'openDisclaimerBtn', modal: 'disclaimerModal', close: 'closeDisclaimerBtn' }
    ];

    modalsInfo.forEach(m => {
        const btn = document.getElementById(m.btn);
        const modal = document.getElementById(m.modal);
        const closeBtn = document.getElementById(m.close);
        
        if (btn && modal) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });
});
