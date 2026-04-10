import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvityqfkazcqnporvwka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2aXR5cWZrYXpjcW5wb3J2d2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA4OTExMSwiZXhwIjoyMDg5NjY1MTExfQ.rbGsDvpAsky6hBuq2U_MsKRhFnS73ljKfgZTSnvID4Y';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbx0ssjtKYrkeFPPDs34QR_5A4YPci_tbazOGvJs5VIZGxJs2WKHgaJXg2jJd87JmoEF6A/exec';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('從 Google Sheets 抓取最新資料...');
const response = await fetch(GAS_API_URL);
if (!response.ok) throw new Error('無法連線至 Google Sheets');
const products = await response.json();
console.log(`取得 ${products.length} 筆資料`);
const seen = new Set();
const uniqueProducts = products.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
});
console.log(`去重後剩 ${uniqueProducts.length} 筆`);

const { data: existingData, error: fetchError } = await supabase
    .from('products')
    .select('id');

if (fetchError) {
    console.error('取得現有資料失敗:', fetchError.message);
} else {
    const existingIds = new Set(existingData.map(item => item.id));
    const newIds = new Set(uniqueProducts.map(p => p.id));
    const idsToDelete = [...existingIds].filter(id => !newIds.has(id));

    if (idsToDelete.length > 0) {
        console.log(`即將刪除 ${idsToDelete.length} 筆已在 Google Sheets 中不存在的資料...`);
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .in('id', idsToDelete);
            
        if (deleteError) {
            console.error('刪除舊資料失敗:', deleteError.message);
        } else {
            console.log(`成功刪除 ${idsToDelete.length} 筆舊資料！`);
        }
    } else {
        console.log('沒有發現需要刪除的舊資料。');
    }
}

const { data, error } = await supabase
    .from('products')
    .upsert(uniqueProducts, { onConflict: 'id' });

if (error) {
    console.error('匯入更新失敗:', error.message);
} else {
    console.log(`更新/新增成功！共處理 ${uniqueProducts.length} 筆產品資料。`);
}
