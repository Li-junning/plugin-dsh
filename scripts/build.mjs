import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = name => readFileSync(path.join(root,name),"utf8");
const css = read("src/boot.css");
const uri = "data:image/png;base64," + readFileSync(path.join(root,"assets/crest.png")).toString("base64");
const client = read("src/boot.js").replace("__STADIUM_CODE__", () => read("src/stadium.js")).replace("__BOOT_CSS__",JSON.stringify(css)).replace("__CREST_URI__",JSON.stringify(uri));
mkdirSync(path.join(root,"lib"),{recursive:true});
writeFileSync(path.join(root,"lib/client.js"),client);
console.log("Built self-contained client:", Buffer.byteLength(client), "bytes");


