import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Box } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { Product } from './types';
import productsData from './data/products.json';

// Get unique categories and remove any empties
const CATEGORIES = Array.from(new Set((productsData as Product[]).map(p => p.category).filter(Boolean)));

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return (productsData as Product[]).filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory ? product.category === selectedCategory : true;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-foreground font-sans selection:bg-blue-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/10 blur-[100px] animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-white/20 shadow-sm supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-xl shadow-lg">
                                <Box size={20} />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white bg-clip-text">
                                瑞全公司產品履歷
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="搜尋產品名稱、編號..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 border border-transparent focus:bg-white dark:focus:bg-gray-800 focus:shadow-lg focus:shadow-blue-500/10 transition-all outline-none text-sm placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar mask-gradient-x">
                        <Filter size={16} className="text-gray-400 shrink-0 ml-1" />
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 touch-manipulation select-none ${!selectedCategory
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105'
                                : 'bg-transparent text-gray-500 md:hover:text-gray-900 md:hover:bg-gray-100/50'
                                }`}
                        >
                            全部展示
                        </button>
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 touch-manipulation select-none ${selectedCategory === category
                                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105'
                                    : 'bg-transparent text-gray-500 md:hover:text-gray-900 md:hover:bg-gray-100/50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 relative z-10">
                {filteredProducts.length > 0 ? (
                    <motion.div
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32"
                    >
                        <div className="inline-flex justify-center items-center w-20 h-20 rounded-3xl bg-gray-100 dark:bg-gray-900 mb-6 shadow-inner">
                            <Search size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">找不到相關產品</h3>
                        <p className="text-gray-500">試試看其他的關鍵字或清除篩選條件</p>
                    </motion.div>
                )}
            </main>

            {/* Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    )
}

export default App
