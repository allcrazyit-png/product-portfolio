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
            whileHover={{ y: -4 }}
            className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col cursor-pointer"
            onClick={() => onClick(product)}
        >
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                {product.image ? (
                    <img
                        src={`assets/${product.image}`}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                        <span className="material-symbols-outlined text-4xl opacity-20">image</span>
                        <span className="text-[10px] mt-2 font-medium">NO IMAGE</span>
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/20 px-2 py-1 text-[10px] font-bold text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">有庫存</span>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">{product.id}</p>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded whitespace-nowrap">
                        {product.specs.material || '標準件'}
                    </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">{product.category}</p>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
                        <span>{product.specs.machine || '未指派'}</span>
                    </div>
                    <button className="text-primary hover:text-primary-dark p-1 rounded-full hover:bg-primary/5 transition-colors">
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
