import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ফায়ারবেস কনসোল থেকে পাওয়া আপনার নিজস্ব তথ্য এখানে বসান
const firebaseConfig = {
  apiKey: "AIzaSyBiKOWchCMZhELByLsw6jieJqMCKy442zE",
  authDomain: "keshabpur-news.firebaseapp.com",
  databaseURL: "https://keshabpur-news-default-rtdb.firebaseio.com", // এটি আমি যোগ করে দিলাম
  projectId: "keshabpur-news",
  storageBucket: "keshabpur-news.firebasestorage.app",
  messagingSenderId: "1073107142671",
  appId: "1:1073107142671:web:03054deafec95924607b7a"
};

// ফায়ারবেস ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ফর্ম সাবমিট হ্যান্ডলার
const newsForm = document.getElementById('newsEntryForm');

if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // ফর্ম থেকে ডেটা সংগ্রহ
        const title = document.getElementById('newsTitle').value;
        const category = document.getElementById('newsCategory').value;
        const image = document.getElementById('newsImage').value || "https://via.placeholder.com/800x450";
        const details = document.getElementById('newsDetails').value;
        const publishDate = new Date().toLocaleString('bn-BD');

        // ডেটাবেসে পাঠানোর অবজেক্ট
        const newsPost = {
            title: title,
            category: category,
            image: image,
            details: details,
            date: publishDate,
            timestamp: Date.now()
        };

        // 'news' নামক টেবিল/রেফারেন্সে ডেটা পাঠানো
        push(ref(db, 'news'), newsPost)
            .then(() => {
                alert("✅ অভিনন্দন! খবরটি সফলভাবে পাবলিশ হয়েছে।");
                newsForm.reset(); // ফর্ম খালি করা
            })
            .catch((error) => {
                alert("❌ সমস্যা হয়েছে: " + error.message);
            });
    });
}