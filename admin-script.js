import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBiKOWchCMZhELByLsw6jieJqMCKy442zE",
    authDomain: "keshabpur-news.firebaseapp.com",
    databaseURL: "https://keshabpur-news-default-rtdb.firebaseio.com",
    projectId: "keshabpur-news",
    storageBucket: "keshabpur-news.firebasestorage.app",
    messagingSenderId: "1073107142671",
    appId: "1:1073107142671:web:03054deafec95924607b7a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ডিরেক্টরি লোড
const sidebarList = document.getElementById('sidebar-list');
onValue(ref(db, 'news'), (snapshot) => {
    const data = snapshot.val();
    sidebarList.innerHTML = '';
    if (data) {
        Object.keys(data).reverse().forEach(key => {
            const news = data[key];
            const div = document.createElement('div');
            div.className = 'news-item';
            div.innerHTML = `
                <div style="font-weight:bold; color:#01ff95; font-size:14px;">${news.category} | ${news.date || ''}</div>
                <div style="font-size:16px; margin:8px 0; line-height:1.4; color:#fff;">${news.title}</div>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editNews('${key}')"><i class="fas fa-edit"></i> এডিট</button>
                    <button class="del-btn" onclick="deleteNews('${key}')"><i class="fas fa-trash"></i> ডিলিট</button>
                </div>
            `;
            sidebarList.appendChild(div);
        });
    } else {
        sidebarList.innerHTML = '<p style="text-align:center; color:#555;">কোন সংবাদ পাওয়া যায়নি।</p>';
    }
});

// সেভ বা আপডেট
document.getElementById('newsEntryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const key = document.getElementById('editKey').value;
    const title = document.getElementById('newsTitle').value;
    const category = document.getElementById('newsCategory').value;
    const image = document.getElementById('newsImage').value || 'images (11).png';
    const details = document.getElementById('newsDetails').value;
    const date = new Date().toLocaleDateString('bn-BD');

    const newsData = { title, category, image, details, date };

    if (key) {
        set(ref(db, 'news/' + key), newsData).then(() => {
            alert("সফলভাবে আপডেট হয়েছে!");
            resetForm();
        });
    } else {
        push(ref(db, 'news'), newsData).then(() => {
            alert("সফলভাবে পাবলিশ হয়েছে!");
            resetForm();
        });
    }
});

// এডিট ফাংশন
window.editNews = (key) => {
    get(ref(db, 'news/' + key)).then((snapshot) => {
        const news = snapshot.val();
        document.getElementById('editKey').value = key;
        document.getElementById('newsTitle').value = news.title;
        document.getElementById('newsCategory').value = news.category;
        document.getElementById('newsImage').value = news.image;
        document.getElementById('newsDetails').value = news.details;
        document.getElementById('formTitle').innerHTML = "<i class='fas fa-sync-alt'></i> সংবাদ আপডেট করুন";
        document.getElementById('submitBtn').innerHTML = "আপডেট নিশ্চিত করুন";
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
};

// ডিলিট ফাংশন
window.deleteNews = (key) => {
    if(confirm("আপনি কি নিশ্চিত যে খবরটি মুছে ফেলতে চান?")) {
        remove(ref(db, 'news/' + key)).then(() => alert("খবরটি মুছে ফেলা হয়েছে!"));
    }
};

function resetForm() {
    document.getElementById('newsEntryForm').reset();
    document.getElementById('editKey').value = '';
    document.getElementById('formTitle').innerHTML = "<i class='fas fa-edit'></i> সংবাদ প্রকাশ করুন";
    document.getElementById('submitBtn').innerHTML = "পাবলিশ করুন";
}