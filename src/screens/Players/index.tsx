import { useState } from "react";
import { FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/input";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { EmptyList } from "@components/EmptyList";
import { Button } from "@components/Button";

type RouteParams = {
  GROUP_NAME: string;
}

export function Players() {
  const [team, setTeam] = useState('TIME A');
  const [players, setPlayers] = useState([]);

  const route = useRoute();
  const { GROUP_NAME } = route.params as RouteParams;

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={GROUP_NAME}
        subtitle="Adicione a galera e separe os times"
      />

      <Form>
        <Input
          placeholder="Nome da pessoa"
          autoCorrect={false}
        />

        <ButtonIcon icon="add" />
      </Form>
      <HeaderList>
        <FlatList
          horizontal
          data={['TIME A', 'TIME B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      <FlatList
        data={players}
        keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PlayerCard name={item} onRemove={() => { }} />}
        ListEmptyComponent={() => <EmptyList message="Ainda não há pessoas nesse time!" />}
        contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
      />

      <Button title="Remover Turma" type="SECONDARY" />

    </Container>
  )
}