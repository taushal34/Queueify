(function() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = 9999;

        // Create message
        const msg = document.createElement('div');
        msg.style.background = '#222';
        msg.style.color = '#fff';
        msg.style.padding = '40px 60px';
        msg.style.borderRadius = '16px';
        msg.style.textAlign = 'center';
        msg.style.fontSize = '22px';
        msg.innerHTML = 'First, please login to continue.<br><br>';

        // Create login button
        const btn = document.createElement('button');
        btn.textContent = 'Login';
        btn.className = 'submit-btn';
        btn.style.fontSize = '20px';
        btn.onclick = function() {
            window.location.href = 'login.html';
        };

        msg.appendChild(btn);
        overlay.appendChild(msg);
        document.body.appendChild(overlay);
    }
})();