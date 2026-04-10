import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    if (!product) return null;

    const [previewDoc, setPreviewDoc] = React.useState<string | null>(null);

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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                        className="relative z-20 w-full max-w-4xl bg-background-light dark:bg-background-dark rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {product.name} <span className="text-slate-400 font-mono text-lg ml-2">#{product.id}</span>
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                                        生產中
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">分類：{product.category}</span>
                                    {product.type && (
                                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                            {product.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Section 1: Specs */}
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">precision_manufacturing</span>
                                            生產規格
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                            <SpecItem label="CT 時間" value={product.ct_time} />
                                            <SpecItem label="重量" value={product.weight} />
                                            <SpecItem label="原料編號" value={product.material} isRawMaterial />
                                            <SpecItem label="機台" value={product.machine} isLink />
                                            <SpecItem label="組裝時間" value={product.assembly_time} />
                                            <SpecItem label="模具廠商" value={product.mold_maker} isLink />
                                        </div>
                                    </section>

                                    {/* Section 2: Logistics */}
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">inventory_2</span>
                                            包裝物流
                                        </h3>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-sm">
                                            <LogisticsItem icon="box" label="出貨容器" value={product.container} />
                                            <LogisticsItem icon="widgets" label="收容數" value={product.capacity} />
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-6">
                                    {/* Section 3: Documents */}
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">description</span>
                                            技術文件
                                        </h3>
                                        <div className="flex flex-col gap-3">
                                            {product.documents.map((doc, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setPreviewDoc(doc.url)}
                                                    className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary hover:shadow-sm dark:hover:border-primary transition-all text-left"
                                                >
                                                    <div className={`h-10 w-10 rounded flex items-center justify-center shrink-0 ${doc.type.includes('PDF') ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                                                        <span className="material-symbols-outlined">{doc.type.includes('PDF') ? 'picture_as_pdf' : 'article'}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{doc.type}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">點擊預覽文件</p>
                                                    </div>
                                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">visibility</span>
                                                </button>
                                            ))}
                                            {product.documents.length === 0 && (
                                                <div className="text-center py-6 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 text-sm">
                                                    尚無相關文件
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {/* Section 4: Preview */}
                                    <section>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">部件預覽</h3>
                                        <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group cursor-pointer shadow-sm">
                                            {product.image ? (
                                                <img
                                                    src={`assets/${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-6xl text-slate-300">image</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                                <div className="bg-white/90 dark:bg-slate-900/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                                    <span className="material-symbols-outlined text-slate-900 dark:text-white">zoom_in</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                關閉窗口
                            </button>
                            <button className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                編輯規格
                            </button>
                        </div>

                        {/* Document Preview Modal */}
                        <AnimatePresence>
                            {previewDoc && (
                                <div className="absolute inset-0 z-[60] flex flex-col bg-background">
                                    <div className="flex items-center justify-between p-4 border-b bg-card">
                                        <h3 className="font-bold">文件預覽</h3>
                                        <button
                                            onClick={() => setPreviewDoc(null)}
                                            className="p-2 rounded-full hover:bg-secondary transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="flex-1 bg-muted p-4 overflow-hidden">
                                        <iframe
                                            src={`assets/${previewDoc}`}
                                            className="w-full h-full rounded-xl border bg-white shadow-sm"
                                            title="Document Preview"
                                        />
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Helper Components
const SpecItem = ({ label, value, isLink = false, isRawMaterial = false }: { label: string, value?: string, isLink?: boolean, isRawMaterial?: boolean }) => (
    <div className="bg-white dark:bg-slate-800 p-4">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center gap-2">
            {isRawMaterial && <span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>}
            <p className={`text-sm font-bold ${isLink ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                {value || '-'}
            </p>
        </div>
    </div>
);

const LogisticsItem = ({ icon, label, value }: { icon: string, label: string, value?: string }) => (
    <div className="flex items-start gap-4 p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg">
        <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0 text-primary">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate">{value || '-'}</p>
        </div>
    </div>
);
