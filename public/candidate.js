// document.addEventListener('DOMContentLoaded', () => {
//     const candidateData = JSON.parse(sessionStorage.getItem('candidate'));
//     if (!candidateData) {
//         window.location.href = '/candidate_login.html';
//         return;
//     }

//     const socket = io();
//     const markers = {};

//     // ✅✅✅ أضف هذه المتغيرات هنا ✅✅✅
//     const toggleFinalReportBtn = document.getElementById('toggle-final-report-btn');
//     const finalReportStatusSpan = document.getElementById('final-report-status');
//     const finalReportStatusFooter = document.getElementById('final-report-status-footer');
//     let isFinalReportActive = false;


//     let observersData = {};
//     let employeesData = {};
//     let allEmployeeDetails = [];
//     let fullAttendanceLog = [];

//     const observerModal = new bootstrap.Modal(document.getElementById('observerModal'));
//     const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
//     const centerModal = new bootstrap.Modal(document.getElementById('centerModal'));
//     const logDetailModal = new bootstrap.Modal(document.getElementById('logDetailModal'));
//     // ✅✅✅ إضافة النافذة الجديدة
//     const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    
//     const reportToastEl = document.getElementById('reportToast');
//     const reportToast = new bootstrap.Toast(reportToastEl);
    
//     const observerForm = document.getElementById('observerForm');
//     const employeeForm = document.getElementById('employeeForm');
//     const centerForm = document.getElementById('centerForm');

//     document.getElementById('welcome-message').innerText = `الاستاذ,  ${candidateData.full_name}`;
    
//     mapboxgl.accessToken = 'pk.eyJ1IjoicmFteTk1IiwiYSI6ImNtZ2h2NXV3cjAwb2UybXF3Z3FtcDlpenAifQ.0VwTWBH5iSYd8eF8qZgMTg';
//     const map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/streets-v11',
//         center: [44.36, 33.31],
//         zoom: 6
//     });

//     // ✅ دالة لجلب الحالة الحالية عند تحميل الصفحة
//     const fetchFinalReportStatus = async () => {
//         try {
//             const response = await fetch(`/api/reports/final-status`);
//             const data = await response.json();
//             isFinalReportActive = data.isActive;
//             updateFinalReportButton();
//         } catch (error) {
//             console.error('Failed to fetch final report status:', error);
//         }
//     };

//     // ✅ دالة لتحديث شكل الزر والنص
//     const updateFinalReportButton = () => {
//         if (isFinalReportActive) {
//             toggleFinalReportBtn.classList.remove('btn-success');
//             toggleFinalReportBtn.classList.add('btn-danger');
//             toggleFinalReportBtn.innerHTML = `<i class="fas fa-stop-circle me-2"></i>إيقاف استقبال التقارير`;
//             finalReportStatusSpan.textContent = 'فعّال';
//             finalReportStatusSpan.className = 'fw-bold text-success';
//             finalReportStatusFooter.classList.remove('bg-light');
//             finalReportStatusFooter.classList.add('bg-success-subtle');
//         } else {
//             toggleFinalReportBtn.classList.remove('btn-danger');
//             toggleFinalReportBtn.classList.add('btn-success');
//             toggleFinalReportBtn.innerHTML = `<i class="fas fa-play-circle me-2"></i>بدء استقبال التقارير النهائية`;
//             finalReportStatusSpan.textContent = 'متوقف';
//             finalReportStatusSpan.className = 'fw-bold text-danger';
//             finalReportStatusFooter.classList.remove('bg-success-subtle');
//             finalReportStatusFooter.classList.add('bg-light');
//         }
//     };

   

//     // ✅ دالة لإرسال أمر التفعيل/الإيقاف
//     const toggleFinalReport = async () => {
//         const newStatus = !isFinalReportActive;
//         try {
//             const response = await fetch('/api/reports/toggle-final', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ status: newStatus, candidateId: candidateData.id })
//             });
//             if (response.ok) {
//                 isFinalReportActive = newStatus;
//                 updateFinalReportButton();
//                 alert(`تم ${newStatus ? 'تفعيل' : 'إيقاف'} استقبال التقارير النهائية بنجاح.`);
//             } else {
//                 alert('فشل تغيير الحالة. حاول مرة أخرى.');
//             }
//         } catch (error) {
//             console.error('Failed to toggle final report status:', error);
//         }
//     };

   
    
   

//     async function loadLastHourSummary() {
//         try {
//             const response = await fetch(`/api/attendance/summary/lasthour/${candidateData.id}`);
//             const summary = await response.json();
//             document.getElementById('summary-present').innerText = summary.present || 0;
//             document.getElementById('summary-absent').innerText = summary.absent || 0;
//         } catch (error) { console.error("Failed to load last hour summary:", error); }
//     }

//     async function loadAttendanceLog() {
//         try {
//             const response = await fetch(`/api/attendance/log/${candidateData.id}`);
//             fullAttendanceLog = await response.json();
//             applyFiltersAndRenderLog();
//         } catch (error) { console.error("Failed to load attendance log:", error); }
//     }

//     function applyFiltersAndRenderLog() {
//         const employeeFilter = document.getElementById('filter-employee-name').value.toLowerCase();
//         const observerFilter = document.getElementById('filter-observer-name').value.toLowerCase();
//         const statusFilter = document.getElementById('filter-status').value;
//         const dateFilter = document.getElementById('filter-date').value;

//         const filteredLogs = fullAttendanceLog.filter(entry => {
//             const entryDate = entry.log_time.split('T')[0];
            
//             const matchesEmployee = entry.employee_name.toLowerCase().includes(employeeFilter);
//             const matchesObserver = entry.observer_name.toLowerCase().includes(observerFilter);
//             const matchesStatus = !statusFilter || entry.status === statusFilter;
//             const matchesDate = !dateFilter || entryDate === dateFilter;

//             return matchesEmployee && matchesObserver && matchesStatus && matchesDate;
//         });

//         renderLogTable(filteredLogs);
//     }
    
//   // ✨ التعديل هنا: عرض الأعمدة الجديدة
//    function renderLogTable(logs) {
//     const logBody = document.getElementById('attendance-log-body');
//     logBody.innerHTML = '';
//     if (logs.length === 0) { logBody.innerHTML = `<tr><td colspan="6" class="text-center">لا توجد نتائج تطابق بحثك.</td></tr>`; return; }
//     logs.forEach(entry => {
//         const row = logBody.insertRow();
//         const statusClass = entry.status === 'present' ? 'status-present' : 'status-absent';
//         const statusText = entry.status === 'present' ? 'حاضر' : 'غائب';
//         // --- ✅ تعديل محتوى الصف ---
//         row.innerHTML = `
//             <td>${entry.employee_name}</td>
//             <td class="${statusClass}">${statusText}</td>
//             <td>${new Date(entry.log_time).toLocaleString('ar-IQ')}</td>
//             <td>${entry.observer_name}</td>
//             <td>${entry.individual_note || '-'}</td>
//             <td>${entry.general_note || '-'}</td>
//         `;
//     });
// }

//  // ✨ التعديل هنا: هذه الدالة الآن تجلب البيانات ثم تستدعي دالة العرض المفلترة مباشرة
//     async function loadEmployeeAnalytics() {
//         try {
//             const response = await fetch(`/api/employees/details/${candidateData.id}`);
//             allEmployeeDetails = await response.json();
//             applyAnalyticsFiltersAndRender(); // استدعاء الفلترة والعرض مباشرة بعد جلب البيانات
//         } catch (error) {
//             console.error('Failed to load employee analytics:', error);
//             document.getElementById('employee-analytics-container').innerHTML = `<p class="text-center text-danger col-12">فشل تحميل البيانات.</p>`;
//         }
//     }

//     // ✨ دوال جديدة لفلترة قسم التحليل
//     async function populateAnalyticsFilters() {
//         const observerSelect = document.getElementById('analytics-filter-observer');
//         const centerSelect = document.getElementById('analytics-filter-center');

//         observerSelect.innerHTML = '<option value="">فلترة حسب المراقب</option>';
//         centerSelect.innerHTML = '<option value="">فلترة حسب المركز</option>';
        
//         const [observersRes, centersRes] = await Promise.all([
//             fetch(`/api/observers/${candidateData.id}`),
//             fetch(`/api/centers/${candidateData.id}`)
//         ]);

//         const observers = await observersRes.json();
//         const centers = await centersRes.json();

//         observers.forEach(obs => {
//             observerSelect.innerHTML += `<option value="${obs.full_name}">${obs.full_name}</option>`;
//         });
//         centers.forEach(center => {
//             centerSelect.innerHTML += `<option value="${center.center_name}">${center.center_name}</option>`;
//         });
//     }
// // ✨ تم تعديل هذه الدالة
//     function applyAnalyticsFiltersAndRender() {
//         const observerFilter = document.getElementById('analytics-filter-observer').value.toLowerCase();
//         const centerFilter = document.getElementById('analytics-filter-center').value.toLowerCase();
//         const container = document.getElementById('employee-analytics-container');
//         container.innerHTML = '';
        
//         const filteredEmployees = allEmployeeDetails.filter(employee => {
//             // نبحث إذا كان أي سجل للموظف يطابق الفلترة
//            // ✨ التعديل هنا: الفلترة أصبحت مباشرة وصحيحة
//             const matchesObserver = !observerFilter || (employee.assigned_observer_name && employee.assigned_observer_name.toLowerCase().includes(observerFilter));
//             const matchesCenter = !centerFilter || (employee.assigned_center_name && employee.assigned_center_name.toLowerCase().includes(centerFilter));
//             return matchesObserver && matchesCenter;

            
//         });
//         if (filteredEmployees.length === 0) {
//             container.innerHTML = `<p class="text-center text-muted col-12">لا توجد نتائج تطابق الفلترة.</p>`;
//             return;
//         }

//         filteredEmployees.forEach(employee => {
//             container.innerHTML += `<div class="col-md-6 col-lg-4 mb-4"><div class="card h-100 shadow-sm"><div class="card-body d-flex flex-column"><h5 class="card-title">${employee.full_name}</h5><h6 class="card-subtitle mb-2 text-muted">${employee.job_title}</h6><hr><div class="d-flex justify-content-around text-center my-3"><div><p class="mb-0 fs-3 text-success">${employee.summary.present}</p><small class="text-muted">تقرير حضور</small></div><div><p class="mb-0 fs-3 text-danger">${employee.summary.absent}</p><small class="text-muted">تقرير غياب</small></div></div><button class="btn btn-outline-primary w-100 mt-auto" onclick="window.showLogDetails(${employee.id})"><i class="fas fa-history me-2"></i>عرض السجل التفصيلي</button></div></div></div>`;
//         });
//     }
//   async function loadObservers() {
//         try {
//             const response = await fetch(`/api/observers/${candidateData.id}`);
//             const observers = await response.json();
//             const observersTableBody = document.getElementById('observers-table-body');
//             const liveObserversList = document.getElementById('live-observers-list');
//             observersTableBody.innerHTML = '';
//             liveObserversList.innerHTML = '';
//             observersData = {};

//             for (const obs of observers) {
//                 observersData[obs.id] = obs;
//                 liveObserversList.innerHTML += `<div id="live-obs-${obs.id}" class="list-group-item d-flex justify-content-between align-items-center"><div><span class="status-dot offline"></span><strong>${obs.full_name}</strong><br><small>غير متصل</small></div><button class="btn btn-sm btn-outline-secondary" onclick="window.focusOnObserver(${obs.id})"><i class="fas fa-map-marker-alt"></i></button></div>`;
//                 const row = observersTableBody.insertRow();
//                 // ✨ التعديل هنا لإضافة خلية كلمة المرور
//               // ✅ الكود الجديد لعرض الصف
// row.innerHTML = `
//     <td>${obs.full_name}</td>
//     <td>${obs.username}</td>
//      <td class="password-cell">
//         <span id="pass-text-${obs.id}" data-password="${obs.password}">••••••</span>
//         <i id="pass-icon-${obs.id}" class="fas fa-eye" onclick="window.togglePassword(${obs.id})"></i>
//     </td>
//     <td>${obs.phone_number || '-'}</td>
//     <td>${obs.job_title || '-'}</td>
//     <td>${obs.address || '-'}</td>
//     <td>${obs.birth_date ? obs.birth_date.split('T')[0] : '-'}</td>
   
//     <td class="table-actions">
//         <button class="btn btn-sm btn-info" onclick='window.editObserver(${JSON.stringify(obs)})'><i class="fas fa-edit"></i> تعديل</button>
//         <button class="btn btn-sm btn-danger" onclick="window.deleteObserver(${obs.id})"><i class="fas fa-trash"></i> حذف</button>
//     </td>
// `;
//             }
//             await fetchAndApplyOnlineStatus();
//         } catch (error) { console.error('Failed to load observers:', error); }
//     }
    
//     async function loadEmployees() {
//         try {
//             const response = await fetch(`/api/employees/${candidateData.id}`);
//             const employees = await response.json();
//             employeesData = {};
//             const tableBody = document.getElementById('employees-table-body');
//             tableBody.innerHTML = '';
//             employees.forEach(emp => {
//                 employeesData[emp.id] = emp;
//                 const row = tableBody.insertRow();
//                // ✨ التعديل هنا: إعادة إضافة خلية العنوان
//                 row.innerHTML = `
//                     <td>${emp.full_name}</td>
//                     <td>${emp.job_title}</td>
//                     <td>${emp.observer_name}</td>
//                     <td>${emp.phone_number || 'N/A'}</td>
//                     <td>${emp.address || 'N/A'}</td>
//                     <td class="table-actions">
//                         <button class="btn btn-sm btn-info" onclick='window.openEmployeeModal(${emp.id})'><i class="fas fa-edit"></i> تعديل</button>
//                         <button class="btn btn-sm btn-danger" onclick="window.deleteEmployee(${emp.id})"><i class="fas fa-trash"></i> حذف</button>
//                     </td>`;
//              });
//         } catch (error) { console.error('Failed to load employees:', error); }
//     }
    
//     async function loadCenters() {
//         try {
//             const response = await fetch(`/api/centers/${candidateData.id}`);
//             const centers = await response.json();
//             const tableBody = document.getElementById('centers-table-body');
//             tableBody.innerHTML = '';
//             centers.forEach(center => {
//                 const row = tableBody.insertRow();
//                 row.innerHTML = `<td>${center.center_name}</td>
//                 <td>${center.observer_name}</td>
//                 <td>${center.district} / ${center.area}</td>
//                 <td>${center.station_count}</td><td class="table-actions">
//                 <button class="btn btn-sm btn-info" onclick='window.editCenter(${JSON.stringify(center)})'>
//                 <i class="fas fa-edit"></i> تعديل</button><button class="btn btn-sm btn-danger" onclick="window.deleteCenter(${center.id})"><i class="fas fa-trash"></i> حذف</button></td>`;
//             });
//         } catch (error) { console.error('Failed to load centers:', error); }
//     }

//     async function loadFinalReports() {
//         try {
//             const response = await fetch(`/api/reports/final/${candidateData.id}`);
//             const reports = await response.json();
//             const tableBody = document.getElementById('final-reports-table-body');
//             tableBody.innerHTML = ''; // تفريغ الجدول قبل ملئه

//             if (reports.length === 0) {
//                 tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">لم يتم استلام أي تقارير نهائية بعد.</td></tr>';
//                 return;
//             }

//             reports.forEach(report => {
//                 const row = tableBody.insertRow();
//                 // إضافة كلاس خاص للمحطة المعطلة
//                 if (report.is_disabled) {
//                     row.classList.add('disabled-station');
//                 }
                
//                row.innerHTML = `
//     <td>${report.center_name}</td>
//     <td>${report.district || '-'}</td>
//     <td><strong>${report.station_number}</strong></td>
//     <td>${report.is_disabled ? '<span class="badge bg-danger">معطلة</span>' : report.vote_count}</td>
//     <td>${report.observer_name}</td>
//     <td>${report.employee_count}</td>
//     <td>
//         <img src="${report.result_image_url}" alt="صورة الشريط" class="report-image" onclick="window.showImageInModal('${report.result_image_url}')">
//     </td>
//     <td>${report.notes || '-'}</td>
//     <td>${new Date(report.created_at).toLocaleString('ar-IQ')}</td>
// `;
//             });
//         } catch (error) {
//             console.error('Failed to load final reports:', error);
//         }
//     }

//      // ✅✅✅ إضافة دالة لفتح الصورة في نافذة منبثقة
//    window.showImageInModal = (imageUrl) => {
//     // 1. ضع رابط الصورة في عنصر الصورة للعرض
//     document.getElementById('modalImage').src = imageUrl;

//     // 2. احصل على زر التحميل وضع رابط الصورة فيه
//     const downloadBtn = document.getElementById('downloadImageBtn');
//     if (downloadBtn) {
//         downloadBtn.href = imageUrl;
//     }

//     // 3. أظهر النافذة المنبثقة
//     imageModal.show();
// };

//     window.logout = () => {
//         sessionStorage.removeItem('candidate');
//         window.location.href = '/candidate_login.html';
//     };

//     window.editObserver = (observer) => {
//         document.getElementById('observerId').value = observer.id;
//         document.getElementById('observerFullName').value = observer.full_name;
//         document.getElementById('observerUsername').value = observer.username;
//         document.getElementById('observerPassword').value = '';
//         // --- ✅ أضف هذه الأسطر ---
//     document.getElementById('observerPhoneNumber').value = observer.phone_number || '';
//     // تنسيق التاريخ ليتوافق مع حقل الإدخال
//     document.getElementById('observerBirthDate').value = observer.birth_date ? observer.birth_date.split('T')[0] : '';
//     document.getElementById('observerJobTitle').value = observer.job_title || '';
//     document.getElementById('observerAddress').value = observer.address || '';
//     // -----------------------
//         document.getElementById('observerModalLabel').innerText = 'تعديل مراقب';
//         observerModal.show();
//     };

//     window.deleteObserver = async (id) => {
//         if (confirm('هل أنت متأكد من حذف هذا المراقب؟')) {
//             try { await fetch(`/api/observers/${id}`, { method: 'DELETE' }); await loadObservers(); await loadCenters(); } 
//             catch (error) { console.error('Failed to delete observer:', error); }
//         }
//     };
    
//     window.editEmployee = (empId) => {
//         const employee = employeesData[empId];
//         if (!employee) return;
//         document.getElementById('employeeId').value = employee.id;
//         document.getElementById('employeeFullName').value = employee.full_name;
//         document.getElementById('employeeJobTitle').value = employee.job_title;
//         document.getElementById('employeePhoneNumber').value = employee.phone_number || '';
//         document.getElementById('employeeAddress').value = employee.address || '';
//         document.getElementById('employeeModalLabel').innerText = 'تعديل موظف';
//         employeeModal.show();
//     };
    
//     window.deleteEmployee = async (id) => {
//         if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
//             try { await fetch(`/api/employees/${id}`, { method: 'DELETE' }); await loadEmployees(); } 
//             catch (error) { console.error('Failed to delete employee:', error); }
//         }
//     };
    
//     window.editCenter = (center) => {
//         document.getElementById('centerId').value = center.id;
//         document.getElementById('centerName').value = center.center_name;
//         document.getElementById('centerStationCount').value = center.station_count;
//         document.getElementById('centerDistrict').value = center.district;
//         document.getElementById('centerArea').value = center.area;
//         document.getElementById('centerLandmark').value = center.landmark;
//         centerModal.show();
//     };
    
//     window.deleteCenter = async (id) => {
//         if (confirm('هل أنت متأكد من حذف هذا المركز؟')) {
//             try { await fetch(`/api/centers/${id}`, { method: 'DELETE' }); await loadCenters(); } 
//             catch (error) { console.error('Failed to delete center:', error); }
//         }
//     };

//     window.focusOnObserver = (observerId) => {
//         if (markers[observerId]) {
//             const location = markers[observerId].getLngLat();
//             map.flyTo({ center: [location.lng, location.lat], zoom: 15 });
//         } else { alert('لا يوجد موقع حالي لهذا المراقب.'); }
//     };
    
//    window.showLogDetails = (employeeId) => {
//     const employee = allEmployeeDetails.find(emp => emp.id === employeeId);
//     if (!employee) { alert("لم يتم العثور على بيانات الموظف!"); return; }


//     if (toggleFinalReportBtn) {
//         toggleFinalReportBtn.addEventListener('click', toggleFinalReport);
//     }

//     // ✅✅✅ ربط حدث التبويب الجديد
// document.getElementById('final-reports-tab').addEventListener('shown.bs.tab', async () => {
//     // 1. جلب حالة الزر عند فتح التبويب
//     await fetchFinalReportStatus();

//     // 2. تحميل التقارير الموجودة
//     await loadFinalReports();

//     // 3. ربط حدث النقر بالزر (مهم جدًا وضعه هنا)
//     if (toggleFinalReportBtn) {
//         toggleFinalReportBtn.removeEventListener('click', toggleFinalReport); 
//         toggleFinalReportBtn.addEventListener('click', toggleFinalReport);
//     }
// });

//     document.getElementById('logDetailModalLabel').innerText = `السجل التفصيلي لـ: ${employee.full_name}`;
//     const modalBody = document.getElementById('logDetailModalBody');
//     // --- ✅ تعديل رأس الجدول داخل النافذة ---
//     modalBody.parentElement.querySelector('thead').innerHTML = `
//         <tr>
//             <th>الحالة</th>
//             <th>الوقت والتاريخ</th>
//             <th>بواسطة المراقب</th>
//             <th>ملاحظة خاصة</th>
//             <th>ملاحظة عامة</th>
//         </tr>
//     `;
//     modalBody.innerHTML = '';

//     if (!employee.logs || employee.logs.length === 0) {
//         modalBody.innerHTML = `<tr><td colspan="5" class="text-center">لا توجد سجلات لهذا الموظف.</td></tr>`;
//     } else {
//         employee.logs.forEach(log => {
//             const statusClass = log.status === 'present' ? 'text-success' : 'text-danger';
//             const statusText = log.status === 'present' ? 'حاضر' : 'غائب';
//             // --- ✅ تعديل محتوى الصف في النافذة ---
//             const row = `
//                 <tr>
//                     <td class="fw-bold ${statusClass}">${statusText}</td>
//                     <td>${new Date(log.log_time).toLocaleString('ar-IQ')}</td>
//                     <td>${log.observer_name}</td>
//                     <td>${log.individual_note || '-'}</td>
//                     <td>${log.general_note || '-'}</td>
//                 </tr>`;
//             modalBody.innerHTML += row;
//         });
//     }
//     logDetailModal.show();
// };

//     // ✨ دالة جديدة لإظهار/إخفاء كلمة المرور
//     window.togglePassword = (observerId) => {
//         const passText = document.getElementById(`pass-text-${observerId}`);
//         const passIcon = document.getElementById(`pass-icon-${observerId}`);

//         if (passIcon.classList.contains('fa-eye')) {
//             // Show password
//             passText.innerText = passText.dataset.password;
//             passIcon.classList.remove('fa-eye');
//             passIcon.classList.add('fa-eye-slash');
//         } else {
//             // Hide password
//             passText.innerText = '••••••';
//             passIcon.classList.remove('fa-eye-slash');
//             passIcon.classList.add('fa-eye');
//         }
//     };
//     // ✨ دالة جديدة للتركيز على موقع التقرير
//     window.focusOnLocation = (lat, lng) => {
//         const dashboardTab = new bootstrap.Tab(document.getElementById('dashboard-tab'));
//         dashboardTab.show();
//         map.flyTo({ center: [lng, lat], zoom: 15 });
//     };

//     // ✨ دالة جديدة لفتح نافذة الموظف مع تحميل المراقبين
//     window.openEmployeeModal = async (employeeId = null) => {
//         employeeForm.reset();
//         document.getElementById('employeeId').value = '';

//         const observerSelect = document.getElementById('employeeObserver');
//         observerSelect.innerHTML = '<option value="" disabled selected>-- جاري تحميل المراقبين... --</option>';
        
//         const response = await fetch(`/api/observers/${candidateData.id}`);
//         const observers = await response.json();

//         observerSelect.innerHTML = '<option value="" disabled selected>-- الرجاء الاختيار --</option>';
//         observers.forEach(obs => {
//             observerSelect.innerHTML += `<option value="${obs.id}">${obs.full_name}</option>`;
//         });

//         if (employeeId) {
//             const employee = employeesData[employeeId];
//             if (!employee) return;
//             document.getElementById('employeeId').value = employee.id;
//             document.getElementById('employeeFullName').value = employee.full_name;
//             document.getElementById('employeeJobTitle').value = employee.job_title;
//             document.getElementById('employeePhoneNumber').value = employee.phone_number || '';
//             document.getElementById('employeeAddress').value = employee.address || '';
//             document.getElementById('employeeObserver').value = employee.observer_id;
//             document.getElementById('employeeModalLabel').innerText = 'تعديل موظف';
//         } else {
//             document.getElementById('employeeModalLabel').innerText = 'إضافة موظف جديد';
//         }
//         employeeModal.show();
//     };

//     observerForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const id = document.getElementById('observerId').value;
//         const password = document.getElementById('observerPassword').value;


//         const body = { 
//             fullName: document.getElementById('observerFullName').value,
//             username: document.getElementById('observerUsername').value, 
//             candidateId: candidateData.id,
//              ...(password && { password }),
//             // --- ✅ إضافة الحقول الجديدة ---
//         phoneNumber: document.getElementById('observerPhoneNumber').value,
//         birthDate: document.getElementById('observerBirthDate').value,
//         jobTitle: document.getElementById('observerJobTitle').value,
//         address: document.getElementById('observerAddress').value,
//      };
//         const url = id ? `/api/observers/${id}` : '/api/observers';
//         const method = id ? 'PUT' : 'POST';

//         try {
//             const response = await fetch(url, {
//                  method, 
//                  headers: { 'Content-Type': 'application/json' },
//                  body: JSON.stringify(body) });
//             // التعامل مع الردود المختلفة
//         if (response.ok) { 
//             observerModal.hide(); 
//             await loadObservers(); 
//         } else { 
//             // قراءة رسالة الخطأ من الخادم وعرضها
//             const errorData = await response.json();
//             alert(errorData.message || 'فشل حفظ المراقب.'); 
//         }
//     } catch (error) { 
//         console.error('Failed to save observer:', error);
//         alert('حدث خطأ أثناء الاتصال بالخادم.');
//     }
// });

//   // ✨ تعديل منطق الحفظ ليشمل observerId
//     employeeForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const id = document.getElementById('employeeId').value;
//         const body = {
//             fullName: document.getElementById('employeeFullName').value,
//             jobTitle: document.getElementById('employeeJobTitle').value,
//             phoneNumber: document.getElementById('employeePhoneNumber').value,
//             address: document.getElementById('employeeAddress').value,
//             observerId: document.getElementById('employeeObserver').value,
//             candidateId: candidateData.id
//         };
//         const url = id ? `/api/employees/${id}` : '/api/employees';
//         const method = id ? 'PUT' : 'POST';
//         try {
//             const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
//             if (response.ok) { employeeModal.hide(); await loadEmployees(); } 
//             else { alert('فشل حفظ الموظف. تأكد من اختيار المراقب.'); }
//         } catch (error) { console.error('Failed to save employee:', error); }
//     });
    
//     centerForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const id = document.getElementById('centerId').value;
//         const body = { centerName: document.getElementById('centerName').value, stationCount: document.getElementById('centerStationCount').value, district: document.getElementById('centerDistrict').value, area: document.getElementById('centerArea').value, landmark: document.getElementById('centerLandmark').value };
//         try {
//             const response = await fetch(`/api/centers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
//             if (response.ok) { centerModal.hide(); await loadCenters(); } 
//             else { alert('فشل تعديل المركز.'); }
//         } catch (error) { console.error('Failed to save center:', error); }
//     });


//     async function fetchAndApplyOnlineStatus() {
//         try {
//             const res = await fetch(`/api/observers/status/${candidateData.id}`);
//             const onlineObservers = await res.json();
//             onlineObservers.forEach(obs => {
//                 updateObserverStatus(obs.id, 'online');
//                 if (obs.lastLocation) updateMarker(obs.id, obs.lastLocation);
//             });
//         } catch (error) { console.error("Failed to fetch online status:", error); }
//     }

//     function updateObserverStatus(observerId, status, statusText = null) {
//         const observerElement = document.getElementById(`live-obs-${observerId}`);
//         if (observerElement) {
//             const dot = observerElement.querySelector('.status-dot');
//             const smallText = observerElement.querySelector('small');
//             dot.className = `status-dot ${status}`;
//             smallText.textContent = statusText || (status === 'online' ? 'متصل' : 'غير متصل');
//         }
//     }

//     function updateMarker(observerId, location) {
//         const observerName = observersData[observerId]?.full_name || `مراقب ${observerId}`;
//         if (markers[observerId]) {
//             markers[observerId].setLngLat([location.lng, location.lat]);
//         } else {
//             const popup = new mapboxgl.Popup({ offset: 25 }).setText(observerName);
//             markers[observerId] = new mapboxgl.Marker().setLngLat([location.lng, location.lat]).setPopup(popup).addTo(map);
//         }
//     }

//     socket.on('connect', () => socket.emit('candidateJoin', { candidateId: candidateData.id }));
//     socket.on('observerStatusUpdate', (data) => updateObserverStatus(data.observerId, data.status));
//     socket.on('locationUpdate', (data) => {
//         updateMarker(data.observerId, data.location);
//         updateObserverStatus(data.observerId, 'online', 'يتم تتبعه مباشرة...');
//     });
//     socket.on('newReport', async (data) => {
//         await loadLastHourSummary();
//         await loadAttendanceLog();
//         const observerName = observersData[data.observerId]?.full_name || 'مراقب';
//         document.getElementById('toast-observer-name').innerText = observerName;
//         reportToast.show();
//         const presentCount = data.present_employees?.length || 0;
//         const absentCount = data.absent_employees?.length || 0;
//         updateObserverStatus(data.observerId, 'online', `آخر تقرير: ${presentCount} ح, ${absentCount} غ`);
//     });
//     // ✅✅✅ أضف هذا المستمع الجديد هنا ✅✅✅
//     socket.on('newFinalReport', async () => {
//         console.log("استلام إشارة بوجود تقرير نهائي جديد، جاري تحديث الجدول...");
//         // اعرض إشعاراً منبثقاً (اختياري)
//         // Toast.show({
//         //     type: 'success',
//         //     text1: 'تقرير نهائي جديد',
//         //     text2: 'تم استلام تقرير سنطورة جديد!'
//         // });
        
//         // أعد تحميل بيانات الجدول
//         await loadFinalReports();
        
//         const observerName = observersData[data.observerId]?.full_name || 'مراقب';
//         document.getElementById('toast-observer-name').innerText = observerName;
//         reportToast.show();


//     });

//     document.getElementById('observerModal').addEventListener('hidden.bs.modal', () => {
//         observerForm.reset();
//         document.getElementById('observerId').value = '';
//         document.getElementById('observerModalLabel').innerText = 'إضافة مراقب جديد';
//     });
//     document.getElementById('employeeModal').addEventListener('hidden.bs.modal', () => {
//         employeeForm.reset();
//         document.getElementById('employeeId').value = '';
//         document.getElementById('employeeModalLabel').innerText = 'إضافة موظف جديد';
//     });

//     document.getElementById('filter-employee-name').addEventListener('input', applyFiltersAndRenderLog);
//     document.getElementById('filter-observer-name').addEventListener('input', applyFiltersAndRenderLog);
//     document.getElementById('filter-status').addEventListener('change', applyFiltersAndRenderLog);
//     document.getElementById('filter-date').addEventListener('change', applyFiltersAndRenderLog);
//     document.getElementById('clear-filters-btn').addEventListener('click', () => {
//         document.getElementById('filter-employee-name').value = '';
//         document.getElementById('filter-observer-name').value = '';
//         document.getElementById('filter-status').value = '';
//         document.getElementById('filter-date').value = '';
//         applyFiltersAndRenderLog();
//     });
// // ✨ ربط الأحداث الجديدة
//     document.getElementById('analytics-filter-observer').addEventListener('input', applyAnalyticsFiltersAndRender);
//     document.getElementById('analytics-filter-center').addEventListener('input', applyAnalyticsFiltersAndRender);
//     document.getElementById('observers-tab').addEventListener('shown.bs.tab', loadObservers);
//     document.getElementById('employees-tab').addEventListener('shown.bs.tab', loadEmployees);
//     document.getElementById('centers-tab').addEventListener('shown.bs.tab', loadCenters);
//    // ✅ استبدل حدث تبويب التقارير بهذا الكود المصحح
// // ✅ بهذا الكود المصحح
// document.getElementById('reports-tab').addEventListener('shown.bs.tab', async () => { 
//     await loadLastHourSummary(); 
//     await loadAttendanceLog(); 
  

//     // ربط حدث النقر بالزر فقط بعد التأكد من أنه أصبح ظاهراً
//     if (toggleFinalReportBtn) {
//         // نضمن عدم إضافة الحدث أكثر من مرة
//         toggleFinalReportBtn.removeEventListener('click', toggleFinalReport); 
//         toggleFinalReportBtn.addEventListener('click', toggleFinalReport);
//     }
// });
//     document.getElementById('analytics-tab').addEventListener('shown.bs.tab', loadEmployeeAnalytics);
    
//     (async () => {
//         await loadObservers();
//         await loadFinalReports(); // ✅ أضف هذا السطر هنا
//     })();
// });


document.addEventListener('DOMContentLoaded', () => {
    const candidateData = JSON.parse(sessionStorage.getItem('candidate'));
    if (!candidateData) {
        window.location.href = '/candidate_login.html';
        return;
    }

    const socket = io();

    // ✅
    const liveMarkers = {}; // للأزرق (التتبع المباشر)
    const centerMarkers = {}; // للأحمر (المراكز)
    const reportMarkers = {}; // للأصفر (آخر تقرير)

    const toggleFinalReportBtn = document.getElementById('toggle-final-report-btn');
    const finalReportStatusSpan = document.getElementById('final-report-status');
    const finalReportStatusFooter = document.getElementById('final-report-status-footer');
    let isFinalReportActive = false;


    let observersData = {};
    let employeesData = {};
    let allEmployeeDetails = [];
    let fullAttendanceLog = [];
    let allFinalReports = []; // ✨ إضافة: متغير لتخزين كل التقارير النهائية

    const observerModal = new bootstrap.Modal(document.getElementById('observerModal'));
    const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
    const centerModal = new bootstrap.Modal(document.getElementById('centerModal'));
    const logDetailModal = new bootstrap.Modal(document.getElementById('logDetailModal'));
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));

    const reportToastEl = document.getElementById('reportToast');
    const reportToast = new bootstrap.Toast(reportToastEl);

    const observerForm = document.getElementById('observerForm');
    const employeeForm = document.getElementById('employeeForm');
    const centerForm = document.getElementById('centerForm');

    document.getElementById('welcome-message').innerText = `الاستاذ,  ${candidateData.full_name}`;

    mapboxgl.accessToken = 'pk.eyJ1IjoicmFteTk1IiwiYSI6ImNtZ2h2NXV3cjAwb2UybXF3Z3FtcDlpenAifQ.0VwTWBH5iSYd8eF8qZgMTg';
    
    // ✨ إضافة: أضف هذا السطر هنا لتفعيل الإضافة
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js', null, true);
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [44.36, 33.31],
        zoom: 6
    });

    // --- ✨ إضافة: الدوال الجديدة لجلب وعرض الماركرات ---

    // دالة لجلب وعرض مواقع المراكز (ماركر أحمر)
    async function loadAndDrawCenterLocations() {
        try {
            const response = await fetch(`/api/centers/locations/${candidateData.id}`);
            const centers = await response.json();

            // حذف الماركرات الحمراء القديمة قبل رسم الجديدة
            Object.values(centerMarkers).forEach(marker => marker.remove());

            centers.forEach(center => {
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<h6><i class="fas fa-university me-2"></i>${center.center_name}</h6>
                     <p class="mb-0">المراقب: ${center.observer_name}</p>`
                );

                centerMarkers[center.id] = new mapboxgl.Marker({ color: '#dc3545' }) // اللون الأحمر
                    .setLngLat([center.longitude, center.latitude])
                    .setPopup(popup)
                    .addTo(map);
            });
        } catch (error) {
            console.error('Failed to load center locations:', error);
        }
    }

    // دالة لجلب وعرض مواقع آخر التقارير (ماركر أصفر)
    async function loadAndDrawReportLocations() {
        try {
            const response = await fetch(`/api/reports/last-locations/${candidateData.id}`);
            const reports = await response.json();

            // حذف الماركرات الصفراء القديمة قبل رسم الجديدة
            Object.values(reportMarkers).forEach(marker => marker.remove());

            reports.forEach(report => {
                const reportTime = new Date(report.log_time).toLocaleString('ar-IQ');
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<h6><i class="fas fa-clock me-2"></i>آخر تقرير للمراقب</h6>
                     <p class="mb-1"><strong>المراقب:</strong> ${report.observer_name}</p>
                     <p class="mb-0"><strong>وقت التقرير:</strong> ${reportTime}</p>`
                );

                // نستخدم observer_id كمفتاح لضمان وجود ماركر واحد لكل مراقب
                reportMarkers[report.observer_id] = new mapboxgl.Marker({ color: '#ffc107' }) // اللون الأصفر
                    .setLngLat([report.longitude, report.latitude])
                    .setPopup(popup)
                    .addTo(map);
            });
        } catch (error) {
            console.error('Failed to load last report locations:', error);
        }
    }


    // ✅ تعديل: دالة تحديث الماركر المباشر (الأزرق)
    function updateMarker(observerId, location) {
        const observerName = observersData[observerId]?.full_name || `مراقب ${observerId}`;

        // إذا كان هناك ماركر أصفر لهذا المراقب، قم بإزالته مؤقتاً
        if (reportMarkers[observerId]) {
            reportMarkers[observerId].remove();
            delete reportMarkers[observerId];
        }

        if (liveMarkers[observerId]) {
            liveMarkers[observerId].setLngLat([location.lng, location.lat]);
        } else {
            const popup = new mapboxgl.Popup({ offset: 25 }).setText(observerName);
            liveMarkers[observerId] = new mapboxgl.Marker({ color: '#0d6efd' }) // اللون الأزرق
                .setLngLat([location.lng, location.lat])
                .setPopup(popup)
                .addTo(map);
        }
    }

    // ✅ تعديل: دالة التركيز على المراقب لتشمل كل أنواع الماركرات
    window.focusOnObserver = (observerId) => {
        let location = null;
        if (liveMarkers[observerId]) {
            location = liveMarkers[observerId].getLngLat();
        } else if (reportMarkers[observerId]) {
            location = reportMarkers[observerId].getLngLat();
        }

        if (location) {
            map.flyTo({ center: [location.lng, location.lat], zoom: 15 });
        } else {
            alert('لا يوجد موقع حالي أو موقع تقرير لهذا المراقب.');
        }
    };


    const fetchFinalReportStatus = async () => {
        try {
            const response = await fetch(`/api/reports/final-status`);
            const data = await response.json();
            isFinalReportActive = data.isActive;
            updateFinalReportButton();
        } catch (error) {
            console.error('Failed to fetch final report status:', error);
        }
    };

    const updateFinalReportButton = () => {
        if (isFinalReportActive) {
            toggleFinalReportBtn.classList.remove('btn-success');
            toggleFinalReportBtn.classList.add('btn-danger');
            toggleFinalReportBtn.innerHTML = `<i class="fas fa-stop-circle me-2"></i>إيقاف استقبال التقارير`;
            finalReportStatusSpan.textContent = 'فعّال';
            finalReportStatusSpan.className = 'fw-bold text-success';
            finalReportStatusFooter.classList.remove('bg-light');
            finalReportStatusFooter.classList.add('bg-success-subtle');
        } else {
            toggleFinalReportBtn.classList.remove('btn-danger');
            toggleFinalReportBtn.classList.add('btn-success');
            toggleFinalReportBtn.innerHTML = `<i class="fas fa-play-circle me-2"></i>بدء استقبال التقارير النهائية`;
            finalReportStatusSpan.textContent = 'متوقف';
            finalReportStatusSpan.className = 'fw-bold text-danger';
            finalReportStatusFooter.classList.remove('bg-success-subtle');
            finalReportStatusFooter.classList.add('bg-light');
        }
    };

    const toggleFinalReport = async () => {
        const newStatus = !isFinalReportActive;
        try {
            const response = await fetch('/api/reports/toggle-final', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, candidateId: candidateData.id })
            });
            if (response.ok) {
                isFinalReportActive = newStatus;
                updateFinalReportButton();
                alert(`تم ${newStatus ? 'تفعيل' : 'إيقاف'} استقبال التقارير النهائية بنجاح.`);
            } else {
                alert('فشل تغيير الحالة. حاول مرة أخرى.');
            }
        } catch (error) {
            console.error('Failed to toggle final report status:', error);
        }
    };

    async function loadLastHourSummary() {
        try {
            const response = await fetch(`/api/attendance/summary/lasthour/${candidateData.id}`);
            const summary = await response.json();
            document.getElementById('summary-present').innerText = summary.present || 0;
            document.getElementById('summary-absent').innerText = summary.absent || 0;
        } catch (error) { console.error("Failed to load last hour summary:", error); }
    }

    async function loadAttendanceLog() {
        try {
            const response = await fetch(`/api/attendance/log/${candidateData.id}`);
            fullAttendanceLog = await response.json();
            applyFiltersAndRenderLog();
        } catch (error) { console.error("Failed to load attendance log:", error); }
    }

    function applyFiltersAndRenderLog() {
        const employeeFilter = document.getElementById('filter-employee-name').value.toLowerCase();
        const observerFilter = document.getElementById('filter-observer-name').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;
        const dateFilter = document.getElementById('filter-date').value;

        const filteredLogs = fullAttendanceLog.filter(entry => {
            const entryDate = entry.log_time.split('T')[0];
            const matchesEmployee = entry.employee_name.toLowerCase().includes(employeeFilter);
            const matchesObserver = entry.observer_name.toLowerCase().includes(observerFilter);
            const matchesStatus = !statusFilter || entry.status === statusFilter;
            const matchesDate = !dateFilter || entryDate === dateFilter;
            return matchesEmployee && matchesObserver && matchesStatus && matchesDate;
        });

        renderLogTable(filteredLogs);
    }

  // ✅ استبدل هذه الدالة بالكامل
function renderLogTable(logs) {
    const logBody = document.getElementById('attendance-log-body');
    logBody.innerHTML = '';
    // ✨ تعديل: تم تغيير الرقم إلى 8 ليناسب عدد الأعمدة الجديد
    if (logs.length === 0) { logBody.innerHTML = `<tr><td colspan="8" class="text-center">لا توجد نتائج تطابق بحثك.</td></tr>`; return; }
    
    logs.forEach(entry => {
        const row = logBody.insertRow();
        const statusClass = entry.status === 'present' ? 'status-present' : 'status-absent';
        const statusText = entry.status === 'present' ? 'حاضر' : 'غائب';
        
        // ✨ تعديل: إضافة الخلايا الجديدة للمركز والقضاء
        row.innerHTML = `
            <td>${entry.employee_name}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>${new Date(entry.log_time).toLocaleString('ar-IQ')}</td>
            <td>${entry.observer_name}</td>
            <td>${entry.center_name || '-'}</td>
            <td>${entry.district || '-'}</td>
            <td>${entry.individual_note || '-'}</td>
            <td>${entry.general_note || '-'}</td>
        `;
    });
}

    async function loadEmployeeAnalytics() {
        try {
            const response = await fetch(`/api/employees/details/${candidateData.id}`);
            allEmployeeDetails = await response.json();
            applyAnalyticsFiltersAndRender();
        } catch (error) {
            console.error('Failed to load employee analytics:', error);
            document.getElementById('employee-analytics-container').innerHTML = `<p class="text-center text-danger col-12">فشل تحميل البيانات.</p>`;
        }
    }

    async function populateAnalyticsFilters() {
        const observerSelect = document.getElementById('analytics-filter-observer');
        const centerSelect = document.getElementById('analytics-filter-center');

        observerSelect.innerHTML = '<option value="">فلترة حسب المراقب</option>';
        centerSelect.innerHTML = '<option value="">فلترة حسب المركز</option>';

        const [observersRes, centersRes] = await Promise.all([
            fetch(`/api/observers/${candidateData.id}`),
            fetch(`/api/centers/${candidateData.id}`)
        ]);

        const observers = await observersRes.json();
        const centers = await centersRes.json();

        observers.forEach(obs => {
            observerSelect.innerHTML += `<option value="${obs.full_name}">${obs.full_name}</option>`;
        });
        centers.forEach(center => {
            centerSelect.innerHTML += `<option value="${center.center_name}">${center.center_name}</option>`;
        });
    }

   // ✅ استبدل هذه الدالة بالكامل
function applyAnalyticsFiltersAndRender() {
    const observerFilter = document.getElementById('analytics-filter-observer').value.toLowerCase();
    const centerFilter = document.getElementById('analytics-filter-center').value.toLowerCase();
    const container = document.getElementById('employee-analytics-container');
    container.innerHTML = '';
    
    const filteredEmployees = allEmployeeDetails.filter(employee => {
        const matchesObserver = !observerFilter || (employee.assigned_observer_name && employee.assigned_observer_name.toLowerCase().includes(observerFilter));
        const matchesCenter = !centerFilter || (employee.assigned_center_name && employee.assigned_center_name.toLowerCase().includes(centerFilter));
        return matchesObserver && matchesCenter;
    });

    if (filteredEmployees.length === 0) {
        container.innerHTML = `<p class="text-center text-muted col-12">لا توجد نتائج تطابق الفلترة.</p>`;
        return;
    }

    filteredEmployees.forEach(employee => {
        // ✨ تعديل: إضافة اسم المركز والقضاء هنا
        container.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${employee.full_name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${employee.job_title}</h6>
                        <div class="card-text text-muted small mb-2">
                            <div><i class="fas fa-university fa-fw me-2"></i>${employee.assigned_center_name || 'لم يسجل مركز'}</div>
                            <div><i class="fas fa-map-marked-alt fa-fw me-2"></i>${employee.assigned_district || 'N/A'}</div>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-around text-center my-3">
                            <div><p class="mb-0 fs-3 text-success">${employee.summary.present}</p><small class="text-muted">عدد ساعات الحضور</small></div>
                            <div><p class="mb-0 fs-3 text-danger">${employee.summary.absent}</p><small class="text-muted">عدد ساعات الغياب</small></div>
                        </div>
                        <button class="btn btn-outline-primary w-100 mt-auto" onclick="window.showLogDetails(${employee.id})">
                            <i class="fas fa-history me-2"></i>عرض السجل التفصيلي
                        </button>
                    </div>
                </div>
            </div>`;
    });
}

// ✨ إضافة: دالة الفلترة العامة
    function setupTableSearch(inputId, tableBodyId, countId) {
        const searchInput = document.getElementById(inputId);
        const tableBody = document.getElementById(tableBodyId);
        const countElement = document.getElementById(countId);

        if (!searchInput) return;

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const rows = tableBody.getElementsByTagName('tr');
            let visibleCount = 0;

            for (const row of rows) {
                const rowText = row.textContent.toLowerCase();
                if (rowText.includes(searchTerm)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            }
            countElement.textContent = visibleCount;
        });
    }
    async function loadObservers() {
        try {
            const response = await fetch(`/api/observers/${candidateData.id}`);
            const observers = await response.json();
            const observersTableBody = document.getElementById('observers-table-body');
            const liveObserversList = document.getElementById('live-observers-list');
            observersTableBody.innerHTML = '';
            liveObserversList.innerHTML = '';
            observersData = {};

            for (const obs of observers) {
                observersData[obs.id] = obs;
                liveObserversList.innerHTML += `<div id="live-obs-${obs.id}" class="list-group-item d-flex justify-content-between align-items-center"><div><span class="status-dot offline"></span><strong>${obs.full_name}</strong><br><small>غير متصل</small></div><button class="btn btn-sm btn-outline-secondary" onclick="window.focusOnObserver(${obs.id})"><i class="fas fa-map-marker-alt"></i></button></div>`;
                const row = observersTableBody.insertRow();
                row.innerHTML = `
                    <td>${obs.full_name}</td>
                    <td>${obs.username}</td>
                    <td class="password-cell">
                        <span id="pass-text-${obs.id}" data-password="${obs.password}">••••••</span>
                        <i id="pass-icon-${obs.id}" class="fas fa-eye" onclick="window.togglePassword(${obs.id})"></i>
                    </td>
                    <td>${obs.phone_number || '-'}</td>
                    <td>${obs.job_title || '-'}</td>
                    <td>${obs.address || '-'}</td>
                    <td>${obs.birth_date ? obs.birth_date.split('T')[0] : '-'}</td>
                    <td class="table-actions">
                        <button class="btn btn-sm btn-info" onclick='window.editObserver(${JSON.stringify(obs)})'><i class="fas fa-edit"></i> تعديل</button>
                        <button class="btn btn-sm btn-danger" onclick="window.deleteObserver(${obs.id})"><i class="fas fa-trash"></i> حذف</button>
                    </td>
                `;
            }
            // ✨ إضافة: تحديث العداد بعد تحميل البيانات
            document.getElementById('observers-count').textContent = observers.length;
            document.getElementById('observer-search-input').value = ''; // مسح البحث القديم
            await fetchAndApplyOnlineStatus();
        } catch (error) { console.error('Failed to load observers:', error); }
    }

    async function loadEmployees() {
        try {
            const response = await fetch(`/api/employees/${candidateData.id}`);
            const employees = await response.json();
            employeesData = {};
            const tableBody = document.getElementById('employees-table-body');
            tableBody.innerHTML = '';
            employees.forEach(emp => {
                employeesData[emp.id] = emp;
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${emp.full_name}</td>
                    <td>${emp.job_title}</td>
                    <td>${emp.observer_name}</td>
                    <td>${emp.phone_number || 'N/A'}</td>
                    <td>${emp.address || 'N/A'}</td>
                    <td class="table-actions">
                        <button class="btn btn-sm btn-info" onclick='window.openEmployeeModal(${emp.id})'><i class="fas fa-edit"></i> تعديل</button>
                        <button class="btn btn-sm btn-danger" onclick="window.deleteEmployee(${emp.id})"><i class="fas fa-trash"></i> حذف</button>
                    </td>`;
            });
            // ✨ إضافة: تحديث العداد بعد تحميل البيانات
            document.getElementById('employees-count').textContent = employees.length;
            document.getElementById('employee-search-input').value = ''; // مسح البحث القديم
        } catch (error) { console.error('Failed to load employees:', error); }
    }

    async function loadCenters() {
        try {
            const response = await fetch(`/api/centers/${candidateData.id}`);
            const centers = await response.json();
            const tableBody = document.getElementById('centers-table-body');
            tableBody.innerHTML = '';
            centers.forEach(center => {
                const row = tableBody.insertRow();
                row.innerHTML = `<td>${center.center_name}</td>
                <td>${center.observer_name}</td>
                <td>${center.district} / ${center.area}</td>
                <td>${center.station_count}</td><td class="table-actions">
                <button class="btn btn-sm btn-info" onclick='window.editCenter(${JSON.stringify(center)})'>
                <i class="fas fa-edit"></i> تعديل</button><button class="btn btn-sm btn-danger" onclick="window.deleteCenter(${center.id})"><i class="fas fa-trash"></i> حذف</button></td>`;
            });

            // ✨ إضافة: تحديث العداد بعد تحميل البيانات
            document.getElementById('centers-count').textContent = centers.length;
            document.getElementById('center-search-input').value = ''; // مسح البحث القديم
        } catch (error) { console.error('Failed to load centers:', error); }
    }

    async function loadFinalReports() {
        try {
            const response = await fetch(`/api/reports/final/${candidateData.id}`);
            allFinalReports = await response.json(); // تخزين البيانات في المتغير العام
            applyFinalReportFiltersAndRender(); // استدعاء دالة الفلترة والعرض
            const reports = await response.json();
            const tableBody = document.getElementById('final-reports-table-body');
            tableBody.innerHTML = '';
            if (reports.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">لم يتم استلام أي تقارير نهائية بعد.</td></tr>';
                return;
            }
            reports.forEach(report => {
                const row = tableBody.insertRow();
                if (report.is_disabled) {
                    row.classList.add('disabled-station');
                }
                row.innerHTML = `
                    <td>${report.center_name}</td>
                    <td>${report.district || '-'}</td>
                    <td><strong>${report.station_number}</strong></td>
                    <td>${report.is_disabled ? '<span class="badge bg-danger">معطلة</span>' : report.vote_count}</td>
                    <td>${report.observer_name}</td>
                    <td>${report.employee_count}</td>
                    <td>
                        <img src="${report.result_image_url}" alt="صورة الشريط" class="report-image" onclick="window.showImageInModal('${report.result_image_url}')">
                    </td>
                    <td>${report.notes || '-'}</td>
                    <td>${new Date(report.created_at).toLocaleString('ar-IQ')}</td>
                `;
            });
        } catch (error) {
            console.error('Failed to load final reports:', error);
        }
    }
// ✨ إضافة: دالة الفلترة والعرض للتقارير النهائية
    function applyFinalReportFiltersAndRender() {
        const centerFilter = document.getElementById('filter-center-name').value.toLowerCase();
        const districtFilter = document.getElementById('filter-district').value.toLowerCase();
        const observerFilter = document.getElementById('filter-final-observer').value.toLowerCase();
        const statusFilter = document.getElementById('filter-station-status').value;

        const filteredReports = allFinalReports.filter(report => {
            const matchesCenter = !centerFilter || (report.center_name && report.center_name.toLowerCase().includes(centerFilter));
            const matchesDistrict = !districtFilter || (report.district && report.district.toLowerCase().includes(districtFilter));
            const matchesObserver = !observerFilter || (report.observer_name && report.observer_name.toLowerCase().includes(observerFilter));
            
            let matchesStatus = true;
            if (statusFilter === 'working') { matchesStatus = !report.is_disabled; } 
            else if (statusFilter === 'disabled') { matchesStatus = report.is_disabled; }
            
            return matchesCenter && matchesDistrict && matchesObserver && matchesStatus;
        });

        const tableBody = document.getElementById('final-reports-table-body');
        tableBody.innerHTML = '';
        let totalVotes = 0;

        if (filteredReports.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">لا توجد نتائج تطابق بحثك.</td></tr>';
        } else {
            filteredReports.forEach(report => {
                totalVotes += report.is_disabled ? 0 : report.vote_count;
                
                const row = tableBody.insertRow();
                if (report.is_disabled) { row.classList.add('table-danger'); }
                
                row.innerHTML = `
                    <td>${report.center_name}</td>
                    <td>${report.district || '-'}</td>
                    <td><strong>${report.station_number}</strong></td>
                    <td>${report.is_disabled ? '<span class="badge bg-danger">معطلة</span>' : '<span class="badge bg-success">عاملة</span>'}</td>
                    <td>${report.is_disabled ? '0' : report.vote_count}</td>
                    <td>${report.observer_name}</td>
                    <td>${report.employee_count}</td>
                    <td>
                        <img src="${report.result_image_url}" alt="صورة الشريط" class="report-image" onclick="window.showImageInModal('${report.result_image_url}')">
                    </td>
                    <td>${report.notes || '-'}</td>
                    <td>${new Date(report.created_at).toLocaleString('ar-IQ')}</td>
                `;
            });
        }
        document.getElementById('total-votes-summary').innerText = totalVotes.toLocaleString('ar-IQ');
    }
    window.showImageInModal = (imageUrl) => {
        document.getElementById('modalImage').src = imageUrl;
        const downloadBtn = document.getElementById('downloadImageBtn');
        if (downloadBtn) {
            downloadBtn.href = imageUrl;
        }
        imageModal.show();
    };

    window.logout = () => {
        sessionStorage.removeItem('candidate');
        window.location.href = '/candidate_login.html';
    };

    window.editObserver = (observer) => {
        document.getElementById('observerId').value = observer.id;
        document.getElementById('observerFullName').value = observer.full_name;
        document.getElementById('observerUsername').value = observer.username;
        document.getElementById('observerPassword').value = '';
        document.getElementById('observerPhoneNumber').value = observer.phone_number || '';
        document.getElementById('observerBirthDate').value = observer.birth_date ? observer.birth_date.split('T')[0] : '';
        document.getElementById('observerJobTitle').value = observer.job_title || '';
        document.getElementById('observerAddress').value = observer.address || '';
        document.getElementById('observerModalLabel').innerText = 'تعديل مراقب';
        observerModal.show();
    };

    window.deleteObserver = async (id) => {
        if (confirm('هل أنت متأكد من حذف هذا المراقب؟\n هذا سيحذف كل البيانات المرتبطة به')) {
            try { await fetch(`/api/observers/${id}`, { method: 'DELETE' }); await loadObservers(); await loadCenters(); }
            catch (error) { console.error('Failed to delete observer:', error); }
        }
    };

    window.deleteEmployee = async (id) => {
        if (confirm('هل أنت متأكد من حذف هذا الموظف؟\n هذا سيحذف كل البيانات المرتبطة به')) {
            try { await fetch(`/api/employees/${id}`, { method: 'DELETE' }); await loadEmployees(); }
            catch (error) { console.error('Failed to delete employee:', error); }
        }
    };

    window.editCenter = (center) => {
        document.getElementById('centerId').value = center.id;
        document.getElementById('centerName').value = center.center_name;
        document.getElementById('centerStationCount').value = center.station_count;
        document.getElementById('centerDistrict').value = center.district;
        document.getElementById('centerArea').value = center.area;
        document.getElementById('centerLandmark').value = center.landmark;
        centerModal.show();
    };

    window.deleteCenter = async (id) => {
        if (confirm('هل أنت متأكد من حذف هذا المركز؟\n هذا سيحذف كل البيانات المرتبطة به')) {
            try { await fetch(`/api/centers/${id}`, { method: 'DELETE' }); await loadCenters(); }
            catch (error) { console.error('Failed to delete center:', error); }
        }
    };

    window.showLogDetails = (employeeId) => {
        const employee = allEmployeeDetails.find(emp => emp.id === employeeId);
        if (!employee) { alert("لم يتم العثور على بيانات الموظف!"); return; }

        if (toggleFinalReportBtn) {
            toggleFinalReportBtn.addEventListener('click', toggleFinalReport);
        }

        document.getElementById('final-reports-tab').addEventListener('shown.bs.tab', async () => {
            await fetchFinalReportStatus();
            await loadFinalReports();
            if (toggleFinalReportBtn) {
                toggleFinalReportBtn.removeEventListener('click', toggleFinalReport);
                toggleFinalReportBtn.addEventListener('click', toggleFinalReport);
            }
        });

        document.getElementById('logDetailModalLabel').innerText = `السجل التفصيلي لـ: ${employee.full_name}`;
        const modalBody = document.getElementById('logDetailModalBody');
        modalBody.parentElement.querySelector('thead').innerHTML = `
            <tr>
                <th>الحالة</th>
                <th>الوقت والتاريخ</th>
                <th>بواسطة المراقب</th>
                <th>ملاحظة خاصة</th>
                <th>ملاحظة عامة</th>
            </tr>
        `;
        modalBody.innerHTML = '';

        if (!employee.logs || employee.logs.length === 0) {
            modalBody.innerHTML = `<tr><td colspan="5" class="text-center">لا توجد سجلات لهذا الموظف.</td></tr>`;
        } else {
            employee.logs.forEach(log => {
                const statusClass = log.status === 'present' ? 'text-success' : 'text-danger';
                const statusText = log.status === 'present' ? 'حاضر' : 'غائب';
                const row = `
                    <tr>
                        <td class="fw-bold ${statusClass}">${statusText}</td>
                        <td>${new Date(log.log_time).toLocaleString('ar-IQ')}</td>
                        <td>${log.observer_name}</td>
                        <td>${log.individual_note || '-'}</td>
                        <td>${log.general_note || '-'}</td>
                    </tr>`;
                modalBody.innerHTML += row;
            });
        }
        logDetailModal.show();
    };

    window.togglePassword = (observerId) => {
        const passText = document.getElementById(`pass-text-${observerId}`);
        const passIcon = document.getElementById(`pass-icon-${observerId}`);

        if (passIcon.classList.contains('fa-eye')) {
            passText.innerText = passText.dataset.password;
            passIcon.classList.remove('fa-eye');
            passIcon.classList.add('fa-eye-slash');
        } else {
            passText.innerText = '••••••';
            passIcon.classList.remove('fa-eye-slash');
            passIcon.classList.add('fa-eye');
        }
    };
    window.focusOnLocation = (lat, lng) => {
        const dashboardTab = new bootstrap.Tab(document.getElementById('dashboard-tab'));
        dashboardTab.show();
        map.flyTo({ center: [lng, lat], zoom: 15 });
    };

    window.openEmployeeModal = async (employeeId = null) => {
        employeeForm.reset();
        document.getElementById('employeeId').value = '';

        const observerSelect = document.getElementById('employeeObserver');
        observerSelect.innerHTML = '<option value="" disabled selected>-- جاري تحميل المراقبين... --</option>';

        const response = await fetch(`/api/observers/${candidateData.id}`);
        const observers = await response.json();

        observerSelect.innerHTML = '<option value="" disabled selected>-- الرجاء الاختيار --</option>';
        observers.forEach(obs => {
            observerSelect.innerHTML += `<option value="${obs.id}">${obs.full_name}</option>`;
        });

        if (employeeId) {
            const employee = employeesData[employeeId];
            if (!employee) return;
            document.getElementById('employeeId').value = employee.id;
            document.getElementById('employeeFullName').value = employee.full_name;
            document.getElementById('employeeJobTitle').value = employee.job_title;
            document.getElementById('employeePhoneNumber').value = employee.phone_number || '';
            document.getElementById('employeeAddress').value = employee.address || '';
            document.getElementById('employeeObserver').value = employee.observer_id;
            document.getElementById('employeeModalLabel').innerText = 'تعديل موظف';
        } else {
            document.getElementById('employeeModalLabel').innerText = 'إضافة موظف جديد';
        }
        employeeModal.show();
    };

    observerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('observerId').value;
        const password = document.getElementById('observerPassword').value;
        const body = {
            fullName: document.getElementById('observerFullName').value,
            username: document.getElementById('observerUsername').value,
            candidateId: candidateData.id,
            ...(password && { password }),
            phoneNumber: document.getElementById('observerPhoneNumber').value,
            birthDate: document.getElementById('observerBirthDate').value,
            jobTitle: document.getElementById('observerJobTitle').value,
            address: document.getElementById('observerAddress').value,
        };
        const url = id ? `/api/observers/${id}` : '/api/observers';
        const method = id ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                observerModal.hide();
                await loadObservers();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'فشل حفظ المراقب.');
            }
        } catch (error) {
            console.error('Failed to save observer:', error);
            alert('حدث خطأ أثناء الاتصال بالخادم.');
        }
    });

    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('employeeId').value;
        const body = {
            fullName: document.getElementById('employeeFullName').value,
            jobTitle: document.getElementById('employeeJobTitle').value,
            phoneNumber: document.getElementById('employeePhoneNumber').value,
            address: document.getElementById('employeeAddress').value,
            observerId: document.getElementById('employeeObserver').value,
            candidateId: candidateData.id
        };
        const url = id ? `/api/employees/${id}` : '/api/employees';
        const method = id ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (response.ok) { employeeModal.hide(); await loadEmployees(); }
            else { alert('فشل حفظ الموظف. تأكد من اختيار المراقب.'); }
        } catch (error) { console.error('Failed to save employee:', error); }
    });

    centerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('centerId').value;
        const body = { centerName: document.getElementById('centerName').value, stationCount: document.getElementById('centerStationCount').value, district: document.getElementById('centerDistrict').value, area: document.getElementById('centerArea').value, landmark: document.getElementById('centerLandmark').value };
        try {
            const response = await fetch(`/api/centers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (response.ok) { centerModal.hide(); await loadCenters(); }
            else { alert('فشل تعديل المركز.'); }
        } catch (error) { console.error('Failed to save center:', error); }
    });

    async function fetchAndApplyOnlineStatus() {
        try {
            const res = await fetch(`/api/observers/status/${candidateData.id}`);
            const onlineObservers = await res.json();
            onlineObservers.forEach(obs => {
                updateObserverStatus(obs.id, 'online');
                if (obs.lastLocation) updateMarker(obs.id, obs.lastLocation);
            });
        } catch (error) { console.error("Failed to fetch online status:", error); }
    }

    function updateObserverStatus(observerId, status, statusText = null) {
        const observerElement = document.getElementById(`live-obs-${observerId}`);
        if (observerElement) {
            const dot = observerElement.querySelector('.status-dot');
            const smallText = observerElement.querySelector('small');
            dot.className = `status-dot ${status}`;
            smallText.textContent = statusText || (status === 'online' ? 'متصل' : 'غير متصل');
        }
    }
    
    // --- Socket.IO Listeners ---
    socket.on('connect', () => socket.emit('candidateJoin', { candidateId: candidateData.id }));

    socket.on('observerStatusUpdate', (data) => updateObserverStatus(data.observerId, data.status));

    socket.on('locationUpdate', (data) => {
        updateMarker(data.observerId, data.location);
        updateObserverStatus(data.observerId, 'online', 'يتم تتبعه مباشرة...');
    });

    socket.on('newReport', async (data) => {
        await loadLastHourSummary();
        await loadAttendanceLog();
        const observerName = observersData[data.observerId]?.full_name || 'مراقب';
        document.getElementById('toast-observer-name').innerText = observerName;
        reportToast.show();
        const presentCount = data.present_employees?.length || 0;
        const absentCount = data.absent_employees?.length || 0;
        updateObserverStatus(data.observerId, 'online', `آخر تقرير: ${presentCount} ح, ${absentCount} غ`);
    });

    socket.on('newFinalReport', async () => {
        console.log("استلام إشارة بوجود تقرير نهائي جديد، جاري تحديث الجدول...");
        await loadFinalReports();
        reportToast.show();
    });
    
    // ✨
    socket.on('centerRegistered', async () => {
        console.log('إشارة بتسجيل مركز جديد، جاري تحديث ماركرات المراكز...');
        await loadAndDrawCenterLocations();
    });

    socket.on('reportLocationUpdate', async () => {
        console.log('إشارة بوصول تقرير جديد مع موقع، جاري تحديث ماركرات التقارير...');
        await loadAndDrawReportLocations();
    });


    // --- Event Listeners ---
    document.getElementById('observerModal').addEventListener('hidden.bs.modal', () => {
        observerForm.reset();
        document.getElementById('observerId').value = '';
        document.getElementById('observerModalLabel').innerText = 'إضافة مراقب جديد';
    });

    document.getElementById('employeeModal').addEventListener('hidden.bs.modal', () => {
        employeeForm.reset();
        document.getElementById('employeeId').value = '';
        document.getElementById('employeeModalLabel').innerText = 'إضافة موظف جديد';
    });

    document.getElementById('filter-employee-name').addEventListener('input', applyFiltersAndRenderLog);
    document.getElementById('filter-observer-name').addEventListener('input', applyFiltersAndRenderLog);
    document.getElementById('filter-status').addEventListener('change', applyFiltersAndRenderLog);
    document.getElementById('filter-date').addEventListener('change', applyFiltersAndRenderLog);

    document.getElementById('clear-filters-btn').addEventListener('click', () => {
        document.getElementById('filter-employee-name').value = '';
        document.getElementById('filter-observer-name').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-date').value = '';
        applyFiltersAndRenderLog();
    });

    document.getElementById('analytics-filter-observer').addEventListener('input', applyAnalyticsFiltersAndRender);
    document.getElementById('analytics-filter-center').addEventListener('input', applyAnalyticsFiltersAndRender);
    document.getElementById('observers-tab').addEventListener('shown.bs.tab', loadObservers);
    document.getElementById('employees-tab').addEventListener('shown.bs.tab', loadEmployees);
    document.getElementById('centers-tab').addEventListener('shown.bs.tab', loadCenters);

    document.getElementById('reports-tab').addEventListener('shown.bs.tab', async () => {
        await loadLastHourSummary();
        await loadAttendanceLog();
    });

    document.getElementById('analytics-tab').addEventListener('shown.bs.tab', loadEmployeeAnalytics);

   // ✅ تعديل: مستمع تبويب التقارير النهائية لربط الفلاتر
    document.getElementById('final-reports-tab').addEventListener('shown.bs.tab', async () => {
        await fetchFinalReportStatus();
        await loadFinalReports();
        if (toggleFinalReportBtn) {
            toggleFinalReportBtn.removeEventListener('click', toggleFinalReport);
            toggleFinalReportBtn.addEventListener('click', toggleFinalReport);
        }
        // ✨ إضافة: ربط الأحداث مع الفلاتر الجديدة
        document.getElementById('filter-center-name').addEventListener('input', applyFinalReportFiltersAndRender);
        document.getElementById('filter-district').addEventListener('input', applyFinalReportFiltersAndRender);
        document.getElementById('filter-final-observer').addEventListener('input', applyFinalReportFiltersAndRender);
        document.getElementById('filter-station-status').addEventListener('change', applyFinalReportFiltersAndRender);
        document.getElementById('clear-final-filters-btn').addEventListener('click', () => {
            document.getElementById('filter-center-name').value = '';
            document.getElementById('filter-district').value = '';
            document.getElementById('filter-final-observer').value = '';
            document.getElementById('filter-station-status').value = '';
            applyFinalReportFiltersAndRender();
        });
    });

    // --- Initial Load ---
    (async () => {
        await loadObservers();
        await loadFinalReports();
        await loadAndDrawCenterLocations();
        await loadAndDrawReportLocations();
        // ✨ إضافة: ربط دوال البحث مع حقول الإدخال
        setupTableSearch('observer-search-input', 'observers-table-body', 'observers-count');
        setupTableSearch('employee-search-input', 'employees-table-body', 'employees-count');
        setupTableSearch('center-search-input', 'centers-table-body', 'centers-count');
    })();
});