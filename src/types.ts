export interface Product {
    id: string;
    name: string;
    category: string;
    type?: string;
    description: string;
    image: string;
    status: string;
    
    // Flattened specs
    weight?: string;
    material?: string;
    machine?: string;
    ct_time?: string;
    mold_maker?: string;
    post_process?: string;
    assembly_time?: string;
    container?: string;
    capacity?: string;
    monthly_demand?: string;
    
    qc_points: string[];
    history: string;
    documents: { type: string; url: string }[];
    tags: string[];
}
