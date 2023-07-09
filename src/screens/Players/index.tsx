import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useRoute } from "@react-navigation/native";

import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { PlayersGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";

import { Input } from "@components/input";
import { Header } from "@components/Header";
import { Filter } from "@components/Filter";
import { Button } from "@components/Button";
import { EmptyList } from "@components/EmptyList";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { PlayerCard } from "@components/PlayerCard";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { Keyboard } from "react-native";
import { PlayerRemoveByGroup } from "@storage/player/playerRemoveByGroup";

type RouteParams = {
  GROUP_NAME: string;
}

export function Players() {
  const route = useRoute();

  const [team, setTeam] = useState('TIME A');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const { GROUP_NAME } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Novo membro', 'Informe o nome do membro para adicioná-lo.');
    }

    const newPlayer = { name: newPlayerName, team };

    try {
      await playerAddByGroup(newPlayer, GROUP_NAME);

      // Remove o foco do input.
      newPlayerNameInputRef.current?.blur();

      // Força o fechamento do teclado.
      Keyboard.dismiss();

      setNewPlayerName("");
      fetchPlayersByTeam();

    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo membro', error.message)
      } else {
        console.log(error);
        Alert.alert('Novo membro', "Não foi possível adicionar o membro ao grupo.");
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      const playersByTeam = await PlayersGetByGroupAndTeam(GROUP_NAME, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert('Jogadores', 'Não foi possível carregar as pessoas filtradas do time selecionado.')
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await PlayerRemoveByGroup(playerName, GROUP_NAME);
      fetchPlayersByTeam();
    } catch (error) {
      Alert.alert('Remover jogador', 'Não foi possível remover esse jogador');
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

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
          inputRef={newPlayerNameInputRef}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon icon="add" onHandle={handleAddPlayer} />
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
        keyExtractor={item => item.name}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PlayerCard name={item.name} onRemove={() => handlePlayerRemove(item.name)} />}
        ListEmptyComponent={() => <EmptyList message="Ainda não há pessoas nesse time!" />}
        contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
      />

      <Button title="Remover Turma" type="SECONDARY" onPress={handleAddPlayer} />

    </Container>
  )
}