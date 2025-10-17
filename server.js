// // server.js

// // 1. استدعاء المكتبات
// import 'dotenv/config'; // ✅ أضف هذا السطر في الأعلى
// import express from 'express';
// import http from 'http';
// import mysql from 'mysql2/promise';
// import { Server } from "socket.io";
// import cors from 'cors';
// import fileUpload from 'express-fileupload'; // ✅ إضافة جديدة
// import path from 'path'; // ✅ إضافة جديدة (للتعامل مع المسارات)

// // 2. إعداد الخادم الأساسي
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });
// app.use(cors({ origin: '*' }));
// app.use(express.static('public'));
// app.use(express.json());
// app.use(fileUpload()); // ✅ إضافة جديدة
// const PORT = 3001;


// // 3. إنشاء الاتصال بقاعدة البيانات داخل دالة async
// // 3. ✅ إضافة متغير حالة عام
// let dbConnection;
// let isFinalReportActive = false; // هذا هو المفتاح الرئيسي للتحكم

// async function startServer() {
//     try {
//         // ...
// dbConnection = await mysql.createConnection({
//     host: process.env.DATABASE_HOST,       // ✅ تعديل
//     user: process.env.DATABASE_USERNAME,    // ✅ تعديل
//     password: process.env.DATABASE_PASSWORD,  // ✅ تعديل
//     database: process.env.DATABASE_NAME,    // ✅ تعديل
//     ssl: { "rejectUnauthorized": true }     // ✅ إضافة هامة لـ PlanetScale
// });
// // ...
// /////القديم
// //  dbConnection = await mysql.createConnection({
// //             host: 'localhost',
// //             user: 'root',
// //             password: '19951995',
// //             database: 'DBRAMY'
// //         });

//         console.log('✅ تم الاتصال بقاعدة البيانات DBRAMY بنجاح!');

//         // 4. تشغيل الخادم بعد الاتصال بقاعدة البيانات
//         server.listen(PORT, () => {
//             console.log(`🚀 الخادم يعمل الآن على الرابط http://localhost:${PORT}`);
//         });

//     } catch (error) {
//         console.error('❌ فشل الاتصال بقاعدة البيانات:', error);
//     }
// }

// startServer();

// // 4. نقاط النهاية (API Endpoints) - كلها محدثة لتعمل مع async/await


// // نقطة نهاية لتغيير حالة تقعيل التقرير وبثها للمراقبين
// app.post('/api/reports/toggle-final', (req, res) => {
//     const { status, candidateId } = req.body;
//     isFinalReportActive = status;

//     // بث الحالة الجديدة لجميع المراقبين التابعين لهذا المرشح
//     const roomName = `candidate_${candidateId}`;
//     io.to(roomName).emit('finalReportStatus', { isActive: isFinalReportActive });

//     console.log(`✅ تم تغيير حالة التقرير النهائي إلى: ${isFinalReportActive} للمرشح ${candidateId}`);
//     res.status(200).json({ success: true, newStatus: isFinalReportActive });
// });

// // --- نقاط النهاية الخاصة بالتقرير النهائي ---

// app.get('/api/reports/final-status', (req, res) => {
//     res.json({ isActive: isFinalReportActive });
// });

// // ✅ نقطة نهاية جديدة لمعرفة عدد وأرقام المحطات المرسلة
// app.get('/api/reports/final-submitted/:observerId', async (req, res) => {
//     const { observerId } = req.params;
//     try {
//         const sql = "SELECT station_number FROM end_of_day_station_report WHERE observer_id = ?";
//         const [results] = await dbConnection.query(sql, [observerId]);
//         const submittedStations = results.map(row => row.station_number);
//         res.json({ success: true, count: submittedStations.length, submittedStations });
//     } catch (error) {
//         res.status(500).json({ success: false, count: 0, submittedStations: [] });
//     }
// });

// // ✅ تحديث نقطة النهاية لاستلام التقرير النهائي
// app.post('/api/reports/submit-final', async (req, res) => {

//     // --- ✅ أضف هذا الكود للتتبع ---
//     console.log('--- Received Request on /api/reports/submit-final ---');
//     console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
//     console.log('Request Body:', req.body); // سيطبع البيانات النصية
//     console.log('Request Files:', req.files); // سيطبع بيانات الملف
//     console.log('----------------------------------------------------');
//     // ------------------------------------
    
//     if (!isFinalReportActive) {
//         return res.status(403).json({ success: false, message: "إرسال التقارير النهائية غير مفعّل حالياً." });
//     }

//     try {
//         const { observerId, candidateName, centerName, stationNumber, voteCount, isDisabled, notes } = req.body;
        
//         // --- ✅ التحقق من عدم وجود تقرير مكرر لنفس المحطة ---
//         const checkSql = "SELECT id FROM end_of_day_station_report WHERE observer_id = ? AND station_number = ?";
//         const [existing] = await dbConnection.query(checkSql, [observerId, stationNumber]);
//         if (existing.length > 0) {
//             return res.status(409).json({ success: false, message: `تم بالفعل إرسال تقرير للمحطة رقم ${stationNumber}.` });
//         }
        
//         if (!req.files || !req.files.resultImage) {
//             return res.status(400).json({ success: false, message: 'لم يتم رفع صورة النتيجة.' });
//         }

//         const resultImage = req.files.resultImage;
//         const imageName = `${Date.now()}_${observerId}_${resultImage.name}`;
//         const uploadPath = path.resolve() + '/public/uploads/' + imageName;
        
//         await resultImage.mv(uploadPath);
//         const imageUrl = `/uploads/${imageName}`;

//         const finalVoteCount = isDisabled === 'true' ? 0 : parseInt(voteCount, 10);

//         const sql = `INSERT INTO end_of_day_station_report (observer_id, candidate_name, center_name, station_number, vote_count, is_disabled, result_image_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
//         await dbConnection.query(sql, [observerId, candidateName, centerName, stationNumber, finalVoteCount, isDisabled === 'true', imageUrl, notes]);

//         res.status(201).json({ success: true, message: 'تم استلام التقرير النهائي بنجاح!' });
//         console.log(`📥 تم استلام تقرير نهائي من المراقب ${observerId} للمحطة ${stationNumber}`);
//         // ✅✅✅ أضف هذا الجزء لإرسال الإشعار الفوري ✅✅✅
//         const [observer] = await dbConnection.query("SELECT candidate_id FROM observers WHERE id = ?", [observerId]);
//         if (observer.length > 0) {
//             const roomName = `candidate_${observer[0].candidate_id}`;
//             // أرسل إشارة لتحديث واجهة التقارير النهائية
//             io.to(roomName).emit('newFinalReport'); 
//         }

//     } catch (error) {
//         console.error("❌ فشل حفظ التقرير النهائي:", error);
//         res.status(500).json({ success: false, message: "خطأ في الخادم." });
//     }
// });


// // --- ✅✅✅ أضف نقطة النهاية الجديدة هنا ✅✅✅ ---
// app.get('/api/reports/final/:candidateId', async (req, res) => {
//     const { candidateId } = req.params;
//     try {
//        const sql = `
//     SELECT 
//         r.id,
//         r.center_name,
//         r.station_number,
//         r.vote_count,
//         r.is_disabled,
//         r.notes,
//         r.result_image_url,
//         r.created_at,
//         o.full_name as observer_name,
//         pc.district,
//         (SELECT COUNT(*) FROM employees e WHERE e.observer_id = o.id) as employee_count
//     FROM end_of_day_station_report AS r
//     JOIN observers AS o ON r.observer_id = o.id
//     LEFT JOIN polling_centers pc ON o.id = pc.observer_id
//     WHERE o.candidate_id = ?
//     ORDER BY r.created_at DESC
// `;
//         const [reports] = await dbConnection.query(sql, [candidateId]);
//         res.json(reports);
//     } catch (error) {
//         console.error("❌ فشل جلب التقارير النهائية:", error);
//         res.status(500).json([]);
//     }
// });
// ///////////////////////////////////////////////////////
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const sql = "SELECT * FROM observers WHERE username = ? AND password = ?";
//     try {
//         const [results] = await dbConnection.query(sql, [username, password]);
//         if (results.length > 0) {
//             res.json({ success: true, user: results[0] });
//         } else {
//             res.json({ success: false, message: 'Invalid credentials' });
//         }
//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

// app.post('/candidate-login', async (req, res) => {
//     const { username, password } = req.body;
//     const sql = "SELECT * FROM candidates WHERE username = ? AND password = ?";
//     try {
//         const [results] = await dbConnection.query(sql, [username, password]);
//         if (results.length > 0) {
//             res.json({ success: true, user: results[0] });
//         } else {
//             res.json({ success: false });
//         }
//     } catch (error) {
//         console.error("Candidate login error:", error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

// app.get('/api/observers/:candidateId', async (req, res) => {
//     const { candidateId } = req.params;
//     // ✨ التعديل هنا: أضفنا username و password إلى الاستعلام
//     // ✅ الكود المعدل لجلب كل بيانات المراقبين
// const sql = "SELECT id, full_name, username, password, phone_number, birth_date, job_title, address FROM observers WHERE candidate_id = ?";
//     try {
//         const [results] = await dbConnection.query(sql, [candidateId]);
//         res.json(results);
//     } catch (error) {
//         console.error("Fetch observers error:", error);
//         res.status(500).json([]);
//     }
// });

// app.get('/api/observers/status/:candidateId', async (req, res) => {
//     const candidateId = req.params.candidateId;
//     const sql = `SELECT obs.id, obs.full_name, oo.last_location_lat, oo.last_location_lng 
//                  FROM observers obs 
//                  JOIN online_observers oo ON obs.id = oo.observer_id 
//                  WHERE obs.candidate_id = ?`;
//     try {
//         const [onlineObservers] = await dbConnection.query(sql, [candidateId]);
//         const formattedObservers = onlineObservers.map(obs => ({
//             id: obs.id,
//             full_name: obs.full_name,
//             lastLocation: (obs.last_location_lat) ? { lat: obs.last_location_lat, lng: obs.last_location_lng } : null
//         }));
//         res.json(formattedObservers);
//     } catch (error) {
//         console.error("Fetch status error:", error);
//         res.status(500).json([]);
//     }
// });

// app.get('/api/attendance/summary/:candidateId', async (req, res) => {
//     const { candidateId } = req.params;
//     try {
//         const sql = `SELECT status, COUNT(*) as count 
//                      FROM attendance_log al 
//                      JOIN observers o ON al.observer_id = o.id 
//                      WHERE o.candidate_id = ? 
//                      GROUP BY al.status;`;
//         const [results] = await dbConnection.query(sql, [candidateId]);
//         const summary = { present: 0, absent: 0 };
//         results.forEach(row => {
//             if (row.status === 'present') summary.present = row.count;
//             else if (row.status === 'absent') summary.absent = row.count;
//         });
//         res.json(summary);
//     } catch (error) {
//         console.error("Error fetching attendance summary:", error);
//         res.status(500).json({ error: 'Failed to fetch summary' });
//     }
// });

// // ✅ استبدل هذه الدالة بالكامل
// app.get('/api/attendance/log/:candidateId', async (req, res) => {
//     const { candidateId } = req.params;
//     try {
//         // ✨ تعديل: أضفنا INNER JOIN مع polling_centers لجلب اسم المركز والقضاء
//         const sql = `SELECT 
//                         al.employee_name, 
//                         al.status, 
//                         al.log_time, 
//                         o.full_name as observer_name, 
//                         al.individual_note, 
//                         al.general_note,
//                         pc.center_name,
//                         pc.district
//                      FROM attendance_log al 
//                      INNER JOIN observers o ON al.observer_id = o.id 
//                      LEFT JOIN polling_centers pc ON o.id = pc.observer_id
//                      WHERE o.candidate_id = ? 
//                      ORDER BY al.log_time DESC;`;
//         const [logEntries] = await dbConnection.query(sql, [candidateId]);
//         res.json(logEntries);
//     } catch (error) {
//         console.error("Error fetching attendance log:", error);
//         res.status(500).json({ error: 'Failed to fetch log' });
//     }
// });
// /////////////////////////////////////
// // إضافة مراقب جديد
// // ✅ الكود الجديد لإضافة مراقب مع التحقق من اسم المستخدم
// app.post('/api/observers', async (req, res) => {
//     // 1. استخراج كل البيانات الجديدة من الطلب
//     const { fullName, username, password, candidateId, phoneNumber, birthDate, jobTitle, address } = req.body;

//     if (!fullName || !username || !password || !candidateId) {
//         return res.status(400).json({ success: false, message: 'الاسم، اسم المستخدم، كلمة المرور، وهوية المرشح هي حقول إجبارية.' });
//     }

//     try {
//         // 2. التحقق مما إذا كان اسم المستخدم موجودًا بالفعل
//         const checkUserSql = "SELECT id FROM observers WHERE username = ?";
//         const [existing] = await dbConnection.query(checkUserSql, [username]);

//         if (existing.length > 0) {
//             // 3. إذا كان موجودًا، أرجع خطأ 409
//             return res.status(409).json({ success: false, message: 'اسم المستخدم هذا محجوز بالفعل. الرجاء اختيار اسم آخر.' });
//         }

//         // 4. إذا لم يكن موجودًا، قم بإضافته مع كل البيانات الجديدة
//         const insertSql = "INSERT INTO observers (full_name, username, password, candidate_id, phone_number, birth_date, job_title, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//         const [result] = await dbConnection.query(insertSql, [fullName, username, password, candidateId, phoneNumber, birthDate, jobTitle, address]);

//         res.status(201).json({ success: true, insertId: result.insertId });

//     } catch (error) {
//         console.error("Error adding observer:", error);
//         res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
//     }
// });

// // تعديل مراقب
// // ✅ الكود الجديد لتعديل المراقب
// app.put('/api/observers/:id', async (req, res) => {
//     const { id } = req.params;
//     const { fullName, username, password, phoneNumber, birthDate, jobTitle, address } = req.body;

//     // بناء جملة SQL بشكل ديناميكي
//     let sql = "UPDATE observers SET full_name = ?, username = ?, phone_number = ?, birth_date = ?, job_title = ?, address = ?";
//     const params = [fullName, username, phoneNumber, birthDate, jobTitle, address];

//     // إذا تم إرسال كلمة مرور جديدة، قم بإضافتها للاستعلام
//     if (password) {
//         sql += ", password = ?";
//         params.push(password);
//     }

//     sql += " WHERE id = ?";
//     params.push(id);

//     try {
//         await dbConnection.query(sql, params);
//         res.json({ success: true });
//     } catch (error) {
//         // التعامل مع خطأ اسم المستخدم المكرر عند التعديل
//         if (error.code === 'ER_DUP_ENTRY') {
//              return res.status(409).json({ success: false, message: 'اسم المستخدم هذا محجوز بالفعل.' });
//         }
//         console.error("Error updating observer:", error);
//         res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
//     }
// });

// // حذف مراقب
// app.delete('/api/observers/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         await dbConnection.query("DELETE FROM observers WHERE id = ?", [id]);
//         res.json({ success: true });
//     } catch (error) {
//         console.error("Error deleting observer:", error);
//         res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
//     }
// });

// ///////////////////////////////////////////////////////////////
// // --- ✨ نقاط النهاية الجديدة لإدارة الموظفين ---
// // إضافة موظف جديد
// app.post('/api/employees', async (req, res) => {
//     const { candidateId, observerId, fullName, phoneNumber, jobTitle, address } = req.body;
//     if (!observerId || !fullName) return res.status(400).json({ error: 'Observer ID and Full Name are required' });
//     try {
//         const sql = `INSERT INTO employees (candidate_id, observer_id, full_name, phone_number, job_title, address) VALUES (?, ?, ?, ?, ?, ?)`;
//         const [result] = await dbConnection.query(sql, [candidateId, observerId, fullName, phoneNumber, jobTitle, address]);
//         res.status(201).json({ success: true, employeeId: result.insertId });
//     } catch (error) { res.status(500).json({ error: 'Failed to add employee' }); }
// });

// // جلب قائمة الموظفين
// // ✨ التعديل هنا: جلب اسم المراقب مع الموظف
// app.get('/api/employees/:candidateId', async (req, res) => {
//     const { candidateId } = req.params;
//     const sql = `SELECT e.id, e.full_name, e.job_title, e.phone_number, e.address, e.observer_id, o.full_name as observer_name 
//                  FROM employees e 
//                  JOIN observers o ON e.observer_id = o.id
//                  WHERE e.candidate_id = ? 
//                  ORDER BY e.full_name`;
//     try {
//         const [employees] = await dbConnection.query(sql, [candidateId]);
//         res.json(employees);
//     } catch (error) { res.status(500).json({ error: 'Failed to fetch employees' }); }
// });

// // تعديل موظف
// // ✨ التعديل هنا: إضافة observerId للسماح بتغيير المراقب
// app.put('/api/employees/:id', async (req, res) => {
//     const { id } = req.params;
//     const { observerId, fullName, phoneNumber, jobTitle, address } = req.body;
//     if (!observerId || !fullName) return res.status(400).json({ error: 'Observer ID and Full Name are required' });
//     try {
//         const sql = "UPDATE employees SET observer_id = ?, full_name = ?, phone_number = ?, job_title = ?, address = ? WHERE id = ?";
//         await dbConnection.query(sql, [observerId, fullName, phoneNumber, jobTitle, address, id]);
//         res.json({ success: true });
//     } catch (error) { res.status(500).json({ success: false, message: 'خطأ في الخادم.' }); }
// });

// // حذف موظف
// app.delete('/api/employees/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         await dbConnection.query("DELETE FROM employees WHERE id = ?", [id]);
//         res.json({ success: true });
//     } catch (error) {
//         console.error("Error deleting employee:", error);
//         res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
//     }
// });


// // نقطة نهاية جديدة لتحليل بيانات الموظفين التفصيلية
// // ✅ استبدل هذه الدالة بالكامل
// app.get('/api/employees/details/:candidateId', async (req, res) => {
//     const { candidateId } = req.params;
//     try {
//        // ✨ تعديل: أضفنا القضاء (district) إلى البيانات المسترجعة
//        const [employees] = await dbConnection.query(
//             `SELECT 
//                 e.id, e.full_name, e.job_title,
//                 o.full_name as assigned_observer_name,
//                 pc.center_name as assigned_center_name,
//                 pc.district as assigned_district 
//              FROM employees e
//              JOIN observers o ON e.observer_id = o.id
//              LEFT JOIN polling_centers pc ON o.id = pc.observer_id
//              WHERE e.candidate_id = ?`, 
//             [candidateId]
//         );

//        const detailedEmployees = await Promise.all(employees.map(async (employee) => {
//             const [logs] = await dbConnection.query(
//                 `SELECT 
//                     al.status, al.log_time, al.individual_note, al.general_note,
//                     o.full_name as observer_name
//                  FROM attendance_log al
//                  JOIN observers o ON al.observer_id = o.id
//                  WHERE al.employee_name = ? AND o.candidate_id = ?
//                  ORDER BY al.log_time DESC`,
//                 [employee.full_name, candidateId]
//             );
//             const summary = {
//                 present: logs.filter(log => log.status === 'present').length,
//                 absent: logs.filter(log => log.status === 'absent').length
//             };
//             return {
//                 ...employee,
//                 summary,
//                 logs
//             };
//         }));

//         res.json(detailedEmployees);
//     } catch (error) {
//         console.error("Error fetching employee details:", error);
//         res.status(500).json({ error: 'Failed to fetch employee details' });
//     }
// });

// // ✨ نقطة نهاية جديدة لجلب الموظفين حسب المراقب
// app.get('/api/employees/by-observer/:observerId', async (req, res) => {
//     const { observerId } = req.params;
//     const sql = `SELECT id, full_name, job_title, phone_number, address FROM employees WHERE observer_id = ? ORDER BY full_name`;
//     try {
//         const [employees] = await dbConnection.query(sql, [observerId]);
//         res.json(employees);
//     } catch (error) {
//         console.error("Error fetching employees by observer:", error);
//         res.status(500).json({ error: 'Failed to fetch employees' });
//     }
// });
// ////////////////////////////////////////////////////////////////////////////////
// // نقطة نهاية جديدة لجلب ملخص آخر ساعة فقط
// app.get('/api/attendance/summary/lasthour/:candidateId', async (req, res) => {
//     const { candidateId } = req.params;
//     try {
//         const sql = `
//             SELECT status, COUNT(*) as count 
//             FROM attendance_log al 
//             JOIN observers o ON al.observer_id = o.id 
//             WHERE o.candidate_id = ? AND al.log_time >= NOW() - INTERVAL 1 HOUR
//             GROUP BY al.status;
//         `;
//         const [results] = await dbConnection.query(sql, [candidateId]);
//         const summary = { present: 0, absent: 0 };
//         results.forEach(row => {
//             if (row.status === 'present') summary.present = row.count;
//             else if (row.status === 'absent') summary.absent = row.count;
//         });
//         res.json(summary);
//     } catch (error) {
//         console.error("Error fetching last hour attendance summary:", error);
//         res.status(500).json({ error: 'Failed to fetch summary' });
//     }
// });

// // --- ✨ إضافة: نقطة نهاية جديدة لجلب آخر مواقع تقارير المراقبين ---
// app.get('/api/reports/last-locations/:candidateId', async (req, res) => {
//     const { candidateId } = req.params;
//     try {
//         // هذه الجملة تقوم بجلب آخر سجل لكل مراقب يحتوي على إحداثيات
//         const sql = `
//             SELECT al.observer_id, o.full_name as observer_name, al.latitude, al.longitude, al.log_time
//             FROM attendance_log al
//             INNER JOIN (
//                 SELECT observer_id, MAX(id) as max_id
//                 FROM attendance_log
//                 WHERE latitude IS NOT NULL AND longitude IS NOT NULL
//                 GROUP BY observer_id
//             ) as latest_logs ON al.id = latest_logs.max_id
//             JOIN observers o ON al.observer_id = o.id
//             WHERE o.candidate_id = ?;
//         `;
//         const [locations] = await dbConnection.query(sql, [candidateId]);
//         res.json(locations);
//     } catch (error) {
//         console.error("Error fetching last report locations:", error);
//         res.status(500).json([]);
//     }
// });

// // --- ✨ نقاط النهاية الجديدة لإدارة المراكز ---

// // تسجيل بيانات مركز جديد
// // --- ✅ تعديل: نقطة نهاية تسجيل المركز لتشمل الموقع ---
// app.post('/api/center', async (req, res) => {
//     // استلام الإحداثيات الجديدة
//     const { observerId, centerName, stationCount, district, area, landmark, latitude, longitude } = req.body;
//     try {
//         const sql = `
//             INSERT INTO polling_centers (observer_id, center_name, station_count, district, area, landmark, latitude, longitude)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//             ON DUPLICATE KEY UPDATE 
//                 center_name = VALUES(center_name), 
//                 station_count = VALUES(station_count), 
//                 district = VALUES(district), 
//                 area = VALUES(area), 
//                 landmark = VALUES(landmark),
//                 latitude = VALUES(latitude),
//                 longitude = VALUES(longitude)
//         `;
//         await dbConnection.query(sql, [observerId, centerName, stationCount, district, area, landmark, latitude, longitude]);
        
//         // ✨ إضافة: إرسال إشعار فوري للوحة التحكم لتحديث ماركر المركز
//         const [observer] = await dbConnection.query("SELECT candidate_id FROM observers WHERE id = ?", [observerId]);
//         if (observer.length > 0) {
//             const roomName = `candidate_${observer[0].candidate_id}`;
//             io.to(roomName).emit('centerRegistered'); // إرسال إشارة بسيطة
//         }

//         res.status(201).json({ success: true, message: 'Center registered successfully' });
//     } catch (error) {
//         console.error("Error registering center:", error);
//         res.status(500).json({ error: 'Failed to register center' });
//     }
// });

// // جلب كل المراكز التابعة لمرشح معين
// app.get('/api/centers/:candidateId', async (req, res) => {
//     const { candidateId } = req.params;
//     try {
//         const sql = `
//             SELECT pc.*, o.full_name as observer_name 
//             FROM polling_centers pc
//             JOIN observers o ON pc.observer_id = o.id
//             WHERE o.candidate_id = ?
//         `;
//         const [centers] = await dbConnection.query(sql, [candidateId]);
//         res.json(centers);
//     } catch (error) {
//         console.error("Error fetching centers:", error);
//         res.status(500).json([]);
//     }
// });

// // تعديل مركز انتخابي
// app.put('/api/centers/:id', async (req, res) => {
//     const { id } = req.params;
//     const { centerName, stationCount, district, area, landmark } = req.body;
//     try {
//         const sql = `UPDATE polling_centers SET center_name = ?, station_count = ?, district = ?, area = ?, landmark = ? WHERE id = ?`;
//         await dbConnection.query(sql, [centerName, stationCount, district, area, landmark, id]);
//         res.json({ success: true });
//     } catch (error) {
//         console.error("Error updating center:", error);
//         res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
//     }
// });

// // حذف مركز انتخابي (ملاحظة: سيتم حذفه تلقائياً عند حذف المراقب المرتبط به بسبب علاقة CASCADE)
// app.delete('/api/centers/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         await dbConnection.query("DELETE FROM polling_centers WHERE id = ?", [id]);
//         res.json({ success: true });
//     } catch (error) {
//         console.error("Error deleting center:", error);
//         res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
//     }
// });

// // --- ✨ إضافة: نقطة نهاية جديدة لجلب مواقع المراكز ---
// app.get('/api/centers/locations/:candidateId', async (req, res) => {
//     const { candidateId } = req.params;
//     try {
//         const sql = `
//             SELECT pc.id, pc.center_name, pc.latitude, pc.longitude, o.full_name as observer_name
//             FROM polling_centers pc
//             JOIN observers o ON pc.observer_id = o.id
//             WHERE o.candidate_id = ? AND pc.latitude IS NOT NULL AND pc.longitude IS NOT NULL
//         `;
//         const [centers] = await dbConnection.query(sql, [candidateId]);
//         res.json(centers);
//     } catch (error) {
//         console.error("Error fetching centers locations:", error);
//         res.status(500).json([]);
//     }
// });

// ////////////////////////////////////////////////
// // نقطة نهاية للتحقق مما إذا كان المراقب قد سجل مركزًا
// app.get('/api/center/:observerId', async (req, res) => {
//     const { observerId } = req.params;
//     try {
//         const sql = "SELECT * FROM polling_centers WHERE observer_id = ?";
//         const [results] = await dbConnection.query(sql, [observerId]);
//         if (results.length > 0) {
//             res.json({ registered: true, center: results[0] });
//         } else {
//             res.json({ registered: false });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });





// // 5. منطق Socket.IO
// io.on('connection', (socket) => {
//     console.log('✅ مستخدم جديد قد اتصل:', socket.id);

//     socket.on('candidateJoin', (data) => {
//         const roomName = `candidate_${data.candidateId}`;
//         socket.join(roomName);
//         console.log(`المرشح ${data.candidateId} انضم إلى الغرفة ${roomName}`);
//     });

//     socket.on('observerIsOnline', async (observerData) => {
//         try {
//             const sql = `
//                 INSERT INTO online_observers (observer_id, socket_id, last_location_lat, last_location_lng) 
//                 VALUES (?, ?, NULL, NULL) 
//                 ON DUPLICATE KEY UPDATE socket_id = VALUES(socket_id), last_location_lat = NULL, last_location_lng = NULL;
//             `;
//             await dbConnection.query(sql, [observerData.id, socket.id]);
            
//             const roomName = `candidate_${observerData.candidate_id}`;
//             io.to(roomName).emit('observerStatusUpdate', {
//                 observerId: observerData.id,
//                 observerName: observerData.full_name,
//                 status: 'online'
//             });
//         } catch (error) {
//             console.error("Error in observerIsOnline:", error);
//         }
//     });

//     socket.on('updateLocation', async (data) => {
//         console.log('!!! تم استلام حدث تحديث الموقع بالبيانات:', data);
//         const { observerId, location } = data;
//         if (!observerId || !location) return;
//         try {
//             const updateSql = "UPDATE online_observers SET last_location_lat = ?, last_location_lng = ? WHERE observer_id = ?";
//             await dbConnection.query(updateSql, [location.lat, location.lng, observerId]);

//             await dbConnection.query("INSERT INTO reports (observer_id, latitude, longitude) VALUES (?, ?, ?)", [observerId, location.lat, location.lng]);
//             const [rows] = await dbConnection.query("SELECT candidate_id FROM observers WHERE id = ?", [observerId]);
//             if (rows.length > 0) {
//                 const roomName = `candidate_${rows[0].candidate_id}`;
//                 io.to(roomName).emit('locationUpdate', { observerId, location });
//             }
//         } catch(error){ console.error("Update location error:", error); }
//     });



// socket.on('submitReport', async (data) => {
//         // استلام بيانات الموقع مع التقرير
//         const { observerId, present_employees, absent_employees, general_note, individual_notes, location } = data;
//         console.log(`تم استلام تقرير ساعة من المراقب ${observerId} مع الموقع:`, location);

//         try {
//             const attendanceValues = [];
//             const now = new Date();
            
//             // تحديد قيمة خطوط الطول والعرض (قد تكون غير موجودة)
//             const latitude = location ? location.lat : null;
//             const longitude = location ? location.lng : null;

//             (present_employees || []).forEach(name => {
//                 const individualNote = individual_notes[name.trim()] || null;
//                 // إضافة الإحداثيات إلى البيانات المرسلة
//                 attendanceValues.push([observerId, name.trim(), individualNote, 'present', general_note, now, latitude, longitude]);
//             });
//             (absent_employees || []).forEach(name => {
//                 const individualNote = individual_notes[name.trim()] || null;
//                 // إضافة الإحداثيات إلى البيانات المرسلة
//                 attendanceValues.push([observerId, name.trim(), individualNote, 'absent', general_note, now, latitude, longitude]);
//             });

//             if (attendanceValues.length > 0) {
//                 // تعديل جملة الإدخال لتشمل الأعمدة الجديدة
//                 const attendanceSql = `INSERT INTO attendance_log (observer_id, employee_name, individual_note, status, general_note, log_time, latitude, longitude) VALUES ?`;
//                 await dbConnection.query(attendanceSql, [attendanceValues]);
//             }

//             console.log(`✅ تم حفظ تقرير الساعة بنجاح للمراقب ${observerId}`);

//             const [rows] = await dbConnection.query("SELECT candidate_id FROM observers WHERE id = ?", [observerId]);
//             if (rows.length > 0) {
//                 const roomName = `candidate_${rows[0].candidate_id}`;
//                 io.to(roomName).emit('newReport', data); 
//                 // ✨ إضافة: إرسال إشعار فوري للوحة التحكم لتحديث ماركر التقرير
//                 if(location) {
//                     io.to(roomName).emit('reportLocationUpdate');
//                 }
//             }
//         } catch (error) {
//             console.error('❌ خطأ في حفظ تقرير الساعة:', error);
//         }
//     });


//     socket.on('disconnect', async () => {
//         console.log('❌ مستخدم قد قطع الاتصال:', socket.id);
//         try {
//             const findObserverSql = "SELECT o.id, o.full_name, o.candidate_id FROM observers o JOIN online_observers oo ON o.id = oo.observer_id WHERE oo.socket_id = ?";
//             const [rows] = await dbConnection.query(findObserverSql, [socket.id]);
//             if (rows.length > 0) {
//                 const disconnectedObserver = rows[0];
//                 await dbConnection.query("DELETE FROM online_observers WHERE socket_id = ?", [socket.id]);
//                 const roomName = `candidate_${disconnectedObserver.candidate_id}`;
//                 io.to(roomName).emit('observerStatusUpdate', {
//                     observerId: disconnectedObserver.id,
//                     observerName: disconnectedObserver.full_name,
//                     status: 'offline'
//                 });
//             }
//         } catch(error) { console.error("Disconnect error:", error); }
//     });


    
// // // ✨ إضافة: الحل النهائي لمشكلة تحديث الصفحة (Catch-all Route)
// // ❗️❗️ يجب أن يكون هذا هو آخر مسار app.get في الملف
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve('public', 'index.html'));
// });
// });




// server.js

// 1. استدعاء المكتبات
import 'dotenv/config';
import express from 'express';
import http from 'http';
import mysql from 'mysql2/promise';
import { Server } from "socket.io";
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';

// 2. إعداد الخادم الأساسي
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(cors({ origin: '*' }));
app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload());
const PORT = 3001;


// 3. إنشاء الاتصال بقاعدة البيانات داخل دالة async
let dbConnection;
let isFinalReportActive = false;

async function startServer() {
    try {
        dbConnection = await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            ssl: { "rejectUnauthorized": true }
        });

        console.log('✅ تم الاتصال بقاعدة البيانات DBRAMY بنجاح!');

        server.listen(PORT, () => {
            console.log(`🚀 الخادم يعمل الآن على الرابط http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ فشل الاتصال بقاعدة البيانات:', error);
    }
}

startServer();

// 4. نقاط النهاية (API Endpoints)

// نقطة نهاية لتغيير حالة تقعيل التقرير وبثها للمراقبين
app.post('/api/reports/toggle-final', (req, res) => {
    const { status, candidateId } = req.body;
    isFinalReportActive = status;
    const roomName = `candidate_${candidateId}`;
    io.to(roomName).emit('finalReportStatus', { isActive: isFinalReportActive });
    console.log(`✅ تم تغيير حالة التقرير النهائي إلى: ${isFinalReportActive} للمرشح ${candidateId}`);
    res.status(200).json({ success: true, newStatus: isFinalReportActive });
});

// --- نقاط النهاية الخاصة بالتقرير النهائي ---

app.get('/api/reports/final-status', (req, res) => {
    res.json({ isActive: isFinalReportActive });
});

app.get('/api/reports/final-submitted/:observerId', async (req, res) => {
    const { observerId } = req.params;
    try {
        const sql = "SELECT station_number FROM end_of_day_station_report WHERE observer_id = ?";
        const [results] = await dbConnection.query(sql, [observerId]);
        const submittedStations = results.map(row => row.station_number);
        res.json({ success: true, count: submittedStations.length, submittedStations });
    } catch (error) {
        res.status(500).json({ success: false, count: 0, submittedStations: [] });
    }
});

app.post('/api/reports/submit-final', async (req, res) => {
    if (!isFinalReportActive) {
        return res.status(403).json({ success: false, message: "إرسال التقارير النهائية غير مفعّل حالياً." });
    }

    try {
        const { observerId, candidateName, centerName, stationNumber, voteCount, isDisabled, notes } = req.body;
        
        // ✅ تعديل: التحقق من وجود المراقب قبل متابعة العملية
        const [observerCheck] = await dbConnection.query("SELECT id FROM observers WHERE id = ?", [observerId]);
        if (observerCheck.length === 0) {
            return res.status(404).json({ success: false, message: `المراقب بالمعرف ${observerId} غير موجود.` });
        }

        const checkSql = "SELECT id FROM end_of_day_station_report WHERE observer_id = ? AND station_number = ?";
        const [existing] = await dbConnection.query(checkSql, [observerId, stationNumber]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: `تم بالفعل إرسال تقرير للمحطة رقم ${stationNumber}.` });
        }
        
        if (!req.files || !req.files.resultImage) {
            return res.status(400).json({ success: false, message: 'لم يتم رفع صورة النتيجة.' });
        }

        const resultImage = req.files.resultImage;
        const imageName = `${Date.now()}_${observerId}_${resultImage.name}`;
        const uploadPath = path.resolve() + '/public/uploads/' + imageName;
        
        await resultImage.mv(uploadPath);
        const imageUrl = `/uploads/${imageName}`;
        const finalVoteCount = isDisabled === 'true' ? 0 : parseInt(voteCount, 10);

        const sql = `INSERT INTO end_of_day_station_report (observer_id, candidate_name, center_name, station_number, vote_count, is_disabled, result_image_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        await dbConnection.query(sql, [observerId, candidateName, centerName, stationNumber, finalVoteCount, isDisabled === 'true', imageUrl, notes]);

        res.status(201).json({ success: true, message: 'تم استلام التقرير النهائي بنجاح!' });
        console.log(`📥 تم استلام تقرير نهائي من المراقب ${observerId} للمحطة ${stationNumber}`);
        
        const [observer] = await dbConnection.query("SELECT candidate_id FROM observers WHERE id = ?", [observerId]);
        if (observer.length > 0) {
            const roomName = `candidate_${observer[0].candidate_id}`;
            io.to(roomName).emit('newFinalReport'); 
        }

    } catch (error) {
        console.error("❌ فشل حفظ التقرير النهائي:", error);
        res.status(500).json({ success: false, message: "خطأ في الخادم." });
    }
});

app.get('/api/reports/final/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    try {
        const sql = `
            SELECT 
                r.id, r.center_name, r.station_number, r.vote_count, r.is_disabled, r.notes, r.result_image_url, r.created_at,
                o.full_name as observer_name, 
                pc.district,
                (SELECT COUNT(*) FROM employees e WHERE e.observer_id = o.id) as employee_count
            FROM end_of_day_station_report AS r
            JOIN observers AS o ON r.observer_id = o.id
            LEFT JOIN polling_centers pc ON o.id = pc.observer_id
            WHERE o.candidate_id = ?
            ORDER BY r.created_at DESC`;
        const [reports] = await dbConnection.query(sql, [candidateId]);
        res.json(reports);
    } catch (error) {
        console.error("❌ فشل جلب التقارير النهائية:", error);
        res.status(500).json([]);
    }
});

// --- نقاط النهاية الخاصة بتسجيل الدخول ---

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [results] = await dbConnection.query("SELECT * FROM observers WHERE username = ? AND password = ?", [username, password]);
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/candidate-login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [results] = await dbConnection.query("SELECT * FROM candidates WHERE username = ? AND password = ?", [username, password]);
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error("Candidate login error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// --- نقاط النهاية الخاصة بالمراقبين (Observers) ---

app.get('/api/observers/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    try {
        const [results] = await dbConnection.query("SELECT id, full_name, username, password, phone_number, birth_date, job_title, address FROM observers WHERE candidate_id = ?", [candidateId]);
        res.json(results);
    } catch (error) {
        console.error("Fetch observers error:", error);
        res.status(500).json([]);
    }
});

app.post('/api/observers', async (req, res) => {
    const { fullName, username, password, candidateId, phoneNumber, birthDate, jobTitle, address } = req.body;
    if (!fullName || !username || !password || !candidateId) {
        return res.status(400).json({ success: false, message: 'الاسم، اسم المستخدم، كلمة المرور، وهوية المرشح هي حقول إجبارية.' });
    }
    try {
        // ✅ تعديل: التحقق من وجود المرشح قبل إضافة المراقب
        const [existingCandidate] = await dbConnection.query("SELECT id FROM candidates WHERE id = ?", [candidateId]);
        if (existingCandidate.length === 0) {
            return res.status(404).json({ success: false, message: `المرشح بالمعرف ${candidateId} غير موجود.` });
        }

        const [existingUser] = await dbConnection.query("SELECT id FROM observers WHERE username = ?", [username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ success: false, message: 'اسم المستخدم هذا محجوز بالفعل. الرجاء اختيار اسم آخر.' });
        }

        const sql = "INSERT INTO observers (full_name, username, password, candidate_id, phone_number, birth_date, job_title, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const [result] = await dbConnection.query(sql, [fullName, username, password, candidateId, phoneNumber, birthDate, jobTitle, address]);
        res.status(201).json({ success: true, insertId: result.insertId });
    } catch (error) {
        console.error("Error adding observer:", error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
    }
});

app.put('/api/observers/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, username, password, phoneNumber, birthDate, jobTitle, address } = req.body;
    
    let sql = "UPDATE observers SET full_name = ?, username = ?, phone_number = ?, birth_date = ?, job_title = ?, address = ?";
    const params = [fullName, username, phoneNumber, birthDate, jobTitle, address];
    
    if (password) {
        sql += ", password = ?";
        params.push(password);
    }
    sql += " WHERE id = ?";
    params.push(id);

    try {
        await dbConnection.query(sql, params);
        res.json({ success: true });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'اسم المستخدم هذا محجوز بالفعل.' });
        }
        console.error("Error updating observer:", error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
    }
});

// ✅ تعديل: إعادة كتابة دالة الحذف بالكامل لمحاكاة ON DELETE CASCADE/SET NULL
app.delete('/api/observers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // بدء معاملة لضمان تنفيذ جميع عمليات الحذف معًا أو عدم تنفيذ أي منها
        await dbConnection.beginTransaction();

        // 1. محاكاة ON DELETE SET NULL لجدول reports
        await dbConnection.query("UPDATE reports SET observer_id = NULL WHERE observer_id = ?", [id]);

        // 2. محاكاة ON DELETE CASCADE للجداول الأخرى
        await dbConnection.query("DELETE FROM end_of_day_station_report WHERE observer_id = ?", [id]);
        await dbConnection.query("DELETE FROM attendance_log WHERE observer_id = ?", [id]);
        await dbConnection.query("DELETE FROM polling_centers WHERE observer_id = ?", [id]);
        await dbConnection.query("DELETE FROM employees WHERE observer_id = ?", [id]);
        await dbConnection.query("DELETE FROM online_observers WHERE observer_id = ?", [id]);
        
        // 3. أخيرًا، حذف المراقب نفسه
        const [result] = await dbConnection.query("DELETE FROM observers WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            // إذا لم يتم العثور على المراقب، تراجع عن المعاملة
            await dbConnection.rollback();
            return res.status(404).json({ success: false, message: 'المراقب غير موجود.' });
        }

        // إذا نجحت جميع العمليات، قم بتأكيد المعاملة
        await dbConnection.commit();
        
        res.json({ success: true });

    } catch (error) {
        // في حالة حدوث أي خطأ، تراجع عن جميع التغييرات
        await dbConnection.rollback();
        console.error("Error deleting observer and related data:", error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم أثناء حذف المراقب.' });
    }
});


// --- نقاط النهاية الخاصة بالموظفين (Employees) ---

app.post('/api/employees', async (req, res) => {
    const { candidateId, observerId, fullName, phoneNumber, jobTitle, address } = req.body;
    if (!observerId || !fullName || !candidateId) {
        return res.status(400).json({ error: 'Observer ID, Candidate ID and Full Name are required' });
    }
    try {
        // ✅ تعديل: التحقق من وجود المراقب والمرشح قبل إضافة الموظف
        const [existingObserver] = await dbConnection.query("SELECT id FROM observers WHERE id = ?", [observerId]);
        if (existingObserver.length === 0) {
            return res.status(404).json({ success: false, message: `المراقب بالمعرف ${observerId} غير موجود.` });
        }
        const [existingCandidate] = await dbConnection.query("SELECT id FROM candidates WHERE id = ?", [candidateId]);
        if (existingCandidate.length === 0) {
            return res.status(404).json({ success: false, message: `المرشح بالمعرف ${candidateId} غير موجود.` });
        }

        const sql = `INSERT INTO employees (candidate_id, observer_id, full_name, phone_number, job_title, address) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await dbConnection.query(sql, [candidateId, observerId, fullName, phoneNumber, jobTitle, address]);
        res.status(201).json({ success: true, employeeId: result.insertId });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ error: 'Failed to add employee' });
    }
});

app.put('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { observerId, fullName, phoneNumber, jobTitle, address } = req.body;
    if (!observerId || !fullName) {
        return res.status(400).json({ error: 'Observer ID and Full Name are required' });
    }
    try {
        // ✅ تعديل: التحقق من وجود المراقب الجديد قبل التحديث
        const [existingObserver] = await dbConnection.query("SELECT id FROM observers WHERE id = ?", [observerId]);
        if (existingObserver.length === 0) {
            return res.status(404).json({ success: false, message: `المراقب الجديد بالمعرف ${observerId} غير موجود.` });
        }

        const sql = "UPDATE employees SET observer_id = ?, full_name = ?, phone_number = ?, job_title = ?, address = ? WHERE id = ?";
        await dbConnection.query(sql, [observerId, fullName, phoneNumber, jobTitle, address, id]);
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await dbConnection.query("DELETE FROM employees WHERE id = ?", [id]);
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
    }
});

app.get('/api/employees/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    const sql = `SELECT e.id, e.full_name, e.job_title, e.phone_number, e.address, e.observer_id, o.full_name as observer_name 
                 FROM employees e 
                 JOIN observers o ON e.observer_id = o.id
                 WHERE e.candidate_id = ? 
                 ORDER BY e.full_name`;
    try {
        const [employees] = await dbConnection.query(sql, [candidateId]);
        res.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

app.get('/api/employees/by-observer/:observerId', async (req, res) => {
    const { observerId } = req.params;
    try {
        const [employees] = await dbConnection.query(`SELECT id, full_name, job_title, phone_number, address FROM employees WHERE observer_id = ? ORDER BY full_name`, [observerId]);
        res.json(employees);
    } catch (error) {
        console.error("Error fetching employees by observer:", error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// --- نقاط النهاية الخاصة بالمراكز (Polling Centers) ---

app.post('/api/center', async (req, res) => {
    const { observerId, centerName, stationCount, district, area, landmark, latitude, longitude } = req.body;
    try {
        // ✅ تعديل: التحقق من وجود المراقب قبل إضافة أو تحديث المركز
        const [existingObserver] = await dbConnection.query("SELECT id FROM observers WHERE id = ?", [observerId]);
        if (existingObserver.length === 0) {
            return res.status(404).json({ success: false, message: `المراقب بالمعرف ${observerId} غير موجود.` });
        }

        const sql = `
            INSERT INTO polling_centers (observer_id, center_name, station_count, district, area, landmark, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                center_name = VALUES(center_name), station_count = VALUES(station_count), district = VALUES(district), 
                area = VALUES(area), landmark = VALUES(landmark), latitude = VALUES(latitude), longitude = VALUES(longitude)`;
        await dbConnection.query(sql, [observerId, centerName, stationCount, district, area, landmark, latitude, longitude]);
        
        const [observer] = await dbConnection.query("SELECT candidate_id FROM observers WHERE id = ?", [observerId]);
        if (observer.length > 0) {
            const roomName = `candidate_${observer[0].candidate_id}`;
            io.to(roomName).emit('centerRegistered');
        }
        res.status(201).json({ success: true, message: 'Center registered successfully' });
    } catch (error) {
        console.error("Error registering center:", error);
        res.status(500).json({ error: 'Failed to register center' });
    }
});

app.delete('/api/centers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await dbConnection.query("DELETE FROM polling_centers WHERE id = ?", [id]);
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting center:", error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
    }
});

// ✅✅✅ أضف هذا الكود بالكامل إلى ملف server.js ✅✅✅

// تعديل مركز انتخابي
app.put('/api/centers/:id', async (req, res) => {
    const { id } = req.params;
    const { centerName, stationCount, district, area, landmark } = req.body;

    // التحقق من وجود البيانات الأساسية
    if (!centerName || !stationCount) {
        return res.status(400).json({ success: false, message: 'اسم المركز وعدد المحطات حقول إجبارية.' });
    }

    try {
        const sql = `UPDATE polling_centers 
                     SET center_name = ?, station_count = ?, district = ?, area = ?, landmark = ? 
                     WHERE id = ?`;
        
        const [result] = await dbConnection.query(sql, [centerName, stationCount, district, area, landmark, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'لم يتم العثور على المركز المطلوب لتعديله.' });
        }

        res.json({ success: true, message: 'تم تعديل المركز بنجاح!' });

    } catch (error) {
        console.error("Error updating center:", error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم.' });
    }
});


// --- باقي نقاط النهاية (GET Endpoints) ---
// (لا تحتاج لتعديل لأنها تقرأ البيانات فقط)

app.get('/api/observers/status/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    const sql = `SELECT obs.id, obs.full_name, oo.last_location_lat, oo.last_location_lng 
                 FROM observers obs 
                 JOIN online_observers oo ON obs.id = oo.observer_id 
                 WHERE obs.candidate_id = ?`;
    try {
        const [onlineObservers] = await dbConnection.query(sql, [candidateId]);
        const formattedObservers = onlineObservers.map(obs => ({
            id: obs.id,
            full_name: obs.full_name,
            lastLocation: (obs.last_location_lat) ? { lat: obs.last_location_lat, lng: obs.last_location_lng } : null
        }));
        res.json(formattedObservers);
    } catch (error) {
        console.error("Fetch status error:", error);
        res.status(500).json([]);
    }
});

app.get('/api/attendance/summary/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    try {
        const sql = `SELECT status, COUNT(*) as count 
                     FROM attendance_log al 
                     JOIN observers o ON al.observer_id = o.id 
                     WHERE o.candidate_id = ? 
                     GROUP BY al.status;`;
        const [results] = await dbConnection.query(sql, [candidateId]);
        const summary = { present: 0, absent: 0 };
        results.forEach(row => {
            if (row.status === 'present') summary.present = row.count;
            else if (row.status === 'absent') summary.absent = row.count;
        });
        res.json(summary);
    } catch (error) {
        console.error("Error fetching attendance summary:", error);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

app.get('/api/attendance/log/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    try {
        const sql = `SELECT 
                         al.employee_name, al.status, al.log_time, 
                         o.full_name as observer_name, 
                         al.individual_note, al.general_note,
                         pc.center_name, pc.district
                     FROM attendance_log al 
                     INNER JOIN observers o ON al.observer_id = o.id 
                     LEFT JOIN polling_centers pc ON o.id = pc.observer_id
                     WHERE o.candidate_id = ? 
                     ORDER BY al.log_time DESC;`;
        const [logEntries] = await dbConnection.query(sql, [candidateId]);
        res.json(logEntries);
    } catch (error) {
        console.error("Error fetching attendance log:", error);
        res.status(500).json({ error: 'Failed to fetch log' });
    }
});

app.get('/api/employees/details/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    try {
       const [employees] = await dbConnection.query(
            `SELECT 
                e.id, e.full_name, e.job_title,
                o.full_name as assigned_observer_name,
                pc.center_name as assigned_center_name,
                pc.district as assigned_district 
             FROM employees e
             JOIN observers o ON e.observer_id = o.id
             LEFT JOIN polling_centers pc ON o.id = pc.observer_id
             WHERE e.candidate_id = ?`, [candidateId]
       );

       const detailedEmployees = await Promise.all(employees.map(async (employee) => {
            const [logs] = await dbConnection.query(
                `SELECT 
                    al.status, al.log_time, al.individual_note, al.general_note,
                    o.full_name as observer_name
                 FROM attendance_log al
                 JOIN observers o ON al.observer_id = o.id
                 WHERE al.employee_name = ? AND o.candidate_id = ?
                 ORDER BY al.log_time DESC`,
                [employee.full_name, candidateId]
            );
            const summary = {
                present: logs.filter(log => log.status === 'present').length,
                absent: logs.filter(log => log.status === 'absent').length
            };
            return { ...employee, summary, logs };
       }));
       res.json(detailedEmployees);
    } catch (error) {
       console.error("Error fetching employee details:", error);
       res.status(500).json({ error: 'Failed to fetch employee details' });
    }
});

app.get('/api/reports/last-locations/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    try {
        const sql = `
            SELECT al.observer_id, o.full_name as observer_name, al.latitude, al.longitude, al.log_time
            FROM attendance_log al
            INNER JOIN (
                SELECT observer_id, MAX(id) as max_id
                FROM attendance_log
                WHERE latitude IS NOT NULL AND longitude IS NOT NULL
                GROUP BY observer_id
            ) as latest_logs ON al.id = latest_logs.max_id
            JOIN observers o ON al.observer_id = o.id
            WHERE o.candidate_id = ?;`;
        const [locations] = await dbConnection.query(sql, [candidateId]);
        res.json(locations);
    } catch (error) {
        console.error("Error fetching last report locations:", error);
        res.status(500).json([]);
    }
});

app.get('/api/centers/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    try {
        const sql = `
            SELECT pc.*, o.full_name as observer_name 
            FROM polling_centers pc
            JOIN observers o ON pc.observer_id = o.id
            WHERE o.candidate_id = ?`;
        const [centers] = await dbConnection.query(sql, [candidateId]);
        res.json(centers);
    } catch (error) {
        console.error("Error fetching centers:", error);
        res.status(500).json([]);
    }
});

app.get('/api/centers/locations/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    try {
        const sql = `
            SELECT pc.id, pc.center_name, pc.latitude, pc.longitude, o.full_name as observer_name
            FROM polling_centers pc
            JOIN observers o ON pc.observer_id = o.id
            WHERE o.candidate_id = ? AND pc.latitude IS NOT NULL AND pc.longitude IS NOT NULL`;
        const [centers] = await dbConnection.query(sql, [candidateId]);
        res.json(centers);
    } catch (error) {
        console.error("Error fetching centers locations:", error);
        res.status(500).json([]);
    }
});

app.get('/api/center/:observerId', async (req, res) => {
    const { observerId } = req.params;
    try {
        const [results] = await dbConnection.query("SELECT * FROM polling_centers WHERE observer_id = ?", [observerId]);
        res.json({ registered: results.length > 0, center: results[0] || null });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// 5. منطق Socket.IO
io.on('connection', (socket) => {
    console.log('✅ مستخدم جديد قد اتصل:', socket.id);

    socket.on('candidateJoin', (data) => {
        const roomName = `candidate_${data.candidateId}`;
        socket.join(roomName);
        console.log(`المرشح ${data.candidateId} انضم إلى الغرفة ${roomName}`);
    });

    socket.on('observerIsOnline', async (observerData) => {
        try {
            const sql = `
                INSERT INTO online_observers (observer_id, socket_id, last_location_lat, last_location_lng) 
                VALUES (?, ?, NULL, NULL) 
                ON DUPLICATE KEY UPDATE socket_id = VALUES(socket_id), last_location_lat = NULL, last_location_lng = NULL;`;
            await dbConnection.query(sql, [observerData.id, socket.id]);
            
            const roomName = `candidate_${observerData.candidate_id}`;
            io.to(roomName).emit('observerStatusUpdate', {
                observerId: observerData.id,
                observerName: observerData.full_name,
                status: 'online'
            });
        } catch (error) {
            console.error("Error in observerIsOnline:", error);
        }
    });

    socket.on('updateLocation', async (data) => {
        const { observerId, location } = data;
        if (!observerId || !location) return;
        try {
            // ✅ تعديل: التحقق من وجود المراقب قبل تحديث الموقع
            const [existingObserver] = await dbConnection.query("SELECT candidate_id FROM observers WHERE id = ?", [observerId]);
            if (existingObserver.length === 0) {
                console.error(`Error in updateLocation: Observer with ID ${observerId} not found.`);
                return;
            }

            await dbConnection.query("UPDATE online_observers SET last_location_lat = ?, last_location_lng = ? WHERE observer_id = ?", [location.lat, location.lng, observerId]);
            await dbConnection.query("INSERT INTO reports (observer_id, latitude, longitude) VALUES (?, ?, ?)", [observerId, location.lat, location.lng]);
            
            const roomName = `candidate_${existingObserver[0].candidate_id}`;
            io.to(roomName).emit('locationUpdate', { observerId, location });
        } catch(error){ console.error("Update location error:", error); }
    });

    socket.on('submitReport', async (data) => {
        const { observerId, present_employees, absent_employees, general_note, individual_notes, location } = data;
        try {
            // ✅ تعديل: التحقق من وجود المراقب قبل حفظ التقرير
            const [observer] = await dbConnection.query("SELECT candidate_id FROM observers WHERE id = ?", [observerId]);
            if (observer.length === 0) {
                console.error(`Error in submitReport: Observer with ID ${observerId} not found.`);
                return; // إيقاف التنفيذ إذا لم يتم العثور على المراقب
            }

            const attendanceValues = [];
            const now = new Date();
            const latitude = location ? location.lat : null;
            const longitude = location ? location.lng : null;

            (present_employees || []).forEach(name => {
                const individualNote = individual_notes[name.trim()] || null;
                attendanceValues.push([observerId, name.trim(), individualNote, 'present', general_note, now, latitude, longitude]);
            });
            (absent_employees || []).forEach(name => {
                const individualNote = individual_notes[name.trim()] || null;
                attendanceValues.push([observerId, name.trim(), individualNote, 'absent', general_note, now, latitude, longitude]);
            });

            if (attendanceValues.length > 0) {
                const attendanceSql = `INSERT INTO attendance_log (observer_id, employee_name, individual_note, status, general_note, log_time, latitude, longitude) VALUES ?`;
                await dbConnection.query(attendanceSql, [attendanceValues]);
            }

            console.log(`✅ تم حفظ تقرير الساعة بنجاح للمراقب ${observerId}`);

            const roomName = `candidate_${observer[0].candidate_id}`;
            io.to(roomName).emit('newReport', data); 
            if(location) {
                io.to(roomName).emit('reportLocationUpdate');
            }
        } catch (error) {
            console.error('❌ خطأ في حفظ تقرير الساعة:', error);
        }
    });

    socket.on('disconnect', async () => {
        console.log('❌ مستخدم قد قطع الاتصال:', socket.id);
        try {
            const [rows] = await dbConnection.query("SELECT o.id, o.full_name, o.candidate_id FROM observers o JOIN online_observers oo ON o.id = oo.observer_id WHERE oo.socket_id = ?", [socket.id]);
            if (rows.length > 0) {
                const disconnectedObserver = rows[0];
                await dbConnection.query("DELETE FROM online_observers WHERE socket_id = ?", [socket.id]);
                const roomName = `candidate_${disconnectedObserver.candidate_id}`;
                io.to(roomName).emit('observerStatusUpdate', {
                    observerId: disconnectedObserver.id,
                    observerName: disconnectedObserver.full_name,
                    status: 'offline'
                });
            }
        } catch(error) { console.error("Disconnect error:", error); }
    });
    
    // الحل النهائي لمشكلة تحديث الصفحة (يجب أن يكون آخر مسار)
    app.get('*', (req, res) => {
        res.sendFile(path.resolve('public', 'index.html'));
    });
});