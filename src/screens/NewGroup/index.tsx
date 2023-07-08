import { useNavigation } from "@react-navigation/native";
import { Container, Content, Icon } from "./styles";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/input";
import { useState } from "react";

export function NewGroup() {
  const navigation = useNavigation();

  const [group, setGroup] = useState('');

  function handleNew() {
    navigation.navigate('Players', { GROUP_NAME: group })
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