// === FIX FOR POPUPS HIDING BEHIND MODALS ===
if (typeof document !== 'undefined') {
    var style = document.createElement('style');
    style.innerHTML = '.swal2-container { z-index: 9999999 !important; }';
    document.head.appendChild(style);
}

// === AUTH GUARD & AUTO-LOGOUT ===
if (localStorage.getItem('hr_logged_in') !== 'true') {
    window.location.href = 'login.html';
} else {
    localStorage.setItem('hr_tnc_accepted', 'true');
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

// =========================================================
// MASSIVE BUS DATA FOR MARQUEE & SEARCH
// =========================================================
var busData = [
    // --- FROM USER'S ORIGINAL PROMPT ---
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "05:20 AM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Gurugram", via: "Hansi", departure: "07:53 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "09:30 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "10:00 AM", busType: "AC", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "10:40 AM", busType: "Ordinary", arr: "HR" },
    { from: "Ganganagar", to: "Bahadurgarh", via: "Hansi", departure: "10:45 AM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Gurugram", via: "Hansi", departure: "11:00 AM", busType: "AC", arr: "HR" },
    { from: "Hisar", to: "Bahadurgarh", via: "Hansi", departure: "11:15 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Bahadurgarh", via: "Hansi", departure: "11:50 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "12:00 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Gurugram", via: "Hansi", departure: "12:04 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "12:10 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Bahadurgarh", via: "Hansi", departure: "12:20 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Palwal", via: "Hansi", departure: "12:30 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Bahadurgarh", via: "Hansi", departure: "01:00 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Bahadurgarh", via: "Hansi", departure: "01:10 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "01:30 PM", busType: "AC", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "01:40 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "02:00 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Bahadurgarh", via: "Hansi", departure: "02:10 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "02:45 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "03:10 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "03:40 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi", departure: "03:45 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Gurugram", via: "Hansi", departure: "05:30 PM", busType: "AC", arr: "HR" },
    { from: "Sirsa", to: "Gurugram", via: "Hansi", departure: "07:00 PM", busType: "AC", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "05:10 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "06:00 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Ballabgarh", via: "Hansi", departure: "06:10 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Palwal", via: "Hansi", departure: "06:20 AM", busType: "Ordinary", arr: "HR" },
    { from: "Nathusari Chopta", to: "Gurugram", via: "Hansi", departure: "06:40 AM", busType: "Ordinary", arr: "HR" },
    { from: "Ellanabad", to: "Gurugram", via: "Hansi", departure: "06:50 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "07:00 AM", busType: "Ordinary", arr: "HR" },
    { from: "Fatehabad", to: "Gurugram", via: "Hansi", departure: "07:16 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "07:40 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "08:10 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "08:40 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "08:50 AM", busType: "Ordinary", arr: "HR" },
    { from: "SIRSA", to: "Gurugram", via: "Hansi", departure: "09:08 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "09:40 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Ballabgarh", via: "Hansi", departure: "09:56 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Agra", via: "Hansi", departure: "10:10 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "10:40 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "11:00 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "11:30 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi", departure: "12:04 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Palwal", via: "Hansi", departure: "12:20 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Jhajjar", via: "Hansi", departure: "01:00 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "KMP", departure: "01:20 PM", busType: "Ordinary", arr: "HR" },
    { from: "SIRSA", to: "Ballabgarh", via: "Hansi", departure: "01:40 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Jhajjar", via: "Hansi", departure: "02:00 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "KMP", departure: "02:20 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "KMP", departure: "02:50 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "KMP", departure: "03:20 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "KMP", departure: "04:30 PM", busType: "Ordinary", arr: "HR" },
    { from: "SIRSA", to: "Gurugram", via: "Hansi", departure: "05:20 PM", busType: "Ordinary", arr: "HR" },
    { from: "Ganganagar", to: "Delhi", via: "Hansi", departure: "12:50 AM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Ganganagar", to: "Delhi", via: "Hansi", departure: "01:30 AM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Ganganagar", to: "Delhi", via: "Hansi", departure: "02:03 AM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "03:50 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:00 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:10 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:18 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:36 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:44 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:00 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:10 AM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:30 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:40 AM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:48 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:10 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:32 AM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:40 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:55 AM", busType: "HVAC", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:04 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:12 AM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:28 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:36 AM", busType: "HVAC", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:44 AM", busType: "Ordinary", arr: "PRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:52 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:00 AM", busType: "HVAC", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:08 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:24 AM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:46 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:56 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "09:04 AM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "09:20 AM", busType: "HVAC", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "09:28 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "09:44 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "09:52 AM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "10:00 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "10:16 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "10:24 AM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "10:38 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "10:50 AM", busType: "Ordinary", arr: "PRM" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "10:57 AM", busType: "HVAC", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "11:12 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "11:20 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "11:36 AM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "11:42 AM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "12:08 PM", busType: "HVAC", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "12:16 PM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "12:22 PM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "12:30 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "12:36 PM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "12:44 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "12:50 PM", busType: "Ordinary", arr: "PRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "12:58 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "01:20 PM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "01:28 PM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "01:36 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "01:44 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "02:00 PM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "02:16 PM", busType: "HVAC", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "02:32 PM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "02:54 PM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "03:00 PM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "03:20 PM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "03:34 PM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "03:40 PM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:00 PM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:08 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:18 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:28 PM", busType: "HVAC", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:34 PM", busType: "Ordinary", arr: "PRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:40 PM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "04:48 PM", busType: "AC", arr: "KBS" },
    { from: "Hisar", to: "Haldwani", via: "Hansi", departure: "04:50 PM", busType: "Ordinary", arr: "UK" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:04 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:10 PM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:18 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:26 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:45 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "05:51 PM", busType: "Ordinary", arr: "RSRTC" },
    { from: "Hisar", to: "Tanakpur", via: "Hansi", departure: "06:10 PM", busType: "Ordinary", arr: "UK" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "06:50 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:05 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "07:35 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:05 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:20 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "08:50 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "09:05 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "09:40 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "10:20 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi", departure: "10:40 PM", busType: "Ordinary", arr: "HR" },

    // --- EXTRACTED FROM NEW IMAGES (104917 to 105747) ---
    { from: "Hisar", to: "Gurugram", via: "Hansi, Meham, Beri, Jhajjar", departure: "05:10 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi, Meham, Beri, Jhajjar", departure: "06:00 AM", busType: "AC", arr: "HR" },
    { from: "Hisar", to: "Ballabgarh", via: "Hansi, Meham, Beri, Jhajjar", departure: "06:00 AM", busType: "AC", arr: "HR" },
    { from: "Sirsa", to: "Gurugram", via: "Hansi, Meham, Beri, Jhajjar", departure: "06:40 AM", busType: "Ordinary", arr: "HR" },
    { from: "Chopta", to: "Gurugram", via: "Hansi, Meham, Beri, Jhajjar", departure: "06:54 AM", busType: "Ordinary", arr: "HR" },
    { from: "Fatehabad", to: "Gurugram", via: "Hansi, Meham, Beri, Jhajjar", departure: "07:20 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi, Meham, Beri, Jhajjar", departure: "07:30 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Gurugram", via: "Hansi, Meham, Beri, Jhajjar", departure: "07:40 AM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Gurugram", via: "Hansi, Meham, Beri, Jhajjar", departure: "07:48 AM", busType: "Ordinary", arr: "HR" },
    { from: "Fatehabad", to: "Gurugram", via: "Hansi, Meham, Beri, Jhajjar", departure: "08:12 AM", busType: "Ordinary", arr: "HR" },
    { from: "Dabwali", to: "Ballabgarh", via: "Hansi, Meham", departure: "09:20 AM", busType: "AC", arr: "HR" },
    { from: "Hisar", to: "Ballabgarh", via: "Hansi, Meham, Beri, Jhajjar", departure: "09:50 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Agra", via: "Hansi, Meham, Beri, Jhajjar", departure: "10:15 AM", busType: "Ordinary", arr: "HR" },
    { from: "Ganganagar", to: "Bahadurgarh", via: "Hansi, Meham, Beri, Jhajjar", departure: "10:45 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Palwal", via: "Badli", departure: "12:30 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Gurugram", via: "Hansi, Rohtak", departure: "01:40 PM", busType: "AC", arr: "HR" },
    { from: "Fatehabad", to: "Ballabgarh", via: "Hansi", departure: "01:48 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Gurugram", via: "Hansi, Rohtak", departure: "02:50 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Gurugram", via: "Hansi, Rohtak", departure: "03:50 PM", busType: "Ordinary", arr: "HR" },
    { from: "Fatehabad", to: "Delhi", via: "Hansi, Rohtak", departure: "04:10 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi, Meham", departure: "04:36 AM", busType: "AC", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "04:44 AM", busType: "Ordinary", arr: "HR" },
    { from: "Fatehabad", to: "Delhi", via: "Hansi, Rohtak", departure: "05:00 AM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "06:00 AM", busType: "AC", arr: "HR" },
    { from: "Fatehabad", to: "Delhi", via: "Hansi", departure: "06:10 AM", busType: "Ordinary", arr: "HR" },
    { from: "Fatehabad", to: "Delhi", via: "Hansi, Rohtak", departure: "06:48 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi, Meham", departure: "06:54 AM", busType: "AC", arr: "HR" },
    { from: "Fatehabad", to: "Delhi", via: "Hansi, Rohtak", departure: "07:04 AM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "07:30 AM", busType: "AC", arr: "HR" },
    { from: "Dabwali", to: "Delhi", via: "Hansi, Rohtak", departure: "07:52 AM", busType: "AC", arr: "HR" },
    { from: "Fatehabad", to: "Delhi", via: "Hansi, Rohtak", departure: "08:00 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi, Meham", departure: "08:08 AM", busType: "AC", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "08:45 AM", busType: "AC", arr: "HR" },
    { from: "Fatehabad", to: "Delhi", via: "Hansi, Rohtak", departure: "09:28 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi, Meham", departure: "09:44 AM", busType: "AC", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "09:45 AM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "10:15 AM", busType: "AC", arr: "HR" },
    { from: "Fatehabad", to: "Delhi", via: "Hansi, Rohtak", departure: "10:38 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi, Meham", departure: "10:57 AM", busType: "AC", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "11:20 AM", busType: "AC", arr: "HR" },
    { from: "Ganganagar", to: "Delhi", via: "Hansi", departure: "11:52 AM", busType: "RSRTC Express", arr: "RSRTC" },
    { from: "Hisar", to: "Delhi", via: "Hansi, Meham", departure: "12:08 PM", busType: "AC", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "12:30 PM", busType: "AC", arr: "HR" },
    { from: "Ganganagar", to: "Delhi", via: "Hansi", departure: "12:40 PM", busType: "RSRTC Express", arr: "RSRTC" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "01:14 PM", busType: "Ordinary", arr: "HR" },
    { from: "Anoopgarh", to: "Delhi", via: "Hansi", departure: "02:10 PM", busType: "RSRTC Express", arr: "RSRTC" },
    { from: "Ganganagar", to: "Delhi", via: "Hansi, Rohtak", departure: "02:34 PM", busType: "RSRTC Express", arr: "RSRTC" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "02:40 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "03:28 PM", busType: "Ordinary", arr: "HR" },
    { from: "Fatehabad", to: "Delhi", via: "Hansi", departure: "03:52 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi, Meham", departure: "04:28 PM", busType: "AC", arr: "HR" },
    { from: "Dabwali", to: "Delhi", via: "Hansi, Rohtak", departure: "05:18 PM", busType: "AC", arr: "HR" },
    { from: "Bikaner", to: "Delhi", via: "Hansi", departure: "05:20 PM", busType: "RSRTC Express", arr: "RSRTC" },
    { from: "Dabwali", to: "Delhi", via: "Hansi, Rohtak", departure: "05:30 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "05:34 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Rohtak", departure: "06:50 PM", busType: "AC", arr: "HR" },
    { from: "Dabwali", to: "Delhi", via: "Hansi, Rohtak", departure: "08:10 PM", busType: "Ordinary", arr: "HR" },
    { from: "Dabwali", to: "Delhi", via: "Hansi, Rohtak", departure: "08:25 PM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Delhi", via: "Hansi, Meham", departure: "04:00 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi, Meham", departure: "05:00 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi, Meham", departure: "05:20 AM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Meham", departure: "06:00 AM", busType: "AC", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Meham", departure: "07:30 AM", busType: "AC", arr: "HR" },
    { from: "Dabwali", to: "Delhi", via: "Hansi, Meham", departure: "07:52 AM", busType: "AC", arr: "HR" },
    { from: "Fatehabad", to: "Rohtak", via: "Hansi, Meham", departure: "08:30 AM", busType: "Ordinary", arr: "HR" },
    { from: "Bathinda", to: "Bahadurgarh", via: "Hansi, Meham", departure: "08:45 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi, Meham", departure: "09:30 AM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Meham", departure: "09:45 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi, Meham", departure: "10:00 AM", busType: "AC", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Meham", departure: "10:15 AM", busType: "AC", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi, Meham", departure: "10:30 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Rohtak", via: "Hansi, Meham", departure: "10:40 AM", busType: "Ordinary", arr: "HR" },
    { from: "Hisar", to: "Bahadurgarh", via: "Hansi, Meham", departure: "11:15 AM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Meham", departure: "11:20 AM", busType: "AC", arr: "HR" },
    { from: "Hisar", to: "Bahadurgarh", via: "Hansi, Meham", departure: "11:50 AM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Rohtak", via: "Hansi, Meham", departure: "12:00 PM", busType: "Ordinary", arr: "HR" },
    { from: "Fatehabad", to: "Rohtak", via: "Hansi, Meham", departure: "12:10 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Rohtak", via: "Hansi, Meham", departure: "12:20 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Delhi", via: "Hansi, Meham", departure: "12:30 PM", busType: "AC", arr: "HR" },
    { from: "Sirsa", to: "Rohtak", via: "Hansi, Meham", departure: "12:40 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Rohtak", via: "Hansi, Meham", departure: "01:01 PM", busType: "Ordinary", arr: "HR" },
    { from: "Sirsa", to: "Rohtak", via: "Hansi, Meham", departure: "01:05 PM", busType: "Ordinary", arr: "HR" }
];

document.addEventListener("DOMContentLoaded", async function() {
    
    if (typeof emailjs !== 'undefined') {
        try { emailjs.init("K6cs_matxXu2begVg"); } catch (e) { }
    }

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
    // 🚨 LIVE MARQUEE ALERT LOGIC (BLACK TEXT, 30 MINS & 5 MINS) 
    // =========================================================
    function getMinutesToDeparture(departureStr) {
        var now = new Date();
        var depParts = departureStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if(!depParts) return -1;
        
        var h = parseInt(depParts[1], 10);
        var m = parseInt(depParts[2], 10);
        var ampm = depParts[3].toUpperCase();
        
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        
        var depTime = new Date();
        depTime.setHours(h, m, 0, 0);
        
        var diffMs = depTime - now;
        return Math.floor(diffMs / 60000);
    }

    function updateMarquee() {
        var marquee = document.getElementById('marqueeText');
        if(!marquee) return;
        
        // Find buses departing in the next 30 minutes
        var upcomingBuses = busData.filter(function(b) {
            var mins = getMinutesToDeparture(b.departure);
            return mins >= 0 && mins <= 30; 
        });

        if(upcomingBuses.length > 0) {
            var alertText = upcomingBuses.map(function(b) {
                var mins = getMinutesToDeparture(b.departure);
                var timeText = mins <= 5 ? `<span style="color:#d9534f; font-weight:900;">IN ${mins} MINS!</span>` : `in ${mins} mins`;
                return `🚍 ${b.departure} ${b.from} to ${b.to} departing ${timeText}`;
            }).join(' &nbsp; &nbsp; | &nbsp; &nbsp; ');
            
            marquee.innerHTML = `<span style="color: #000; font-weight: bold; font-size: 1.05rem;">🚨 LIVE DEPARTURES: &nbsp; ${alertText} 🚨</span>`;
        } else {
            marquee.innerHTML = `<span style="color: #000; font-weight: bold; font-size: 1.05rem;">🚍 Welcome to Haryana Roadways Timetable | Plan your journey easily. All timings are subject to change.</span>`;
        }
    }
    
    setInterval(updateMarquee, 30000); 
    updateMarquee(); 

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
    // ROUTES TAB LOGIC (DYNAMIC DESTINATIONS)
    // =========================================================
    var cityBtns = document.querySelectorAll('.city-btn');
    var routeDetailsContainer = document.getElementById('routeDetailsContainer');
    
    cityBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var city = this.getAttribute('data-city');
            
            cityBtns.forEach(b => { b.style.background = ''; b.style.color = ''; });
            this.style.background = 'var(--primary-blue)';
            this.style.color = 'white';

            if (city === 'Hisar') {
                var destinations = [...new Set(busData.filter(b => b.from.toLowerCase() === 'hisar').map(b => b.to))].sort();
                var destHTML = '<h4 style="color:var(--primary-blue); margin:15px 0 10px 0;"><i class="fa-solid fa-map-location-dot"></i> Routes from Hisar Depot:</h4><div style="display:flex; flex-wrap:wrap; gap:8px;">';
                destinations.forEach(d => {
                    destHTML += `<span style="background:rgba(0,0,0,0.05); padding:6px 12px; border-radius:15px; font-size:0.9rem; border:1px solid rgba(0,0,0,0.1); font-weight:600; color:var(--primary-blue);">${d}</span>`;
                });
                destHTML += '</div>';
                if(routeDetailsContainer) routeDetailsContainer.innerHTML = destHTML;
            } else {
                if(routeDetailsContainer) routeDetailsContainer.innerHTML = '';
                // Popup error inside settings page
                Swal.fire({
                    title: 'Route Unavailable 🚧',
                    text: `The routes for ${city} Depot are currently being updated. Please check back later.`,
                    icon: 'info',
                    target: document.getElementById('settingsPage') || 'body'
                });
            }
        });
    });

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
                } else {
                    Swal.fire({ title: '⚠️ Unauthorized Access', text: "Sorry! You don't have permission.", icon: 'error', target: document.getElementById('settingsPage') || 'body' });
                }
            } else { 
                Swal.fire({ title: 'Error', text: 'Incorrect Password.', icon: 'error', target: document.getElementById('settingsPage') || 'body' }); 
            }
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
            if (!currentMobile || !currentEmail || !db) { Swal.fire({title:'Error', text:'System not ready.', icon:'error', target: document.getElementById('settingsPage') || 'body'}); return; }
            var oldPhone = document.getElementById('oldPhoneInput') ? document.getElementById('oldPhoneInput').value.trim() : '';
            var newPhone = document.getElementById('updatePhoneInput') ? document.getElementById('updatePhoneInput').value.trim() : '';
            
            if (oldPhone !== currentMobile) return Swal.fire({title:'Error', text:'Old mobile mismatch.', icon:'error', target: document.getElementById('settingsPage') || 'body'});
            if (newPhone.length !== 10) return Swal.fire({title:'Invalid', text:'Enter valid 10-digit number.', icon:'warning', target: document.getElementById('settingsPage') || 'body'});
            btnSendPhoneOtp.disabled = true; btnSendPhoneOtp.innerText = "Checking...";
            
            var dup = await db.from('users').select('mobile').eq('mobile', newPhone).maybeSingle();
            if (dup.data) { btnSendPhoneOtp.disabled = false; btnSendPhoneOtp.innerText = "Send OTP"; return Swal.fire({title:'Exists', text:'New number already registered.', icon:'warning', target: document.getElementById('settingsPage') || 'body'}); }
            phoneUpdateOTP = Math.floor(1000 + Math.random() * 9000).toString();
            
            if(typeof emailjs !== 'undefined') {
                emailjs.send("service_ecofefq", "template_grujfl8", { to_email: currentEmail, user_name: localStorage.getItem('hr_user_name') || "User", otp: phoneUpdateOTP })
                .then(() => {
                    document.getElementById('phoneOtpBox').classList.remove('hidden');
                    btnSendPhoneOtp.innerText = "Sent ✓";
                    Swal.fire({title:'OTP Sent', text:`OTP sent to ${currentEmail}`, icon:'success', target: document.getElementById('settingsPage') || 'body'});
                }).catch(e => {
                    btnSendPhoneOtp.disabled = false; btnSendPhoneOtp.innerText = "Send OTP";
                    Swal.fire({title:'Error', text:'Failed to send Email.', icon:'error', target: document.getElementById('settingsPage') || 'body'});
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
            if (!currentMobile || !currentEmail || !db) { Swal.fire({title:'Error', text:'System not ready.', icon:'error', target: document.getElementById('settingsPage') || 'body'}); return; }
            var oldEmail = document.getElementById('oldEmailInput') ? document.getElementById('oldEmailInput').value.trim() : '';
            var newEmail = document.getElementById('updateEmailInput') ? document.getElementById('updateEmailInput').value.trim() : '';
            
            if (oldEmail !== currentEmail) return Swal.fire({title:'Error', text:'Old email mismatch.', icon:'error', target: document.getElementById('settingsPage') || 'body'});
            if (!newEmail.includes('@')) return Swal.fire({title:'Invalid', text:'Enter a valid new email address.', icon:'warning', target: document.getElementById('settingsPage') || 'body'});
            btnSendEmailOtp.disabled = true; btnSendEmailOtp.innerText = "Checking...";
            
            var dup = await db.from('users').select('email').eq('email', newEmail).maybeSingle();
            if (dup.data) { btnSendEmailOtp.disabled = false; btnSendEmailOtp.innerText = "Send OTP"; return Swal.fire({title:'Exists', text:'New email already registered.', icon:'warning', target: document.getElementById('settingsPage') || 'body'}); }
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
                    Swal.fire({title:'Error', text:'Failed to send Email.', icon:'error', target: document.getElementById('settingsPage') || 'body'});
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
                
                var results = busData.filter(function(bus) {
                    var bFrom = bus.from.toLowerCase().trim();
                    var bTo = bus.to.toLowerCase().trim();
                    var bVia = (bus.via || "").toLowerCase().trim();

                    // MUNDHAL SPECIAL CONDITION: 
                    if (toVal === 'mundhal') {
                        var mundhalDestinations = ["delhi", "gurugram", "rohtak", "bahadurgarh", "palwal", "ballabgarh", "agra", "jhajjar", "fatehabad", "haldwani", "tanakpur"];
                        var passesMundhal = (bTo === 'mundhal') || bVia.includes('mundhal') || (mundhalDestinations.includes(bTo) && bVia.includes('hansi'));
                        return bFrom === fromVal && passesMundhal;
                    }

                    // NORMAL SEARCH
                    return bFrom === fromVal && (bTo === toVal || bVia.includes(toVal));
                });

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
    // BULLETPROOF FOOTER & MODAL LOGIC 
    // ==========================================
    document.body.addEventListener('click', function(e) {
        
        var target = e.target;
        var parentTarget = target.closest('a, button, span, div');
        var clickedText = target.innerText ? target.innerText.toLowerCase() : '';
        if(parentTarget && parentTarget.innerText) clickedText = parentTarget.innerText.toLowerCase();

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

        if (e.target.closest('#closeTncBtn') || e.target.id === 'closeTncBtn' || e.target.closest('.glass-close') || e.target.closest('.btn-side')) {
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

    // =========================================================
    // 🚍 LIVE SPEED TRACKER LOGIC
    // =========================================================
    var watchId = null;
    var totalDistance = 0;
    var lastLat = null;
    var lastLon = null;

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

    setInterval(function() {
        var d = new Date();
        if(gpsTime) {
            gpsTime.innerText = d.getHours().toString().padStart(2, '0') + ':' + 
                                d.getMinutes().toString().padStart(2, '0') + ':' + 
                                d.getSeconds().toString().padStart(2, '0');
        }
    }, 1000);

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
        if(gpsStatus) { gpsStatus.innerText = "Connected"; gpsStatus.style.color = "#5eb063"; }
        var crd = pos.coords;
        
        if (lastLat !== null && lastLon !== null) {
            totalDistance += calculateDistance(lastLat, lastLon, crd.latitude, crd.longitude);
        }
        lastLat = crd.latitude; lastLon = crd.longitude;
        var speed = crd.speed ? (crd.speed * 3.6) : 0; 
        updateUI(speed, crd.heading);
    }

    function error(err) {
        if(gpsStatus) { gpsStatus.innerText = "GPS Error"; gpsStatus.style.color = "#d9534f"; }
        if (err.code === 1) {
            Swal.fire({ title: 'Permission Denied', text: 'Location permission is required to use Live Speed Tracker.', icon: 'error', target: document.getElementById('settingsPage') || 'body' });
            stopTracking();
        } else {
            Swal.fire({ title: 'Error', text: 'Unable to fetch location. Check your GPS.', icon: 'warning', target: document.getElementById('settingsPage') || 'body' });
            stopTracking();
        }
    }

    function startTracking() {
        if (!navigator.geolocation) { Swal.fire({title: 'Error', text: 'Geolocation is not supported', icon: 'error', target: document.getElementById('settingsPage') || 'body'}); return; }
        if(gpsStatus) { gpsStatus.innerText = "Searching..."; gpsStatus.style.color = "#f39c12"; }
        if(startBtn) startBtn.style.display = 'none';
        if(pauseBtn) pauseBtn.style.display = 'flex';
        if(stopBtn) stopBtn.style.display = 'flex';
        
        watchId = navigator.geolocation.watchPosition(success, error, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
    }

    function stopTracking() {
        if (watchId) navigator.geolocation.clearWatch(watchId);
        lastLat = null; lastLon = null; totalDistance = 0;
        updateUI(0, null);
        if(gpsStatus) { gpsStatus.innerText = "Stopped"; gpsStatus.style.color = "#d9534f"; }
        if(startBtn) startBtn.style.display = 'flex';
        if(pauseBtn) pauseBtn.style.display = 'none';
        if(stopBtn) stopBtn.style.display = 'none';
    }

    function pauseTracking() {
        if (watchId) navigator.geolocation.clearWatch(watchId);
        if(gpsStatus) { gpsStatus.innerText = "Paused"; gpsStatus.style.color = "#f39c12"; }
        if(startBtn) startBtn.style.display = 'flex';
        if(pauseBtn) pauseBtn.style.display = 'none';
    }

    if(startBtn) startBtn.addEventListener('click', startTracking);
    if(stopBtn) stopBtn.addEventListener('click', stopTracking);
    if(pauseBtn) pauseBtn.addEventListener('click', pauseTracking);

});
