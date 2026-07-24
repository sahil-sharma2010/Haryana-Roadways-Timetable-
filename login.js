let isOtpVerified = false;
let generatedOTP = null;
let forgotGeneratedOTP = null;
let isForgotOtpVerified = false;

// ADDED BAD WORDS ARRAY TO FIX REFERENCE ERROR CRASH
const badWords = ['admin', 'fake', 'test', 'dummy', 'abuse', 'fuck', 'shit'];

// === NEW DUPLICATE TRACKING VARIABLES ===
let isMobileDuplicate = false;
let isEmailDuplicate = false;

async function hashString(str) {
    try {
        const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
        return Array.prototype.map.call(new Uint8Array(buffer), x => (('00'+x.toString(16)).slice(-2))).join('');
    } catch(e) {
        return btoa(str + "_HR"); 
    }
}

// Multi-Language Toggle for Modals
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

document.addEventListener("DOMContentLoaded", async () => {
    if (localStorage.getItem('hr_logged_in') === 'true') { window.location.href = 'index.html'; }

    const registerSection = document.getElementById('registerSection');
    const loginSection = document.getElementById('loginSection');
    const forgotSection = document.getElementById('forgotSection');
    const pendingSection = document.getElementById('pendingStateSection');
    const authHeaderBlock = document.getElementById('authHeaderBlock');
    const mainAuthTitle = document.getElementById('mainAuthTitle');
    
    function showSection(section) {
        if(registerSection) registerSection.classList.add('hidden');
        if(loginSection) loginSection.classList.add('hidden');
        if(forgotSection) forgotSection.classList.add('hidden');
        if(pendingSection) pendingSection.classList.add('hidden');
        if(authHeaderBlock) authHeaderBlock.classList.remove('hidden');

        if (section === 'register' && registerSection) {
            registerSection.classList.remove('hidden');
            if(mainAuthTitle) mainAuthTitle.innerText = "HR REGISTER";
        } else if (section === 'login' && loginSection) {
            loginSection.classList.remove('hidden');
            if(mainAuthTitle) mainAuthTitle.innerText = "HR LOGIN";
        } else if (section === 'forgot' && forgotSection) {
            forgotSection.classList.remove('hidden');
            if(mainAuthTitle) mainAuthTitle.innerText = "RESET PASSWORD";
        } else if (section === 'pending' && pendingSection) {
            pendingSection.classList.remove('hidden');
            if(authHeaderBlock) authHeaderBlock.classList.add('hidden'); 
        }
    }

    const pendingEmail = localStorage.getItem('hr_pending_email');
    if (pendingEmail) { showSection('pending'); } else { showSection('login'); } // Defaults to Login!

    // Bulletproof click event attachments
    const showLoginBtn = document.getElementById('showLoginBtn');
    if(showLoginBtn) showLoginBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('login'); });

    const showRegisterBtn = document.getElementById('showRegisterBtn');
    if(showRegisterBtn) showRegisterBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('register'); });

    const showForgotBtn = document.getElementById('showForgotBtn');
    if(showForgotBtn) showForgotBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('forgot'); });

    const backToLoginBtn = document.getElementById('backToLoginBtn');
    if(backToLoginBtn) backToLoginBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('login'); });

    const btnCancelPending = document.getElementById('btnCancelPending');
    if(btnCancelPending) {
        btnCancelPending.addEventListener('click', () => {
            localStorage.removeItem('hr_pending_email');
            showSection('login');
        });
    }

    let supabase = null;
    try {
        emailjs.init("K6cs_matxXu2begVg"); 
        const SUPABASE_URL = 'https://wapxdmpwvhcsrnfiodjd.supabase.co'; 
        const SUPABASE_ANON_KEY = 'sb_publishable_odtRBN3c0mV917RGbwCCKA_JuwKHVUU'; 
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) { console.error("Database connection failed", error); }

    // ==========================================
    // 0. ADMIN APPROVAL AUTOMATION (via URL) + EmailJS Update
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const adminAction = urlParams.get('action');
    const targetEmail = urlParams.get('email');
    const targetName = urlParams.get('name');
    const targetMob = urlParams.get('mob');
    const targetPass = urlParams.get('pass');

    if ((adminAction === 'accept' || adminAction === 'decline') && targetEmail && supabase) {
        Swal.fire({ title: 'Processing Admin Request...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        if (adminAction === 'accept') {
            try {
                const { error } = await supabase.from('users').update({ status: 'Approved' }).eq('email', targetEmail);
                if (!error) {
                    // Send EmailJS Notification to User
                    const templateParams = {
                        subject: "🎉 Registration Approved – Haryana Roadways Timetable",
                        status: "Registration Approved Successfully",
                        message: "Congratulations! Your registration has been approved successfully. You can now log in using your registered credentials.",
                        name: targetName,
                        mobile: targetMob,
                        email: targetEmail,
                        password: targetPass,
                        color: "#0b7d35",
                        login_link: window.location.href.split('?')[0] // Base URL
                    };
                    
                    await emailjs.send("service_ecofefq", "template_vryvuck", templateParams);

                    Swal.fire("Success", "User Approved and notification sent to their email.", "success").then(()=> window.location.href = window.location.pathname);
                } else {
                    Swal.fire("Error", error.message, "error");
                }
            } catch (err) {
                Swal.fire("Error", "Failed to process approval.", "error");
            }

        } else if (adminAction === 'decline') {
            try {
                const { error } = await supabase.from('users').update({ status: 'Rejected' }).eq('email', targetEmail);
                if (!error) {
                    // Send EmailJS Notification to User
                    const templateParams = {
                        subject: "Registration Declined – Haryana Roadways Timetable",
                        status: "Registration Request Declined",
                        message: "We regret to inform you that your registration request has been declined. Please contact the administrator for further assistance.",
                        name: targetName,
                        mobile: targetMob || "N/A",
                        email: targetEmail,
                        password: "N/A",
                        color: "#d32f2f",
                        login_link: window.location.href.split('?')[0] // Base URL
                    };
                    
                    await emailjs.send("service_ecofefq", "template_vryvuck", templateParams);

                    Swal.fire("Declined", "User request has been declined and notification sent.", "info").then(()=> window.location.href = window.location.pathname);
                } else {
                    Swal.fire("Error", error.message, "error");
                }
            } catch (err) {
                Swal.fire("Error", "Failed to process decline.", "error");
            }
        }
    }

    // ==========================================
    // CHECK STATUS FROM PERSISTENT PAGE
    // ==========================================
    const btnCheckStatus = document.getElementById('btnCheckStatus');
    if (btnCheckStatus) {
        btnCheckStatus.addEventListener('click', async () => {
            if (!supabase) return;
            const emailToCheck = localStorage.getItem('hr_pending_email');
            if (!emailToCheck) return;

            btnCheckStatus.disabled = true;
            btnCheckStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking...';

            try {
                const { data: user } = await supabase.from('users').select('*').eq('email', emailToCheck).maybeSingle();
                if (user) {
                    const currentStatus = user.status ? user.status.toLowerCase() : 'approved';
                    if (currentStatus === 'pending') {
                        Swal.fire({ title: "⏳ Application Pending", html: "Your registration request is under review.<br><br>Please wait for administrator approval.", icon: "info", confirmButtonColor: "#0b4595" });
                    } else if (currentStatus === 'rejected' || currentStatus === 'declined') {
                        localStorage.removeItem('hr_pending_email'); 
                        Swal.fire({ title: "❌ Registration Rejected", html: "Your registration request has been rejected by the administrator.<br><br>Please contact support for more information.", icon: "error", confirmButtonColor: "#d9534f" }).then(() => { showSection('login'); });
                    } else {
                        localStorage.removeItem('hr_pending_email'); 
                        Swal.fire({ title: "✅ Registration Approved", text: "Your account is approved! You can now log in.", icon: "success", confirmButtonColor: "#5eb063" }).then(() => { showSection('login'); });
                    }
                }
            } catch (err) { }
            btnCheckStatus.disabled = false;
            btnCheckStatus.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Check Status';
        });
    }

    // ==========================================
    // 1. REGISTER LOGIC
    // ==========================================
    const fullName = document.getElementById('fullName');
    const mobile = document.getElementById('mobile');
    const email = document.getElementById('email');
    const passwordInput = document.getElementById('password'); 
    const confirmPasswordInput = document.getElementById('confirmPassword'); 
    const termsCheck = document.getElementById('termsCheck');
    const btnSendOtp = document.getElementById('btnSendOtp');
    const btnRegisterSubmit = document.getElementById('btnRegisterSubmit');
    const btnVerifyOtp = document.getElementById('btnVerifyOtp');
    const otpInput = document.getElementById('otpInput');
    const authForm = document.getElementById('authForm');
    const blockMessage = document.getElementById('blockMessage');

    // === UPDATED forceCheckValidity FUNCTION ===
    function forceCheckValidity() {
        if (!fullName || !mobile || !email || !btnSendOtp) return;
        const n = fullName.value.trim();
        const m = mobile.value.trim();
        const e = email.value.trim();
        const p = passwordInput ? passwordInput.value.trim() : "";
        const isChecked = termsCheck ? termsCheck.checked : false;

        const isNameValid = n.length >= 2;
        const isMobileValid = m.length === 10 && /^\d+$/.test(m);
        const isEmailValid = e.includes('@') && e.includes('.');

        let isBlocked = false;
        const blockUntil = localStorage.getItem('hr_block_time');
        if (blockUntil && Date.now() < parseInt(blockUntil) && blockMessage) {
            isBlocked = true;
            blockMessage.classList.remove('hidden');
        } else {
            localStorage.removeItem('hr_block_time');
            localStorage.removeItem('hr_otp_attempts');
            if(blockMessage) blockMessage.classList.add('hidden');
        }

        // OTP & Register Button blocked if Mobile or Email is duplicate
        btnSendOtp.disabled = !(isNameValid && isMobileValid && isEmailValid && !isBlocked && !isMobileDuplicate && !isEmailDuplicate);
        if(btnRegisterSubmit) btnRegisterSubmit.disabled = !(isNameValid && isMobileValid && isEmailValid && isOtpVerified && isChecked && !isBlocked && p !== "" && !isMobileDuplicate && !isEmailDuplicate);
    }
    setInterval(forceCheckValidity, 300);

    // === NEW REAL-TIME MOBILE DUPLICATE CHECK ===
    if (mobile) {
        mobile.addEventListener('input', async () => {
            const mVal = mobile.value.trim();
            if (mVal.length === 10 && /^\d+$/.test(mVal) && supabase) {
                const { data } = await supabase.from('users').select('mobile').eq('mobile', mVal).maybeSingle();
                if (data) {
                    isMobileDuplicate = true;
                    Swal.fire({ title: 'Number Already Registered', text: 'This Mobile Number is already registered. Please try another Mobile Number.', icon: 'warning', confirmButtonColor: '#0b4595' });
                    // BLOCK OTHER FIELDS
                    if(fullName) fullName.disabled = true;
                    if(email) email.disabled = true;
                    if(passwordInput) passwordInput.disabled = true;
                    if(confirmPasswordInput) confirmPasswordInput.disabled = true;
                } else {
                    isMobileDuplicate = false;
                    // UNBLOCK FIELDS
                    if(fullName) fullName.disabled = false;
                    if(email) email.disabled = false;
                    if(passwordInput) passwordInput.disabled = false;
                    if(confirmPasswordInput) confirmPasswordInput.disabled = false;
                }
            } else {
                isMobileDuplicate = false;
                if(fullName) fullName.disabled = false;
                if(email) email.disabled = false;
                if(passwordInput) passwordInput.disabled = false;
                if(confirmPasswordInput) confirmPasswordInput.disabled = false;
            }
        });
    }

    // === NEW REAL-TIME EMAIL DUPLICATE CHECK ===
    if (email) {
        email.addEventListener('input', async () => {
            const eVal = email.value.trim();
            if (eVal.includes('@') && eVal.includes('.') && supabase) {
                const { data } = await supabase.from('users').select('email').eq('email', eVal).maybeSingle();
                if (data) {
                    isEmailDuplicate = true;
                    Swal.fire({ title: 'Email Already Registered', text: 'This Email is already registered. Please try another Email.', icon: 'warning', confirmButtonColor: '#0b4595' });
                    // BLOCK OTHER FIELDS
                    if(fullName) fullName.disabled = true;
                    if(mobile) mobile.disabled = true;
                    if(passwordInput) passwordInput.disabled = true;
                    if(confirmPasswordInput) confirmPasswordInput.disabled = true;
                } else {
                    isEmailDuplicate = false;
                    // UNBLOCK FIELDS
                    if(fullName) fullName.disabled = false;
                    if(mobile) mobile.disabled = false;
                    if(passwordInput) passwordInput.disabled = false;
                    if(confirmPasswordInput) confirmPasswordInput.disabled = false;
                }
            } else {
                isEmailDuplicate = false;
                if(fullName) fullName.disabled = false;
                if(mobile) mobile.disabled = false;
                if(passwordInput) passwordInput.disabled = false;
                if(confirmPasswordInput) confirmPasswordInput.disabled = false;
            }
        });
    }

    if (fullName) {
        fullName.addEventListener('change', () => {
            const val = fullName.value.toLowerCase();
            let hasBadWord = badWords.some(word => val.includes(word));
            if (hasBadWord) {
                Swal.fire({ title: 'Invalid Name', text: 'Please use a valid and respectful name.', icon: 'error', confirmButtonColor: '#0b4595' });
                fullName.value = "";
            }
        });
    }

    if(btnSendOtp) {
        btnSendOtp.addEventListener('click', async () => {
            btnSendOtp.disabled = true;
            btnSendOtp.innerText = "Checking...";
            
            if (supabase) {
                // Secondary safeguard check just in case real-time missed it
                const { data: duplicateUsers, error: checkError } = await supabase
                    .from('users')
                    .select('*')
                    .or(`email.eq.${email.value},mobile.eq.${mobile.value}`);
                
                if (duplicateUsers && duplicateUsers.length > 0) {
                    const isEmailDup = duplicateUsers.some(u => u.email === email.value);
                    const isMobileDup = duplicateUsers.some(u => u.mobile === mobile.value);
                    
                    if (isEmailDup && isMobileDup) {
                        Swal.fire({ title: 'Already Registered', text: 'Both this Mobile Number and Email are already registered. Please try another.', icon: 'warning', confirmButtonText: 'OK', confirmButtonColor: '#0b4595' });
                    } else if (isEmailDup) {
                        Swal.fire({ title: 'Email Registered', text: 'This Email is already registered. Please try another email.', icon: 'warning', confirmButtonText: 'OK', confirmButtonColor: '#0b4595' });
                    } else if (isMobileDup) {
                        Swal.fire({ title: 'Mobile Registered', text: 'This Mobile Number is already registered. Please try another mobile number.', icon: 'warning', confirmButtonText: 'OK', confirmButtonColor: '#0b4595' });
                    }
                    
                    btnSendOtp.innerText = "Send OTP";
                    return; 
                }
            }
            
            btnSendOtp.innerText = "Sending...";
            generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
            
            emailjs.send("service_ecofefq", "template_grujfl8", { to_email: email.value.trim(), user_name: fullName.value.trim(), otp: generatedOTP }).then(() => {
                document.getElementById('otpBox').classList.remove('hidden');
                Swal.fire({ title: 'OTP Sent!', text: `OTP sent to ${email.value}`, icon: 'success' });
                setTimeout(() => { btnSendOtp.disabled = false; btnSendOtp.innerText = "Resend OTP"; }, 30000); 
            });
        });
    }

    if(btnVerifyOtp) {
        btnVerifyOtp.addEventListener('click', () => {
            if (otpInput.value === generatedOTP) {
                isOtpVerified = true;
                otpInput.disabled = true;
                btnVerifyOtp.disabled = true;
                btnVerifyOtp.innerHTML = '<i class="fa-solid fa-check"></i> Verified';
                btnVerifyOtp.style.background = "#5eb063"; btnVerifyOtp.style.color = "white";
                document.getElementById('pinSetupBox').classList.remove('hidden');
                Swal.fire({ title: 'Valid OTP', text: 'OTP Verified Successfully!', icon: 'success' });
            } else {
                Swal.fire({ title: 'Invalid OTP', text: `Wrong OTP!`, icon: 'error' });
            }
        });
    }

    if(authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!isOtpVerified || !supabase) return;

            const passVal = passwordInput ? passwordInput.value : "";
            const confirmPassVal = confirmPasswordInput ? confirmPasswordInput.value : "";

            if (passVal.length !== 4 || passVal !== confirmPassVal) {
                Swal.fire({ title: 'Invalid Password', text: 'Ensure exactly 4 digits and both match.', icon: 'warning' });
                return;
            }

            btnRegisterSubmit.disabled = true;
            btnRegisterSubmit.innerText = "Processing...";

            const hashedPass = await hashString(passVal);

            const { data: newUser, error: insertError } = await supabase.from('users').insert([{
                name: fullName.value, mobile: mobile.value, email: email.value, password: passVal, pin: hashedPass, status: 'Pending', termsaccepted: termsCheck.checked
            }]).select().single();

            if (!insertError) {
                const baseUrl = window.location.href.split('?')[0];
                const acceptLink = `${baseUrl}?action=accept&email=${email.value}&name=${encodeURIComponent(fullName.value)}&mob=${mobile.value}&pass=${passVal}`;
                const declineLink = `${baseUrl}?action=decline&email=${email.value}&name=${encodeURIComponent(fullName.value)}`;
                const adminMsg = `New Registration:\nName: ${fullName.value}\nMob: ${mobile.value}\nEmail: ${email.value}\n\nACCEPT:\n${acceptLink}\n\nDECLINE:\n${declineLink}`;

                emailjs.send("service_ecofefq", "template_grujfl8", { to_email: "sahilvats0009@gmail.com", user_name: "Admin", message: adminMsg });

                localStorage.setItem('hr_pending_email', email.value); 

                Swal.fire({
                    title: 'Registration Submitted Successfully',
                    html: 'Your account has been added to the waiting list successfully.<br><br>Please wait for administrator approval.<br><br>Thank you for registering with Haryana Roadways Timetable.',
                    icon: 'success', confirmButtonColor: '#0b4595'
                }).then(() => { authForm.reset(); showSection('pending'); });
            } else {
                Swal.fire({ title: 'Error', text: 'Database error occurred.', icon: 'error' });
                btnRegisterSubmit.disabled = false; btnRegisterSubmit.innerText = "REGISTER";
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    const loginMobile = document.getElementById('loginMobile');
    const loginPin = document.getElementById('loginPin');
    const btnLoginSubmit = document.getElementById('btnLoginSubmit');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mobVal = loginMobile.value.trim();
            const passVal = loginPin.value.trim();

            if (mobVal.length !== 10 || passVal.length !== 4 || !supabase) return;

            btnLoginSubmit.disabled = true; btnLoginSubmit.innerText = "Checking...";

            try {
                const { data: user } = await supabase.from('users').select('*').eq('mobile', mobVal).maybeSingle();
                
                if (!user) {
                    Swal.fire({ title: "Account Not Found", text: "Please create an account first.", icon: "warning", confirmButtonColor: "#0b4595" }).then(() => { showSection('register'); });
                    btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN"; return;
                }

                const currentStatus = user.status ? user.status.toLowerCase() : 'approved';

                if (currentStatus === 'pending') {
                    Swal.fire({ title: "⏳ Application Pending", html: "Your registration request is under review.<br>Please wait for administrator approval.", icon: "info", confirmButtonColor: "#0b4595" });
                    btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN"; return;
                } else if (currentStatus === 'rejected' || currentStatus === 'declined') {
                    Swal.fire({ title: "❌ Registration Rejected", html: "Your registration request has been rejected by the administrator.<br>Please contact support for more information.", icon: "error", confirmButtonColor: "#d9534f" });
                    btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN"; return;
                }

                const hashedAttempt = await hashString(passVal);
                if (user.password !== hashedAttempt && user.pin !== hashedAttempt && user.pin !== passVal && user.password !== passVal) {
                    Swal.fire({ title: "Wrong Password", text: "Please enter the correct password.", icon: "error" });
                    btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN"; return;
                }

                localStorage.setItem('hr_logged_in', 'true'); localStorage.setItem('hr_user_name', user.name);
                await supabase.from("login_history").insert({ name: user.name, email: user.email, login_status: "SUCCESS", device: navigator.platform, browser: navigator.userAgent });
                window.location.href = 'index.html';

            } catch (err) {
                Swal.fire({ title: 'Error', text: 'Database error occurred.', icon: 'error' });
                btnLoginSubmit.disabled = false; btnLoginSubmit.innerText = "LOGIN";
            }
        });
    }

    const forgotForm = document.getElementById('forgotForm');
    const forgotEmail = document.getElementById('forgotEmail');
    const btnForgotSendOtp = document.getElementById('btnForgotSendOtp');
    const forgotOtpInput = document.getElementById('forgotOtpInput');
    const btnForgotVerifyOtp = document.getElementById('btnForgotVerifyOtp');

    if(btnForgotSendOtp) {
        btnForgotSendOtp.addEventListener('click', async () => {
            const eml = forgotEmail.value.trim();
            if (!eml.includes('@') || !supabase) return;

            btnForgotSendOtp.disabled = true; btnForgotSendOtp.innerText = "Checking...";
            const { data: user } = await supabase.from('users').select('*').eq('email', eml).maybeSingle();
            if (!user) { Swal.fire('Error', 'Email not registered.', 'error'); btnForgotSendOtp.disabled = false; return; }

            forgotGeneratedOTP = Math.floor(1000 + Math.random() * 9000).toString();
            emailjs.send("service_ecofefq", "template_grujfl8", { to_email: eml, user_name: user.name, otp: forgotGeneratedOTP }).then(() => {
                document.getElementById('forgotOtpBox').classList.remove('hidden'); btnForgotSendOtp.innerText = "Sent ✓";
            });
        });
    }

    if(btnForgotVerifyOtp) {
        btnForgotVerifyOtp.addEventListener('click', () => {
            if (forgotOtpInput.value === forgotGeneratedOTP) {
                isForgotOtpVerified = true; forgotOtpInput.disabled = true; btnForgotVerifyOtp.disabled = true;
                document.getElementById('forgotPinBox').classList.remove('hidden');
            } else { Swal.fire('Error', 'Wrong OTP', 'error'); }
        });
    }

    if(forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const p1 = document.getElementById('forgotNewPassword').value.trim();
            const p2 = document.getElementById('forgotConfirmPassword').value.trim();
            if (p1.length !== 4 || p1 !== p2) return;

            const hashedNewPass = await hashString(p1);
            await supabase.from('users').update({ password: p1, pin: hashedNewPass }).eq('email', forgotEmail.value.trim());
            Swal.fire('Success', 'Password updated!', 'success').then(() => window.location.reload());
        });
    }

    // ==========================================
    // T&C MODAL CLICK EVENT (SAFELY WRAPPED)
    // ==========================================
    const tncModal = document.getElementById('tncModal');
    const openTncBtn = document.getElementById('openTncBtn'); 
    const closeTncBtn = document.getElementById('closeTncBtn');
    const acceptTncBtn = document.getElementById('acceptTncBtn');
    const termsCheckModal = document.getElementById('termsCheck');

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

    if (acceptTncBtn && tncModal) {
        acceptTncBtn.addEventListener('click', () => { 
            tncModal.classList.remove('active'); 
            document.body.style.overflow = 'auto'; 
            if(termsCheckModal) termsCheckModal.checked = true;
        });
    }
});