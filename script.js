let currentScore = 0; // Başlangıç puanı

// Sayfa yüklendiğinde Home sayfasını göster
window.onload = function() {
  loadScore(); // Puanı Local Storage'dan yükle
  navigateTo('home-page'); // İlk açılışta Home sayfasını göster
  checkTaskAvailability(); // Görevlerin kullanılabilirliğini kontrol et
  displayInviteLink(); // Davet linkini göster
};

function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
    // Sayfa gizlendiğinde coin'i gizle
    const coin = document.getElementById('earn-coin');
    if (coin) {
      coin.style.display = 'none';
    }
  });

  const activePage = document.getElementById(pageId);
  activePage.classList.add('active');

  // Eğer Earn sayfasına geçiliyorsa coin'i göster
  if (pageId === 'earn-page') {
    const coin = document.getElementById('earn-coin');
    if (coin) {
      coin.style.display = 'block'; // Coin'i göster
    }
  }
}


function earnPoints(points, taskId) {
  const taskElement = document.getElementById(taskId);
  const lastCompletionTime = localStorage.getItem(taskId);
  const currentTime = new Date().getTime();

  if (lastCompletionTime && (currentTime - lastCompletionTime < 24 * 60 * 60 * 1000)) {
    const remainingTime = 24 * 60 * 60 * 1000 - (currentTime - lastCompletionTime);
    alert(`To complete this task ${Math.ceil(remainingTime / (60 * 1000))} Wait a minute.`);
    return;
  }

  currentScore += points;
  saveScore(); // Yeni puanı kaydet
  updateScoreDisplay();

  taskElement.classList.add('completed');
  const taskButton = taskElement.querySelector('button');
  taskButton.disabled = true;

  showNotification(`Tebrikler! ${points} puan kazandınız!`);
  localStorage.setItem(taskId, currentTime);
}

function checkTaskAvailability() {
  const tasks = ['telegram-task', 'twitter-task', 'instagram-task', 'youtube-task'];
  const currentTime = new Date().getTime();

  tasks.forEach(taskId => {
    const lastCompletionTime = localStorage.getItem(taskId);

    if (lastCompletionTime && (currentTime - lastCompletionTime < 24 * 60 * 60 * 1000)) {
      const remainingTime = 24 * 60 * 60 * 1000 - (currentTime - lastCompletionTime);
      const taskElement = document.getElementById(taskId);
      const taskButton = taskElement.querySelector('button');
      taskButton.disabled = true;

      const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
      taskElement.querySelector('img.confetti-icon').classList.remove('hidden');
      taskButton.innerText = `Bekleyin: ${remainingMinutes} dakika kaldı`;
    }
  });
}

function displayInviteLink() {
  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe.user;

  // Kullanıcı bilgilerini al
  let username = "Kullanıcı";
  let userId = user.id; // Kullanıcının Telegram ID'si

  if (user && (user.username || user.first_name)) {
      username = user.username || `${user.first_name} ${user.last_name || ''}`;
  }

  // Kullanıcı adını sayfada göster
  document.getElementById('username').innerText = username;

  // Davet bağlantısını oluştur
  const inviteLink = `https://t.me/GlderGame_bot/GGame?ref=${userId}`; // ID'yi referans olarak ekle
  document.getElementById('invite-link').value = inviteLink;
}


function copyInviteLink() {
  const inviteLink = document.getElementById('invite-link');
  inviteLink.select();
  document.execCommand('copy');
  showNotification("Bağlantı kopyalandı!");
}

function addFriend(username) {
  const friendsListElement = document.getElementById('friends-list');
  const listItem = document.createElement('li');
  listItem.innerText = username;
  friendsListElement.appendChild(listItem);
}

function onFriendInvited(friendUsername) {
  addFriend(friendUsername);
  currentScore += 1000;
  saveScore(); // Yeni puanı kaydet
  updateScoreDisplay();
  showNotification(`${friendUsername} joined the game! You've earned 1000 points!`);
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.innerText = message;
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

// Puanı güncelle
function updateScoreDisplay() {
  document.getElementById('score-text').innerText = currentScore / 1000 + 'K';
}

// Puanı kaydet
function saveScore() {
  localStorage.setItem('currentScore', currentScore);
}

// Puanı yükle
function loadScore() {
  const savedScore = localStorage.getItem('currentScore');
  if (savedScore) {
    currentScore = parseInt(savedScore, 10);
  } else {
    currentScore = 1000; // İlk defa yükleniyorsa başlangıç puanı
  }
  updateScoreDisplay();
}
