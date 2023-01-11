import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export default function useBooleanState(
  defaultValue = false,
): [boolean, Dispatch<SetStateAction<boolean>>, VoidFunction, VoidFunction] {
  const [value, setValue] = useState(defaultValue);

  const setTrue = useCallback(() => setValue(true), []);

  const setFalse = useCallback(() => setValue(false), []);

  return [value, setValue, setTrue, setFalse];
}
