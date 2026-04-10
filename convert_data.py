import csv
import json
import os

csv_file_path = '瑞全公司產品履歷.csv'
json_file_path = 'src/data/products.json'

products = []
seen_ids = set()

with open(csv_file_path, mode='r', encoding='utf-8-sig') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        product_id = row['品番']
        if product_id in seen_ids:
            continue
        seen_ids.add(product_id)

        product = {
            "id": product_id,
            "name": row['品名'],
            "category": row['車型'],
            "type": row.get('類別', ''),
            "description": f"{row['品名']} for {row['車型']}",
            "image": row['產品圖片'],
            "status": "Production",
            
            # Flat fields
            "weight": row['重量公差'],
            "material": row['原料編號'],
            "machine": row['生產機台'],
            "ct_time": row['CT時間(秒)'],
            "mold_maker": row['模具廠商'],
            "post_process": row.get('後加工組立', ''),
            "assembly_time": row.get('組立時間', ''),
            "container": row.get('出貨容器', ''),
            "capacity": row.get('收容數', ''),
            "monthly_demand": row.get('月需求量', ''),
            
            "qc_points": [
                row.get('重點管制1', ''),
                row.get('重點管制2', ''),
                row.get('重點管制3', '')
            ],
            "history": row.get('歷史異常回溯', ''),
            "documents": [],
            "tags": [row['車型'], row['原料編號']]
        }

        if row.get('作業標準書'):
             product['documents'].append({"type": "SOP", "url": row['作業標準書']})
        if row.get('檢查手順書'):
             product['documents'].append({"type": "QC", "url": row['檢查手順書']})
        if row.get('成形條件表'):
             product['documents'].append({"type": "Conditions", "url": row['成形條件表']})

        # Cleaning up
        product['qc_points'] = [x for x in product['qc_points'] if x]
        products.append(product)

with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(products, json_file, ensure_ascii=False, indent=2)

print(f"Converted {len(products)} products to {json_file_path} (Flat Structure)")
