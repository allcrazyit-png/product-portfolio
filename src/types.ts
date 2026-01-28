export interface ProductSpecs {
    weight: string;
    material: string;
    machine: string;
    ct_time: string;
    mold_maker: string;
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
    documents: Document[];
    tags: string[];
}
