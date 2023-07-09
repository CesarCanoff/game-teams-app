import { ButtonIconTypeStyleProps, Container, Icon } from "./styles";
import { TouchableOpacityProps } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

type Props = TouchableOpacityProps & {
  type?: ButtonIconTypeStyleProps;
  icon: keyof typeof MaterialIcons.glyphMap;
  onHandle: () => void;
}

export function ButtonIcon({ type = 'PRIMARY', icon, onHandle }: Props) {
  return (
    <Container onPress={onHandle}>
      <Icon name={icon} type={type} />
    </Container>
  )
}