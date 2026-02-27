// পেজ লোড হলে নিউজ লিস্ট দেখাবে
document.addEventListener('DOMContentLoaded', displayNewsTable);

const adminPostForm = document.getElementById('adminPostForm');

// ১. নিউজ সেভ করার লজিক
adminPostForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const details = document.getElementById('postDetails').value;
    const imageFile = document.getElementById('postImage').files[0];

    // ইমেজকে Base64 এ রূপান্তর করা (লোকাল স্টোরেজে সেভ করার জন্য)
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            saveToStorage(title, category, details, event.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveToStorage(title, category, details, 'https://via.placeholder.com/100');
    }
});

function saveToStorage(title, category, details, image) {
    let newsList = JSON.parse(localStorage.getItem('myNews')) || [];

    const newPost = {
        id: Date.now(),
        date: new Date().toLocaleDateString('bn-BD'),
        title: title,
        category: category,
        description: details,
        image: image
    };

    newsList.push(newPost);
    localStorage.setItem('myNews', JSON.stringify(newsList));

    adminPostForm.reset(); // ফর্ম ক্লিয়ার করা
    alert("নিউজ সফলভাবে পাবলিশ হয়েছে!");
    displayNewsTable(); // টেবিল আপডেট করা
}

// ২. টেবিল লিস্ট দেখানোর লজিক
function displayNewsTable() {
    const tableBody = document.getElementById('newsTableBody');
    if (!tableBody) return;

    const newsData = JSON.parse(localStorage.getItem('myNews')) || [];
    tableBody.innerHTML = "";

    if (newsData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='3' style='text-align:center;'>কোনো নিউজ নেই</td></tr>";
        return;
    }

    // নতুন নিউজ সবার উপরে দেখাবে
    newsData.reverse().forEach((news) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${news.date}</td>
            <td>${news.title}</td>
            <td>
                <button onclick="deleteNews(${news.id})" style="background:red; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">মুছে ফেলুন</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ৩. নিউজ মুছে ফেলার লজিক
function deleteNews(id) {
    if (confirm("আপনি কি নিশ্চিতভাবে এই নিউজটি মুছে ফেলতে চান?")) {
        let newsList = JSON.parse(localStorage.getItem('myNews')) || [];
        newsList = newsList.filter(news => news.id !== id);
        localStorage.setItem('myNews', JSON.stringify(newsList));
        displayNewsTable();
    }
}

// ৪. লগআউট লজিক
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'index.html';
});