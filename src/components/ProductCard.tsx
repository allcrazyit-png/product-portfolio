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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -8 }}
            className="group relative bg-white dark:bg-card rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-border/50"
            onClick={() => onClick(product)}
        >
            {/* Image Container */}
            <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                {product.image ? (
                    <img
                        src={`assets/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/50">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                            <span className="text-2xl mb-1">📷</span>
                        </div>
                        <span className="text-xs font-medium">No Image</span>
                    </div>
                )}

                {/* Floating Tags */}
                <div className="absolute top-3 right-3 z-20 flex gap-1">
                    <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-white/90 dark:bg-black/80 text-foreground backdrop-blur-md rounded-lg shadow-sm">
                        {product.category}
                    </span>
                </div>
            </div>

            {/* Content Content */}
            <div className="p-5">
                <div className="mb-3">
                    <p className="text-[10px] font-mono text-primary font-bold tracking-wider mb-1 opacity-80">{product.id}</p>
                    <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                    {product.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md font-medium">
                            {tag}
                        </span>
                    ))}
                    {product.tags.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 text-muted-foreground">
                            +{product.tags.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
