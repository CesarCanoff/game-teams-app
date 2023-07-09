import { playersGetByGroup } from "@storage/player/playersGetByGroup";

export async function PlayersGetByGroupAndTeam(
  groupName: string,
  team: string
) {
  try {
    const storage = await playersGetByGroup(groupName);

    const players = storage.filter((player) => player.team === team);

    return players;
  } catch (error) {
    throw error;
  }
}
