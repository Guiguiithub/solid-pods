// Import from "@inrupt/solid-client-authn-browser"
import {
    login,
    handleIncomingRedirect,
    getDefaultSession,
    fetch
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
    setThing
} from "@inrupt/solid-client";

import { SCHEMA_INRUPT, RDF, AS } from "@inrupt/vocab-common-rdf";

const buttonLogin = document.querySelector("#btnLogin");
const labelCreateStatus = document.querySelector("#labelCreateStatus");
let webId ;
let myPod ;

// 1a. Start Login Process. Call login() function.
function loginToSelectedIdP() {

    return login({
        oidcIssuer: "https://solidcommunity.net/",
        redirectUrl: new URL("/", window.location.href).toString(),
        clientName: "Getting started app"
    });
}

// 1b. Login Redirect. Call handleIncomingRedirect() function.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
    await handleIncomingRedirect(); // no-op if not part of login redirect

    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
        // Update the page with the status.
        webId = session.info.webId;

        getMyPods();
    }
}

// The example has the login redirect back to the root page.
// The page calls this method, which, in turn, calls handleIncomingRedirect.
handleRedirectAfterLogin();

// 2. Get Pod(s) associated with the WebID
async function getMyPods() {
    const mypods = await getPodUrlAll(webId, { fetch: fetch });

    // Update the page with the retrieved values.

    for (const podUrl of mypods){
        const readingLikeListUrl = `${podUrl}VideoGames/Like/myList`;
        const readingDislikeListUrl = `${podUrl}VideoGames/Dislike/myList`;
        try {
            const readingLikeList = await getSolidDataset(readingLikeListUrl, { fetch: fetch });
            const readingDislikeList = await getSolidDataset(readingDislikeListUrl, { fetch: fetch });
            const itemsLike = getThingAll(readingLikeList);
            const itemsDislike = getThingAll(readingDislikeList);

            let listcontent = `<h4>Reading List from ${podUrl}</h4>`;
            for (let i = 0; i < itemsLike.length; i++) {
                const item = getStringNoLocale(itemsLike[i], SCHEMA_INRUPT.name);
                if (item !== null) {
                    listcontent += `<p>${itemsLike[i].predicates['http://schema.org/name'].literals['http://www.w3.org/2001/XMLSchema#string'][0]}</p>`;
                }
            }
            for (let i = 0; i < itemsDislike.length; i++) {
                const item = getStringNoLocale(itemsDislike[i], SCHEMA_INRUPT.name);
                if (item !== null) {
                    listcontent += `<p>${itemsDislike[i].predicates['http://schema.org/name'].literals['http://www.w3.org/2001/XMLSchema#string'][0]}</p>`;
                }
            }

        } catch (error) {
            console.error(`Error fetching reading list from ${podUrl}:`, error);
        }
    }

    mypods.forEach((mypod) => {
        let podOption = document.createElement("option");
        podOption.textContent = mypod;
        podOption.value = mypod;
        myPod = podOption.value;
    });
}

// 3. Create the Reading List
async function createList() {
    labelCreateStatus.textContent = "";

    // For simplicity and brevity, this tutorial hardcodes the  SolidDataset URL.
    // In practice, you should add in your profile a link to this resource
    // such that applications can follow to find your list.
    const readingLikeListUrl = `${myPod}VideoGames/Like/myList`;
    const readingDislikeListUrl = `${myPod}VideoGames/Dislike/myList`;

    let titles = document.getElementById("titles").value.split("\n");

    // Fetch or create a new reading list.
    let myReadingList;

    try {
        // Attempt to retrieve the reading list in case it already exists.
        myReadingList = await getSolidDataset(readingDislikeListUrl, { fetch: fetch });
        // Clear the list to override the whole list
        /*
        let items = getThingAll(myReadingList);
        items.forEach((item) => {
            myReadingList = removeThing(myReadingList, item);
        });*/
    } catch (error) {
        if (typeof error.statusCode === "number" && error.statusCode === 404) {
            // if not found, create a new SolidDataset (i.e., the reading list)
            myReadingList = createSolidDataset();
        } else {
            console.error(error.message);
        }
    }

    // Add titles to the Dataset
    let i = readingDislikeListUrl.length;
    titles.forEach((title) => {
        if (title.trim() !== "") {
            let item = createThing({ name: "title" + i });
            item = addUrl(item, RDF.type, AS.Article);
            item = addStringNoLocale(item, SCHEMA_INRUPT.name, title);
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

        document.getElementById("savedtitles").value = listcontent;
    } catch (error) {
        console.log(error);
        labelCreateStatus.textContent = "Error" + error;
        labelCreateStatus.setAttribute("role", "alert");
    }
}

buttonLogin.onclick = function () {
    loginToSelectedIdP();
};