import { useEffect, useState } from "react";
import styled from "styled-components";

const HeaderBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 48px;
  background-color: var(--btn-color);
  color: white;
  padding-left: 1rem;
  font-size: 1.5rem;
`;

const TimerBar = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  // Convert seconds into time format hh:mm:ss
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  const timeString =
    hours === 0
      ? `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`
      : `${hours.toString()}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;

  return <HeaderBar>{timeString}</HeaderBar>;
};

export default TimerBar;
