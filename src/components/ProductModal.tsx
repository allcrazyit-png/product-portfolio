import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, FileText, Scale, Settings, Truck } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <AnimatePresence>
            {product && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 bg-muted relative">
                            {product.image ? (
                                <img
                                    src={`images/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
                                    <p className="text-muted-foreground font-mono">{product.id}</p>
                                </div>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-secondary/50 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                            <Scale size={16} />
                                            <span className="text-xs font-medium">重量</span>
                                        </div>
                                        <p className="font-semibold">{product.specs.weight}</p>
                                    </div>
                                    <div className="p-3 bg-secondary/50 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                            <Settings size={16} />
                                            <span className="text-xs font-medium">原料</span>
                                        </div>
                                        <p className="font-semibold">{product.specs.material}</p>
                                    </div>
                                    <div className="p-3 bg-secondary/50 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                            <Settings size={16} />
                                            <span className="text-xs font-medium">機台</span>
                                        </div>
                                        <p className="font-semibold">{product.specs.machine}</p>
                                    </div>
                                    <div className="p-3 bg-secondary/50 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                            <Truck size={16} />
                                            <span className="text-xs font-medium">模具廠商</span>
                                        </div>
                                        <p className="font-semibold">{product.specs.mold_maker || '-'}</p>
                                    </div>
                                </div>

                                {/* Documents */}
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <FileText size={18} />
                                        相關文件
                                    </h3>
                                    <div className="space-y-2">
                                        {product.documents.map((doc, idx) => (
                                            <a
                                                key={idx}
                                                href={`sop/${doc.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors group"
                                            >
                                                <span className="text-sm font-medium">{doc.type}</span>
                                                <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                            </a>
                                        ))}
                                        {product.documents.length === 0 && (
                                            <p className="text-sm text-muted-foreground italic">無相關文件</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
