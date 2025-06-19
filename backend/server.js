const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// تحميل المتغيرات البيئية
dotenv.config();

// إعداد Express
const app = express();
app.use(cors());
app.use(express.json());

// إعداد Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://vnvbjphwulwpdzfieyyo.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudmJqcGh3dWx3cGR6ZmlleXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDA2ODcsImV4cCI6MjA2MTUxNjY4N30.qfTs0f4Y5dZIc4hlmitfhe0TOI1fFbdEAK1_9wxzTxY';
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
