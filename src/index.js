// Import from "@inrupt/solid-client-authn-browser"
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

import { SCHEMA_INRUPT, RDF, AS } from "@inrupt/vocab-common-rdf";

const buttonLogin = document.querySelector("#btnLogin");
const labelCreateStatus = document.querySelector("#labelCreateStatus");
let webId ;
let myPod ;
let username ;
let urlName;

function getPage(){
    let allPath = window.location.href.toString();
    if(allPath.includes("recommendation")){
        urlName = "/recommendation"
    } else {
        urlName = "/"
    }
}
// 1a. Start Login Process. Call login() function.
function loginToSelectedIdP() {
    getPage();
    return login({
        oidcIssuer: "https://solidcommunity.net/",
        redirectUrl: new URL(urlName, window.location.href).toString(),
        clientName: "Getting started app"
    });
}

async function isConnected() {
    let session = getDefaultSession();
    if (session.info.isLoggedIn) {
        webId = session.info.webId;
        await getUsername();
        document.getElementById('btnLogin').style.display = 'none';
        document.getElementById('userWebId').style.display = 'inline';
        document.getElementById('userWebId').innerText = username;
        getMyPods();
    }
}
async function handleRedirectAfterLogin() {
    /*
    let session = await getDefaultSession();
    session.events.on(EVENTS.SESSION_RESTORED, (url)=> {
        urlName = url;
        login({
        oidcIssuer: "https://solidcommunity.net/",
        redirectUrl: new URL(urlName, window.location.href).toString(),
        clientName: "Getting started app"})
    })
    */

    await handleIncomingRedirect(); // no-op if not part of login redirect
    await isConnected();
}

handleRedirectAfterLogin();

async function getUsername(){
    const myPods = await getPodUrlAll(webId, {fetch: fetch});
    for (const podUrl of myPods){
        const readingUsername = `${podUrl}profile/card` ;
        try {
            const readingUsernameList = await getSolidDataset(readingUsername, {fetch: fetch});
            const items = getThingAll(readingUsernameList);
            username = items[1].predicates["http://xmlns.com/foaf/0.1/name"].literals['http://www.w3.org/2001/XMLSchema#string'][0]

        } catch (error) {
            console.error(`Error fetching reading list from ${podUrl}:`, error);
        }
    }
}
// 2. Get Pod(s) associated with the WebID
async function getMyPods() {
    const mypods = await getPodUrlAll(webId, { fetch: fetch });

    for (const podUrl of mypods){
        const readingLikeListUrl = `${podUrl}VideoGames/Like/myList`;
        const readingDislikeListUrl = `${podUrl}VideoGames/Dislike/myList`;
        let readingLikeList
        let readingDislikeList

        try {
            readingLikeList = await getSolidDataset(readingLikeListUrl, { fetch: fetch });
            readingDislikeList = await getSolidDataset(readingDislikeListUrl, { fetch: fetch });

        } catch (error) {
            readingLikeList = createSolidDataset();
            let savedReadingList = await saveSolidDatasetAt(
                readingLikeListUrl,
                readingLikeList,
                { fetch: fetch }
            );
            readingDislikeList = createSolidDataset();
            let davedReadingList = await saveSolidDatasetAt(
            readingDislikeListUrl,
            readingDislikeList,
            { fetch: fetch }
            );
        }
    }
}

// 3. Create the Reading List
async function createList(ident) {
    labelCreateStatus.textContent = "";
    const readingLikeListUrl = `${myPod}VideoGames/Like/myList`;
    const readingDislikeListUrl = `${myPod}VideoGames/Dislike/myList`;

    // Fetch or create a new reading list.
    let myReadingList;

    try {
        myReadingList = await getSolidDataset(readingDislikeListUrl, { fetch: fetch });
        // Clear the list to override the whole list
        /*
        let items = getThingAll(myReadingList);
        items.forEach((item) => {
            myReadingList = removeThing(myReadingList, item);
        });*/
    } catch (error) {
        if (typeof error.statusCode === "number" && error.statusCode === 404) {
            myReadingList = createSolidDataset();
        } else {
            console.error(error.message);
        }
    }

    // Add titles to the Dataset
    let i = readingDislikeListUrl.length;
    ident.forEach((ident) => {
        if (ident.trim() !== "") {
            let item = createThing({ ident: "ident" + i });
            item = addUrl(item, RDF.type, AS.Article);
            item = addStringNoLocale(item, SCHEMA_INRUPT.name, ident);
            myReadingList = setThing(myReadingList, item);
            i++;
        }
    });

    try {
        // Save the SolidDataset
        let savedReadingList = await saveSolidDatasetAt(
            readingDislikeListUrl,
            myReadingList,
            { fetch: fetch }
        );

        labelCreateStatus.textContent = "Saved";

        // Refetch the Reading List
        savedReadingList = await getSolidDataset(readingDislikeListUrl, { fetch: fetch });

        let items = getThingAll(savedReadingList);

        let listcontent = "";
        for (let i = 0; i < items.length; i++) {
            let item = getStringNoLocale(items[i], SCHEMA_INRUPT.name);
            if (item !== null) {
                listcontent += item + "\n";
            }
        }
    } catch (error) {
        console.log(error);
    }
}

buttonLogin.onclick = function () {
    loginToSelectedIdP();
};