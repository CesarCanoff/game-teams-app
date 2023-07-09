import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Container } from './styles';

import { Header } from '@components/Header';
import { Button } from '@components/Button';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { EmptyList } from '@components/EmptyList';
import { groupsGetAll } from '@storage/group/groupsGetAll';

export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('NewGroup');
  }

  function handleOpenGroup(groupName: string) {
    navigation.navigate('Players', { GROUP_NAME: groupName })
  }

  async function fetchGroups() {
    try {
      const data = await groupsGetAll();

      setGroups(data);
    } catch (error) {
      console.log(error);

    }
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []))

  return (
    <Container>
      <Header />

      <Highlight
        title='Turmas'
        subtitle='Jogue com a sua turma'
      />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => <GroupCard title={item} onPress={() => handleOpenGroup(item)} />}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        ListEmptyComponent={() => (
          <EmptyList message="Cadastre a primeira turma!" />
        )}
      />

      <Button
        title='Criar nova turma'
        onPress={handleNewGroup}
      />

    </Container>
  );
}