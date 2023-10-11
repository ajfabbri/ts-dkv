import { init, Ditto, Collection, Document, DocumentID, LiveQueryEvent, LiveQuery} from "@dittolive/ditto";

const APP_ID = process.env?.DITTO_APP_ID;
const PG_TOKEN = process.env?.DITTO_PG_TOKEN;
const DOC_ID = new DocumentID("ts-ditto-dkv-example");
const DOC_QUERY = `_id == ${DOC_ID.toQueryCompatibleString()}`;

let exiting = false;
let debug = false;

// These are in outer scope to prevent GC (when this is made interactive).
let ditto: Ditto;

function dprint(...args: any[]) {
    if (debug) {
        console.log(...args);
    }
}

async function make_ditto() : Promise<Ditto> {
    await init()
    ditto = new Ditto({
        type: "onlinePlayground",
        appID: APP_ID ?? "",
        token: PG_TOKEN ?? "",
    })
    return ditto;
}

type MaybeString = string | null;

async function get_val(collection: Collection, key: string) : Promise<MaybeString> {
    let res = collection.find(DOC_QUERY);
    let docs = await res.limit(1).exec();
    return docs[0]?.value?.[key] ?? null;
}

async function set_val(collection: Collection, key: string, value: string) : Promise<DocumentID> {
    // Update should perform better than upsert, but we'd need to handle 
    // the new document creation case.
    let doc = {_id: DOC_ID, [key]: value};
    let doc_id = await collection.upsert(doc);
    dprint(`upsert: doc_id = ${doc_id}`);
    return doc_id;
}

function usage() {
    console.log("Usage: node main.js --get <key> | --set <key> <value> | --list");
}

function xor(a: boolean, b: boolean) {
    return a != b;
}

async function liveQueryCb(docs: Document[],
                           event: LiveQueryEvent,
                           // @ts-ignore
                           signalNext?: () => void )
{
    let eventType = event.isInitial ? "initial" : "update";
    console.log(`[${eventType}] ${docs.length} ${docs}`);
}

async function main() {
    let liveQuery: LiveQuery | null = null;
    let argv = require('minimist')(process.argv.slice(2));
    if (argv["verbose"]) {
        debug = true;
    }
    dprint("args", argv);
    let get = argv["get"] != undefined && argv?.["_"].length == 0;
    let set = argv["set"] != undefined && argv?.["_"].length == 1;
    let list = argv["list"] != undefined;
    let watch = argv["watch"] != undefined;
    // Exactly one command allowed
    if (! xor(xor(xor(get, set), list), watch)) {
        usage();
    } else if (!(APP_ID && PG_TOKEN)) {
        console.log("DITTO_APP_ID and DITTO_PG_TOKEN must be set in environment.");
    } else {
        process.on('SIGINT', () => {
            console.log("Exiting (SIGINT)..");
            exiting = true;
        });

        let d = await make_ditto();
        d.startSync();
        try {
            let collection = d.store.collection("dkv");
            if (list) {
                let res = await collection.find(DOC_QUERY).exec();
                // print out res one by one
                for (let doc of res) {
                    console.log(doc.value);
                }
            } else if (get) {
                let key = argv["get"];
                let res = await get_val(collection, key);
                let val = res ?? "<null>";
                console.log(`${key} = ${val}`);
            } else if (set) {
                let key = argv["set"];
                let value = argv["_"][0];
                let doc_id = await set_val(collection, key, value);
                dprint(`Set ${key} = ${value} (doc_id ${doc_id})`);
            } else if (watch) {
                liveQuery = collection.find(DOC_QUERY)
                    .observeLocal(liveQueryCb);
                while (! exiting) {
                    await new Promise(r => setTimeout(r, 100));
                }
            }
        } finally {
            liveQuery?.stop();
            d.stopSync();
        }
    }
}

main()
