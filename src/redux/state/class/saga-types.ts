import { createAction } from '@reduxjs/toolkit';

export const fetchMyClassesSagaAction = createAction<any | undefined>('@@class/FETCH_MY_CLASSES');
export const setCurrentClassSagaAction = createAction<any | undefined>('@@class/SET_CURRENT_CLASS');
