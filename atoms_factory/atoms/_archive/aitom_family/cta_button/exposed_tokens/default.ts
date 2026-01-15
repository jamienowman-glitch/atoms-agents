import { SCHEMA } from './schema';

export const DEFAULTS = {
    ...SCHEMA,
    // Explicit overrides can go here if the schema structure is just type definition, 
    // but in our lightweight JS model, SCHEMA acts as default structure too.
};
