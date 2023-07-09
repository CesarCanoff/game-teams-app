import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playersGetByGroup } from "./playersGetByGroup";

export async function PlayerRemoveByGroup(
  playerName: string,
  groupName: string
) {
  try {
    const storage = await playersGetByGroup(groupName);

    const filtered = storage.filter((player) => player.name !== playerName);
    const players = JSON.stringify(filtered);

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${groupName}`, players);
  } catch (error) {
    throw error;
  }
}
