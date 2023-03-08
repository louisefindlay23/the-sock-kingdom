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

    // Get articles from Prismic
    const articles = await client.getAllByType("posts");
    console.info(articles);

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
        const articleContainer = document.getElementById("articles");
        const articleDiv = document.createElement("article");
        const articleContent = document.createElement("div");
        articleContent.setAttribute("class", "article-content");
        articleContent.innerHTML = articleName + articleDate + articleExcerpt;
        articleDiv.appendChild(articleContent);
        const articleMedia = document.createElement("div");
        articleMedia.setAttribute("class", "article-image");
        articleMedia.innerHTML = articleImage;
        articleDiv.appendChild(articleMedia);
        articleContainer.appendChild(articleDiv);
    });
};

init();
