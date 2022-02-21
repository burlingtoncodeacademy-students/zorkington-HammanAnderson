const { Sign } = require("crypto");
const { read } = require("fs");
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

/* ------------------ Boiler Plate //hope I didn't delete anything I wasn't supposed too this time-------------------- */

/* ---------- Player Object ------------ */
let player = {
  name: "player",
  inventory: [],
  currentArea: "",
};
/* ---------- Inventory Class Constructor ------------ */
//includes methods to allow player to inspect, read, take and drop items
class Inventory {
  constructor(itemName, itemDescription, readItem, possessable) {
    this.itemName = itemName;
    this.itemDescription = itemDescription;
    this.readItem = readItem;
    this.possessable = possessable;
  }
  inspect() {
    return this.itemDescription;
  }
  read() {
    return this.readItem;
  }
  take() {
    //add item into players inventory
    if (player.currentArea.areaItems.includes(this.itemName)) {
      //item can be taken
      if (this.possessable) {
        player.inventory.push(this.itemName);
      }
      //remove item from current Area
      player.currentArea.areaItems.splice(
        player.currentArea.areaItems.indexOf(this.itemName),
        1
      );
      //message to player
      return "You have added " + this.itemName + " to your backpack.";
    }
    //item unable to be taken
    else {
      return "You cannot take the " + this.itemName + ".";
    }
  }
  drop() {
    //remove items from players backpack
    player.inventory.splice(
      player.currentArea.areaItems.indexOf(this.itemName),
      1
    );
    console.log(`You have dropped the ${this.itemName} .`);
    //add item to area the player dropped it in
    player.currentArea.areaItems.push(this.itemName);
    //backpack contents when player asks
    if (player.inventory.length > 0) {
      return "You have " + player.inventory.join(",") + "inside your backpack.";
    } else return "Your backpack is empty.";
  }
}
/* ---------- Define each item ------------ */

//Beach Inventory
let note = new Inventory(
  "Note",
  "An old note that looks to be a journal entry.",
  "Day 152 of being alone on this island. I cannot keep my treasure safe any longer. The monkey king has gathered an army of primates to help steal my jewels. I fear if his army attack, I may not be able to defend myself...",
  true
);
let bottle = new Inventory(
  "Bottle",
  "A broken bottle that has been here some time",
  "The writing on the bottle is faint. It looks to say 1715 and property of Spain",
  false
);
let sign = new Inventory(
  "Sign",
  "An old sign made of wood.",
  "Beware the Monkey King!!! He only likes one color of banana...that is the only way to calm him down.",
  false
);
//Shore Inventory
let shells = new Inventory(
  "Shells",
  "A glistening pile of shells. What a strange formation they make. You push them aside revealing a machete",
  "You can't read shells....I'm thinking we may need to talk about your literacy skills.",
  false
);
let machete = new Inventory(
  "Machete",
  "A sharp machete, good for cutting down dense jungles and clearing paths.",
  "I'm unsure you know what reading means.",
  true
);
//Jungle Inventory
let leaves = new Inventory(
  "Leaves",
  "A large pile of leaves...are those snakes? Oh..wait just rubber snakes. Wait, who put those here???",
  "Again...its leaves...",
  false
);
//Tree Inventory
//goal to throw red banana at monkey king to unlock treasure room
//should monkey king be an object?
let redBanana = new Inventory(
  "Red Banana",
  "A large red banana! You have never seen such a site.",
  "You can't read a banana....can you?",
  true
);
let yellowBanana = new Inventory(
  "Yellow Banana",
  "A typical yellow banana.",
  "You can't read a banana....can you?",
  true
);
let blueBanana = new Inventory(
  "Blue Banana",
  "A small blue banana?We are definitely not in Kansas now.",
  "You can't read a banana....can you?",
  true
);
//Ship Inventory
let eyepatch = new Inventory(
  "Eye Patch",
  "How old is this thing? Wait, was this a pirate ship? I really thought the Eye Patch was a stereotype...",
  "There is no text on the Eye Patch",
  false
);
//Treasure Room Inventory
let treasure = new Inventory(
  //want possesion of treasure to end game
  "Treasure",
  "Rubies, Emeralds and Diamonds. Gold coins and jewelry.",
  "The coins have a date of 1715 etched on them.",
  true
);
/* ---------- Inventory LookUp Table --------- */
//inventory lookUp table
let inventoryLookUp = {
  note: note,
  bottle: bottle,
  sign: sign,
  shells: shells,
  machete: machete,
  leaves: leaves,
  "yellow banana": yellowBanana,
  "red banana": redBanana,
  "blue banana": blueBanana,
  "eye patch": eyepatch,
  treasure: treasure,
};
/*------------ Action StateMachine ------------*/
let actionStates = {
  move: ["move", "go"],
  inspect: ["inspect", "look", "view"],
  read: ["read"],
  take: ["take", "pick", "grab"],
  drop: ["drop", "leave"],
  give: ["give"],
};
/* ---------- Area(room) Class Constructor ------------ */
//includes map to allow player to move through game
class Area {
  constructor(areaName, areaDescription, areaInventory, isLocked, navigate) {
    this.areaName = areaName;
    this.areaDesription = areaDescription;
    this.areaInventory = areaInventory;
    //boolean values-- true/false needed
    this.isLocked = isLocked;
    this.navigate = navigate;
  }
  map() {
    //provide map for navigation
    console.log(
      `From the ${this.areaName} area, you can move to the ${this.navigate} area(s)`
    );
  }
  payerInventory() {
    if (player.inventory.length > 0) {
      console.log(`Your backpack holds: ${player.inventory.join(" ")}`);
    }
  }
}
/* ---------- Define each Area in Game and Properities ------------ */
let beach = new Area(
  "Beach",
  "You are standing on the white sands of Monkey Island. As the sun beats down on your face, you can hear the waves crash on the shore. You ponder why you agreed to explore this island...even with a map the likelyhood of surviving is slim.\nYou walk over to a sign closer to the jungle.In the sand you notice a broken bottle with a note sitting next to it.",
  "Note, Bottle, Sign",
  false,
  "Shore, Ship, Jungle"
);
let shore = new Area(
  "Shore",
  "You move so close to the incoming tide that you can feel the wet sand between your toes. As you stand there you notice a glimmer in the corner of your eye. A large pile of shells shimmers in the sun.",
  "Shells, Machete",
  false,
  "Shore"
);
let ship = new Area(
  "Ship",
  "A wrecked pirate ship stands before you. On the ground you see an eyepatch. As you climb onto the deck, you see an open door with what look to be several jewels and precious gems inside. However the entry becomes blocked by a giant purple monkey wearing a crown",
  "Eye Patch",
  false,
  "Beach,Treasure Room"
);
let jungle = new Area(
  "Jungle",
  "The jungle is dense and humid. There are piles of leaves and sticks on the ground. Perhaps this is where the monkeys normally reside.",
  "Leaves",
  true,
  "Beach, Treasure Room"
);
let tree = new Area(
  "Tree",
  "A plantation of banana trees opens up to your view. The bananas are many colors like yellow, red and blue. Thier shapes and sizes differ as well.",
  "Red Banana, Yellow Banana, Blue Banana",
  false,
  "Jungle"
);
let treasureRoom = new Area(
  "Treasure Room",
  "You have finally reached the treasure Room! Rubies, Emeralds and diamonds sit amongst piles of gold coins. You wonder if the monkey collected these items on his own or if they always belonged to the ship. Either way, you decide to take what you can of the treasure and head back to the mainland. Hmmm...now you crave a banana...",
  "treasure",
  true,
  "Beach,Treasure Room"
);
/* ---------- Area LookUp Table --------- */
//map lookUp table to map the area keyword to the object
let areaLookUp = {
  beach: beach,
  shore: shore,
  ship: ship,
  jungle: jungle,
  tree: tree,
  "treasure Room": treasureRoom,
};
/* ---------- Area State Machine --------- */
//state machine holds allowable navigation points
let areaStates = {
  beach: ["Shore", "Ship", "Jungle"],
  shore: ["Beach"],
  ship: ["Beach", "Treasure Room"],
  jungle: ["Beach", "Tree"],
  tree: ["Jungle"],
  treasureRoom: ["Ship"],
};

/*--------------------Game Play Below------------------------*/
///Actual game starts here. User input is needed for story to progress. User can use North, South, East or West to get to different locations. User has various actions to deal with items.
function start() {
  async function playGame() {
    //Introductory Text --- Set Up Story
    let intro =
      "Welcome to Monkey Island. Within the depths of the jungle it is told a tribe of monkeys rose to power and forced the locals to flee. It is said they guard a long lost treasure. Many treasure hunters have gone into the jungle...but none have come out.\nThankfully you have a [map] that can help you [move] on the island. If at anypoint you fear the hoards of monkeys, press [exit]. Are you ready for an adventure?.\n>_";

    let input = await ask(intro);

    while (input.toLowerCase().trim() !== "yes") {
      input = await ask(
        "Let me know when you are ready to find that treasure! Just enter yes!\n>_"
      );
    }
    while (input !== "exit") {
      if (input.toLowerCase().trim().includes("yes")) {
        player.currentArea = beach;
      }
      input = await ask(">_");
      //sanitize
      input = input.toLowerCase().trim();
      if (input === "exit") {
        console.log(
          "We understand....you too fear the monkeys. Safe journey friend."
        );
        process.exit();
      }
      ///Not exactly sure how to move player through game and have room unlock or let them make action. --- I know it has something to do with an array.
      //I know this code does not work. Just ran out of time once I finally understood what I needed / wanted to do. Does create infinate loop if you press yes....pointers appreciated
      //Will fix all comments for next submission 
      //(Also forgot how to commit so....that is why there is only the one.)
    }
  }
  playGame();
}
start();

process.exit();
