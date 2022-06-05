import styled from "styled-components";

const StyledButton = styled.button`
  border: 2px solid var(--btn-color);
  border-radius: 5px;
  background-color: var(--btn-color);
  cursor: pointer;
  font-size: 1.5rem;
  width: 100%;
  height: 100%;

  padding: ${({ size }) => (size === "large" ? "0.5rem 2rem" : "0.5rem")};
  background-color: ${({ primary }) =>
    !!primary ? "var(--btn-color)" : "white"};
  color: ${({ primary }) => (!!primary ? "#262626" : "#464646")};
`;

const Button = (props) => {
  const { children, ...otherProps } = props;

  return <StyledButton {...otherProps}>{children}</StyledButton>;
};

export default Button;

const PauseButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 100%;
  border: 0;
  background-color: transparent;
`;

export const PauseButton = (props) => {
  return (
    <PauseButtonWrapper {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88">
        <path d="M61.44 0c16.97 0 32.33 6.88 43.44 18 11.12 11.12 18 26.48 18 43.44 0 16.97-6.88 32.33-18 43.44-11.12 11.12-26.48 18-43.44 18-16.97 0-32.33-6.88-43.44-18C6.88 93.77 0 78.41 0 61.44S6.88 29.11 18 18C29.11 6.88 44.47 0 61.44 0zM42.3 39.47h13.59v43.95H42.3V39.47zm24.69 0h13.59v43.95H66.99V39.47zm30.43-14.01c-9.21-9.21-21.93-14.9-35.98-14.9-14.05 0-26.78 5.7-35.98 14.9-9.21 9.21-14.9 21.93-14.9 35.98s5.7 26.78 14.9 35.98c9.21 9.21 21.93 14.9 35.98 14.9 14.05 0 26.78-5.7 35.98-14.9 9.21-9.21 14.9-21.93 14.9-35.98s-5.69-26.78-14.9-35.98z" />
      </svg>
    </PauseButtonWrapper>
  );
};
