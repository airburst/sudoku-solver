import styled from "styled-components";

const StyledButton = styled.button`
  padding: 0.5rem 2rem;
  border: 0;
  border-radius: 3px;
  background-color: var(--btn-color);
  color: white;
  cursor: pointer;
`;

const Button = (props) => {
  const { children, ...otherProps } = props;

  return <StyledButton {...otherProps}>{children}</StyledButton>;
};

export default Button;
