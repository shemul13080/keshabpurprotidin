// ==========================================
// ১. গ্লোবাল ভেরিয়েবল এবং স্টেট
// ==========================================
let mCurrentOperand = "";
let mPreviousOperand = "";
let mOperation = undefined;
let currentNewsIndex = 0;

// নিউজ ডাটা (স্লাইডারের জন্য)
const myNewsData = [
    "ব্রেকিং নিউজ: আমাদের নতুন সাইবার প্যানেল এখন লাইভ!",
    "প্রযুক্তি সংবাদ: জাভাস্ক্রিপ্টের নতুন আপডেট এসেছে।",
    "আবহাওয়া: আজ আকাশ পরিষ্কার থাকবে এবং রোদ বাড়বে।",
    "খেলাধুলা: বাংলাদেশ ও ভারতের মধ্যে সিরিজ শুরু হচ্ছে।"
];

// ==========================================
// ২. সাইবার ঘড়ি লজিক
// ==========================================
function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    
    if(document.getElementById('hours')) document.getElementById('hours').innerText = h;
    if(document.getElementById('minutes')) document.getElementById('minutes').innerText = m;
    if(document.getElementById('seconds')) document.getElementById('seconds').innerText = s;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if(document.getElementById('fullDate')) {
        document.getElementById('fullDate').innerText = now.toLocaleDateString('bn-BD', options);
    }
}

// ==========================================
// ৩. ক্যালকুলেটর লজিক
// ==========================================
function addM(number) {
    if (mCurrentOperand === "0" && number !== ".") mCurrentOperand = number.toString();
    else if (number === "." && mCurrentOperand.includes(".")) return;
    else mCurrentOperand = mCurrentOperand.toString() + number.toString();
    updateMDisplay();
}

function opM(op) {
    if (mCurrentOperand === "") {
        if (mPreviousOperand !== "") mOperation = op;
        updateMDisplay();
        return;
    }
    if (mPreviousOperand !== "") compM();
    mOperation = op;
    mPreviousOperand = mCurrentOperand;
    mCurrentOperand = "";
    updateMDisplay();
}

function compM() {
    let result;
    const prev = parseFloat(mPreviousOperand);
    const current = parseFloat(mCurrentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (mOperation) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': 
            if (current === 0) { alert("শুন্য দিয়ে ভাগ অসম্ভব!"); clearM(); return; }
            result = prev / current; break;
        default: return;
    }
    mCurrentOperand = result.toString();
    mOperation = undefined;
    mPreviousOperand = "";
    updateMDisplay();
}

function clearM() { mCurrentOperand = ""; mPreviousOperand = ""; mOperation = undefined; updateMDisplay(); }
function delM() { mCurrentOperand = mCurrentOperand.toString().slice(0, -1); updateMDisplay(); }

function updateMDisplay() {
    const currElement = document.getElementById('m-curr');
    const prevElement = document.getElementById('m-prev');
    if(currElement) currElement.innerText = mCurrentOperand === "" ? "0" : mCurrentOperand;
    if(prevElement) prevElement.innerText = mOperation != null ? `${mPreviousOperand} ${mOperation}` : "";
}

// ==========================================
// ৪. নিউজ স্লাইডার
// ==========================================
function updateNewsSlider() {
    const newsElement = document.getElementById('news-content');
    if (!newsElement) return;

    newsElement.style.opacity = 0;
    setTimeout(() => {
        newsElement.innerText = myNewsData[currentNewsIndex];
        newsElement.style.opacity = 1;
        currentNewsIndex = (currentNewsIndex + 1) % myNewsData.length;
    }, 500);
}

// ==========================================
// ৫. আল-কুরআন উইজেট লজিক (১১৪ সূরা)
// ==========================================
async function initSurahList() {
    const select = document.getElementById('surahSelect');
    if(!select) return;
    try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        data.data.forEach(surah => {
            let option = document.createElement('option');
            option.value = surah.number;
            option.text = `${surah.number}. ${surah.name} (${surah.englishName})`;
            select.add(option);
        });
    } catch (err) {
        console.error("সূরা লিস্ট লোড করতে সমস্যা হয়েছে।");
    }
}

async function fetchSurahData() {
    const surahId = document.getElementById('surahSelect').value;
    if (!surahId) return;

    const container = document.getElementById('versesContainer');
    const loader = document.getElementById('loadingText');
    
    container.innerHTML = '';
    loader.style.display = 'block';

    try {
        // আরবি, বাংলা উচ্চারণ এবং বাংলা অর্থ - এই তিনটি ভার্সন একসাথে আনা হচ্ছে
        // bn.transliteration আমাদের সরাসরি বাংলা অক্ষরে উচ্চারণ দিবে
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-simple,bn.transliteration,bn.bengali`);
        const data = await res.json();

        loader.style.display = 'none';

        // ডাটা সেট করা
        const arabicAyahs = data.data[0].ayahs;      // আরবি
        const transAyahs = data.data[1].ayahs;       // বাংলা উচ্চারণ (সরাসরি বাংলা হরফে)
        const bengaliAyahs = data.data[2].ayahs;    // বাংলা অর্থ

        arabicAyahs.forEach((ayah, index) => {
            let arText = ayah.text;
            
            // সূরার শুরুতে 'বিসমিল্লাহ' থাকলে তা পরিষ্কার করা (সূরা ফাতিহা বাদে)
            if (surahId != 1 && index === 0 && arText.includes("بِسْمِ اللَّهِ الرَّحْمَنِ الرَّহِيمِ")) {
                arText = arText.replace("بِسْمِ اللَّهِ الرَّحْمَنِ الرَّহِيمِ", "");
            }

            const verseHtml = `
                <div class="verse-box" style="border-bottom: 2px solid #333; padding: 25px 0; text-align: center; background: #1a1a1a; margin-bottom: 10px; border-radius: 10px;">
                    <p class="arabic-text" style="font-size: 32px; color: #fff; direction: rtl; line-height: 2.2; font-family: 'Amiri', serif; margin-bottom: 15px;">
                        ${arText}
                    </p>
                    
                    <p class="trans-text" style="font-size: 18px; color: #4db8ff; margin: 10px 0; font-weight: bold; background: rgba(77, 184, 255, 0.1); padding: 10px; border-radius: 5px;">
                        <span style="color: #ccc; font-weight: normal; font-size: 14px; display: block;">উচ্চারণ:</span>
                        ${transAyahs[index].text}
                    </p>
                    
                    <p class="bengali-text" style="font-size: 16px; color: #bbb; line-height: 1.8; padding: 0 15px;">
                        <span style="color: #ff0000; font-weight: bold;">অর্থ [${index + 1}]:</span> ${bengaliAyahs[index].text}
                    </p>
                </div>
            `;
            container.innerHTML += verseHtml;
        });
    } catch (err) {
        loader.innerText = "দুঃখিত, ডাটা লোড হতে সমস্যা হয়েছে। আপনার ইন্টারনেট চেক করুন।";
        console.error(err);
    }
}

// ==========================================
// ৬. অথেনটিকেশন ও পেজ লোডার
// ==========================================
function checkUserLogin() {
    const isLoggedIn = localStorage.getItem('isUserRegistered');
    const userMenu = document.getElementById('userMenu');
    const openAuthBtn = document.getElementById('openAuth');

    if (isLoggedIn === 'true') {
        if(userMenu) userMenu.style.display = 'flex';
        if(openAuthBtn) openAuthBtn.style.display = 'none';
    } else {
        if(userMenu) userMenu.style.display = 'none';
        if(openAuthBtn) openAuthBtn.style.display = 'flex';
    }
}

function initAuthEvents() {
    const authModal = document.getElementById('authModal');
    const authBox = document.getElementById('authBox');
    const signUpBtn = document.getElementById('signUp');
    const signInBtn = document.getElementById('signIn');
    const openAuthBtn = document.getElementById('openAuth');
    const closeModal = document.getElementById('closeModal');

    if(signUpBtn) signUpBtn.onclick = () => authBox.classList.add("active");
    if(signInBtn) signInBtn.onclick = () => authBox.classList.remove("active");
    if(openAuthBtn) openAuthBtn.onclick = () => authModal.style.display = "flex";
    if(closeModal) closeModal.onclick = () => authModal.style.display = "none";

    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            localStorage.setItem('isUserRegistered', 'true');
            authModal.style.display = "none";
            checkUserLogin();
            alert('সফলভাবে প্রবেশ করেছেন!');
        };
    }
    window.onclick = (event) => { if (event.target == authModal) authModal.style.display = "none"; };
}

function logoutUser() {
    localStorage.removeItem('isUserRegistered');
    location.reload();
}

// মাস্টার লোডার
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    
    updateNewsSlider();
    setInterval(updateNewsSlider, 4000);

    initAuthEvents();
    checkUserLogin();
    updateMDisplay();
    initSurahList(); // এখানে কুরআন উইজেট ইনিশিয়েট করা হলো
});
document.addEventListener('DOMContentLoaded', function() {
        const monthPicker = document.getElementById('archive-month-picker');
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
        
        // বর্তমান মাস সেট করা (YYYY-MM ফরম্যাট)
        const yearMonth = `${currentYear}-${currentMonth}`;
        monthPicker.value = yearMonth;
        monthPicker.max = yearMonth; // ভবিষ্যতের মাস ব্লক
    });

    function searchByMonth() {
        const selectedMonth = document.getElementById('archive-month-picker').value;
        if(selectedMonth) {
            // নির্বাচিত মাসের ফরম্যাট হবে YYYY-MM (যেমন: 2026-02)
            alert("আপনি " + selectedMonth + " মাসের সংবাদ আর্কাইভ খুঁজছেন।");
            // আপনার লিঙ্কে পাঠানোর কোড:
            // window.location.href = "/archive-page?month=" + selectedMonth;
        }
    }
    
    const monthDisplay = document.getElementById('monthDisplay');
const calendarDays = document.getElementById('calendarDays');
let currentDate = new Date();

function renderCalendar() {
    calendarDays.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthDisplay.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);
    
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Sat=0 হিসেবে শুরু করার লজিক
    let startDay = (firstDayOfMonth + 1) % 7; 

    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");
            
            if (i === 0 && j < startDay) {
                cell.innerText = "";
            } else if (date > daysInMonth) {
                break;
            } else {
                cell.innerText = date;
                
                // শনিবার (j=0) এবং শুক্রবার (j=6) এর জন্য weekend ক্লাস
                if (j === 0 || j === 6) {
                cell.classList.add("weekend");
                }
                
                // আজকের তারিখ চেক
                const today = new Date();
                if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    cell.classList.add("today");
                }
                
                cell.onclick = function() {
                    document.querySelectorAll('.modern-calendar td').forEach(td => td.classList.remove('active'));
                    this.classList.add('active');
                };
                
                date++;
            }
            row.appendChild(cell);
        }
        calendarDays.appendChild(row);
        if (date > daysInMonth) break;
    }
}

document.getElementById('prevMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

renderCalendar();