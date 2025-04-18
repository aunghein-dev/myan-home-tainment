(() => {
  const dlUrlParams = new URLSearchParams(window.location.search);
  const decryptedLink = dlUrlParams.get('link');
  const movieId = dlUrlParams.get('id');

  if (decryptedLink) {
    let countdown = 10;
    const countdownElement = document.getElementById('countdown');
    const messageElement = document.getElementById('countdown-message');
    const downloadBtn = document.getElementById('downloadBtn');

    const interval = setInterval(() => {
      countdown--;
      countdownElement.textContent = countdown;

      if (countdown <= 0) {
        clearInterval(interval);
        messageElement.style.display = 'none';
        downloadBtn.href = decryptedLink;
        downloadBtn.style.display = 'inline-block';

        // ⏳ Start 5-minute timer to remove the button
        setTimeout(() => {
          downloadBtn.remove();
          const expiredMsg = document.createElement('p');
          expiredMsg.textContent = '⏱️ Download session expired. Please refresh to try again.';
          expiredMsg.style.color = 'red';
          expiredMsg.style.fontWeight = 'bold';
          expiredMsg.style.marginTop = '20px';
          document.querySelector('main').appendChild(expiredMsg);
        }, 5 * 60 * 1000); // 5 minutes = 300000ms
      }
    }, 1000);
  } else {
    document.getElementById('countdown-message').textContent =
      '❌ Download link missing or invalid.';
  }
})();
