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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)" }}
            className="bg-card/50 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:border-primary/50 transition-colors"
            onClick={() => onClick(product)}
        >
            <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                {product.image ? (
                    <img
                        src={`images/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                    <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white backdrop-blur-md rounded-full">
                        {product.category}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg text-foreground truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2 font-mono">{product.id}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
