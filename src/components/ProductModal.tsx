import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, FileText, Scale, Settings, Truck, Zap } from 'lucide-react';
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
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl bg-card rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Left: Image & Key Info */}
                        <div className="w-full md:w-2/5 relative flex flex-col">
                            <div className="h-64 md:h-full relative overflow-hidden bg-black">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                                {product.image ? (
                                    <img
                                        src={`assets/${product.image}`}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/50 bg-secondary">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                                    <div className="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider uppercase bg-primary text-white rounded-lg shadow-lg shadow-primary/20">
                                        {product.category}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-1">{product.name}</h2>
                                    <p className="text-white/70 font-mono text-sm">{product.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Bento Grid Details */}
                        <div className="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto bg-background">
                            <div className="space-y-6">

                                {/* Section 1: Core Specs (Bento) */}
                                <div>
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">產品規格</h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        <SpecBox icon={<Scale />} label="重量" value={product.specs.weight} />
                                        <SpecBox icon={<Settings />} label="原料" value={product.specs.material} />
                                        <SpecBox icon={<Zap />} label="機台" value={product.specs.machine} />
                                        <SpecBox icon={<Truck />} label="廠商" value={product.specs.mold_maker} />
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                                        <SpecBox icon={<Settings />} label="CT 時間" value={product.specs.ct_time} />
                                        <SpecBox icon={<Settings />} label="組立時間" value={product.specs.assembly_time} />
                                        <SpecBox icon={<Settings />} label="加工組立" value={product.specs.post_process} colSpan={2} />
                                    </div>
                                </div>

                                {/* Section 2: Logistics */}
                                <div>
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">物流資訊</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-4 rounded-2xl bg-secondary/30 border border-secondary">
                                            <div className="text-xs text-muted-foreground mb-1">客戶</div>
                                            <div className="font-semibold text-foreground truncate">{product.specs.customer || '-'}</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-secondary/30 border border-secondary">
                                            <div className="text-xs text-muted-foreground mb-1">容器</div>
                                            <div className="font-semibold text-foreground">{product.specs.container || '-'}</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-secondary/30 border border-secondary">
                                            <div className="text-xs text-muted-foreground mb-1">月需求</div>
                                            <div className="font-semibold text-foreground">{product.specs.monthly_demand || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Critical Info & History */}
                                <div className="grid gap-4">
                                    {product.qc_points.length > 0 && (
                                        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                                            <h4 className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400 mb-3">
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                重點管制項目
                                            </h4>
                                            <ul className="space-y-2">
                                                {product.qc_points.map((point, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {product.history && (
                                        <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                                            <h4 className="flex items-center gap-2 font-bold text-orange-600 dark:text-orange-400 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                歷史異常回溯
                                            </h4>
                                            <p className="text-sm text-foreground/80 leading-relaxed">{product.history}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Section 4: Documents */}
                                <div>
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">相關文件</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {product.documents.map((doc, idx) => (
                                            <a
                                                key={idx}
                                                href={`assets/${doc.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all group shadow-sm text-sm font-medium"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <FileText size={16} className="text-primary" />
                                                    {doc.type}
                                                </span>
                                                <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </a>
                                        ))}
                                        {product.documents.length === 0 && (
                                            <div className="col-span-full text-center py-4 text-sm text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-secondary">
                                                尚無相關文件
                                            </div>
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

// Helper Component for Specs
const SpecBox = ({ icon, label, value, colSpan = 1 }: { icon: React.ReactNode, label: string, value?: string, colSpan?: number }) => (
    <div className={`p-3.5 rounded-2xl bg-secondary/50 border border-transparent hover:border-border transition-colors ${colSpan === 2 ? 'col-span-2' : ''}`}>
        <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
            {React.cloneElement(icon as React.ReactElement, { size: 14 })}
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <p className="font-semibold text-sm text-foreground truncate" title={value}>{value || '-'}</p>
    </div>
);
