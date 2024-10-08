import { TransformFnParams } from 'class-transformer/types/interfaces';
import { MaybeType } from '../types/maybe.type';

export const lowerCaseTransformer = (
  params: TransformFnParams,
): MaybeType<string> => params.value?.toLowerCase().trim();

export const groupBy = <T, K extends keyof any>(
  array: T[],
  key: (item: T) => K,
): Record<K, T[]> => {
  return array.reduce(
    (result, currentValue) => {
      const groupKey = key(currentValue);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentValue);
      return result;
    },
    {} as Record<K, T[]>,
  );
};
