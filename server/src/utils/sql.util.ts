export const sql_where = (field: string, str: string | undefined) => (str ? `where ${field} = '${str}'` : `where ${field} is not null`);
export const sql_and = (field: string, str: string | undefined) => (str ? `and ${field} = '${str}'` : ``);
