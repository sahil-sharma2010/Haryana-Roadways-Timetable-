// === PREMIUM STYLES INJECTION ===
if (typeof document !== 'undefined') {
    var style = document.createElement('style');
    style.innerHTML = `
        .swal2-container { z-index: 9999999 !important; }
        #acceptTncBtn { background: linear-gradient(135deg, #5eb063, #4a914f) !important; color: white !important; border: none !important; padding: 10px 24px !important; border-radius: 25px !important; font-weight: 600 !important; cursor: pointer !important; box-shadow: 0 4px 10px rgba(94, 176, 99, 0.3) !important; transition: all 0.3s ease !important; }
        #acceptTncBtn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(94, 176, 99, 0.4) !important; }
        #closeTncBtn { background: #f1f3f5 !important; color: #333 !important; border: none !important; padding: 10px 24px !important; border-radius: 25px !important; font-weight: 600 !important; cursor: pointer !important; transition: all 0.3s ease !important; }
        #closeTncBtn:hover { background: #e2e6ea !important; }
    `;
    document.head.appendChild(style);
}

// === SAFE GLOBAL VARIABLES ===
var isOtpVerified = false;
var generatedOTP = null;
var forgotGeneratedOTP = null;
var isForgotOtpVerified = false;

// === SMART DATABASE CONNECTION ===
var SUPABASE_URL = 'https://wapxdmpwvhcsrnfiodjd.supabase.co'; 
var SUPABASE_ANON_KEY = 'sb_publishable_odtRBN3c0mV917RGbwCCKA_JuwKHVUU'; 
var supabaseClient = null;

function getDB() {
    if (supabaseClient) return supabaseClient;
    if (typeof window.supabase !== 'undefined') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return supabaseClient;
    }
    return null;
}

async function hashString(str) {
    try {
        var buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
        return Array.prototype.map.call(new Uint8Array(buffer), x => (('00'+x.toString(16)).slice(-2))).join('');
    } catch(e) { return btoa(str + "_HR"); }
}

document.addEventListener("DOMContentLoaded", async function() {
    
    // Redirect if already logged in
    if (localStorage.getItem('hr_logged_in') === 'true') { window.location.href = 'index.html'; }
    if (typeof emailjs !== 'undefined') { try { emailjs.init("K6cs_matxXu2begVg"); } catch (e) {} }

    // ==========================================
    // SHOW BLOCKED & MAINTENANCE POPUPS
    // ==========================================
    var kickedReason = localStorage.getItem('hr_kicked_reason');
    if (kickedReason) {
        localStorage.removeItem('hr_kicked_reason'); 
        if (kickedReason === 'maintenance') {
            Swal.fire({ 
                title: 'Site Under Maintenance', 
                html: "You can't login now because the site is under maintenance.", 
                icon: 'warning', 
                confirmButtonText: 'Okk',
                confirmButtonColor: '#d9534f'
            });
        } else if (kickedReason === 'blocked') {
            Swal.fire({ title: 'Account Blocked', html: 'Your account has been blocked by the Administrator.<br>If this is a mistake, contact support.', icon: 'error' });
        } else if (kickedReason === 'suspended') {
            Swal.fire({ title: 'Account Suspended', html: 'Your account is temporarily suspended.', icon: 'warning' });
        } else if (kickedReason === 'rejected' || kickedReason === 'declined') {
            Swal.fire({ title: 'Access Denied', html: 'Your account request was rejected.', icon: 'error' });
        } else if (kickedReason === 'pending') {
            Swal.fire({ title: 'Pending Approval', html: 'Your account is still pending approval by the Admin.', icon: 'info' });
        }
    }

    // ==========================================
    // AUTO-ENABLE BUTTONS 
    // ==========================================
    setInterval(function() {
        var n = document.getElementById('fullName');
        var m = document.getElementById('mobile');
        var e = document.getElementById('email');
        var btnSend = document.getElementById('btnSendOtp');
        var btnReg = document.getElementById('btnRegisterSubmit');
        var pass = document.getElementById('password');
        var cpass = document.getElementById('confirmPassword');
        var terms = document.getElementById('termsCheck');

        if (n && m && e && btnSend) {
            var nv = n.value.trim();
            var mv = m.value.trim();
            var ev = e.value.trim();
            
            var isValid = nv.length >= 2 && mv.length === 10 && /^\d+$/.test(mv) && ev.includes('@') && ev.includes('.');

            if (btnSend.innerText === "Send OTP" || btnSend.innerText === "Resend OTP") {
                btnSend.disabled = !isValid;
                if(isValid) {
                    btnSend.style.background = "var(--primary-blue)";
                    btnSend.style.color = "white";
                    btnSend.style.cursor = "pointer";
                } else {
                    btnSend.style.background = "#cdd5df";
                    btnSend.style.color = "#333";
                    btnSend.style.cursor = "not-allowed";
                }
            }

            if (btnReg) {
                var pv = pass ? pass.value.trim() : '';
                var cpv = cpass ? cpass.value.trim() : '';
                var isPassValid = pv.length === 4 && pv === cpv;
                var isTerms = terms ? terms.checked : false;

                if (btnReg.innerText === "REGISTER") {
                    btnReg.disabled = !(isValid && isOtpVerified && isPassValid && isTerms);
                    if(!(isValid && isOtpVerified && isPassValid && isTerms)) {
                        btnReg.style.background = "#cdd5df";
                    } else {
                        btnReg.style.background = "var(--accent-green)";
                    }
                }
            }
        }
    }, 300);

    function showSection(section) {
        ['registerSection', 'loginSection', 'forgotSection', 'pendingStateSection'].forEach(id => {
            var el = document.getElementById(id);
            if(el) el.classList.add('hidden');
        });
        
        var authHeaderBlock = document.getElementById('authHeaderBlock');
        var mainAuthTitle = document.getElementById('mainAuthTitle');

        if(authHeaderBlock) authHeaderBlock.classList.remove('hidden');

        if (section === 'register') {
            document.getElementById('registerSection').classList.remove('hidden');
            if(mainAuthTitle) mainAuthTitle.innerText = "HR REGISTER";
        } else if (section === 'login') {
            document.getElementById('loginSection').classList.remove('hidden');
            if(mainAuthTitle) mainAuthTitle.innerText = "HR LOGIN";
        } else if (section === 'forgot') {
            document.getElementById('forgotSection').classList.remove('hidden');
            if(mainAuthTitle) mainAuthTitle.innerText = "RESET PASSWORD";
        } else if (section === 'pending') {
            document.getElementById('pendingStateSection').classList.remove('hidden');
            if(authHeaderBlock) authHeaderBlock.classList.add('hidden'); 
        }
    }

    var pendingEmail = localStorage.getItem('hr_pending_email');
    if (pendingEmail) { showSection('pending'); } else { showSection('login'); }

    var btnMap = {
        'showLoginBtn': 'login',
        'showRegisterBtn': 'register',
        'showForgotBtn': 'forgot',
        'backToLoginBtn': 'login'
    };

    for (var btnId in btnMap) {
        var btn = document.getElementById(btnId);
        if (btn) {
            (function(target) {
                btn.addEventListener('click', function(e) { e.preventDefault(); showSection(target); });
            })(btnMap[btnId]);
        }
    }

    var btnCancelPending = document.getElementById('btnCancelPending');
    if(btnCancelPending) {
        btnCancelPending.addEventListener('click', function() {
            localStorage.removeItem('hr_pending_email');
            showSection('login');
        });
    }

    // ==========================================
    // CHECK STATUS BUTTON
    // ==========================================
    var btnCheckStatus = document.getElementById('btnCheckStatus');
    if (btnCheckStatus) {
        btnCheckStatus.addEventListener('click', async function() {
            var db = getDB();
            if (!db) { Swal.fire('Error','Database disconnected. Please check connection.','error'); return; }
            
            var emailToCheck = localStorage.getItem('hr_pending_email');
            if (!emailToCheck) return;

            btnCheckStatus.disabled = true;
            btnCheckStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking...';

            try {
                var res = await db.from('users').select('*').eq('email', emailToCheck).maybeSingle();
                if (res.data) {
                    var currentStatus = res.data.status ? res.data.status.toLowerCase() : 'approved';
                    if (currentStatus === 'pending') {
                        Swal.fire({ title: "⏳ Application Pending", html: "Your registration is under review.", icon: "info" });
                    } else if (currentStatus === 'rejected' || currentStatus === 'declined') {
                        localStorage.removeItem('hr_pending_email'); 
                        Swal.fire({ title: 'Declined', html: "Your request was declined.", icon: "error"}).then(() => showSection('login'));
                    } else {
                        localStorage.removeItem('hr_pending_email'); 
                        Swal.fire({ title: 'Approved!', html: 'Your account has been approved.', icon: 'success' }).then(() => showSection('login'));
                    }
                } else {
                    localStorage.removeItem('hr_pending_email'); 
                    Swal.fire({ title: 'Declined', html: "Account not found or rejected.", icon: "error" }).then(() => showSection('login'));
                }
            } catch (err) { console.error(err); }
            
            btnCheckStatus.disabled = false;
            btnCheckStatus.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Check Status';
        });
    }

    // ==========================================
    // LOGIN LOGIC
    // ==========================================
    var loginForm = document.getElementById('loginForm');
    var loginMobile = document.getElementById('loginMobile');
    var loginPin = document.getElementById('loginPin');
    var btnLoginSubmit = document.getElementById('btnLoginSubmit');

    if (loginForm && loginMobile && loginPin && btnLoginSubmit) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            var db = getDB();
            if (!db) { Swal.fire('Error', 'Database disconnected! Please refresh the page.', 'error'); return; }

            var mobVal = loginMobile.value.trim();
            var passVal = loginPin.value.trim();

            if (mobVal.length !== 10 || passVal.length !== 4) { Swal.fire('Error', 'Invalid Details', 'error'); return; }

            btnLoginSubmit.disabled = true; btnLoginSubmit.innerText = "Checking...";

            try {
                var adminRes = await db.from('users').select('is_maintenance').eq('mobile', '7988300872').maybeSingle();
                if (adminRes.data && adminRes.data.is_maintenance === true && mobVal !== '7988300872') {
                    Swal.fire({ title: 'Site Under Maintenance', html: "You can't login now because the site is under maintenance", icon: 'warning', confirmButtonText: 'Okk', confirmButtonColor: '#d9534f' });
                    btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN";
                    return;
                }

                var res = await db.from('users').select('*').eq('mobile', mobVal).maybeSingle();
                var user = res.data;
                
                if (!user) {
                    Swal.fire({ title: "Not Found", text: "Create an account first.", icon: "warning" }).then(() => showSection('register'));
                    btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN"; return;
                }

                var reqStatus = user.status ? user.status.toLowerCase() : 'approved';
                var accStatus = user.account_status ? user.account_status.toLowerCase() : 'active';

                if (reqStatus === 'pending') {
                    Swal.fire({ title: "⏳ Pending", text: "Please wait for approval.", icon: "info" });
                    btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN"; return;
                }
                if (accStatus === 'blocked' || accStatus === 'suspended') {
                    Swal.fire({ title: `Account ${accStatus}`, text: "Your account is restricted by Administrator.", icon: "error" });
                    btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN"; return;
                }

                var hashedAttempt = await hashString(passVal);
                if (user.password !== hashedAttempt && user.pin !== hashedAttempt && user.pin !== passVal && user.password !== passVal) {
                    Swal.fire({ title: "Wrong Password", text: "Incorrect PIN.", icon: "error" });
                    btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN"; return;
                }

                localStorage.setItem('hr_logged_in', 'true'); 
                localStorage.setItem('hr_user_name', user.name);
                localStorage.setItem('hr_user_email', user.email);
                localStorage.setItem('hr_user_mobile', user.mobile);
                
                await db.from("login_history").insert({ name: user.name, email: user.email, login_status: "SUCCESS", device: navigator.platform, browser: navigator.userAgent });
                window.location.href = 'index.html';

            } catch (err) {
                Swal.fire({ title: 'Error', text: 'Server error.', icon: 'error' });
                btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN";
            }
        });
    }

    // ==========================================
    // REGISTER LOGIC & OTP
    // ==========================================
    var btnSendOtp = document.getElementById('btnSendOtp');
    var emailInput = document.getElementById('email');
    var mobileInput = document.getElementById('mobile');
    var nameInput = document.getElementById('fullName');
    
    if (btnSendOtp && emailInput && mobileInput && nameInput) {
        btnSendOtp.addEventListener('click', async function(e) {
            e.preventDefault();
            var db = getDB();
            
            if(!db) { Swal.fire('Error', 'Database disconnected. Refresh and try again.', 'error'); return; }
            if(typeof emailjs === 'undefined') { Swal.fire('Error', 'Email system not loaded. Refresh page.', 'error'); return; }
            
            var eVal = emailInput.value.trim();
            var nVal = nameInput.value.trim();
            var mVal = mobileInput.value.trim();
            
            if(!eVal.includes('@')) { Swal.fire('Error', 'Invalid Email', 'error'); return; }
            
            btnSendOtp.disabled = true; btnSendOtp.innerText = "Checking DB...";
            
            var dupCheck = await db.from('users').select('*').or(`email.eq.${eVal},mobile.eq.${mVal}`);
            if (dupCheck.data && dupCheck.data.length > 0) {
                Swal.fire('Already Registered', 'These details already exist in database', 'warning');
                btnSendOtp.disabled = false; btnSendOtp.innerText = "Send OTP"; return;
            }
            
            generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
            btnSendOtp.innerText = "Sending...";
            
            emailjs.send("service_ecofefq", "template_grujfl8", { to_email: eVal, user_name: nVal, otp: generatedOTP }).then(() => {
                document.getElementById('otpBox').classList.remove('hidden');
                Swal.fire('OTP Sent!', `OTP sent to ${eVal}`, 'success');
                setTimeout(() => { btnSendOtp.disabled = false; btnSendOtp.innerText = "Resend OTP"; }, 30000); 
            }).catch(err => {
                Swal.fire('Error', 'Failed to send OTP email.', 'error');
                btnSendOtp.disabled = false; btnSendOtp.innerText = "Send OTP";
            });
        });
    }

    var btnVerifyOtp = document.getElementById('btnVerifyOtp');
    var otpInput = document.getElementById('otpInput');
    if (btnVerifyOtp && otpInput) {
        btnVerifyOtp.addEventListener('click', function(e) {
            e.preventDefault();
            if (otpInput.value === generatedOTP) {
                isOtpVerified = true; otpInput.disabled = true; btnVerifyOtp.disabled = true;
                btnVerifyOtp.innerHTML = '<i class="fa-solid fa-check"></i> Verified';
                btnVerifyOtp.style.background = "#5eb063"; btnVerifyOtp.style.color = "white";
                document.getElementById('pinSetupBox').classList.remove('hidden');
                Swal.fire('Valid OTP', 'OTP Verified Successfully!', 'success');
            } else { Swal.fire('Invalid OTP', 'Wrong OTP!', 'error'); }
        });
    }

    var authForm = document.getElementById('authForm');
    var passInput = document.getElementById('password');
    var confirmPassInput = document.getElementById('confirmPassword');
    var termsCheck = document.getElementById('termsCheck');
    var btnRegisterSubmit = document.getElementById('btnRegisterSubmit');

    if (authForm && btnRegisterSubmit) {
        authForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            var db = getDB();
            if (!isOtpVerified || !db) return;

            var p1 = passInput ? passInput.value : "";
            var p2 = confirmPassInput ? confirmPassInput.value : "";
            var tCheck = termsCheck ? termsCheck.checked : false;

            if (p1.length !== 4 || p1 !== p2) { Swal.fire('Invalid Password', 'Ensure 4 digits match.', 'warning'); return; }
            if (!tCheck) { Swal.fire('Terms', 'Please accept T&C', 'warning'); return; }

            btnRegisterSubmit.disabled = true; btnRegisterSubmit.innerText = "Processing...";
            var hashedPass = await hashString(p1);

            var ins = await db.from('users').insert([{
                name: nameInput.value, mobile: mobileInput.value, email: emailInput.value, password: p1, pin: hashedPass, status: 'Pending', account_status: 'Active', termsaccepted: tCheck
            }]);

            if (!ins.error) {
                localStorage.setItem('hr_pending_email', emailInput.value); 
                Swal.fire({ title: 'Submitted', text: 'Account added to waiting list.', icon: 'success' }).then(() => { authForm.reset(); showSection('pending'); });
            } else {
                Swal.fire('Error', ins.error.message, 'error');
                btnRegisterSubmit.disabled = false; btnRegisterSubmit.innerText = "REGISTER";
            }
        });
    }

    // ==========================================
    // BULLETPROOF FOOTER & MODAL LOGIC
    // ==========================================
    document.body.addEventListener('click', function(e) {
        
        var tncTarget = e.target.closest('#openTncBtn, .open-tnc-btn, a[href="#tnc"]') || (e.target.tagName === 'A' && e.target.innerText.includes('Terms'));
        var privacyTarget = e.target.closest('#openPrivacyBtn, .open-privacy-btn, a[href="#privacy"]') || (e.target.tagName === 'A' && e.target.innerText.includes('Privacy'));
        var discTarget = e.target.closest('#openDisclaimerBtn, .open-disclaimer-btn, a[href="#disclaimer"]') || (e.target.tagName === 'A' && e.target.innerText.includes('Disclaimer'));

        if (tncTarget) { e.preventDefault(); var m = document.getElementById('tncModal'); if(m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; } }
        if (privacyTarget) { e.preventDefault(); var p = document.getElementById('privacyModal'); if(p) { p.classList.add('active'); document.body.style.overflow = 'hidden'; } }
        if (discTarget) { e.preventDefault(); var d = document.getElementById('disclaimerModal'); if(d) { d.classList.add('active'); document.body.style.overflow = 'hidden'; } }
        
        // Premium Close / Accept Buttons
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

        if (e.target.classList.contains('glass-modal-overlay')) {
            e.target.classList.remove('active'); document.body.style.overflow = 'auto';
        }
    });

});
