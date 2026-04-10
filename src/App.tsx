import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { Product } from './types';
import { supabase } from './lib/supabase';

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: supabaseError } = await supabase
                .from('products')
                .select('*');
            if (supabaseError) throw supabaseError;
            const uniqueData = Array.from(new Map((data as Product[]).map(item => [item.id, item])).values()) as Product[];
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
        return Array.from(new Set(products.map(p => p.machine?.trim()).filter(Boolean)));
    }, [products]);

    // Get unique types (射出/組裝/etc)
    const types = useMemo(() => {
        return Array.from(new Set(products.map(p => p.type?.trim()).filter(Boolean)));
    }, [products]);

    // Pre-compute counts to avoid N+1 filter-inside-map in sidebar
    const categoryCounts = useMemo(() =>
        new Map(categories.map(cat => [cat, products.filter(p => p.category?.trim() === cat).length])),
    [products, categories]);

    const machineCounts = useMemo(() =>
        new Map(machines.map(m => [m, products.filter(p => p.machine?.trim() === m).length])),
    [products, machines]);

    const typeCounts = useMemo(() =>
        new Map(types.map(t => [t, products.filter(p => p.type?.trim() === t).length])),
    [products, types]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        const searchLower = searchQuery.trim().toLowerCase();
        const normalizedCategory = selectedCategory?.trim() ?? null;
        const normalizedMachine = selectedMachine?.trim() ?? null;
        const normalizedType = selectedType?.trim() ?? null;
        return products.filter(product => {
            const matchesSearch = !searchLower ||
                product.name.toLowerCase().includes(searchLower) ||
                product.id.toLowerCase().includes(searchLower) ||
                product.category?.toLowerCase().includes(searchLower);

            const matchesCategory = normalizedCategory
                ? product.category?.trim() === normalizedCategory
                : true;

            const matchesMachine = normalizedMachine
                ? product.machine?.trim() === normalizedMachine
                : true;

            const matchesType = normalizedType
                ? product.type?.trim() === normalizedType
                : true;

            return matchesSearch && matchesCategory && matchesMachine && matchesType;
        });
    }, [products, searchQuery, selectedCategory, selectedMachine, selectedType]);

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans antialiased">
            {/* Header */}
            <header className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-primary/60 bg-slate-900 px-6 py-3 shadow-lg">
                <div className="flex items-center gap-4 shrink-0">
                    <span className="material-symbols-outlined text-primary text-4xl drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]">factory</span>
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-white text-2xl font-black tracking-widest uppercase drop-shadow-[0_0_12px_rgba(217,119,6,0.4)]"
                            style={{ letterSpacing: '0.15em' }}>
                            瑞全公司產品目錄
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-gradient-to-r from-primary/80 to-transparent" />
                            <span className="font-mono text-[10px] text-primary/60 tracking-[0.3em] uppercase">Product Catalog</span>
                            <span className="font-mono text-[10px] text-primary/40">· v{__APP_VERSION__}</span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 justify-center px-10">
                    <div className="relative w-full max-w-xl group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="搜尋品番或品名..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-sm border-0 py-2.5 pl-10 bg-slate-800 text-white placeholder:text-slate-500 ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-primary font-mono text-base transition-all"
                        />
                    </div>
                </div>

                <div className="shrink-0">
                    <span className="font-mono text-sm text-slate-500 tracking-wider hidden lg:block">
                        {products.length > 0 ? `${products.length} PARTS LOADED` : 'LOADING...'}
                    </span>
                </div>
            </header>
            
            {/* Mobile Search */}
            <div className="md:hidden bg-slate-900 px-4 py-2 border-b border-slate-800">
                <div className="relative w-full group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-xl">search</span>
                    </div>
                    <input
                        type="text"
                        placeholder="搜尋品番或品名..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full rounded-sm border-0 py-2.5 pl-10 bg-slate-800 text-white placeholder:text-slate-500 ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-primary font-mono text-base transition-all"
                    />
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden w-64 flex-col overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 lg:flex">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-5">
                            <span className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase">篩選條件</span>
                            <button
                                onClick={() => { setSelectedCategory(null); setSelectedMachine(null); setSelectedType(null); }}
                                className="font-mono text-xs text-primary hover:text-primary-dark tracking-wider uppercase"
                            >
                                CLEAR
                            </button>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <p className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">車型</p>
                            <div className="space-y-0.5">
                                <button
                                    className={`w-full text-left px-3 py-2 text-base font-medium transition-colors rounded-sm ${!selectedCategory ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    全部
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-base transition-colors rounded-sm ${selectedCategory === category ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        <span className="font-medium">{category}</span>
                                        <span className={`font-mono text-xs ${selectedCategory === category ? 'text-white/70' : 'text-slate-400'}`}>{categoryCounts.get(category) ?? 0}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div className="mb-6">
                            <p className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">製造類別</p>
                            <div className="flex flex-wrap gap-1 px-1">
                                {types.map(type => (
                                    <button
                                        key={type}
                                        className={`px-3 py-1.5 text-sm font-bold border transition-all rounded-full ${selectedType === type ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
                                        onClick={() => setSelectedType(selectedType === type ? null : type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Machine Filter */}
                        <div className="mb-6">
                            <p className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">機台別</p>
                            <div className="space-y-0.5">
                                <button
                                    className={`w-full text-left px-3 py-2 text-base font-medium transition-colors rounded-sm ${!selectedMachine ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    onClick={() => setSelectedMachine(null)}
                                >
                                    全部
                                </button>
                                {machines.map(machine => (
                                    <button
                                        key={machine}
                                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-base transition-colors rounded-sm ${selectedMachine === machine ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        onClick={() => setSelectedMachine(machine)}
                                    >
                                        <span className="font-medium font-mono text-sm">{machine}</span>
                                        <span className={`font-mono text-xs ${selectedMachine === machine ? 'text-white/70' : 'text-slate-400'}`}>{machineCounts.get(machine) ?? 0}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-5 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {(selectedCategory || selectedMachine || selectedType || searchQuery) && (
                                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded-sm">
                                    已篩選
                                </span>
                            )}
                        </div>
                        <span className="font-mono text-xs text-slate-400 tracking-wider">
                            {filteredProducts.length} / {products.length} PARTS
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
                                        transition={{ delay: Math.min(index * 0.05, 0.3) }}
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

