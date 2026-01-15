
export default [
    {
        ignores: ["dist", "node_modules", "**/*.d.ts"]
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
        },
        rules: {
            "no-unused-vars": "off"
        }
    }
];
