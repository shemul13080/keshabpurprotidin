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

// সংবাদ তালিকা লোড করা (বামপাশে)
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
                <div style="font-size: 14px; margin-bottom: 8px;">${news.title.substring(0, 40)}...</div>
                <div style="display:flex; gap: 10px;">
                    <button onclick="editNews('${key}')" style="background:#01ff95; border:none; padding:3px 10px; border-radius:5px; cursor:pointer; font-size:12px;">এডিট</button>
                    <button onclick="deleteNews('${key}')" style="background:#ff4d4d; color:white; border:none; padding:3px 10px; border-radius:5px; cursor:pointer; font-size:12px;">ডিলিট</button>
                </div>
            `;
            sidebarList.appendChild(div);
        });
    } else {
        sidebarList.innerHTML = '<p style="text-align:center; color:#888;">কোনো নিউজ নেই</p>';
    }
});

// পাবলিশ বা আপডেট করা
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
        // আপডেট (Edit)
        set(ref(db, 'news/' + key), newsData).then(() => {
            alert("সংবাদটি আপডেট হয়েছে!");
            resetForm();
        });
    } else {
        // নতুন পোস্ট (Push)
        const newPostRef = push(ref(db, 'news'));
        set(newPostRef, newsData).then(() => {
            alert("সংবাদটি পাবলিশ হয়েছে!");
            resetForm();
        });
    }
});

// এডিট ফাংশন
window.editNews = (key) => {
    const newsRef = ref(db, 'news/' + key);
    get(newsRef).then((snapshot) => {
        const news = snapshot.val();
        document.getElementById('editKey').value = key;
        document.getElementById('newsTitle').value = news.title;
        document.getElementById('newsCategory').value = news.category;
        document.getElementById('newsImage').value = news.image;
        document.getElementById('newsDetails').value = news.details;
        
        document.getElementById('formTitle').innerHTML = '<i class="fas fa-sync"></i> সংবাদ আপডেট করুন';
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-check"></i> আপডেট করুন';
        window.scrollTo(0, 0);
    });
};

// ডিলিট ফাংশন
window.deleteNews = (key) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই খবরটি মুছে ফেলতে চান?")) {
        remove(ref(db, 'news/' + key)).then(() => alert("ডিলিট সফল!"));
    }
};

// ফরম রিসেট
window.resetForm = () => {
    document.getElementById('newsEntryForm').reset();
    document.getElementById('editKey').value = '';
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus-circle"></i> নতুন সংবাদ প্রকাশ করুন';
    document.getElementById('submitBtn').innerHTML = '<i class="fas fa-paper-plane"></i> পাবলিশ করুন';
};
