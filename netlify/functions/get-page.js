const { notionBlocksToHtml } = require("../utils/notion-blocks-to-html");
const { fetchPage } = require("../utils/fetch-notion-blocks");
const { Client } = require("@notionhq/client");
const fetch = require("node-fetch");

exports.handler = async (event, context, callback) => {
  const pageId = event.queryStringParameters.id;

  console.log(event.headers);

  const integrationKey = event.headers.authorization.split(" ")[1];

  const notionClient = new Client({
    auth: integrationKey,
  });

  const pageData = await fetchPage(pageId, notionClient);

  return {
    statusCode: 200,
    body: JSON.stringify({
      html: notionBlocksToHtml(pageData.children),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
