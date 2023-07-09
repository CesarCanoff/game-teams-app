import { useTheme } from "styled-components/native";
import { Container } from "./styles";
import { TextInput, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  inputRef?: React.RefObject<TextInput>
}

export function Input({ inputRef, ...rest }: Props) {
  const theme = useTheme();

  return (
    <Container
      ref={inputRef}
      placeholderTextColor={theme.COLORS.GRAY_300}
      {...rest} />
  );
}