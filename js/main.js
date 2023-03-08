import * as prismic from "https://cdn.skypack.dev/@prismicio/client";

// Connect to Prismic repository
const repoName = "onboarding-content-management";
const endpoint = prismic.getEndpoint(repoName);
const routes = [
    { type: "posts", path: "/posts/:uid" },
    { type: "home", path: "/" },
];
export const client = prismic.createClient(endpoint, { routes });
