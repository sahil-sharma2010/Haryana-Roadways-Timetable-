// === PREMIUM STYLES INJECTION ===
if (typeof document !== 'undefined') {
    var style = document.createElement('style');
    style.innerHTML = `
        .swal2-container { z-index: 9999999 !important; }
        #acceptTncBtn { background: linear-gradient(135deg, #5eb063, #4a914f) !important; color: white !important; border: none !important; padding: 10px 24px !important; border-radius: 25px !important; font-weight: 600 !important; cursor: pointer !important; box-shadow: 0 4px 10px rgba(94, 176, 99, 0.3) !important; transition: all 0.3s ease !important; }
        #acceptTncBtn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(94, 176, 99, 0.4) !important; }
        #closeTncBtn { background: #f1f3f5 !important; color: #333 !important; border: none !important; padding: 10px 24px !important; border-radius: 25px !important; font-weight: 600 !important; cursor: pointer !important; transition: all 0.3s ease !important; }
        #closeTncBtn:hover { background: #e2e6ea !important; }
        [data-theme="dark"] .gauge-inner { background: #1e232d !important; }
        [data-theme="dark"] .tracker-content { background: #1a1e23 !important; border: 1px solid rgba(255,255,255,0.1); }
    `;
    document.head.appendChild(style);
}

// === AUTH GUARD & AUTO-LOGOUT ===
if (localStorage.getItem('hr_logged_in') !== 'true') {
    window.location.href = 'login.html';
}

// === THEME CHECK ===
var currentHour = new Date().getHours();
if (currentHour >= 18 || currentHour < 6) {
    if (!localStorage.getItem('theme_manually_changed')) {
        document.body.setAttribute('data-theme', 'dark');
    }
}

// === SMART DATABASE CONNECTION ===
var SUPABASE_URL = 'https://wapxdmpwvhcsrnfiodjd.supabase.co'; 
var SUPABASE_ANON_KEY = 'sb_publishable_odtRBN3c0mV917RGbwCCKA_JuwKHVUU'; 
var supabaseClient = null;
var currentUserData = null;

function getDB() {
    if (supabaseClient) return supabaseClient;
    if (typeof window.supabase !== 'undefined') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return supabaseClient;
    }
    return null;
}

document.addEventListener("DOMContentLoaded", async function() {
    
    if (typeof emailjs !== 'undefined') { try { emailjs.init("K6cs_matxXu2begVg"); } catch (e) { } }

    if (localStorage.getItem('hr_welcome_shown') !== 'true' && typeof Swal !== 'undefined') {
        var userName = localStorage.getItem('hr_user_name') || 'USER';
        Swal.fire({
            title: `WELCOME BACK ${userName.toUpperCase()}`,
            text: "Continue your journey.",
            confirmButtonText: "Thanks",
            confirmButtonColor: "#5eb063",
            customClass: { popup: 'glass-swal', title: 'glass-swal-title', htmlContainer: 'glass-swal-text' }
        });
        localStorage.setItem('hr_welcome_shown', 'true');
    }

    // =========================================================
    // ONE-TIME SILENT BLOCK & MAINTENANCE CHECK 
    // =========================================================
    var userEmail = localStorage.getItem('hr_user_email');
    var userMob = localStorage.getItem('hr_user_mobile');
    var db = getDB();
    
    if (db && userEmail) {
        db.from('users').select('is_maintenance').eq('mobile', '7988300872').maybeSingle().then(function(adminRes) {
            if (adminRes.data && adminRes.data.is_maintenance === true && userMob !== '7988300872') {
                localStorage.removeItem('hr_logged_in');
                localStorage.setItem('hr_kicked_reason', 'maintenance');
                window.location.href = 'login.html';
                return;
            }
            db.from('users').select('account_status, status').eq('email', userEmail).maybeSingle().then(function(res) {
                if (res.error || !res.data) return; 
                var accStat = res.data.account_status ? res.data.account_status.toLowerCase() : 'active';
                var reqStat = res.data.status ? res.data.status.toLowerCase() : 'approved';
                
                if (accStat === 'blocked' || accStat === 'suspended') {
                    localStorage.removeItem('hr_logged_in');
                    localStorage.setItem('hr_kicked_reason', accStat); 
                    window.location.href = 'login.html';
                } else if (reqStat === 'pending' || reqStat === 'rejected' || reqStat === 'declined') {
                    localStorage.removeItem('hr_logged_in');
                    localStorage.setItem('hr_kicked_reason', reqStat); 
                    window.location.href = 'login.html';
                }
            });
        });
    }

    var btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            localStorage.clear(); 
            window.location.href = 'login.html';
        });
    }

    // =========================================================
    // SETTINGS PAGE & DETAILS
    // =========================================================
    var btnOpenSettings = document.getElementById('btnOpenSettings');
    var settingsPage = document.getElementById('settingsPage');
    var closeSettingsBtn = document.getElementById('closeSettingsBtn');
    var navItems = document.querySelectorAll('.setting-nav-item');
    var tabContents = document.querySelectorAll('.settings-tab-content');

    if (btnOpenSettings && settingsPage) {
        btnOpenSettings.addEventListener('click', async function() {
            settingsPage.classList.add('active');
            document.body.style.overflow = 'hidden'; 
            
            var dispName = document.getElementById('dispName');
            var dispMob = document.getElementById('dispMobile');
            var dispEmail = document.getElementById('dispEmail');

            if(dispName) dispName.innerText = localStorage.getItem('hr_user_name') || "Loading...";
            if(dispMob) dispMob.innerText = localStorage.getItem('hr_user_mobile') ? "+91 " + localStorage.getItem('hr_user_mobile') : "Fetching...";
            if(dispEmail) dispEmail.innerText = localStorage.getItem('hr_user_email') || "Fetching...";

            if (db) {
                try {
                    var query = db.from('users').select('*');
                    if (userEmail) {
                        var res = await query.eq('email', userEmail).limit(1).maybeSingle();
                        if (res && res.data) {
                            currentUserData = res.data;
                            localStorage.setItem('hr_user_name', res.data.name);
                            localStorage.setItem('hr_user_email', res.data.email);
                            localStorage.setItem('hr_user_mobile', res.data.mobile);
                            if(dispName) dispName.innerText = res.data.name;
                            if(dispMob) dispMob.innerText = "+91 " + res.data.mobile;
                            if(dispEmail) dispEmail.innerText = res.data.email;
                            
                            if(typeof updatePhoneLimitUI === 'function') updatePhoneLimitUI(); 
                            if(typeof updateEmailLimitUI === 'function') updateEmailLimitUI(); 
                        }
                    }
                } catch(err) { }
            }
        });
    }

    if (closeSettingsBtn && settingsPage) {
        closeSettingsBtn.addEventListener('click', function() {
            settingsPage.classList.remove('active');
            document.body.style.overflow = 'auto'; 
        });
    }

    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            if (item.id === 'openTrackerBtn') return; // Speed Tracker ke liye alag logic hai
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            item.classList.add('active');
            var targetTab = document.getElementById(item.getAttribute('data-tab'));
            if(targetTab) targetTab.classList.add('active');
        });
    });

    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            localStorage.setItem('theme_manually_changed', 'true');
            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                document.getElementById('icon-sun').style.opacity = '1'; 
                document.getElementById('icon-moon').style.opacity = '0.5';
                document.getElementById('themeStatusText').innerText = "Light Mode";
            } else {
                document.body.setAttribute('data-theme', 'dark');
                document.getElementById('icon-sun').style.opacity = '0.5'; 
                document.getElementById('icon-moon').style.opacity = '1';
                document.getElementById('themeStatusText').innerText = "Dark Mode";
            }
        });
    }

    // =========================================================
    // ADMIN PANEL & MAINTENANCE
    // =========================================================
    var btnUnlockAdmin = document.getElementById('btnUnlockAdmin');
    var adminPinInput = document.getElementById('adminPinInput');
    var adminPage = document.getElementById('adminPage');

    if (btnUnlockAdmin && adminPinInput) {
        btnUnlockAdmin.addEventListener('click', function() {
            var enteredPin = adminPinInput.value.trim();
            var adminMob = localStorage.getItem('hr_user_mobile');
            if (enteredPin === '3806') {
                if (adminMob === '7988300872') {
                    if(settingsPage) settingsPage.classList.remove('active'); 
                    if(adminPage) adminPage.classList.add('active'); 
                    if(typeof loadAdminData === 'function') loadAdminData();
                } else { Swal.fire('⚠️ Unauthorized Access', "Sorry! You don't have permission.", 'error'); }
            } else { Swal.fire('Error', 'Incorrect Password.', 'error'); }
            adminPinInput.value = ''; 
        });
    }

    var closeAdminBtn = document.getElementById('closeAdminBtn');
    if (closeAdminBtn && adminPage) {
        closeAdminBtn.addEventListener('click', function() {
            adminPage.classList.remove('active');
            if(settingsPage) settingsPage.classList.add('active'); 
        });
    }

    var tabUsersBtn = document.getElementById('tabUsersBtn');
    var tabReqBtn = document.getElementById('tabReqBtn');
    var adminUsersSection = document.getElementById('adminUsersSection');
    var adminReqSection = document.getElementById('adminReqSection');

    if (tabUsersBtn && tabReqBtn) {
        tabUsersBtn.addEventListener('click', function() {
            tabUsersBtn.style.background = 'var(--primary-blue)'; tabUsersBtn.style.color = 'white';
            tabReqBtn.style.background = '#cdd5df'; tabReqBtn.style.color = '#333';
            if(adminUsersSection) adminUsersSection.classList.remove('hidden'); 
            if(adminReqSection) adminReqSection.classList.add('hidden');
        });
        tabReqBtn.addEventListener('click', function() {
            tabReqBtn.style.background = 'var(--primary-blue)'; tabReqBtn.style.color = 'white';
            tabUsersBtn.style.background = '#cdd5df'; tabUsersBtn.style.color = '#333';
            if(adminReqSection) adminReqSection.classList.remove('hidden'); 
            if(adminUsersSection) adminUsersSection.classList.add('hidden');
        });
    }

    window.loadAdminData = async function() {
        if (!db) { Swal.fire('Error','Database not ready','error'); return; }
        var adminTableBody = document.getElementById('adminTableBody');
        var adminRequestsBody = document.getElementById('adminRequestsBody');
        if(!adminTableBody || !adminRequestsBody) return;
        adminTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Loading...</td></tr>';
        adminRequestsBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Loading...</td></tr>';
        
        try {
            var adminRow = await db.from('users').select('is_maintenance').eq('mobile', '7988300872').maybeSingle();
            var isMaint = adminRow.data ? adminRow.data.is_maintenance : false;

            var maintContainer = document.getElementById('devMaintContainer');
            if (!maintContainer) {
                maintContainer = document.createElement('div');
                maintContainer.id = 'devMaintContainer';
                maintContainer.style.padding = '15px';
                maintContainer.style.margin = '10px 20px';
                maintContainer.style.borderRadius = '8px';
                maintContainer.style.textAlign = 'center';
                maintContainer.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
                var adminHeader = document.querySelector('.admin-header') || document.getElementById('adminPage');
                if (document.querySelector('.admin-header')) { adminHeader.parentNode.insertBefore(maintContainer, adminHeader.nextSibling); } 
                else { adminHeader.insertBefore(maintContainer, adminHeader.firstChild); }
            }

            maintContainer.style.background = isMaint ? '#f8d7da' : '#d4edda';
            maintContainer.style.border = `2px solid ${isMaint ? '#f5c6cb' : '#c3e6cb'}`;
            maintContainer.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: ${isMaint ? '#721c24' : '#155724'}; font-weight: bold;">
                    <i class="fa-solid fa-server"></i> Web Status: ${isMaint ? 'MAINTENANCE (OFF) 🔴' : 'NORMAL (ON) 🟢'}
                </h4>
                <button id="toggleMaintBtn" style="padding: 8px 20px; font-weight:bold; cursor: pointer; border: none; border-radius: 5px; background: ${isMaint ? '#5eb063' : '#d9534f'}; color: white;">
                    ${isMaint ? 'Turn App ON (Normal)' : 'Turn App OFF (Maintenance)'}
                </button>
            `;

            document.getElementById('toggleMaintBtn').onclick = async function() {
                Swal.fire({title: 'Updating...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), target: document.getElementById('adminPage') || 'body'});
                var res = await db.from('users').update({ is_maintenance: !isMaint }).eq('mobile', '7988300872');
                if (!res.error) { Swal.fire({title:'Success', text:'Website status updated.', icon:'success', target: document.getElementById('adminPage') || 'body'}); loadAdminData(); } 
                else { Swal.fire('Error', res.error.message, 'error'); }
            };

            var response = await db.from('users').select('*').order('id', {ascending: false});
            if (response.error) throw response.error;
            
            adminTableBody.innerHTML = ''; adminRequestsBody.innerHTML = '';
            var approvedCount = 0; var pendingCount = 0;

            response.data.forEach(function(user) {
                var reqStatus = user.status ? user.status.toLowerCase() : 'approved';
                var accStatus = user.account_status ? user.account_status.toLowerCase() : 'active';

                if (reqStatus === 'pending') {
                    pendingCount++;
                    var tr1 = document.createElement('tr');
                    tr1.innerHTML = `
                        <td>${user.name}</td><td>${user.mobile}</td><td>${user.email}</td>
                        <td style="white-space:nowrap;">
                            <button class="btn-accept-req" onclick="acceptUserReq('${user.email}')">Accept</button>
                            <button class="btn-reject-req" onclick="rejectUserReq('${user.email}')">Reject</button>
                        </td>
                    `;
                    adminRequestsBody.appendChild(tr1);
                } else if (reqStatus === 'approved') {
                    approvedCount++;
                    var statBadge = accStatus === 'blocked' ? '<span style="color:#d9534f;font-size:0.75rem;display:block;">[BLOCKED]</span>' : (accStatus === 'suspended' ? '<span style="color:#f39c12;font-size:0.75rem;display:block;">[SUSPENDED]</span>' : '');
                    var tr2 = document.createElement('tr');
                    tr2.innerHTML = `
                        <td>${user.name} ${statBadge}</td><td>${user.mobile}</td><td>${user.email}</td>
                        <td>
                            <button class="btn-show-pass" id="btn-show-${user.id}" onclick="revealPassword('${user.id}', '${user.password}')">VIEW</button>
                            <span id="pass-${user.id}" style="display:none;font-weight:bold;"></span>
                        </td>
                        <td><button class="btn-action-manage" onclick="manageUser('${user.email}', '${accStatus}')">Manage</button></td>
                    `;
                    adminTableBody.appendChild(tr2);
                }
            });
            document.getElementById('totalUsersCount').innerText = approvedCount;
            document.getElementById('reqCountBadge').innerText = pendingCount;
            if(pendingCount === 0) adminRequestsBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No pending requests.</td></tr>';
            if(approvedCount === 0) adminTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No active users.</td></tr>';
        } catch (err) { }
    };

    window.revealPassword = function(id, pass) {
        if (localStorage.getItem('hr_user_mobile') === '7988300872') {
            document.getElementById(`btn-show-${id}`).style.display = 'none';
            document.getElementById(`pass-${id}`).style.display = 'inline';
            document.getElementById(`pass-${id}`).innerText = pass;
        } else { Swal.fire('Error', 'Unauthorized action!', 'error'); }
    };

    window.manageUser = function(email, currentStatus) {
        if (!db) return;
        Swal.fire({
            title: 'Manage Account Status',
            html: `Current Status: <strong>${currentStatus.toUpperCase()}</strong><br><br>Select Action:`,
            showDenyButton: true, showCancelButton: true,
            confirmButtonText: 'Block', denyButtonText: 'Suspend', cancelButtonText: 'Unblock / Restore',
            confirmButtonColor: '#d9534f', denyButtonColor: '#f39c12', cancelButtonColor: '#5eb063',
            target: document.getElementById('adminPage') || 'body'
        }).then(async function(result) {
            var newStatus = null;
            if (result.isConfirmed) newStatus = 'Blocked';
            else if (result.isDenied) newStatus = 'Suspended';
            else if (result.dismiss === Swal.DismissReason.cancel) newStatus = 'Active';

            if (newStatus) {
                Swal.fire({title: 'Updating...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), target: document.getElementById('adminPage') || 'body'});
                var res = await db.from('users').update({ account_status: newStatus }).eq('email', email);
                if (!res.error) { Swal.fire({title:'Success', text:`Account updated to ${newStatus}`, icon:'success', target: document.getElementById('adminPage') || 'body'}); loadAdminData(); } 
                else { Swal.fire('Error', res.error.message, 'error'); }
            }
        });
    };

    window.acceptUserReq = async function(email) {
        if(!db) return;
        Swal.fire({title: 'Approving...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), target: document.getElementById('adminPage') || 'body'});
        var res = await db.from('users').update({ status: 'Approved', account_status: 'Active' }).eq('email', email);
        if (!res.error) { Swal.fire({title:'Success', text:'User Approved.', icon:'success', target: document.getElementById('adminPage') || 'body'}); loadAdminData(); } 
        else { Swal.fire('Error', res.error.message, 'error'); }
    };

    window.rejectUserReq = async function(email) {
        if(!db) return;
        Swal.fire({title: 'Rejecting...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), target: document.getElementById('adminPage') || 'body'});
        var res = await db.from('users').delete().eq('email', email);
        if (!res.error) { Swal.fire({title:'Declined', text:'User request rejected and deleted.', icon:'info', target: document.getElementById('adminPage') || 'body'}); loadAdminData(); } 
        else { Swal.fire('Error', res.error.message, 'error'); }
    };

    // =========================================================
    // PHONE & EMAIL UPDATES
    // =========================================================
    window.updatePhoneLimitUI = function() {
        var limitData = JSON.parse(localStorage.getItem('hr_phone_update_history')) || [];
        var thirtyDays = 30 * 24 * 60 * 60 * 1000;
        var validData = limitData.filter(t => (Date.now() - t) < thirtyDays);
        localStorage.setItem('hr_phone_update_history', JSON.stringify(validData));
        var phoneLeft = 2 - validData.length;
        var pt = document.getElementById('phoneLimitText');
        if(pt) pt.innerHTML = phoneLeft <= 0 ? `(Limit Reached)` : `(Limit: 2 Edits / Month - ${phoneLeft} left)`;
        var btnP = document.getElementById('btnSendPhoneOtp');
        if (btnP) btnP.disabled = (phoneLeft <= 0);
    }

    window.updateEmailLimitUI = function() {
        var limitData = JSON.parse(localStorage.getItem('hr_email_update_history')) || [];
        var thirtyDays = 30 * 24 * 60 * 60 * 1000;
        var validData = limitData.filter(t => (Date.now() - t) < thirtyDays);
        localStorage.setItem('hr_email_update_history', JSON.stringify(validData));
        var emailLeft = 2 - validData.length;
        var et = document.getElementById('emailLimitText');
        if(et) et.innerHTML = emailLeft <= 0 ? `(Limit Reached)` : `(Limit: 2 Edits / Month - ${emailLeft} left)`;
        var btnE = document.getElementById('btnSendEmailOtp');
        if (btnE) btnE.disabled = (emailLeft <= 0);
    }

    var btnSendPhoneOtp = document.getElementById('btnSendPhoneOtp');
    var btnVerifyPhoneUpdate = document.getElementById('btnVerifyPhoneUpdate');
    var phoneUpdateOTP = null;

    if (btnSendPhoneOtp) {
        btnSendPhoneOtp.addEventListener('click', async function() {
            var currentMobile = localStorage.getItem('hr_user_mobile');
            var currentEmail = localStorage.getItem('hr_user_email');
            if (!currentMobile || !currentEmail || !db) { Swal.fire('Error', 'System not ready.', 'error'); return; }
            var oldPhone = document.getElementById('oldPhoneInput') ? document.getElementById('oldPhoneInput').value.trim() : '';
            var newPhone = document.getElementById('updatePhoneInput') ? document.getElementById('updatePhoneInput').value.trim() : '';
            
            if (oldPhone !== currentMobile) return Swal.fire({title:'Error', text:'Old mobile mismatch.', icon:'error', target: document.getElementById('settingsPage') || 'body'});
            if (newPhone.length !== 10) return Swal.fire({title:'Invalid', text:'Enter valid 10-digit number.', icon:'warning', target: document.getElementById('settingsPage') || 'body'});
            btnSendPhoneOtp.disabled = true; btnSendPhoneOtp.innerText = "Checking...";
            
            var dup = await db.from('users').select('mobile').eq('mobile', newPhone).maybeSingle();
            if (dup.data) { btnSendPhoneOtp.disabled = false; btnSendPhoneOtp.innerText = "Send OTP"; return Swal.fire('Exists', 'New number already registered.', 'warning'); }
            phoneUpdateOTP = Math.floor(1000 + Math.random() * 9000).toString();
            
            if(typeof emailjs !== 'undefined') {
                emailjs.send("service_ecofefq", "template_grujfl8", { to_email: currentEmail, user_name: localStorage.getItem('hr_user_name') || "User", otp: phoneUpdateOTP })
                .then(() => {
                    document.getElementById('phoneOtpBox').classList.remove('hidden');
                    btnSendPhoneOtp.innerText = "Sent ✓";
                    Swal.fire({title:'OTP Sent', text:`OTP sent to ${currentEmail}`, icon:'success', target: document.getElementById('settingsPage') || 'body'});
                }).catch(e => {
                    btnSendPhoneOtp.disabled = false; btnSendPhoneOtp.innerText = "Send OTP";
                    Swal.fire('Error', 'Failed to send Email.', 'error');
                });
            }
        });
    }

    if (btnVerifyPhoneUpdate) {
        btnVerifyPhoneUpdate.addEventListener('click', async function() {
            var enteredOtp = document.getElementById('phoneOtpInput').value.trim();
            var newPhone = document.getElementById('updatePhoneInput').value.trim();
            var currentEmail = localStorage.getItem('hr_user_email');
            if (enteredOtp === phoneUpdateOTP && db) {
                btnVerifyPhoneUpdate.innerText = "Saving...";
                var res = await db.from('users').update({ mobile: newPhone }).eq('email', currentEmail);
                if (!res.error) {
                    var limitData = JSON.parse(localStorage.getItem('hr_phone_update_history')) || [];
                    limitData.push(Date.now()); localStorage.setItem('hr_phone_update_history', JSON.stringify(limitData));
                    localStorage.setItem('hr_user_mobile', newPhone);
                    document.getElementById('dispMobile').innerText = "+91 " + newPhone;
                    Swal.fire({title:'Success', text:'Phone number changed!', icon:'success', target: document.getElementById('settingsPage') || 'body'});
                    document.getElementById('phoneOtpBox').classList.add('hidden');
                    updatePhoneLimitUI();
                } else { Swal.fire('Error', res.error.message, 'error'); }
                btnVerifyPhoneUpdate.innerText = "Verify & Save";
            } else { Swal.fire({title:'Error', text:'Incorrect OTP', icon:'error', target: document.getElementById('settingsPage') || 'body'}); }
        });
    }

    var btnSendEmailOtp = document.getElementById('btnSendEmailOtp');
    var btnVerifyEmailUpdate = document.getElementById('btnVerifyEmailUpdate');
    var emailUpdateOTP = null;

    if (btnSendEmailOtp) {
        btnSendEmailOtp.addEventListener('click', async function() {
            var currentMobile = localStorage.getItem('hr_user_mobile');
            var currentEmail = localStorage.getItem('hr_user_email');
            if (!currentMobile || !currentEmail || !db) { Swal.fire('Error', 'System not ready.', 'error'); return; }
            var oldEmail = document.getElementById('oldEmailInput') ? document.getElementById('oldEmailInput').value.trim() : '';
            var newEmail = document.getElementById('updateEmailInput') ? document.getElementById('updateEmailInput').value.trim() : '';
            
            if (oldEmail !== currentEmail) return Swal.fire({title:'Error', text:'Old email mismatch.', icon:'error', target: document.getElementById('settingsPage') || 'body'});
            if (!newEmail.includes('@')) return Swal.fire({title:'Invalid', text:'Enter a valid new email address.', icon:'warning', target: document.getElementById('settingsPage') || 'body'});
            btnSendEmailOtp.disabled = true; btnSendEmailOtp.innerText = "Checking...";
            
            var dup = await db.from('users').select('email').eq('email', newEmail).maybeSingle();
            if (dup.data) { btnSendEmailOtp.disabled = false; btnSendEmailOtp.innerText = "Send OTP"; return Swal.fire('Exists', 'New email already registered.', 'warning'); }
            emailUpdateOTP = Math.floor(1000 + Math.random() * 9000).toString();
            
            if(typeof emailjs !== 'undefined') {
                emailjs.send("service_ecofefq", "template_grujfl8", { to_email: newEmail, user_name: localStorage.getItem('hr_user_name') || "User", otp: emailUpdateOTP })
                .then(() => {
                    var emailBox = document.getElementById('emailOtpBox');
                    if(emailBox) emailBox.classList.remove('hidden');
                    btnSendEmailOtp.innerText = "Sent ✓";
                    Swal.fire({title:'OTP Sent', text:`OTP sent to ${newEmail} to verify`, icon:'success', target: document.getElementById('settingsPage') || 'body'});
                }).catch(e => {
                    btnSendEmailOtp.disabled = false; btnSendEmailOtp.innerText = "Send OTP";
                    Swal.fire('Error', 'Failed to send Email.', 'error');
                });
            }
        });
    }

    if (btnVerifyEmailUpdate) {
        btnVerifyEmailUpdate.addEventListener('click', async function() {
            var enteredOtp = document.getElementById('emailOtpInput').value.trim();
            var newEmail = document.getElementById('updateEmailInput').value.trim();
            var currentMobile = localStorage.getItem('hr_user_mobile');
            if (enteredOtp === emailUpdateOTP && db) {
                btnVerifyEmailUpdate.innerText = "Saving...";
                var res = await db.from('users').update({ email: newEmail }).eq('mobile', currentMobile);
                if (!res.error) {
                    var limitData = JSON.parse(localStorage.getItem('hr_email_update_history')) || [];
                    limitData.push(Date.now()); localStorage.setItem('hr_email_update_history', JSON.stringify(limitData));
                    localStorage.setItem('hr_user_email', newEmail);
                    var dispEmail = document.getElementById('dispEmail');
                    if(dispEmail) dispEmail.innerText = newEmail;
                    Swal.fire({title:'Success', text:'Email Address changed!', icon:'success', target: document.getElementById('settingsPage') || 'body'});
                    var eBox = document.getElementById('emailOtpBox');
                    if(eBox) eBox.classList.add('hidden');
                    updateEmailLimitUI();
                } else { Swal.fire('Error', res.error.message, 'error'); }
                btnVerifyEmailUpdate.innerText = "Verify & Save";
            } else { Swal.fire({title:'Error', text:'Incorrect OTP', icon:'error', target: document.getElementById('settingsPage') || 'body'}); }
        });
    }

    // =========================================================
    // SEARCH & TIMETABLE LOGIC
    // =========================================================
    var busData = [
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "05:10 AM", time24: "05:10", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "06:00 AM", time24: "06:00", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "06:40 AM", time24: "06:40", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "06:50 AM", time24: "06:50", busType: "Ordinary", arr: "HR" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:10 AM", time24: "05:10", busType: "AC", arr: "KBS" },
        { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:10 AM", time24: "06:10", busType: "Ordinary", arr: "HR" }
    ];

    var form = document.getElementById('searchForm');
    var sourceInput = document.getElementById('source');
    var destInput = document.getElementById('destination');
    var skeletonLoader = document.getElementById('skeletonLoader');
    var emptyState = document.getElementById('emptyState');
    var resultsTableWrapper = document.getElementById('resultsTableWrapper');
    var tableBody = document.getElementById('tableBody');

    if (form && sourceInput && destInput && tableBody) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            var fromVal = sourceInput.value.trim().toLowerCase();
            var toVal = destInput.value.trim().toLowerCase();

            if(resultsTableWrapper) resultsTableWrapper.style.display = 'none';
            if(emptyState) emptyState.style.display = 'none';
            tableBody.innerHTML = '';
            if(skeletonLoader) skeletonLoader.style.display = 'flex'; 

            setTimeout(function() {
                if(skeletonLoader) skeletonLoader.style.display = 'none';
                var results = busData.filter(function(bus) { return bus.from.toLowerCase().trim() === fromVal && bus.to.toLowerCase().trim() === toVal; });

                if (results.length > 0) {
                    results.forEach(function(bus, index) {
                        var tr = document.createElement('tr');
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
                    if(resultsTableWrapper) { resultsTableWrapper.style.display = 'block'; resultsTableWrapper.classList.add('slide-in-bottom'); }
                } else { if(emptyState) emptyState.style.display = 'block'; }
            }, 1500); 
        });
    }

    // ==========================================
    // BULLETPROOF FOOTER & MODAL LOGIC (FIXED)
    // ==========================================
    document.body.addEventListener('click', function(e) {
        
        // 1. Get the element that was clicked
        var target = e.target;
        var parentTarget = target.closest('a, button, span, div');
        var clickedText = target.innerText ? target.innerText.toLowerCase() : '';
        if(parentTarget && parentTarget.innerText) clickedText = parentTarget.innerText.toLowerCase();

        // 2. Identify which modal to open based on text or ID
        if (target.id === 'openTncBtn' || (parentTarget && parentTarget.id === 'openTncBtn') || clickedText.includes('terms') || clickedText.includes('t&c')) {
            var modal = document.getElementById('tncModal');
            if(modal && !target.closest('.glass-modal-overlay')) { e.preventDefault(); modal.classList.add('active'); document.body.style.overflow = 'hidden'; return; }
        }
        
        if (target.id === 'openPrivacyBtn' || (parentTarget && parentTarget.id === 'openPrivacyBtn') || clickedText.includes('privacy')) {
            var pModal = document.getElementById('privacyModal');
            if(pModal && !target.closest('.glass-modal-overlay')) { e.preventDefault(); pModal.classList.add('active'); document.body.style.overflow = 'hidden'; return; }
        }
        
        if (target.id === 'openDisclaimerBtn' || (parentTarget && parentTarget.id === 'openDisclaimerBtn') || clickedText.includes('disclaimer')) {
            var dModal = document.getElementById('disclaimerModal');
            if(dModal && !target.closest('.glass-modal-overlay')) { e.preventDefault(); dModal.classList.add('active'); document.body.style.overflow = 'hidden'; return; }
        }

        // 3. Premium Close / Accept Buttons Logic
        if (e.target.closest('#closeTncBtn') || e.target.id === 'closeTncBtn' || e.target.closest('.glass-close')) {
            var modalClose = e.target.closest('.glass-modal-overlay');
            if(modalClose) { modalClose.classList.remove('active'); document.body.style.overflow = 'auto'; }
        }

        if (e.target.closest('#acceptTncBtn') || e.target.id === 'acceptTncBtn') {
            var modalAcc = e.target.closest('.glass-modal-overlay') || document.getElementById('tncModal');
            if(modalAcc) { modalAcc.classList.remove('active'); document.body.style.overflow = 'auto'; }
            var termsCheck = document.getElementById('termsCheck');
            if(termsCheck) termsCheck.checked = true;
        }

        // 4. Overlay Outside Click Close
        if (e.target.classList.contains('glass-modal-overlay')) {
            e.target.classList.remove('active'); document.body.style.overflow = 'auto';
        }
    });

    // =========================================================
    // 🚍 LIVE SPEED TRACKER LOGIC
    // =========================================================
    var watchId = null;
    var totalDistance = 0;
    var lastLat = null;
    var lastLon = null;

    var openBtn = document.getElementById('openTrackerBtn');
    var modal = document.getElementById('speedTrackerModal');
    var closeBtn = document.getElementById('btnCloseTracker');
    var startBtn = document.getElementById('btnStartTracker');
    var pauseBtn = document.getElementById('btnPauseTracker');
    var stopBtn = document.getElementById('btnStopTracker');
    
    var speedVal = document.getElementById('speedVal');
    var speedGauge = document.getElementById('speedGauge');
    var speedStatusBadge = document.getElementById('speedStatusBadge');
    var gpsStatus = document.getElementById('gpsStatus');
    var gpsDirection = document.getElementById('gpsDirection');
    var gpsDistance = document.getElementById('gpsDistance');
    var gpsTime = document.getElementById('gpsTime');

    if (openBtn) { openBtn.addEventListener('click', () => { if(modal) modal.classList.add('active'); }); }
    if (closeBtn) { closeBtn.addEventListener('click', () => { if(modal) modal.classList.remove('active'); }); }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; 
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; 
    }

    function getDirection(heading) {
        if (heading === null || isNaN(heading)) return '--';
        var val = Math.floor((heading / 22.5) + 0.5);
        var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return arr[(val % 16)];
    }

    function updateUI(speedKmH, heading) {
        speedKmH = Math.max(0, speedKmH);
        if(speedVal) speedVal.innerText = speedKmH < 10 ? '0' + speedKmH.toFixed(0) : speedKmH.toFixed(0);
        if(gpsDirection) gpsDirection.innerText = getDirection(heading);
        if(gpsDistance) gpsDistance.innerText = totalDistance.toFixed(2) + ' km';
        
        var d = new Date();
        if(gpsTime) gpsTime.innerText = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0') + ':' + d.getSeconds().toString().padStart(2, '0');

        var color = '#e0e0e0';
        var statText = 'Idle';
        
        if (speedKmH > 0 && speedKmH <= 20) { color = '#5eb063'; statText = 'Low Speed 🟢'; }
        else if (speedKmH > 20 && speedKmH <= 50) { color = '#f39c12'; statText = 'Medium 🟡'; }
        else if (speedKmH > 50 && speedKmH <= 80) { color = '#e67e22'; statText = 'High 🟠'; }
        else if (speedKmH > 80) { color = '#d9534f'; statText = 'Very High 🔴'; }

        if(speedStatusBadge) {
            speedStatusBadge.style.background = color;
            speedStatusBadge.style.color = 'white';
            speedStatusBadge.innerText = statText;
        }

        if(speedGauge) {
            var percentage = Math.min(speedKmH / 120 * 100, 100);
            speedGauge.style.background = `conic-gradient(${color} ${percentage}%, transparent 0)`;
        }
    }

    function success(pos) {
        if(gpsStatus) { gpsStatus.innerText = "Connected 🛰️"; gpsStatus.style.color = "#5eb063"; }
        var crd = pos.coords;
        
        if (lastLat !== null && lastLon !== null) {
            totalDistance += calculateDistance(lastLat, lastLon, crd.latitude, crd.longitude);
        }
        lastLat = crd.latitude; lastLon = crd.longitude;
        var speed = crd.speed ? (crd.speed * 3.6) : 0; 
        updateUI(speed, crd.heading);
    }

    function error(err) {
        if(gpsStatus) { gpsStatus.innerText = "GPS Error ❌"; gpsStatus.style.color = "#d9534f"; }
        if (err.code === 1) {
            Swal.fire({ title: 'Permission Denied', text: 'Location permission is required to use Live Speed Tracker.', icon: 'error', target: document.getElementById('speedTrackerModal') || 'body' });
            stopTracking();
        }
    }

    function startTracking() {
        if (!navigator.geolocation) { Swal.fire('Error', 'Geolocation is not supported', 'error'); return; }
        if(gpsStatus) { gpsStatus.innerText = "Searching... 📡"; gpsStatus.style.color = "#f39c12"; }
        if(startBtn) startBtn.style.display = 'none';
        if(pauseBtn) pauseBtn.style.display = 'flex';
        if(stopBtn) stopBtn.style.display = 'flex';
        watchId = navigator.geolocation.watchPosition(success, error, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    }

    function stopTracking() {
        if (watchId) navigator.geolocation.clearWatch(watchId);
        lastLat = null; lastLon = null; totalDistance = 0;
        updateUI(0, null);
        if(gpsStatus) { gpsStatus.innerText = "Stopped ⏹"; gpsStatus.style.color = "#d9534f"; }
        if(startBtn) startBtn.style.display = 'flex';
        if(pauseBtn) pauseBtn.style.display = 'none';
        if(stopBtn) stopBtn.style.display = 'none';
    }

    function pauseTracking() {
        if (watchId) navigator.geolocation.clearWatch(watchId);
        if(gpsStatus) { gpsStatus.innerText = "Paused ⏸"; gpsStatus.style.color = "#f39c12"; }
        if(startBtn) startBtn.style.display = 'flex';
        if(pauseBtn) pauseBtn.style.display = 'none';
    }

    if(startBtn) startBtn.addEventListener('click', startTracking);
    if(stopBtn) stopBtn.addEventListener('click', stopTracking);
    if(pauseBtn) pauseBtn.addEventListener('click', pauseTracking);

});
