const { notionBlocksToHtml } = require("../utils/notion-blocks-to-html");
const { fetchPage } = require("../utils/fetch-notion-blocks");
const { Client } = require("@notionhq/client");
const fetch = require("node-fetch");

exports.handler = async (event, context, callback) => {
  const pageId = event.queryStringParameters.id;

  const postData = JSON.parse(event.body);

  const textToAdd = postData.text;

  const integrationKey = event.headers.authorization.split(" ")[1];

  const notionClient = new Client({
    auth: integrationKey,
  });

  notionClient.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Added from shortcut",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: textToAdd,
              },
            },
          ],
        },
      },
    ],
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
