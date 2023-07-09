import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, TextInput, Keyboard } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { AppError } from "@utils/AppError";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { GroupRemoveByName } from "@storage/group/groupRemoveByName";
import { PlayerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
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
import { Loading } from "@components/Loading";

type RouteParams = {
  GROUP_NAME: string;
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();

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
      setIsLoading(true);
      const playersByTeam = await PlayersGetByGroupAndTeam(GROUP_NAME, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert('Jogadores', 'Não foi possível carregar as pessoas filtradas do time selecionado.')
    } finally {
      setIsLoading(false);
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

  async function groupRemove() {
    try {
      await GroupRemoveByName(GROUP_NAME);
      navigation.navigate("Groups");

    } catch (error) {
      console.log(error);
      Alert.alert('Remover grupo', 'Não foi possível remover o grupo.');

    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      'Remover',
      'Deseja remover o grupo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove() },
      ]
    )
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

      {
        isLoading ? <Loading /> :
          <FlatList
            data={players}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <PlayerCard name={item.name} onRemove={() => handlePlayerRemove(item.name)} />}
            ListEmptyComponent={() => <EmptyList message="Ainda não há pessoas nesse time!" />}
            contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
          />
      }

      <Button title="Remover Turma" type="SECONDARY" onPress={handleGroupRemove} />

    </Container>
  )
}