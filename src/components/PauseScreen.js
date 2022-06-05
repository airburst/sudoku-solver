import styled from "styled-components";
import Button from "./Button";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: var(--selected-bg-color);
  color: #262626;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 10rem;
  width: 100%;
  max-width: 20rem;
  margin: 1rem;
  background-color: white;
  border-radius: 7px;
  box-shadow: 0 4px 23px 0 rgb(0 0 0 / 8%);
  padding: 2rem;
`;

const Message = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResumeButton = styled(Button)`
  height: 3rem;
  margin-bottom: 1rem;
`;

const PauseScreen = ({ resumePuzzle }) => {
  return (
    <Container>
      <Card>
        <Message>Your game has been paused</Message>
        <ResumeButton primary onClick={resumePuzzle}>
          Resume
        </ResumeButton>
      </Card>
    </Container>
  );
};

export default PauseScreen;
