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
            whileHover={{ y: -3 }}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex flex-col cursor-pointer relative rounded-sm"
            onClick={() => onClick(product)}
        >
            {/* Top amber accent on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-10" />

            {/* Image */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                {product.image ? (
                    <img
                        src={`assets/${product.image}`}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                        <span className="material-symbols-outlined text-5xl opacity-30">image</span>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                {/* Part ID */}
                <p className="font-mono text-xs font-bold text-primary tracking-wider mb-2 truncate">
                    {product.id}
                </p>

                {/* Name */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                {/* Category & Type */}
                <div className="flex items-center gap-2 mb-auto">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{product.category}</p>
                    {product.type && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {product.type}
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-slate-400 min-w-0">
                        <span className="material-symbols-outlined text-base shrink-0">precision_manufacturing</span>
                        <span className="font-mono text-xs truncate">{product.machine || '—'}</span>
                    </div>
                    {product.material && (
                        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-sm shrink-0 truncate max-w-[90px]">
                            {product.material}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
