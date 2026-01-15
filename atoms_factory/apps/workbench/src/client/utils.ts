import { TokenCatalogItem } from './api';

export function buildTree(catalog: TokenCatalogItem[]) {
    const tree: any = {};
    const meta: Record<string, TokenCatalogItem> = {};

    catalog.forEach(item => {
        const path = item.token_key.split('.');
        const key = item.token_key;

        meta[key] = item;

        let current = tree;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) current[path[i]] = {};
            current = current[path[i]];
        }
        current[path[path.length - 1]] = item.value;
    });

    return { tree, meta };
}
