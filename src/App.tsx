import { useState, useMemo } from 'react';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-foreground transition-colors duration-300">

            {/* Header */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                                <Box size={24} />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                瑞全公司產品履歷
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="搜尋產品名稱、編號..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
                        <Filter size={16} className="text-muted-foreground shrink-0" />
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!selectedCategory
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                                : 'bg-white hover:bg-gray-100 text-gray-600 border'
                                }`}
                        >
                            全部展示
                        </button>
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                                    : 'bg-white hover:bg-gray-100 text-gray-600 border'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={setSelectedProduct}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Search size={32} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">找不到相關產品</h3>
                        <p className="text-muted-foreground">試試看其他的關鍵字或清除篩選條件</p>
                    </div>
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
