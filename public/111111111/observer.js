// استعادة بيانات المراقب من ذاكرة الجلسة
const observerData = JSON.parse(sessionStorage.getItem('observer'));

// إذا لم يكن هناك بيانات، يعني أن المستخدم لم يسجل دخوله
if (!observerData) {
    // أعد توجيهه إلى صفحة تسجيل الدخول
    window.location.href = '/login.html';
} else {
    // ==========================================================
    // كل الكود الخاص بالتطبيق سيعيش هنا داخل كتلة else
    // ==========================================================
    
    mapboxgl.accessToken = 'pk.eyJ1IjoicmFteTk1IiwiYSI6ImNtZ2h2NXV3cjAwb2UybXF3Z3FtcDlpenAifQ.0VwTWBH5iSYd8eF8qZgMTg';

    const socket = io();
    socket.on('connect', () => {
    socket.emit('observerIsOnline', observerData);
    });

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [44.361488, 31.825363],
        zoom: 5
    });
    const marker = new mapboxgl.Marker();
    
    // تعريف متغير لتخزين آخر موقع معروف هنا
    let lastLocation = null;

    // استدعاء واحد فقط لتتبع الموقع
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const userLocation = {
                lng: position.coords.longitude,
                lat: position.coords.latitude
            };
            
            // 1. تحديث العلامة على الخريطة
            marker.setLngLat([userLocation.lng, userLocation.lat]).addTo(map);
            map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 15 });

            // 2. إرسال الموقع المباشر للخادم
            socket.emit('updateLocation', { 
                observerId: observerData.id, 
                location: userLocation 
            });

            // 3. حفظ آخر موقع معروف لاستخدامه في التقارير
            lastLocation = userLocation;
        });
    }

    // التعامل مع نموذج إرسال التقرير
    const reportForm = document.getElementById('reportForm');
    const successMessage = document.getElementById('successMessage');

    reportForm.addEventListener('submit', (event) => {
        event.preventDefault(); // منع تحديث الصفحة

        if (!lastLocation) {
            alert('يرجى الانتظار حتى يتم تحديد موقعك أولاً.');
            return;
        }

        // جمع البيانات من النموذج وإضافة هوية المراقب والموقع
        const reportData = {
            observerId: observerData.id, // الهوية من بيانات الدخول
            center_name: document.getElementById('center_name').value,
            stations_count: document.getElementById('stations_count').value,
            employees_present: document.getElementById('employees_present').value,
            employees_absent: document.getElementById('employees_absent').value,
            location: lastLocation // آخر موقع معروف
        };

        // إرسال التقرير الكامل إلى الخادم
        socket.emit('submitReport', reportData);

        // إظهار رسالة نجاح ومسح النموذج
        successMessage.textContent = 'تم إرسال التقرير بنجاح!';
        reportForm.reset();
        setTimeout(() => { successMessage.textContent = ''; }, 3000);
    });
}