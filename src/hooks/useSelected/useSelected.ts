import { useCallback, useMemo, useState } from 'react';
import {
  SelectedObject,
  SelectFunction,
  SelectTypeEnum,
  UpdateFunction,
  UseSelectedProps,
  UseSelectedReturnValues,
} from './useSelected.types';

const useSelected = <DataType>(
  props: UseSelectedProps<DataType>
): UseSelectedReturnValues<DataType> => {
  const { data, selectType, getItemId, withAutoSelect = true } = props;
  const [selected, setSelected] = useState<SelectedObject>({});

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

  const selectData = useCallback(() => {
    const normalisedData = data.reduce<Record<string, DataType>>(
      (dataAsObject, item, index) => {
        const id =
          selectType === SelectTypeEnum.BY_ID ? memoisedGetItemId(item) : index;
        return {
          ...dataAsObject,
          [id]: item,
        };
      },
      {}
    );

    return Object.entries(selected).reduce<DataType[]>(
      (dataArray, [key, value]) => {
        if (value) {
          return [...dataArray, normalisedData[key]];
        }
        return dataArray;
      },
      []
    );
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
  };
};

export default useSelected;
