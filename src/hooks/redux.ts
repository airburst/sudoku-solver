import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "@/store";

/**
 * Typed dispatch hook for use throughout the app
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed selector hook for use throughout the app
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
