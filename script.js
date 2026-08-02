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
    // 🎵 PREMIUM AUDIO BEEP SYSTEM (Web Audio API - No files needed)
    // =========================================================
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function playAlertBeep(intensity) {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (intensity === 'high') {
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.2);
        } else {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); 
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
        }
    }

    // =========================================================
    // 🎵 PREMIUM BACKGROUND MUSIC SYSTEM
    // =========================================================
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('music-toggle');
    const musicIconOn = document.getElementById('icon-music-on');
    const musicIconOff = document.getElementById('icon-music-off');
    const musicStatusText = document.getElementById('musicStatusText');
    
    let musicStarted = false;
    let targetVolume = 0.03; 
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
    // 🚨 LIVE MARQUEE ALERT LOGIC
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
                    }).then(() => { window.location.href = 'login.html'; });
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
                            if(res.data.highest_speed) {
                                localStorage.setItem('hr_highest_speed', res.data.highest_speed);
                                document.getElementById('stHighestSpeed').innerText = Math.round(res.data.highest_speed) + " km/h";
                            }
                            if(dispName) dispName.innerText = res.data.name;
                            if(dispMob) dispMob.innerText = "+91 " + res.data.mobile;
                            if(dispEmail) dispEmail.innerText = res.data.email;
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

    // =========================================================
    // ROUTES TAB LOGIC 
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
    // 🗺️ FREE ROUTE MAP LOGIC (LEAFLET, ZOOM, HARDWARE BACK FIXED)
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
        } catch (e) { }
        return null;
    }

    window.addEventListener('popstate', function(e) {
        var mapPage = document.getElementById('routeMapPage');
        if (mapPage && mapPage.style.display === 'flex') {
            mapPage.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    window.openRouteMap = async function(from, to, via, dep, type, op) {
        var mapPage = document.getElementById('routeMapPage');
        if(!mapPage) return;
        
        history.pushState({ mapOpen: true }, null, "#routeMap");

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
            L.control.zoom({ position: 'bottomleft' }).addTo(lMap);
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
        }
    };

    var btnBackMap = document.getElementById('btnBackFromMap');
    if(btnBackMap) {
        btnBackMap.addEventListener('click', function() {
            var mapPage = document.getElementById('routeMapPage');
            if(mapPage) mapPage.style.display = 'none';
            document.body.style.overflow = 'auto';
            if(window.location.hash === '#routeMap') history.back();
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
    // 🔥 PREMIUM DEVICE SPEED TRACKER (FULL LOGIC & ALERTS) 🔥
    // =========================================================
    var watchSpeedId = null;
    var totalSpeedDistKm = 0;
    var lastSpeedLat = null;
    var lastSpeedLon = null;
    
    var tripActive = false;
    var tripStartTime = null;
    var tripTimerInt = null;
    
    var highestSpeedAchieved = parseFloat(localStorage.getItem('hr_highest_speed') || 0);
    
    var alertLevel = 0; 
    var beepIntervalId = null;

    var startBtn = document.getElementById('btnStartTrip');
    var endBtn = document.getElementById('btnEndTrip');
    
    var stCurrentSpeed = document.getElementById('stCurrentSpeed');
    var meterNeedle = document.getElementById('meterNeedle');
    var stSpeedStatusBadge = document.getElementById('stSpeedStatusBadge');
    
    var stHighestSpeed = document.getElementById('stHighestSpeed');
    var stHighestDate = document.getElementById('stHighestDate');
    var stAvgSpeed = document.getElementById('stAvgSpeed');
    var stDistance = document.getElementById('stDistance');
    var stTime = document.getElementById('stTime');
    var stTextStatus = document.getElementById('stTextStatus');
    var stTripStart = document.getElementById('stTripStart');
    var stCurrentLoc = document.getElementById('stCurrentLoc');
    
    var stGpsText = document.getElementById('stGpsText');
    var stGpsDot = document.getElementById('stGpsDot');

    var warnPopup = document.getElementById('speedWarningPopup');
    var warnCurrentSpeed = document.getElementById('warnCurrentSpeed');

    if(stHighestSpeed) stHighestSpeed.innerText = Math.round(highestSpeedAchieved) + " km/h";

    function calcDeviceDist(lat1, lon1, lat2, lon2) {
        var R = 6371; 
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; 
    }

    async function getLocName(lat, lon) {
        try {
            var res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            var data = await res.json();
            return data.address.city || data.address.town || data.address.village || data.address.county || "Unknown Location";
        } catch(e) { return "GPS Coordinates"; }
    }

    function manageAlerts(speed) {
        // High Alert (>= 100)
        if (speed >= 100) {
            if (alertLevel !== 2) {
                alertLevel = 2;
                document.body.classList.remove('danger-blink');
                document.body.classList.add('high-danger-blink');
                warnPopup.style.display = 'block';
                clearInterval(beepIntervalId);
                beepIntervalId = setInterval(() => playAlertBeep('high'), 500); // Fast Beep
            }
        } 
        // Normal Alert (>= 76 & < 100)
        else if (speed > 75) {
            if (alertLevel !== 1) {
                alertLevel = 1;
                document.body.classList.remove('high-danger-blink');
                document.body.classList.add('danger-blink');
                warnPopup.style.display = 'block';
                clearInterval(beepIntervalId);
                playAlertBeep('low'); // Beep once immediately
                beepIntervalId = setInterval(() => playAlertBeep('low'), 5000); // Beep every 5 seconds
            }
        } 
        // Safe Speed
        else {
            if (alertLevel !== 0) {
                alertLevel = 0;
                document.body.classList.remove('danger-blink', 'high-danger-blink');
                warnPopup.style.display = 'none';
                clearInterval(beepIntervalId);
            }
        }
        
        if (alertLevel > 0 && warnCurrentSpeed) {
            warnCurrentSpeed.innerText = Math.round(speed) + " km/h";
        }
    }

    // 🏎️ PREMIUM SMOOTH SPEED ANIMATION
    let targetSpeedKmH = 0;
    let displaySpeedKmH = 0;
    
    function animateSpeedGauge() {
        if (Math.abs(targetSpeedKmH - displaySpeedKmH) > 0.1) {
            displaySpeedKmH += (targetSpeedKmH - displaySpeedKmH) * 0.08; 
            
            let roundedSpeed = Math.round(displaySpeedKmH);
            let speedStr = roundedSpeed < 10 ? '0' + roundedSpeed : roundedSpeed.toString();
            
            if (stCurrentSpeed && stCurrentSpeed.innerText !== speedStr) {
                stCurrentSpeed.innerText = speedStr;
            }

            // Move Needle (0-160 km/h maps to -90 to +90 degrees)
            let angle = -90 + (Math.min(displaySpeedKmH, 160) / 160) * 180;
            if (meterNeedle) {
                meterNeedle.style.transform = `rotate(${angle}deg)`;
            }

            let color = '#5eb063';
            let statText = '<i class="fa-solid fa-circle"></i> Normal Speed';
            let mainStat = 'Safe';
            let mainStatColor = '#5eb063';
            
            if (roundedSpeed === 0) { color = '#777'; statText = '<i class="fa-solid fa-circle-stop"></i> Stopped'; mainStat = 'Stopped'; }
            else if (roundedSpeed > 0 && roundedSpeed <= 50) { color = '#5eb063'; statText = '<i class="fa-solid fa-circle"></i> Slow / Normal'; mainStat = 'Safe'; }
            else if (roundedSpeed > 50 && roundedSpeed <= 75) { color = '#f39c12'; statText = '<i class="fa-solid fa-circle"></i> Fast'; mainStat = 'Fast'; mainStatColor = '#f39c12'; }
            else if (roundedSpeed > 75) { color = '#d9534f'; statText = '<i class="fa-solid fa-circle-exclamation"></i> OVER SPEED'; mainStat = 'DANGER'; mainStatColor = '#d9534f'; }

            if (stSpeedStatusBadge && stSpeedStatusBadge.innerHTML !== statText) {
                stSpeedStatusBadge.innerHTML = statText;
                stSpeedStatusBadge.style.color = color;
                stSpeedStatusBadge.style.background = `rgba(${color === '#d9534f' ? '217,83,79' : (color === '#f39c12' ? '243,156,18' : '94,176,99')}, 0.1)`;
            }
            if (stTextStatus && stTextStatus.innerText !== mainStat) {
                stTextStatus.innerText = mainStat;
                stTextStatus.style.color = mainStatColor;
            }
        }
        requestAnimationFrame(animateSpeedGauge);
    }
    requestAnimationFrame(animateSpeedGauge);

    function deviceSuccess(pos) {
        if(stGpsText) { stGpsText.innerText = "GPS Connected"; stGpsDot.style.color = "#5eb063"; }
        var crd = pos.coords;
        
        if (lastSpeedLat === crd.latitude && lastSpeedLon === crd.longitude) return;

        if (lastSpeedLat !== null && lastSpeedLon !== null) {
            let dist = calcDeviceDist(lastSpeedLat, lastSpeedLon, crd.latitude, crd.longitude);
            totalSpeedDistKm += dist;
            if(stDistance) stDistance.innerText = totalSpeedDistKm.toFixed(2) + ' km';
            
            // Calculate Average Speed
            if (tripStartTime) {
                let hoursElapsed = (Date.now() - tripStartTime) / (1000 * 60 * 60);
                if (hoursElapsed > 0.01) { // Prevent infinity
                    let avg = totalSpeedDistKm / hoursElapsed;
                    if (stAvgSpeed) stAvgSpeed.innerText = Math.round(avg) + " km/h";
                }
            }
        }
        
        lastSpeedLat = crd.latitude; 
        lastSpeedLon = crd.longitude;
        
        // Reverse Geocoding every few distance (Debounce)
        if (Math.random() < 0.1) { // 10% chance to update location to save API calls
            getLocName(crd.latitude, crd.longitude).then(name => {
                if(stCurrentLoc) stCurrentLoc.innerText = "Near " + name + ", India";
            });
        }
        
        var speed = crd.speed ? (crd.speed * 3.6) : 0; 
        if (speed < 2) speed = 0; 
        
        targetSpeedKmH = speed; 
        
        // Highest Speed Logic
        if (speed > highestSpeedAchieved) {
            highestSpeedAchieved = speed;
            localStorage.setItem('hr_highest_speed', highestSpeedAchieved);
            if(stHighestSpeed) stHighestSpeed.innerText = Math.round(highestSpeedAchieved) + " km/h";
            
            let d = new Date();
            let dateStr = d.toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'});
            if(stHighestDate) stHighestDate.innerHTML = `Achieved on ${dateStr}<br><span style="color:#5eb063;font-weight:bold;font-size:0.7rem;">Personal Best</span>`;
            
            // Supabase Silent Update
            if (db && userEmail) {
                db.from('users').update({ highest_speed: highestSpeedAchieved }).eq('email', userEmail).then(()=>{});
            }
        }

        manageAlerts(speed);
    }

    function deviceError(err) {
        if (err.code === 1) { 
            if(stGpsText) { stGpsText.innerText = "Permission Denied"; stGpsDot.style.color = "#d9534f"; }
            Swal.fire({ title: 'Permission Denied', text: 'Please enable Location permission in your device settings.', icon: 'error', target: document.getElementById('settingsPage') || 'body' });
            stopTrip();
        } else { 
            if(stGpsText) { stGpsText.innerText = "Searching GPS..."; stGpsDot.style.color = "#f39c12"; }
        }
    }

    function startTrip() {
        if (!navigator.geolocation) { Swal.fire({title: 'Error', text: 'Geolocation is not supported', icon: 'error', target: document.getElementById('settingsPage') || 'body'}); return; }
        
        tripActive = true;
        tripStartTime = Date.now();
        totalSpeedDistKm = 0;
        
        if(stTripStart) {
            let d = new Date();
            stTripStart.innerText = d.toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'}) + ", " + d.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});
        }
        
        if(startBtn) startBtn.style.display = 'none';
        if(endBtn) endBtn.style.display = 'block';
        if(stGpsText) { stGpsText.innerText = "Connecting..."; stGpsDot.style.color = "#f39c12"; }
        
        // Timer Logic
        tripTimerInt = setInterval(() => {
            let diff = Math.floor((Date.now() - tripStartTime) / 1000);
            let h = Math.floor(diff / 3600).toString().padStart(2, '0');
            let m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
            let s = (diff % 60).toString().padStart(2, '0');
            if(stTime) stTime.innerText = `${h}:${m}:${s}`;
        }, 1000);

        watchSpeedId = navigator.geolocation.watchPosition(deviceSuccess, deviceError, { 
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 0 
        });
    }

    function stopTrip() {
        if (watchSpeedId) navigator.geolocation.clearWatch(watchSpeedId);
        clearInterval(tripTimerInt);
        tripActive = false;
        targetSpeedKmH = 0; 
        alertLevel = 0;
        clearInterval(beepIntervalId);
        document.body.classList.remove('danger-blink', 'high-danger-blink');
        warnPopup.style.display = 'none';
        
        if(stGpsText) { stGpsText.innerText = "Trip Ended"; stGpsDot.style.color = "#d9534f"; }
        if(startBtn) startBtn.style.display = 'block';
        if(endBtn) endBtn.style.display = 'none';
        
        // Save Trip Data to DB
        if (db && userEmail) {
            db.from('users').update({ 
                last_trip_distance: totalSpeedDistKm,
                last_trip_time: stTime.innerText,
                last_trip_date: new Date().toISOString()
            }).eq('email', userEmail).then(()=>{});
            
            // Insert Trip History
            db.from('trip_history').insert([{
                user_email: userEmail,
                max_speed: highestSpeedAchieved,
                distance: totalSpeedDistKm,
                duration: stTime.innerText
            }]).then(()=>{});
        }

        Swal.fire({
            title: 'Trip Ended',
            html: `Total Distance: <strong>${totalSpeedDistKm.toFixed(2)} km</strong><br>Time: <strong>${stTime.innerText}</strong>`,
            icon: 'success',
            target: document.getElementById('settingsPage') || 'body'
        });
    }

    if(startBtn) startBtn.addEventListener('click', startTrip);
    if(endBtn) endBtn.addEventListener('click', stopTrip);

});
