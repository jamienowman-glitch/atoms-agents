
# Roboto Flex Wiring Notes

## Integration Summary

All atoms have been upgraded to consume the shared typography system.

### Shared Typography Module
Located at: `aitom_family/_shared/typography/`
- **presets.ts**: Contains 20 presets parsed from `roboto_flex_presets.tsv`.
- **resolver.ts**: `resolveRobotoFlexVariation(tokens)` computes CSS `font-family` and `font-variation-settings`.
- **index.ts**: Exports the resolver and presets.

### Atom Wiring
For every atom (e.g. `aitom_family/<atom_id>`):
1. **Token Defaults**: `exposed_tokens/typography/default.ts` includes `preset: 'Regular'` and `axes: {}`.
2. **View Logic**: `views/View.tsx` imports `resolveRobotoFlexVariation`.
3. **CSS Injection**: The View computes `resolvedType` and applies it to the top-level style:
   ```typescript
   style={{
     '--ns-font-variation': resolvedType.fontVariationSettings,
     fontFamily: resolvedType.fontFamily,
     // ...
   }}
   ```
4. **CSS Usage**: `views/styles.css` uses:
   ```css
   font-family: "Roboto Flex", sans-serif; /* fallback */
   font-variation-settings: var(--ns-font-variation);
   ```

### Verification
The `verify_roboto_wiring.py` script confirms that `resolveRobotoFlexVariation` is used in the View.
Result: **YES** for all atoms.
