'use client'

import { ReadonlyURLSearchParams } from "next/navigation";

export const queryFrom = (params: ReadonlyURLSearchParams, object: {[key: string]: (string | number)}) => {
  let paramsObject: {[key: string]: (string | number)} = {};
  params.forEach((value, key) => { paramsObject[key] = value });  
  paramsObject = {...paramsObject, ...object};
  const query = Object.entries(paramsObject).map(([key, value]) => `${key}=${value}`).join('&');
  return { query, params: paramsObject };
}
