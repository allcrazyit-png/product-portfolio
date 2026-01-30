import csv
import json
import os

csv_file_path = '瑞全公司產品履歷.csv'
json_file_path = 'src/data/products.json'

products = []

with open(csv_file_path, mode='r', encoding='utf-8-sig') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        # Map CSV fields to JSON structure
        product = {
            "id": row['品番'],
            "name": row['品名'],
            "category": row['車型'], # Assuming '車型' is a good category, or maybe '客戶'
            "description": f"{row['品名']} for {row['車型']}", # Generating a description
            "image": row['產品圖片'],
            "status": "Production", # Default status
            "specs": {
                "weight": row['標準重量(g)'],
                "material": row['原料編號'],
                "machine": row['生產機台'],
                "ct_time": row['CT時間(秒)'],
                "mold_maker": row['模具廠商'],
                "post_process": row.get('後加工組立', ''),
                "assembly_time": row.get('組立時間', ''),

                "container": row.get('出貨容器', ''),
                "capacity": row.get('收容數', ''),
                "monthly_demand": row.get('月需求量', '')
            },
            "qc_points": [
                row.get('重點管制1', ''),
                row.get('重點管制2', ''),
                row.get('重點管制3', '')
            ],
            "history": row.get('歷史異常回溯', ''),
            "documents": [],
            "tags": [row['車型'], row['原料編號']]
        }

        # Add documents
        docs = ['檢查手順書', '作業標準書', '成形條件表']
        # The CSV has multiple PDF columns at the end, let's look at the actual CSV header again.
        # Header: ...,成形條件表,作業標準書,檢查手順書
        # And the values look like: G92D1-VU010_qc1.pdf, G92D1-VU010_qc2.pdf, ...
        # Actually the CSV I saw earlier had multiple columns for PDF?
        # Let's re-examine the CSV content from the view_file output.
        # 1: ...成形條件表,作業標準書,檢查手順書
        # 2: ...G92D1-VU010_qc1.pdf,G92D1-VU010_qc2.pdf,G92D1-VU010_qc3.pdf
        # It seems the headers don't perfectly align or there are repeated headers??
        # The last 3 columns in line 2 seem to correspond to the last 3 headers.
        
        if row.get('作業標準書'):
             product['documents'].append({"type": "SOP", "url": row['作業標準書']})
        if row.get('檢查手順書'):
             product['documents'].append({"type": "QC", "url": row['檢查手順書']})
        if row.get('成形條件表'):
             product['documents'].append({"type": "Conditions", "url": row['成形條件表']})

        # Cleaning up empty strings
        product['specs'] = {k: v for k, v in product['specs'].items() if v}
        product['qc_points'] = [x for x in product['qc_points'] if x]
        products.append(product)

with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(products, json_file, ensure_ascii=False, indent=2)

print(f"Converted {len(products)} products to {json_file_path}")
