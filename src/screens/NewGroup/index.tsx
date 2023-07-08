import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { groupCreate } from "@storage/group/groupCreate";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/input";

import { useTheme } from "styled-components/native";
import { Container, Content, Icon } from "./styles";

export function NewGroup() {
  const theme = useTheme();
    
  const navigation = useNavigation();

  const [group, setGroup] = useState('');

  async function handleNew() {
    try {
      await groupCreate(group);
      navigation.navigate('Players', { GROUP_NAME: group })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />
        <Highlight
          title="Nova turma"
          subtitle="Crie a turma para adicionar as pessoas"
        />

        <Input
          placeholder="Nome da turma"
          placeholderTextColor={theme.COLORS.GRAY_300}
          onChangeText={setGroup}
        />

        <Button
          title="Criar"
          style={{ marginTop: 20 }}
          onPress={handleNew}
        />
      </Content>
    </Container>
  )
}