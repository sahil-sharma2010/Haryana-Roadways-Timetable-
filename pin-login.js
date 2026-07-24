async function hashString(str) {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.prototype.map.call(new Uint8Array(buffer), x => (('00'+x.toString(16)).slice(-2))).join('');
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('email');

    if (!userEmail) { window.location.href = 'login.html'; return; }

    document.getElementById('displayEmail').innerText = userEmail;
    document.getElementById('forgotPinLink').href = `forgot-pin.html?email=${encodeURIComponent(userEmail)}`;

    const SUPABASE_URL = 'https://wapxdmpwvhcsrnfiodjd.supabase.co'; 
    const SUPABASE_ANON_KEY = 'sb_publishable_odtRBN3c0mV917RGbwCCKA_JuwKHVUU'; 
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const pinForm = document.getElementById('pinForm');
    const loginPin = document.getElementById('loginPin');
    const btnPinLogin = document.getElementById('btnPinLogin');
    const pinBlockMessage = document.getElementById('pinBlockMessage');

    // 15 Min Block Logic Check
    function checkBlock() {
        const blockUntil = localStorage.getItem('hr_pin_block');
        if (blockUntil && Date.now() < parseInt(blockUntil)) {
            pinBlockMessage.classList.remove('hidden');
            btnPinLogin.disabled = true;
            loginPin.disabled = true;
            return true;
        } else {
            localStorage.removeItem('hr_pin_block');
            localStorage.removeItem('hr_pin_attempts');
            pinBlockMessage.classList.add('hidden');
            btnPinLogin.disabled = false;
            loginPin.disabled = false;
            return false;
        }
    }
    setInterval(checkBlock, 1000);
    checkBlock();

    pinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (checkBlock()) return;

        const pinVal = loginPin.value;
        if (pinVal.length !== 4 || !/^\d{4}$/.test(pinVal)) {
            Swal.fire('Error', 'PIN must be 4 digits', 'error'); return;
        }

        btnPinLogin.disabled = true;
        btnPinLogin.innerText = "Verifying...";

        const { data: user } = await supabase.from('users').select('*').eq('email', userEmail).single();

        if (user) {
            const hashedInput = await hashString(pinVal);
            
            if (user.pin === hashedInput) {
                // SUCCESS
                localStorage.removeItem('hr_pin_attempts');
                localStorage.setItem('hr_logged_in', 'true');
                localStorage.setItem('userSession', JSON.stringify(user));

                // INSERT LOGIN HISTORY
                await supabase
                    .from("login_history")
                    .insert({
                        name: user.name,
                        email: user.email,
                        login_status: "SUCCESS",
                        device: navigator.platform,
                        browser: navigator.userAgent
                    });

                // REDIRECT TO HOME
                window.location.href = 'index.html';
            } else {
                // FAILED (Do NOT insert login history here)
                let attempts = parseInt(localStorage.getItem('hr_pin_attempts')) || 0;
                attempts += 1;
                localStorage.setItem('hr_pin_attempts', attempts);

                if (attempts >= 5) {
                    const blockTime = Date.now() + (15 * 60 * 1000); // 15 mins
                    localStorage.setItem('hr_pin_block', blockTime);
                    Swal.fire('Blocked', '5 wrong attempts. Blocked for 15 minutes.', 'error');
                } else {
                    Swal.fire('Incorrect PIN', `Wrong PIN. Attempts left: ${5 - attempts}`, 'error');
                    loginPin.value = '';
                }
                btnPinLogin.disabled = false;
                btnPinLogin.innerHTML = '<i class="fa-solid fa-lock-open"></i> Login Securely';
            }
        }
    });
});