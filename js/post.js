import * as prismicH from "https://cdn.skypack.dev/@prismicio/helpers";
import { client } from "./main.js";
import { pigLatin } from "./pigLatin.js";

const init = async () => {
    // Get current post document from Prismic by UID
    let uid = window.location.pathname;
    uid = uid.substring(uid.lastIndexOf("/") + 1);
    uid = uid.split(".")[0];
    const prismicDoc = await client.getByUID("posts", uid);

    const {
        post_title,
        post_content,
        cover_image,
        author_profile,
        code_snippet,
    } = prismicDoc.data;
    let pubDate = prismicDoc.first_publication_date;

    // Use HTML Serializer to render h2s as pig Latin and codespan as code
    const htmlSerializer = {
        heading2: ({ children }) => `<h2>${pigLatin(children)}</h2>`,
        label: ({ children, node }) =>
            `<code class="${node.data.label}">${children}</code>`,
    };

    // Format post fields
    const postTitle = prismicH.asHTML(post_title, null, htmlSerializer);
    const postContent = prismicH.asHTML(post_content);
    pubDate = `<time datetime="${prismicH
        .asDate(pubDate)
        .toLocaleDateString("en-US")}">${prismicH
        .asDate(pubDate)
        .toLocaleDateString("en-GB")}</time>`;
    const postImage = prismicH.asImageWidthSrcSet(cover_image, {
        duotone: ["black", "white"],
    });

    // TODO: Why doesn't this work with pre only p? Applying label doesn't stick when saved.
    const codeSnippet = prismicH.asHTML(code_snippet, null, htmlSerializer);

    // Loop over Author Profile group
    const authorContainer = document.getElementById("box-container");
    author_profile.forEach((author) => {
        // Render Author Profile fields
        const authorName = prismicH.asHTML(author.author_name);
        const authorBio = prismicH.asHTML(author.author_bio);
        let authorImage = prismicH.asImageWidthSrcSet(author.author_image);
        authorImage = `<img src="${authorImage.src}" srcset="${authorImage.srcset}" alt="${author.author_image.alt}">`;
        const authorWebsiteLink = `<a href="${prismicH.asLink(
            author.author_website_link
        )}">${prismicH.asText(author.author_website_text)}</a>`;
        // Template Author Profile
        const authorDiv = document.createElement("div");
        const authorContent = document.createElement("div");
        authorContent.setAttribute("class", "box-content");
        authorContent.innerHTML = authorName + authorBio + authorWebsiteLink;
        authorDiv.appendChild(authorContent);
        const authorMedia = document.createElement("div");
        authorMedia.setAttribute("class", "box-image");
        authorMedia.innerHTML = authorImage;
        authorDiv.appendChild(authorMedia);
        authorContainer.appendChild(authorDiv);
    });

    // Template Prismic data
    const image = `<img src="${postImage.src}" srcset="${postImage.srcset}" alt="${cover_image.alt}">`;
    const postMeta = document.getElementById("post-meta");
    postMeta.innerHTML = postTitle + pubDate + image;
    const contentDiv = document.getElementById("post-content");
    contentDiv.innerHTML = postContent + codeSnippet;
};

init();
