// Import Prismic modules
import * as prismic from "https://cdn.skypack.dev/@prismicio/client";
import * as prismicH from "https://cdn.skypack.dev/@prismicio/helpers";

import("./pigLatin.js").then((module) => {
    module.translate("Hello");
});

// Connect to Prismic repository
const repoName = "onboarding-content-management";
const endpoint = prismic.getEndpoint(repoName);
const client = prismic.createClient(endpoint);

const init = async () => {
    // Get first document from Prismic
    const prismicDoc = await client.getFirst();
    const {
        post_title,
        post_content,
        cover_image,
        author_profile,
        code_snippet,
    } = prismicDoc.data;
    let pubDate = prismicDoc.first_publication_date;
    const group = prismicDoc;

    // Use HTML Serializer to render h2s as pig Latin and codespan as code
    const htmlSerializer = {
        heading2: ({ children }) => `<strong>${children}</strong>`,
        label: ({ children, key, type, node, text }) =>
            `<code class="${node.data.label}">${children}</code>`,
    };

    // Convert JSON to HTML
    const postTitle = prismicH.asHTML(post_title, null, htmlSerializer);
    const postContent = prismicH.asHTML(post_content);
    pubDate = prismicH.asDate(pubDate).toLocaleDateString("en-GB");
    const postImage = prismicH.asImageWidthSrcSet(cover_image, {
        duotone: ["red", "blue"],
    });

    // TODO: Why doesn't this work with pre only p? Applying label doesn't stick when saved.
    const codeSnippet = prismicH.asHTML(code_snippet, null, htmlSerializer);

    // Loop over Author Profile group
    const authorContainer = document.createElement("div");
    author_profile.forEach((author) => {
        // Render Author Profile fields
        const authorName = prismicH.asHTML(author.author_name);
        const authorBio = prismicH.asHTML(author.author_bio);
        let authorImage = prismicH.asImageWidthSrcSet(author.author_image);
        authorImage = `<img src="${authorImage.src}" srcset="${authorImage.srcset}" alt="${author.author_image.alt}">`;
        const authorWebsiteLink = prismicH.asLink(author.author_website_link);
        // Template Author Profile
        const authorDiv = document.createElement("div");
        authorDiv.innerHTML =
            authorName + authorBio + authorWebsiteLink + authorImage;
        authorContainer.appendChild(authorDiv);
    });

    // Template Prismic data
    const container = document.getElementById("container");
    const image = `<img src="${postImage.src}" srcset="${postImage.srcset}" alt="${cover_image.alt}">`;
    container.innerHTML =
        postTitle + pubDate + image + postContent + codeSnippet;
    authorContainer.setAttribute("id", "authorContainer");
    container.appendChild(authorContainer);
};

init();
