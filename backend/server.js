const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseKey } = require('./config');

// تحميل المتغيرات البيئية
dotenv.config();

// إعداد Express
const app = express();
app.use(cors());
app.use(express.json());

// إعداد Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// استيراد ميدلوير المصادقة
const { checkAuth, checkSession } = require('./middleware/auth');

// نقاط نهاية API
app.get('/', (req, res) => {
  res.json({ message: 'مرحبًا بك في خادم RuknApp!' });
});

// استيراد مسارات API
const recommendationsRoutes = require('./routes/recommendations');
const authRoutes = require('./routes/auth');

// استخدام مسارات API
app.use('/api', recommendationsRoutes);
app.use('/auth', authRoutes);

// مثال على استخدام حماية المسارات بواسطة ميدلوير المصادقة
// app.use('/api/protected', checkAuth, protectedRoutes);

// بدء الخادم فقط إذا تم تشغيل الملف مباشرةً
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
  });
}

// تصدير التطبيق لاستخدامه في الاختبارات
module.exports = app;
