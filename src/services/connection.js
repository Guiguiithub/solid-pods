import {
    login,
    handleIncomingRedirect,
    events,
    getDefaultSession,
    fetch, EVENTS
} from "@inrupt/solid-client-authn-browser";

// Import from "@inrupt/solid-client"
import {
    addUrl,
    addStringNoLocale,
    createSolidDataset,
    createThing,
    getPodUrlAll,
    getSolidDataset,
    getThingAll,
    getStringNoLocale,
    removeThing,
    saveSolidDatasetAt,
    setThing, getUrl, createContainerAt
} from "@inrupt/solid-client";

let webId;
export function loginToPod(){
    return login({
        oidcIssuer: "https://solidcommunity.net/",
        redirectUrl: new URL("/", window.location.href).toString(),
        clientName: "Video Game"
    })
}

async function isConnected() {
    let session = getDefaultSession();
    if (session.info.isLoggedIn) {
        webId = session.info.webId;
        localStorage.setItem("webId", webId);
        let toPodStorage = await getPodUrlAll(webId, {fetch: fetch})
        localStorage.setItem("myPod", toPodStorage);
    }
}

async function handleRedirectAfterLogin(){
    await handleIncomingRedirect({restorePreviousSession:true}); // no-op if not part of login redirect
    await isConnected();
}

handleRedirectAfterLogin();

export async function getUsername(){
    const myPods = await getPodUrlAll(webId, {fetch: fetch});
    for (const podUrl of myPods){
        const readingUsername = `${podUrl}profile/card` ;
        try {
            const readingUsernameList = await getSolidDataset(readingUsername, {fetch: fetch});
            const items = getThingAll(readingUsernameList);
            console.log(items)
            return items[1].predicates["http://xmlns.com/foaf/0.1/name"].literals['http://www.w3.org/2001/XMLSchema#string'][0]

        } catch (error) {
            console.error(`Error fetching reading list from ${podUrl}:`, error);
        }
    }
}