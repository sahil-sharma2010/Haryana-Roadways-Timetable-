// === AUTH GUARD & T&C AUTO ACCEPT ===
if (localStorage.getItem('hr_logged_in') !== 'true') {
    window.location.href = 'login.html';
} else {
    localStorage.setItem('hr_tnc_accepted', 'true');
}

// === AUTO DETECT DARK MODE AT NIGHT ===
const currentHour = new Date().getHours();
if (currentHour >= 18 || currentHour < 6) {
    if (!localStorage.getItem('theme_manually_changed')) {
        document.body.setAttribute('data-theme', 'dark');
    }
}

document.addEventListener("DOMContentLoaded", async () => {
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

    let supabase = null;
    try {
        emailjs.init("K6cs_matxXu2begVg"); 
        const SUPABASE_URL = 'https://wapxdmpwvhcsrnfiodjd.supabase.co'; 
        const SUPABASE_ANON_KEY = 'sb_publishable_odtRBN3c0mV917RGbwCCKA_JuwKHVUU'; 
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) { console.error("Database connection failed", error); }

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('hr_logged_in');
            localStorage.removeItem('hr_welcome_shown');
            window.location.href = 'login.html';
        });
    }

    // =========================================================
    // SETTINGS PAGE (FULL SCREEN)
    // =========================================================
    const btnOpenSettings = document.getElementById('btnOpenSettings');
    const settingsPage = document.getElementById('settingsPage');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const navItems = document.querySelectorAll('.setting-nav-item');
    const tabContents = document.querySelectorAll('.settings-tab-content');

    let currentUserData = null; 

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
                    }
                }
            }
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
    // ADMIN PANEL LOGIC (Direct PIN 3806 & Auth Check)
    // =========================================================
    const btnUnlockAdmin = document.getElementById('btnUnlockAdmin');
    const adminPinInput = document.getElementById('adminPinInput');
    const adminPage = document.getElementById('adminPage');

    if (btnUnlockAdmin) {
        btnUnlockAdmin.addEventListener('click', () => {
            const enteredPin = adminPinInput.value;
            
            if (enteredPin === '3806') {
                // Pin is correct, now check if authorized number
                if (currentUserData && currentUserData.mobile === '7988300872') {
                    settingsPage.classList.remove('active'); 
                    adminPage.classList.add('active'); 
                    loadAdminData();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '⚠️ Unauthorized Access',
                        text: "Sorry! You don't have permission to view this page.\nThis admin dashboard is restricted to the authorized developer only.",
                        confirmButtonColor: '#d9534f',
                        customClass: { popup: 'glass-swal' }
                    });
                }
            } else {
                Swal.fire('Error', 'Incorrect PIN. Access Denied.', 'error');
            }
            adminPinInput.value = ''; // Always reset
        });
    }

    const closeAdminBtn = document.getElementById('closeAdminBtn');
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminPage.classList.remove('active');
            settingsPage.classList.add('active'); // Back to settings
        });
    }

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
            
            let approvedCount = 0;
            let pendingCount = 0;

            data.forEach(user => {
                const status = user.status ? user.status.toLowerCase() : 'approved';
                if (status === 'pending') {
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
                } else {
                    approvedCount++;
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.mobile}</td>
                        <td>${user.email}</td>
                        <td id="pass-${user.id}">****</td>
                        <td><button class="btn-show-pass" onclick="revealPassword('${user.id}', '${user.password}')">SHOW</button></td>
                    `;
                    adminTableBody.appendChild(tr);
                }
            });

            totalUsersCount.innerText = approvedCount;
            reqCountBadge.innerText = pendingCount;

            if(pendingCount === 0) {
                adminRequestsBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No pending requests found.</td></tr>';
            }
            if(approvedCount === 0) {
                adminTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No active users found.</td></tr>';
            }
        } catch (err) {
            adminTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Failed to load data</td></tr>';
            adminRequestsBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Failed to load data</td></tr>';
        }
    }

    window.revealPassword = function(id, pass) {
        if (currentUserData && currentUserData.mobile === '7988300872') {
            document.getElementById(`pass-${id}`).innerText = pass;
        } else {
            Swal.fire('Error', 'Unauthorized action!', 'error');
            document.getElementById('adminPage').classList.remove('active');
        }
    };

    window.acceptUserReq = async function(email, name, mobile, pass) {
        Swal.fire({title: 'Approving...', allowOutsideClick: false, didOpen: () => Swal.showLoading()});
        const { error } = await supabase.from('users').update({ status: 'Approved' }).eq('email', email);
        if (!error) {
            emailjs.send("service_ecofefq", "template_vryvuck", {
                subject: "🎉 Registration Approved – Haryana Roadways Timetable",
                status: "Registration Approved Successfully",
                message: "Congratulations! Your registration has been approved successfully. You can now log in.",
                name: name, mobile: mobile, email: email, password: pass, color: "#0b7d35"
            });
            Swal.fire('Success', 'User Approved & Notified.', 'success');
            loadAdminData();
        } else { Swal.fire('Error', error.message, 'error'); }
    };

    window.rejectUserReq = async function(email, name, mobile) {
        Swal.fire({title: 'Rejecting & Deleting...', allowOutsideClick: false, didOpen: () => Swal.showLoading()});
        // DELETING FROM DATABASE INSTEAD OF UPDATING STATUS
        const { error } = await supabase.from('users').delete().eq('email', email);
        if (!error) {
            emailjs.send("service_ecofefq", "template_vryvuck", {
                subject: "Registration Declined – Haryana Roadways Timetable",
                status: "Registration Request Declined",
                message: "We regret to inform you that your request has been declined by the administrator and your data has been removed.",
                name: name, mobile: mobile, email: email, password: "N/A", color: "#d32f2f"
            });
            Swal.fire('Declined', 'User request rejected and deleted from database.', 'info');
            loadAdminData();
        } else { Swal.fire('Error', error.message, 'error'); }
    };

    // =========================================================
    // UPDATE INFORMATION
    // =========================================================
    function checkUpdateLimit(storageKey) {
        const limitData = JSON.parse(localStorage.getItem(storageKey)) || [];
        const now = Date.now();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const validData = limitData.filter(time => (now - time) < thirtyDays);
        localStorage.setItem(storageKey, JSON.stringify(validData));
        return validData.length < 2; 
    }

    function addUpdateRecord(storageKey) {
        const limitData = JSON.parse(localStorage.getItem(storageKey)) || [];
        limitData.push(Date.now());
        localStorage.setItem(storageKey, JSON.stringify(limitData));
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

    const btnSendPhoneOtp = document.getElementById('btnSendPhoneOtp');
    const btnVerifyPhoneUpdate = document.getElementById('btnVerifyPhoneUpdate');
    let phoneUpdateOTP = null;

    if (btnSendPhoneOtp) {
        btnSendPhoneOtp.addEventListener('click', async () => {
            if (!currentUserData) return;
            if (!checkUpdateLimit('hr_phone_update_history')) return Swal.fire('Limit Reached', 'You can only update your Mobile Number 2 times in a month.', 'error');

            const newPhone = document.getElementById('updatePhoneInput').value.trim();
            if (newPhone.length !== 10) return Swal.fire('Invalid', 'Enter valid 10-digit mobile.', 'warning');

            const { data } = await supabase.from('users').select('mobile').eq('mobile', newPhone).maybeSingle();
            if (data) return Swal.fire('Already Exists', 'This number is already registered.', 'warning');

            btnSendPhoneOtp.disabled = true; btnSendPhoneOtp.innerText = "Sending...";
            phoneUpdateOTP = Math.floor(1000 + Math.random() * 9000).toString();

            emailjs.send("service_ecofefq", "template_grujfl8", { 
                to_email: currentUserData.email, user_name: currentUserData.name || "User", otp: phoneUpdateOTP 
            }).then(() => {
                document.getElementById('phoneOtpBox').classList.remove('hidden');
                btnSendPhoneOtp.innerText = "Sent to Email ✓";
                Swal.fire('OTP Sent', `OTP sent to your registered Email: ${currentUserData.email} for verification.`, 'success');
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
                    Swal.fire('Success', 'Phone number updated securely!', 'success');
                    document.getElementById('phoneOtpBox').classList.add('hidden');
                    document.getElementById('updatePhoneInput').value = "";
                } else { Swal.fire('Error', 'Update failed.', 'error'); }
                btnVerifyPhoneUpdate.innerText = "Verify & Save";
            } else { Swal.fire('Error', 'Incorrect OTP', 'error'); }
        });
    }

    const btnSendEmailOtp = document.getElementById('btnSendEmailOtp');
    const btnVerifyEmailUpdate = document.getElementById('btnVerifyEmailUpdate');
    let emailUpdateOTP = null;

    if (btnSendEmailOtp) {
        btnSendEmailOtp.addEventListener('click', async () => {
            if (!currentUserData) return;
            if (!checkUpdateLimit('hr_email_update_history')) return Swal.fire('Limit Reached', 'You can only update your Email Address 2 times in a month.', 'error');

            const newEmail = document.getElementById('updateEmailInput').value.trim();
            if (!newEmail.includes('@')) return Swal.fire('Invalid', 'Enter valid email.', 'warning');

            const { data } = await supabase.from('users').select('email').eq('email', newEmail).maybeSingle();
            if (data) return Swal.fire('Already Exists', 'This email is already registered.', 'warning');

            btnSendEmailOtp.disabled = true; btnSendEmailOtp.innerText = "Sending...";
            emailUpdateOTP = Math.floor(1000 + Math.random() * 9000).toString();

            emailjs.send("service_ecofefq", "template_grujfl8", { 
                to_email: currentUserData.email, user_name: currentUserData.name || "User", otp: emailUpdateOTP 
            }).then(() => {
                document.getElementById('emailOtpBox').classList.remove('hidden');
                btnSendEmailOtp.innerText = "Sent to Old Email ✓";
                Swal.fire('OTP Sent', `Authorization OTP sent to your CURRENT Email: ${currentUserData.email}.`, 'success');
            }).catch(err => {
                btnSendEmailOtp.disabled = false; btnSendEmailOtp.innerText = "Send OTP";
                Swal.fire('Error', 'Failed to send OTP email. Please try again.', 'error');
            });
        });
    }

    if (btnVerifyEmailUpdate) {
        btnVerifyEmailUpdate.addEventListener('click', async () => {
            const enteredOtp = document.getElementById('emailOtpInput').value.trim();
            const newEmail = document.getElementById('updateEmailInput').value.trim();
            
            if (enteredOtp === emailUpdateOTP) {
                btnVerifyEmailUpdate.innerText = "Saving...";
                const { error } = await supabase.from('users').update({ email: newEmail }).eq('mobile', currentUserData.mobile);
                if (!error) {
                    addUpdateRecord('hr_email_update_history'); 
                    currentUserData.email = newEmail;
                    document.getElementById('dispEmail').innerText = newEmail;
                    Swal.fire('Success', 'Email Address updated securely!', 'success');
                    document.getElementById('emailOtpBox').classList.add('hidden');
                    document.getElementById('updateEmailInput').value = "";
                } else { Swal.fire('Error', 'Update failed.', 'error'); }
                btnVerifyEmailUpdate.innerText = "Verify & Save";
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

    // =========================================================
    // FOOTER MODALS
    // =========================================================
    const modalsInfo = [
        { btn: 'openTncBtn', modal: 'tncModal', close: 'closeTncBtn', action: '.close-tnc-action' },
        { btn: 'openPrivacyBtn', modal: 'privacyModal', close: 'closePrivacyBtn', action: '.close-privacy-action' },
        { btn: 'openDisclaimerBtn', modal: 'disclaimerModal', close: 'closeDisclaimerBtn', action: '.close-disclaimer-action' }
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
        
        if (m.action && modal) {
            const actionBtn = modal.querySelector(m.action);
            if(actionBtn) {
                actionBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            }
        }
    });

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains('glass-modal-overlay')) {
            e.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
