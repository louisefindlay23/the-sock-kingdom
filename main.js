import * as prismic from "https://cdn.skypack.dev/@prismicio/client";
import * as prismicH from "https://cdn.skypack.dev/@prismicio/helpers";

// Connect to Prismic repository
const repoName = "onboarding-content-management";
const endpoint = prismic.getEndpoint(repoName);
const routes = [
    { type: "posts", path: "/:uid" },
    { type: "home", path: "/" },
];
export const client = prismic.createClient(endpoint, { routes });

const init = async () => {
    // Get homepage from Prismic
    const prismicDoc = await client.getSingle("home");
    let { overview_text } = prismicDoc.data;
    overview_text = prismicH.asHTML(overview_text);
    document.getElementById("page-content").innerHTML = overview_text;
};

init();
