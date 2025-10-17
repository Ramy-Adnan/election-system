const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // منع الفورم من تحديث الصفحة

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/candidate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        // إذا نجح الدخول، احفظ هوية المرشح وانتقل لصفحة الخريطة
         sessionStorage.setItem('candidate', JSON.stringify(data.user));
    window.location.href = '/candidate.html';
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
});