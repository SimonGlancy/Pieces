import { useCallback, useMemo, useState } from 'react';
import {
  SelectedObject,
  SelectFunction,
  SelectTypeEnum,
  UpdateFunction,
  UseSelectedProps,
  UseSelectedReturnValues,
} from './useSelected.types';
import { normaliseData } from './utils';

const useSelected = <DataType>(
  props: UseSelectedProps<DataType>
): UseSelectedReturnValues<DataType> => {
  const { data, selectType, getItemId, withAutoSelect = true } = props;
  const [selected, setSelected] = useState<SelectedObject>({});

  const selectCount = useMemo(() => Object.values(selected).filter((i) => i).length, [selected]);
  const dataTotal = useMemo(() => data.length, [data]);
  const allSelected = useMemo(() => selectCount === dataTotal, [selectCount, dataTotal]);

  const memoisedGetItemId = useMemo(() => getItemId, [getItemId]);

  // Could I curry this to get cleaner implementation in select and deselect
  const updateValue: UpdateFunction<DataType> = useCallback(
    (item, index, value) => {
      switch (selectType) {
        case SelectTypeEnum.BY_ID: {
          const id = memoisedGetItemId(item);
          return setSelected((prev) => ({ ...prev, [id]: value }));
        }
        case SelectTypeEnum.BY_INDEX: {
          return setSelected((prev) => ({ ...prev, [index]: value }));
        }
      }
    },
    [selectType, memoisedGetItemId]
  );

  const select: SelectFunction<DataType> = useCallback(
    (item, index) => {
      updateValue(item, index, true);
    },
    [updateValue]
  );

  const deselect: SelectFunction<DataType> = useCallback(
    (item, index) => {
      updateValue(item, index, false);
    },
    [updateValue]
  );

  const getIsSelected = useCallback(
    (item, index) => {
      switch (selectType) {
        case SelectTypeEnum.BY_ID: {
          const id = memoisedGetItemId(item);
          return selected[id];
        }
        case SelectTypeEnum.BY_INDEX: {
          return selected[index];
        }
      }
    },
    [selected, selectType]
  );

  const toggle: SelectFunction<DataType> = useCallback(
    (item, index) => {
      getIsSelected(item, index) ? deselect(item, index) : select(item, index);
    },
    [select, getIsSelected, deselect]
  );

  const clear = useCallback(() => {
    setSelected({});
  }, []);

  const selectAll = useCallback(() => {
    const normalisedData = normaliseData(data, memoisedGetItemId, selectType, true);
    setSelected(normalisedData);
  }, [data, memoisedGetItemId]);

  const toggleSelectAll = useCallback(() => {
    allSelected ? clear() : selectAll();
  }, [allSelected, selectAll, clear]);

  const getNormalisedData = useCallback(
    () => normaliseData(data, memoisedGetItemId, selectType, 'item') as Record<string, DataType>,
    [data, selectType, memoisedGetItemId]
  );

  const selectData = useCallback(() => {
    const normalisedData = getNormalisedData();

    return Object.entries(selected).reduce<DataType[]>((dataArray, [key, value]) => {
      if (value) {
        return [...dataArray, normalisedData[key]];
      }
      return dataArray;
    }, []);
  }, [selected, data, memoisedGetItemId]);

  const selectedData = useMemo(() => {
    if (withAutoSelect) {
      return selectData();
    }
  }, [selected, data, memoisedGetItemId]);

  return {
    select,
    deselect,
    selected,
    getIsSelected,
    toggle,
    selectedData,
    selectData,
    clear,
    selectAll,
    selectCount,
    dataTotal,
    allSelected,
    toggleSelectAll,
    getNormalisedData,
  };
};

export default useSelected;
