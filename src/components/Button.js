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
