import * as prismicH from "https://cdn.skypack.dev/@prismicio/helpers";
import { client } from "./main.js";

const init = async () => {
    // Get homepage from Prismic
    const prismicDoc = await client.getSingle("home");
    let { overview_text } = prismicDoc.data;
    overview_text = prismicH.asHTML(overview_text);
    document.getElementById("page-content").innerHTML = overview_text;

    // Get posts from Prismic
    const posts = await client.getAllByType("posts");

    posts.forEach((post) => {
        // Format post fields
        const postName = `<a href="${post.url}.html">${prismicH.asHTML(
            post.data.post_title
        )}</a>`;
        const postDate = `<time datetime="${prismicH
            .asDate(post.first_publication_date)
            .toLocaleDateString("en-US")}">${prismicH
            .asDate(post.first_publication_date)
            .toLocaleDateString("en-GB")}</time>`;
        const postExcerpt = `<p>${post.data.post_content[0].text}</p>`;
        let postImage = prismicH.asImageWidthSrcSet(post.data.cover_image);
        postImage = `<img src="${postImage.src}" srcset="${postImage.srcset}" alt="${post.data.cover_image.alt}">`;

        // Append post section to the DOM
        const postContainer = document.getElementById("box-container");
        const postDiv = document.createElement("article");
        const postContent = document.createElement("div");
        postContent.setAttribute("class", "box-content");
        postContent.innerHTML = postName + postDate + postExcerpt;
        postDiv.appendChild(postContent);
        const postMedia = document.createElement("div");
        postMedia.setAttribute("class", "box-image");
        postMedia.innerHTML = postImage;
        postDiv.appendChild(postMedia);
        postContainer.appendChild(postDiv);
    });
};

init();
