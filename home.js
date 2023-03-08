import * as prismicH from "https://cdn.skypack.dev/@prismicio/helpers";
import { client } from "./main.js";
import { pigLatin } from "./pigLatin.js";

const init = async () => {
    // Get homepage from Prismic
    const prismicDoc = await client.getSingle("home");
    let { overview_text } = prismicDoc.data;
    overview_text = prismicH.asHTML(overview_text);
    document.getElementById("page-content").innerHTML = overview_text;

    // Get articles from Prismic
    const articles = await client.getAllByType("posts");

    articles.forEach((article) => {
        // Render Article fields
        const articleName = `<a href="${article.url}.html">${prismicH.asHTML(
            article.data.post_title
        )}</a>`;
        const articleDate = `<time datetime="${prismicH
            .asDate(article.first_publication_date)
            .toLocaleDateString("en-US")}">${prismicH
            .asDate(article.first_publication_date)
            .toLocaleDateString("en-GB")}</time>`;
        const articleExcerpt = `<p>${article.data.post_content[0].text}</p>`;
        let articleImage = prismicH.asImageWidthSrcSet(
            article.data.cover_image
        );
        articleImage = `<img src="${articleImage.src}" srcset="${articleImage.srcset}" alt="${article.data.cover_image.alt}">`;

        // Template Articles
        const articleContainer = document.getElementById("box-container");
        const articleDiv = document.createElement("article");
        const articleContent = document.createElement("div");
        articleContent.setAttribute("class", "box-content");
        articleContent.innerHTML = articleName + articleDate + articleExcerpt;
        articleDiv.appendChild(articleContent);
        const articleMedia = document.createElement("div");
        articleMedia.setAttribute("class", "box-image");
        articleMedia.innerHTML = articleImage;
        articleDiv.appendChild(articleMedia);
        articleContainer.appendChild(articleDiv);
    });
};

init();
