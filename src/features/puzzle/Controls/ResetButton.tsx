import Button from "@/components/Button";
import { useAppDispatch } from "@/hooks/redux";
import { reset } from "../puzzleSlice";

const ResetButton = () => {
  const dispatch = useAppDispatch();

  return <Button onClick={() => dispatch(reset())}>Reset</Button>;
};

export default ResetButton;
