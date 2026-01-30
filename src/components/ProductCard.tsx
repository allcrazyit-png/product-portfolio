import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    return (
        <motion.div
            layout
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
            onClick={() => onClick(product)}
        >
            {/* Image Container */}
            <div className="aspect-[4/3] bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                {product.image ? (
                    <img
                        src={`assets/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-black/20 flex items-center justify-center mb-2 backdrop-blur-sm">
                            <span className="text-2xl opacity-50">📷</span>
                        </div>
                        <span className="text-xs font-medium opacity-50">No Image</span>
                    </div>
                )}

                {/* Floating Tags */}
                <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase bg-white/90 dark:bg-black/80 text-gray-900 dark:text-white backdrop-blur-xl rounded-full shadow-sm">
                        {product.category}
                    </span>
                </div>
            </div>

            {/* Content Content */}
            <div className="p-6">
                <div className="mb-4">
                    <p className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold tracking-wider mb-2 opacity-80">{product.id}</p>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                    {product.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-full font-medium">
                            {tag}
                        </span>
                    ))}
                    {product.tags.length > 3 && (
                        <span className="text-[10px] px-2.5 py-1 text-gray-400">
                            +{product.tags.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
