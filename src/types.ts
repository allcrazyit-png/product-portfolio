export interface ProductSpecs {
    weight: string;
    material: string;
    machine: string;
    ct_time: string;
    mold_maker: string;
    post_process?: string;
    customer?: string;
    assembly_time?: string;
    container?: string;
    capacity?: string;
    monthly_demand?: string;
}

export interface Document {
    type: string;
    url: string;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    status: string;
    specs: ProductSpecs;
    qc_points: string[];
    history: string;
    documents: Document[];
    tags: string[];
}
