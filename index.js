const titlePlacard = `===================================================
__________             _
\\    ____/            | |
 |  |__   ___ ___ ____| | ___ _    __ ____  ____
 |   __| |   |   |  _ \\ |/ _ \\ \\  / /  __ \\/ __ \\
 |  |____| | | | | |_| || |_| | \\/ /|  ___|  ___|
/________\\_|\\_/|_|  __/_|\\___/ \\  /  \\_____\\_____\\
\\   \\  /   /     |_|           /_/
 |   \\/   | ____ ____   ____  ____  ____  ____
 |        |/ _  |  _ \\ / _  |/ _  |/ __ \\|  __\\
 |  |\\/|  | |_| | | | | |_| | |_| |  ____| |
/___|  |___\\____|_| |_|\\____|\\__  |\\_____|_|
                             |___/

===================================================`;

const cTable = require('console.table');
const promptUser = require("./utils/interface");

console.log(titlePlacard);
promptUser();
