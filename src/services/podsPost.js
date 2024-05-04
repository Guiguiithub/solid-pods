import {
    addStringNoLocale,
    addUrl, createSolidDataset,
    createThing, getPodUrlAll, removeThing,
    getSolidDataset, getThingAll,
    saveSolidDatasetAt,
    setThing
} from "@inrupt/solid-client";
import {fetch} from "@inrupt/solid-client-authn-browser";
import {AS, RDF, SCHEMA_INRUPT} from "@inrupt/vocab-common-rdf";


export async function getListLikePods(myPod){
    const readingLikeListUrl = `${myPod}VideoGames/Like/myList`;
    return await myPods(readingLikeListUrl)
}
export async function getListDislikePods(myPod){
    const readingDislikeListUrl = `${myPod}VideoGames/Dislike/myList`;
    return await myPods(readingDislikeListUrl)
}
export function addToLikeList(ident, myPod, name){
    const readingLikeListUrl = `${myPod}VideoGames/Like/myList`;
    createList(ident, readingLikeListUrl, name);
}
export function addToDislikeList(ident, myPod, name){
    const readingDislikeListUrl = `${myPod}VideoGames/Dislike/myList`;
    createList(ident, readingDislikeListUrl, name);
}
export function removeLikeList(ident, myPod){
    const readingLikeListUrl = `${myPod}VideoGames/Like/myList`;
    deleteElement(ident, readingLikeListUrl);
}
export function removeDislikeList(ident, myPod){
    const readingDislikeListUrl = `${myPod}VideoGames/Dislike/myList`;
    deleteElement(ident, readingDislikeListUrl);
}

async function myPods(myPod){
    let list = [];

    let readingList
    try{
        readingList = await getSolidDataset(myPod, { fetch: fetch });

        let items = getThingAll(readingList);
        items.forEach((item) =>{
            list.push(item.predicates["http://schema.org/identifier"].literals["http://www.w3.org/2001/XMLSchema#string"][0])
        })
        return list
    }catch (error){
        if (typeof error.statusCode === "number" && error.statusCode === 404){
            //Create the list if not existing
            readingList = createSolidDataset();
            let savedReadingList = await saveSolidDatasetAt(
                myPod,
                readingList,
                { fetch: fetch }
            );
            return ""
        }
        console.log(error)
    }
}
async function deleteElement(ident, list){
    let myReadingList;
    try {
        myReadingList = await getSolidDataset(list, {fetch: fetch});

        let items = getThingAll(myReadingList);
        items.forEach((item) =>{
            console.log(item)
            if(item.predicates["http://schema.org/identifier"].literals["http://www.w3.org/2001/XMLSchema#string"][0] === ident){
                myReadingList = removeThing(myReadingList, item);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
    try {
        // Save the SolidDataset
        let savedReadingList = await saveSolidDatasetAt(
            list,
            myReadingList,
            { fetch: fetch }
        );
    } catch (error) {
        console.log(error);
    }
}
async function createList(ident, list, name) {
        // Fetch or create a new reading list.
        let myReadingList;
        try {
            myReadingList = await getSolidDataset(list, { fetch: fetch });
        } catch (error) {
            console.error(error.message);
        }

        // Add titles to the Dataset
        let i = list.length;
        let item = createThing({ ident: "ident" + i });
        item = addUrl(item, RDF.type, AS.Article);
        item = addStringNoLocale(item, SCHEMA_INRUPT.name, name);
        item = addStringNoLocale(item, SCHEMA_INRUPT.identifier, ident);
        myReadingList = setThing(myReadingList, item);

        try {
            // Save the SolidDataset
            let savedReadingList = await saveSolidDatasetAt(
                list,
                myReadingList,
                { fetch: fetch }
            );
        } catch (error) {
            console.log(error);
        }
    }