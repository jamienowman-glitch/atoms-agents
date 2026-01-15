
import { TokenCatalogItem } from '../client/api';

export interface DraftDiff {
    [token_key: string]: {
        patch: Partial<TokenCatalogItem>;
        comment: string;
        timestamp: number;
    };
}

const STORAGE_KEY = 'atoms_factory:token_catalog_draft_diff:v1';

export const DraftDiffManager = {
    getDiff(): DraftDiff {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    saveDiff(diff: DraftDiff) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(diff));
    },

    updateDiff(tokenKey: string, patch: Partial<TokenCatalogItem>, comment: string) {
        const diff = this.getDiff();
        diff[tokenKey] = {
            patch: { ...(diff[tokenKey]?.patch || {}), ...patch },
            comment: comment || diff[tokenKey]?.comment || 'Updated via Workbench',
            timestamp: Date.now()
        };
        this.saveDiff(diff);
    },

    clearDiff() {
        localStorage.removeItem(STORAGE_KEY);
    },

    applyDiffToCatalog(catalog: TokenCatalogItem[], diff: DraftDiff): TokenCatalogItem[] {
        const newCatalog = [...catalog];
        Object.keys(diff).forEach(key => {
            const index = newCatalog.findIndex(item => item.token_key === key);
            if (index !== -1) {
                newCatalog[index] = { ...newCatalog[index], ...diff[key].patch };
            } else {
                // New item
                newCatalog.push(diff[key].patch as TokenCatalogItem);
            }
        });
        return newCatalog;
    }
};
