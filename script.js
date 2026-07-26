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
// MASSIVE BUS DATA (110+ ROUTES - 100% SAFE)
// =========================================================
var busData = [
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
    // 🎵 PREMIUM BACKGROUND MUSIC SYSTEM (3% VOLUME AUTO-PLAY)
    // =========================================================
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('music-toggle');
    const musicIconOn = document.getElementById('icon-music-on');
    const musicIconOff = document.getElementById('icon-music-off');
    const musicStatusText = document.getElementById('musicStatusText');
    
    let musicStarted = false;
    let targetVolume = 0.03; // Exactly 3% Volume
    let fadeInterval;

    function fadeAudio(targetVol, duration) {
        if (!bgMusic) return;
        clearInterval(fadeInterval);
        let steps = 20;
        let stepTime = duration / steps;
        let volStep = (targetVol - bgMusic.volume) / steps;
        
        fadeInterval = setInterval(() => {
            let newVol = bgMusic.volume + volStep;
            if (newVol < 0) newVol = 0;
            if (newVol > 1) newVol = 1;
            bgMusic.volume = newVol;
            
            if ((volStep > 0 && bgMusic.volume >= targetVol) || (volStep < 0 && bgMusic.volume <= targetVol)) {
                bgMusic.volume = targetVol;
                clearInterval(fadeInterval);
                if (targetVol === 0) bgMusic.pause();
            }
        }, stepTime);
    }

    function setMusicUI(isPlaying) {
        if (!musicStatusText) return;
        if (isPlaying) {
            musicStatusText.innerText = "ON";
            musicIconOn.style.opacity = '1';
            musicIconOff.style.opacity = '0.5';
        } else {
            musicStatusText.innerText = "OFF";
            musicIconOn.style.opacity = '0.5';
            musicIconOff.style.opacity = '1';
        }
    }

    if (bgMusic) {
        bgMusic.volume = 0; 
        bgMusic.loop = true; 
        
        bgMusic.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        });

        const musicPref = localStorage.getItem('hr_music_pref') || 'playing';
        
        if (musicPref === 'muted') {
            setMusicUI(false);
        } else {
            setMusicUI(true);
            
            let playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicStarted = true;
                    fadeAudio(targetVolume, 2000); 
                }).catch(error => {
                    const forcePlayOnInteract = () => {
                        if (!musicStarted) {
                            bgMusic.play().then(() => {
                                musicStarted = true;
                                fadeAudio(targetVolume, 2000);
                            }).catch(e => console.log("Still blocked"));
                        }
                        ['click', 'touchstart', 'scroll', 'mousemove', 'keydown'].forEach(evt => document.removeEventListener(evt, forcePlayOnInteract));
                    };
                    ['click', 'touchstart', 'scroll', 'mousemove', 'keydown'].forEach(evt => document.addEventListener(evt, forcePlayOnInteract, {once: true}));
                });
            }
        }

        if (musicToggle) {
            musicToggle.addEventListener('click', (e) => {
                e.stopPropagation(); 
                if (bgMusic.paused || bgMusic.volume === 0) {
                    setMusicUI(true);
                    localStorage.setItem('hr_music_pref', 'playing');
                    bgMusic.play().then(() => {
                        fadeAudio(targetVolume, 2000);
                        musicStarted = true;
                    }).catch(err => { console.log("Music blocked"); });
                } else {
                    setMusicUI(false);
                    localStorage.setItem('hr_music_pref', 'muted');
                    fadeAudio(0, 2000); 
                }
            });
        }
    }

    // =========================================================
    // 🚨 LIVE MARQUEE ALERT LOGIC (SUPER SLOW)
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
        
        var upcomingBuses = busData.filter(function(b) {
            var mins = getMinutesToDeparture(b.departure);
            return mins >= 0 && mins <= 30; 
        });

        if(upcomingBuses.length > 0) {
            var alertText = upcomingBuses.map(function(b) {
                var mins = getMinutesToDeparture(b.departure);
                var timeText = mins <= 5 ? `<span style="color:#d9534f; font-weight:900;">IN ${mins} MINS!</span>` : `in ${mins} mins`;
                return `🚍 ${b.from} to ${b.to} departing ${timeText} (${b.departure})`;
            }).join(' &nbsp; &nbsp; | &nbsp; &nbsp; ');
            
            marquee.innerHTML = `<span style="color: #000; font-weight: bold; font-size: 1.05rem;">🚨 UPCOMING DEPARTURES: &nbsp; ${alertText} 🚨</span>`;
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
                    
                    Swal.fire({
                        title: 'Account ' + accStat.toUpperCase(),
                        html: `Your account has been ${accStat}.<br><br><div style="font-size:0.85rem; color:#777; text-align:left; background:#f8f9fa; padding:10px; border-radius:8px;"><strong>📞 Contact Support:</strong><br>Email: support@hrtimetable.in<br>Phone: +91 798******2</div>`,
                        icon: 'error',
                        confirmButtonColor: '#d9534f',
                        allowOutsideClick: false
                    }).then(() => {
                        window.location.href = 'login.html';
                    });
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

                    if (toVal === 'mundhal') {
                        var mundhalDestinations = ["delhi", "gurugram", "rohtak", "bahadurgarh", "palwal", "ballabgarh", "agra", "jhajjar", "fatehabad", "haldwani", "tanakpur"];
                        var passesMundhal = (bTo === 'mundhal') || bVia.includes('mundhal') || (mundhalDestinations.includes(bTo) && bVia.includes('hansi'));
                        return bFrom === fromVal && passesMundhal;
                    }

                    return bFrom === fromVal && (bTo === toVal || bVia.includes(toVal));
                });

                if (results.length > 0) {
                    results.forEach(function(bus, index) {
                        var tr = document.createElement('tr');
                        var safeFrom = bus.from.replace(/'/g, "\\'");
                        var safeTo = bus.to.replace(/'/g, "\\'");
                        var safeVia = (bus.via || "Direct").replace(/'/g, "\\'");
                        var safeDep = bus.departure.replace(/'/g, "\\'");
                        var safeType = bus.busType.replace(/'/g, "\\'");
                        var safeOp = (bus.arr || 'TBD').replace(/'/g, "\\'");

                        tr.innerHTML = `
                            <td>${index + 1}</td>
                            <td><i class="fa-regular fa-clock"></i> <strong style="color: var(--primary-blue);">${bus.departure}</strong></td>
                            <td>${bus.from} &rarr; ${bus.to}</td>
                            <td>${bus.via || 'Direct'}</td>
                            <td><span style="color: #4a914f; font-weight: 600;">${bus.busType}</span></td>
                            <td>${bus.arr || 'TBD'}</td>
                            <td><button class="btn-track-route" onclick="openRouteMap('${safeFrom}', '${safeTo}', '${safeVia}', '${safeDep}', '${safeType}', '${safeOp}')"><i class="fa-solid fa-map-location-dot"></i> Track</button></td>
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
        
        if (e.target.closest('#openTncBtn')) {
            e.preventDefault(); 
            var modal = document.getElementById('tncModal');
            if(modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
            return;
        }
        
        if (e.target.closest('#openPrivacyBtn')) {
            e.preventDefault(); 
            var pModal = document.getElementById('privacyModal');
            if(pModal) { pModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
            return;
        }
        
        if (e.target.closest('#openDisclaimerBtn')) {
            e.preventDefault(); 
            var dModal = document.getElementById('disclaimerModal');
            if(dModal) { dModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
            return;
        }

        if (e.target.closest('#closeTncBtnTop') || e.target.closest('#closePrivacyBtnTop') || e.target.closest('#closeDisclaimerBtnTop') || e.target.closest('.btn-side')) {
            var modalClose = e.target.closest('.glass-modal-overlay');
            if(modalClose) { modalClose.classList.remove('active'); document.body.style.overflow = 'auto'; }
        }

        if (e.target.closest('#acceptTncBtn')) {
            var modalAcc = e.target.closest('.glass-modal-overlay');
            if(modalAcc) { modalAcc.classList.remove('active'); document.body.style.overflow = 'auto'; }
            var termsCheck = document.getElementById('termsCheck');
            if(termsCheck) termsCheck.checked = true;
        }

        if (e.target.classList.contains('glass-modal-overlay')) {
            e.target.classList.remove('active'); document.body.style.overflow = 'auto';
        }
    });

    // =========================================================
    // 🗺️ FREE ROUTE MAP LOGIC (LEAFLET & OSRM) + INFO TOGGLE
    // =========================================================
    var lMap = null;
    var lRoutingControl = null;
    var lUserMarker = null;

    var btnCloseInfo = document.getElementById('btnCloseMapInfo');
    var btnShowInfo = document.getElementById('btnShowMapInfo');
    var mapInfoCard = document.getElementById('mapInfoCard');

    if(btnCloseInfo && btnShowInfo && mapInfoCard) {
        btnCloseInfo.addEventListener('click', function() {
            mapInfoCard.classList.add('hidden');
            setTimeout(() => { btnShowInfo.style.display = 'flex'; }, 300);
        });
        
        btnShowInfo.addEventListener('click', function() {
            btnShowInfo.style.display = 'none';
            mapInfoCard.classList.remove('hidden');
        });
    }

    var cityCoords = {
        "hisar": [29.1492, 75.7217], "delhi": [28.6139, 77.2090], "sirsa": [29.5336, 75.0177],
        "gurugram": [28.4595, 77.0266], "rohtak": [28.8955, 76.5892], "hansi": [29.1009, 75.9684],
        "mundhal": [28.9427, 76.1738], "bahadurgarh": [28.6811, 76.9242], "fatehabad": [29.5112, 75.4536],
        "palwal": [28.1487, 77.3320], "ballabgarh": [28.3359, 77.3271], "agra": [27.1767, 78.0081],
        "jhajjar": [28.6111, 76.6548], "haldwani": [29.2183, 79.5130], "tanakpur": [29.0725, 80.1130],
        "ganganagar": [29.9167, 73.8771], "ellanabad": [29.4500, 74.6500], "nathusari chopta": [29.3565, 75.0594],
        "chopta": [29.3565, 75.0594], "meham": [28.9592, 76.2947], "beri": [28.6998, 76.5772],
        "badli": [28.5833, 76.8167], "dabwali": [29.9576, 74.7088], "bathinda": [30.2110, 74.9455],
        "anoopgarh": [29.1911, 73.2086], "bikaner": [28.0229, 73.3119]
    };

    async function getCoordinates(cityStr) {
        var cleanCity = cityStr.trim().toLowerCase();
        if (cityCoords[cleanCity]) return L.latLng(cityCoords[cleanCity][0], cityCoords[cleanCity][1]);
        
        try {
            var response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityStr)}, India`);
            var data = await response.json();
            if (data && data.length > 0) return L.latLng(data[0].lat, data[0].lon);
        } catch (e) { console.error("Geocoding failed for " + cityStr); }
        return null;
    }

    window.openRouteMap = async function(from, to, via, dep, type, op) {
        var mapPage = document.getElementById('routeMapPage');
        if(!mapPage) return;
        
        document.getElementById('mapRouteTitle').innerHTML = `${from} &rarr; ${to}`;
        document.getElementById('mapDepTime').innerText = dep;
        document.getElementById('mapBusType').innerText = type;
        document.getElementById('mapOp').innerText = op;
        document.getElementById('mapViaStops').innerText = via || 'Direct';
        document.getElementById('mapEstDist').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Calculating...';
        document.getElementById('mapEstTime').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Calculating...';
        
        mapPage.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        if(mapInfoCard) mapInfoCard.classList.remove('hidden');
        if(btnShowInfo) btnShowInfo.style.display = 'none';

        if (!lMap) {
            lMap = L.map('map', {zoomControl: false}).setView([29.1492, 75.7217], 8);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
            }).addTo(lMap);
            L.control.zoom({ position: 'bottomright' }).addTo(lMap);
        }

        if (lRoutingControl) lMap.removeControl(lRoutingControl);
        if (lUserMarker) { lMap.removeLayer(lUserMarker); lUserMarker = null; }

        var stopNames = [from];
        if (via && via.trim() !== '' && via.trim().toLowerCase() !== 'direct') {
            stopNames = stopNames.concat(via.split(',').map(s => s.trim()));
        }
        stopNames.push(to);

        var waypoints = [];
        for (var i = 0; i < stopNames.length; i++) {
            var latLng = await getCoordinates(stopNames[i]);
            if (latLng) waypoints.push(latLng);
        }

        if (waypoints.length >= 2) {
            var startIcon = L.divIcon({html: '<i class="fa-solid fa-circle-dot fa-2x" style="color:#5eb063; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));"></i>', className: 'custom-div-icon', iconSize: [24,24]});
            var endIcon = L.divIcon({html: '<i class="fa-solid fa-location-dot fa-2x" style="color:#d9534f; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));"></i>', className: 'custom-div-icon', iconSize: [24,24]});
            var viaIcon = L.divIcon({html: '<i class="fa-solid fa-circle fa-sm" style="color:#f39c12; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></i>', className: 'custom-div-icon', iconSize: [12,12]});

            lRoutingControl = L.Routing.control({
                waypoints: waypoints,
                routeWhileDragging: false,
                addWaypoints: false,
                fitSelectedRoutes: true,
                show: false,
                lineOptions: { styles: [{color: '#0056b3', opacity: 0.8, weight: 6}] },
                createMarker: function(i, wp, nWps) {
                    var iconToUse = viaIcon;
                    if (i === 0) iconToUse = startIcon;
                    if (i === nWps - 1) iconToUse = endIcon;
                    return L.marker(wp.latLng, {icon: iconToUse});
                }
            }).addTo(lMap);

            lRoutingControl.on('routesfound', function(e) {
                var summary = e.routes[0].summary;
                document.getElementById('mapEstDist').innerText = (summary.totalDistance / 1000).toFixed(1) + " km";
                var totalTime = summary.totalTime;
                var hrs = Math.floor(totalTime / 3600);
                var mins = Math.floor((totalTime % 3600) / 60);
                document.getElementById('mapEstTime').innerText = (hrs > 0 ? hrs + " hr " : "") + mins + " min";
            });
            
            lRoutingControl.on('routingerror', function() {
                document.getElementById('mapEstDist').innerText = 'N/A';
                document.getElementById('mapEstTime').innerText = 'N/A';
                Swal.fire('Route Error', 'Could not calculate the route. Network issue or invalid locations.', 'error');
            });

        } else {
            Swal.fire('Error', 'Could not locate the route destinations.', 'warning');
            document.getElementById('mapEstDist').innerText = 'N/A';
            document.getElementById('mapEstTime').innerText = 'N/A';
        }
    };

    var btnBackMap = document.getElementById('btnBackFromMap');
    if(btnBackMap) {
        btnBackMap.addEventListener('click', function() {
            var mapPage = document.getElementById('routeMapPage');
            if(mapPage) mapPage.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    var btnFit = document.getElementById('btnFitRoute');
    if(btnFit) {
        btnFit.addEventListener('click', function() {
            if(lMap && lRoutingControl) {
                var waypoints = lRoutingControl.getWaypoints();
                var latlngs = waypoints.map(wp => wp.latLng).filter(ll => ll != null);
                if(latlngs.length > 0) lMap.fitBounds(L.latLngBounds(latlngs), {padding: [50, 50]});
            }
        });
    }

    var btnMyLoc = document.getElementById('btnMyLocation');
    if(btnMyLoc) {
        btnMyLoc.addEventListener('click', function() {
            if(navigator.geolocation) {
                Swal.fire({title: 'Locating...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), target: document.getElementById('routeMapPage')});
                navigator.geolocation.getCurrentPosition(function(pos) {
                    Swal.close();
                    var loc = L.latLng(pos.coords.latitude, pos.coords.longitude);
                    if(!lUserMarker) {
                        var userIcon = L.divIcon({ html: '<i class="fa-solid fa-street-view fa-2x" style="color:#0056b3; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));"></i>', className: 'custom-div-icon', iconSize: [24,24] });
                        lUserMarker = L.marker(loc, {icon: userIcon, zIndexOffset: 1000}).addTo(lMap);
                    } else {
                        lUserMarker.setLatLng(loc);
                    }
                    lMap.flyTo(loc, 15);
                }, function(err) {
                    Swal.close();
                    Swal.fire({title: 'Error', text: 'Location permission denied.', icon: 'error', target: document.getElementById('routeMapPage')});
                });
            } else {
                Swal.fire({title: 'Error', text: 'Geolocation is not supported.', icon: 'error', target: document.getElementById('routeMapPage')});
            }
        });
    }

    // =========================================================
    // 🚍 DEVICE SPEED TRACKER LOGIC (NO-HANG SMOOTH FIX)
    // =========================================================
    var watchSpeedId = null;
    var totalSpeedDist = 0;
    var lastSpeedLat = null;
    var lastSpeedLon = null;

    var startBtn = document.getElementById('btnStartTracker');
    var pauseBtn = document.getElementById('btnPauseTracker');
    var stopBtn = document.getElementById('btnStopTracker');
    
    var speedVal = document.getElementById('speedVal');
    var speedGauge = document.getElementById('speedGauge');
    var speedStatusBadge = document.getElementById('speedStatusBadge');
    var gpsStatus = document.getElementById('gpsStatus');
    var gpsDirection = document.getElementById('gpsDirection');
    var gpsDistance = document.getElementById('gpsDistance');
    
    // 🔥 LIVE TIME FIX: Placed inside DOMContentLoaded so it accurately updates real-time
    setInterval(function() {
        var d = new Date();
        var gt = document.getElementById('gpsTime');
        if(gt) {
            gt.innerText = d.getHours().toString().padStart(2, '0') + ':' + 
                           d.getMinutes().toString().padStart(2, '0') + ':' + 
                           d.getSeconds().toString().padStart(2, '0');
        }
    }, 1000);

    function calcDeviceDist(lat1, lon1, lat2, lon2) {
        var R = 6371; 
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; 
    }

    function getDeviceDir(heading) {
        if (heading === null || isNaN(heading)) return '--';
        var val = Math.floor((heading / 22.5) + 0.5);
        var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return arr[(val % 16)];
    }

    // 🏎️ PREMIUM SMOOTH SPEED ANIMATION (LERP ALGORITHM)
    let targetSpeedKmH = 0;
    let displaySpeedKmH = 0;
    
    function animateSpeedGauge() {
        if (Math.abs(targetSpeedKmH - displaySpeedKmH) > 0.1) {
            displaySpeedKmH += (targetSpeedKmH - displaySpeedKmH) * 0.08; // 8% smoothness factor per frame
            
            let roundedSpeed = Math.round(displaySpeedKmH);
            let speedStr = roundedSpeed < 10 ? '0' + roundedSpeed : roundedSpeed.toString();
            
            if (speedVal && speedVal.innerText !== speedStr) {
                speedVal.innerText = speedStr;
            }

            let color = '#e0e0e0';
            let statText = 'Idle';
            
            if (roundedSpeed > 0 && roundedSpeed <= 20) { color = '#5eb063'; statText = 'Low Speed 🟢'; }
            else if (roundedSpeed > 20 && roundedSpeed <= 50) { color = '#f39c12'; statText = 'Medium 🟡'; }
            else if (roundedSpeed > 50 && roundedSpeed <= 80) { color = '#e67e22'; statText = 'High 🟠'; }
            else if (roundedSpeed > 80) { color = '#d9534f'; statText = 'Very High 🔴'; }

            if (speedStatusBadge && speedStatusBadge.innerText !== statText) {
                speedStatusBadge.style.background = color;
                speedStatusBadge.style.color = 'white';
                speedStatusBadge.innerText = statText;
            }

            if (speedGauge) {
                let percentage = Math.min(displaySpeedKmH / 120 * 100, 100);
                speedGauge.style.background = `conic-gradient(${color} ${percentage}%, transparent 0)`;
            }
        }
        requestAnimationFrame(animateSpeedGauge);
    }
    requestAnimationFrame(animateSpeedGauge); // Start animation loop once

    function deviceSuccess(pos) {
        if(gpsStatus) { gpsStatus.innerText = "Connected"; gpsStatus.style.color = "#5eb063"; }
        var crd = pos.coords;
        
        if (lastSpeedLat === crd.latitude && lastSpeedLon === crd.longitude) return;

        if (lastSpeedLat !== null && lastSpeedLon !== null) {
            totalSpeedDist += calcDeviceDist(lastSpeedLat, lastSpeedLon, crd.latitude, crd.longitude);
            if(gpsDistance) gpsDistance.innerText = totalSpeedDist.toFixed(2) + ' km';
        }
        
        lastSpeedLat = crd.latitude; lastSpeedLon = crd.longitude;
        
        var speed = crd.speed ? (crd.speed * 3.6) : 0; 
        if (speed < 2) speed = 0; // Remove walking/stationary GPS noise
        
        targetSpeedKmH = speed; // Update target for smooth animation
        
        if(gpsDirection) gpsDirection.innerText = getDeviceDir(crd.heading);
    }

    function deviceError(err) {
        // MOBILE FIX: Ignore timeouts so it doesn't hang or stop tracking randomly
        if (err.code === 1) { // PERMISSION_DENIED
            if(gpsStatus) { gpsStatus.innerText = "Permission Denied"; gpsStatus.style.color = "#d9534f"; }
            Swal.fire({ title: 'Permission Denied', text: 'Please enable Location permission.', icon: 'error', target: document.getElementById('settingsPage') || 'body' });
            stopDeviceTracking();
        } else if (err.code === 3) { // TIMEOUT
            if(gpsStatus) { gpsStatus.innerText = "Searching GPS..."; gpsStatus.style.color = "#f39c12"; }
            // Do nothing, let it keep trying.
        } else {
            if(gpsStatus) { gpsStatus.innerText = "Weak Signal"; gpsStatus.style.color = "#f39c12"; }
        }
    }

    function startDeviceTracking() {
        if (!navigator.geolocation) { Swal.fire({title: 'Error', text: 'Geolocation is not supported', icon: 'error', target: document.getElementById('settingsPage') || 'body'}); return; }
        if(gpsStatus) { gpsStatus.innerText = "Searching..."; gpsStatus.style.color = "#f39c12"; }
        if(startBtn) startBtn.style.display = 'none';
        if(pauseBtn) pauseBtn.style.display = 'flex';
        if(stopBtn) stopBtn.style.display = 'flex';
        
        // Timeout 30s & maximumAge 3s for smooth mobile tracking without failing
        watchSpeedId = navigator.geolocation.watchPosition(deviceSuccess, deviceError, { 
            enableHighAccuracy: true, 
            timeout: 30000, 
            maximumAge: 3000 
        });
    }

    function stopDeviceTracking() {
        if (watchSpeedId) navigator.geolocation.clearWatch(watchSpeedId);
        lastSpeedLat = null; lastSpeedLon = null; totalSpeedDist = 0;
        targetSpeedKmH = 0; // Reset animation
        if(gpsDistance) gpsDistance.innerText = '0.00 km';
        if(gpsDirection) gpsDirection.innerText = '--';
        if(gpsStatus) { gpsStatus.innerText = "Stopped"; gpsStatus.style.color = "#d9534f"; }
        if(startBtn) startBtn.style.display = 'flex';
        if(pauseBtn) pauseBtn.style.display = 'none';
        if(stopBtn) stopBtn.style.display = 'none';
    }

    function pauseDeviceTracking() {
        if (watchSpeedId) navigator.geolocation.clearWatch(watchSpeedId);
        if(gpsStatus) { gpsStatus.innerText = "Paused"; gpsStatus.style.color = "#f39c12"; }
        if(startBtn) startBtn.style.display = 'flex';
        if(pauseBtn) pauseBtn.style.display = 'none';
    }

    if(startBtn) startBtn.addEventListener('click', startDeviceTracking);
    if(stopBtn) stopBtn.addEventListener('click', stopDeviceTracking);
    if(pauseBtn) pauseBtn.addEventListener('click', pauseDeviceTracking);

});
