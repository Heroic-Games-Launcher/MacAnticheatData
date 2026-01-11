import fs from "fs/promises";

async function updateGames() {
  const url =
    "https://raw.githubusercontent.com/AreWeAntiCheatYet/AreWeAntiCheatYet/master/games.json";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch games.json: ${response.statusText}`);
  }

  const games = await response.json();

  const updatedGames = games.map((game) => {
    const anticheats = Array.isArray(game.anticheats) ? game.anticheats : [];

    if (
      anticheats.includes("Easy Anti-Cheat") ||
      anticheats.includes("BattlEye")
    ) {
      game.status = "Denied";
    } else {
      game.status = "Unknown";
    }

    game.notes = [];
    game.updates = [];
    delete game.logo;
    delete game.native;
    delete game.reference;
    delete game.slug;

    return game;
  });

  await fs.writeFile(
    "games.json",
    JSON.stringify(updatedGames, null, 2),
    "utf-8"
  );

  console.log("games.json saved");
}

updateGames();
