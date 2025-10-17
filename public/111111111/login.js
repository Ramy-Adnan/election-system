const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // منع الفورم من تحديث الصفحة

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        // إذا نجح الدخول، احفظ هوية المراقب وانتقل لصفحة الخريطة
        sessionStorage.setItem('observer', JSON.stringify(data.user));
        window.location.href = '/index.html'; // اسم صفحة المراقب
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
});