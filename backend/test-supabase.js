const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// تحميل المتغيرات البيئية إذا كانت موجودة
dotenv.config();

// استخدام نفس البيانات الموجودة في الملفات الأخرى
const supabaseUrl = process.env.SUPABASE_URL || 'https://vnvbjphwulwpdzfieyyo.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudmJqcGh3dWx3cGR6ZmlleXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDA2ODcsImV4cCI6MjA2MTUxNjY4N30.qfTs0f4Y5dZIc4hlmitfhe0TOI1fFbdEAK1_9wxzTxY';

// إنشاء عميل Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('اختبار الاتصال بـ Supabase...');
  
  try {
    // محاولة جلب بيانات من Supabase
    const { data, error } = await supabase.from('verification_codes').select('*').limit(1);
    
    if (error) {
      console.error('خطأ في الاتصال بـ Supabase:', error);
      return false;
    }
    
    console.log('تم الاتصال بنجاح بـ Supabase!');
    console.log('البيانات المستلمة:', data);
    return true;
  } catch (err) {
    console.error('خطأ غير متوقع:', err);
    return false;
  }
}

// تنفيذ اختبار الاتصال
testSupabaseConnection()
  .then(isConnected => {
    console.log('نتيجة الاختبار:', isConnected ? 'متصل' : 'غير متصل');
  })
  .catch(err => {
    console.error('خطأ في تنفيذ الاختبار:', err);
  });
