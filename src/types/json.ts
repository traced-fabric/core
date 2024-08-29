export type JSONPrimitive = string | number | boolean | null | undefined;
export type JSONObject = { [_key: string]: JSONValue };
export type JSONArray = Array<JSONValue>;

export type JSONStructure = JSONObject | JSONArray;
export type JSONValue = JSONPrimitive | JSONStructure;
