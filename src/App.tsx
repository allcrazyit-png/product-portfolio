import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { Product } from './types';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbx0ssjtKYrkeFPPDs34QR_5A4YPci_tbazOGvJs5VIZGxJs2WKHgaJXg2jJd87JmoEF6A/exec';

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(GAS_API_URL);
            if (!response.ok) throw new Error('無法連線至雲端資料庫');
            const data = await response.json();
            // 去重處理，優先保留完整資料項目
            const uniqueData = Array.from(new Map(data.map((item: Product) => [item.id, item])).values()) as Product[];
            setProducts(uniqueData);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('讀取資料失敗，請檢查網路連線或稍後再試。');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Get unique categories and remove any empties
    const categories = useMemo(() => {
        return Array.from(new Set(products.map(p => p.category?.trim()).filter(Boolean)));
    }, [products]);

    // Get unique machines and remove any empties
    const machines = useMemo(() => {
        return Array.from(new Set(products.map(p => p.specs?.machine?.trim()).filter(Boolean)));
    }, [products]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const searchLower = searchQuery.trim().toLowerCase();
            const matchesSearch = !searchLower ||
                product.name.toLowerCase().includes(searchLower) ||
                product.id.toLowerCase().includes(searchLower) ||
                product.category?.toLowerCase().includes(searchLower);

            const matchesCategory = selectedCategory
                ? product.category?.trim() === selectedCategory.trim()
                : true;

            const matchesMachine = selectedMachine
                ? product.specs?.machine?.trim() === selectedMachine.trim()
                : true;

            return matchesSearch && matchesCategory && matchesMachine;
        });
    }, [products, searchQuery, selectedCategory, selectedMachine]);

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased">
            {/* Header */}
            <header className="sticky top-0 z-30 flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined text-3xl">factory</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
                        瑞全公司產品履歷
                    </h2>
                </div>

                <div className="hidden md:flex flex-1 justify-center px-12">
                    <div className="relative w-full max-w-2xl group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="搜尋品番或品名..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-lg border-0 py-2.5 pl-10 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm sm:leading-6 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <nav className="hidden lg:flex items-center gap-6">
                        <a className="text-slate-600 dark:text-slate-300 hover:text-primary font-medium text-sm transition-colors" href="#">產品</a>
                        <a className="text-slate-600 dark:text-slate-300 hover:text-primary font-medium text-sm transition-colors" href="#">機台</a>
                        <a className="text-slate-600 dark:text-slate-300 hover:text-primary font-medium text-sm transition-colors" href="#">聯絡我們</a>
                    </nav>
                    <div className="flex gap-2 border-l border-slate-200 dark:border-slate-700 pl-6">
                        <button className="flex items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">account_circle</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden w-72 flex-col overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 lg:flex">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">篩選條件</h3>
                            <button
                                onClick={() => { setSelectedCategory(null); setSelectedMachine(null); }}
                                className="text-xs font-medium text-primary hover:text-primary-dark"
                            >
                                清除全部
                            </button>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3 cursor-pointer group">
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">產品類別</span>
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-sm">expand_less</span>
                            </div>
                            <div className="space-y-1">
                                <label
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group transition-colors ${!selectedCategory ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    <span className="text-sm font-medium">全部展示</span>
                                </label>
                                {categories.map(category => (
                                    <label
                                        key={category}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-colors ${selectedCategory === category ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        <span className="text-sm font-medium">{category}</span>
                                        <span className="text-xs opacity-50">({products.filter(p => p.category === category).length})</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3 cursor-pointer group">
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">機台別</span>
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-sm">expand_less</span>
                            </div>
                            <div className="space-y-1">
                                <label
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group transition-colors ${!selectedMachine ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                                    onClick={() => setSelectedMachine(null)}
                                >
                                    <span className="text-sm font-medium">全部展示</span>
                                </label>
                                {machines.map(machine => (
                                    <label
                                        key={machine}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-colors ${selectedMachine === machine ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                                        onClick={() => setSelectedMachine(machine)}
                                    >
                                        <span className="text-sm font-medium">{machine}</span>
                                        <span className="text-xs opacity-50">({products.filter(p => p.specs?.machine?.trim() === machine).length})</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <nav aria-label="Breadcrumb" className="flex">
                            <ol className="flex items-center space-x-2">
                                <li><a className="text-slate-500 hover:text-primary text-sm font-medium" href="#">首頁</a></li>
                                <li><span className="text-slate-400 text-sm">/</span></li>
                                <li><a className="text-slate-500 hover:text-primary text-sm font-medium" href="#">目錄</a></li>
                                <li><span className="text-slate-400 text-sm">/</span></li>
                                <li><span aria-current="page" className="text-slate-900 dark:text-white text-sm font-semibold">所有產品</span></li>
                            </ol>
                        </nav>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            顯示 <span className="font-bold text-slate-900 dark:text-white">{filteredProducts.length}</span> 筆產品
                        </span>
                    </div>

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-32"
                            >
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                <p className="text-slate-500 font-medium">雲端資料同步中...</p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-32 text-center"
                            >
                                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle size={32} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{error}</h3>
                                <button
                                    onClick={fetchData}
                                    className="mt-4 flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    <RefreshCw size={18} /> 重試一次
                                </button>
                            </motion.div>
                        ) : filteredProducts.length > 0 ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <ProductCard
                                            product={product}
                                            onClick={setSelectedProduct}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-32"
                            >
                                <div className="inline-flex justify-center items-center w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 mb-6 shadow-sm">
                                    <span className="material-symbols-outlined text-4xl text-slate-300">search</span>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">找不到相關產品</h3>
                                <p className="text-slate-500">試試看其他的關鍵字或清除篩選條件</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}

export default App;

