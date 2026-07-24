async function hashString(str) {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.prototype.map.call(new Uint8Array(buffer), x => (('00'+x.toString(16)).slice(-2))).join('');
}

document.addEventListener("DOMContentLoaded", () => {
    emailjs.init("K6cs_matxXu2begVg"); 
    
    const SUPABASE_URL = 'https://wapxdmpwvhcsrnfiodjd.supabase.co'; 
    const SUPABASE_ANON_KEY = 'sb_publishable_odtRBN3c0mV917RGbwCCKA_JuwKHVUU'; 
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('email');
    if (!userEmail) { window.location.href = 'login.html'; return; }

    document.getElementById('resetEmail').value = userEmail;

    const btnSendResetOtp = document.getElementById('btnSendResetOtp');
    const resetOtpBox = document.getElementById('resetOtpBox');
    const resetOtpInput = document.getElementById('resetOtpInput');
    const btnVerifyResetOtp = document.getElementById('btnVerifyResetOtp');
    const newPinForm = document.getElementById('newPinForm');
    const newPin = document.getElementById('newPin');

    let generatedResetOTP = null;
    let isResetVerified = false;

    btnSendResetOtp.addEventListener('click', () => {
        btnSendResetOtp.disabled = true;
        btnSendResetOtp.innerText = "Sending...";
        generatedResetOTP = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Exact EmailJS parameters matching your template
        const templateParams = {
            to_email: userEmail.trim(),
            user_name: "User", // Default placeholder for password reset
            otp: generatedResetOTP
        };

        console.log(templateParams);

        emailjs.send("service_ecofefq", "template_grujfl8", templateParams)
        .then((response) => {
            console.log(response);
            resetOtpBox.classList.remove('hidden');
            Swal.fire('Sent!', 'OTP sent to your email.', 'success');
            setTimeout(() => { btnSendResetOtp.disabled = false; btnSendResetOtp.innerText = "Resend OTP"; }, 30000);
        })
        .catch((error) => {
            console.error(error);
            console.error("EmailJS Error:", error);
            
            Swal.fire({
                title: "Email Sending Failed",
                html: `
                <b>Status:</b> ${error.status || "Unknown"}<br>
                <b>Text:</b> ${error.text || "Unknown"}<br>
                Check browser console for details.
                `,
                icon: "error"
            });
            
            btnSendResetOtp.disabled = false; 
            btnSendResetOtp.innerText = "Resend OTP";
            resetOtpBox.classList.remove('hidden'); // Fallback for testing
        });
    });

    btnVerifyResetOtp.addEventListener('click', () => {
        if (resetOtpInput.value === generatedResetOTP) {
            isResetVerified = true;
            btnVerifyResetOtp.disabled = true;
            btnVerifyResetOtp.innerText = "Verified";
            btnVerifyResetOtp.style.background = "#5eb063";
            resetOtpInput.disabled = true;
            newPinForm.classList.remove('hidden');
        } else {
            Swal.fire('Error', 'Invalid OTP', 'error');
            resetOtpInput.value = "";
        }
    });

    newPinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!isResetVerified) return;

        const pinVal = newPin.value;
        if (pinVal.length !== 4 || !/^\d{4}$/.test(pinVal)) {
            Swal.fire('Error', 'PIN must be exactly 4 digits.', 'error'); return;
        }

        const btnSaveNewPin = document.getElementById('btnSaveNewPin');
        btnSaveNewPin.disabled = true;
        btnSaveNewPin.innerText = "Updating...";

        const hashedPin = await hashString(pinVal);

        const { error } = await supabase.from('users').update({ pin: hashedPin }).eq('email', userEmail);

        if (!error) {
            Swal.fire('Success', 'Your PIN has been updated!', 'success').then(() => {
                window.location.href = `pin-login.html?email=${encodeURIComponent(userEmail)}`;
            });
        } else {
            Swal.fire('Error', error.message, 'error');
            btnSaveNewPin.disabled = false;
            btnSaveNewPin.innerText = "Update PIN";
        }
    });
});