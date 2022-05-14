export default async (request, context) => {
  // Read the value of a cookie
  const DATABASE_ID = Deno.env.get("NOTION_DATABASE_ID");
  const authValue = request.headers.get("Authorization");

  const notionResponse = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: authValue, // pass on the authorization header from our request
        "Content-Type": "application/json",
        "Notion-Version": "2022-02-22",
      },
      body: JSON.stringify({
        filter: {
          or: [
            {
              property: "Tags",
              multi_select: {
                contains: "Reading list",
              },
            },
          ],
        },
        sorts: [{ timestamp: "created_time", direction: "descending" }],
      }),
    }
  );

  if (!notionResponse.ok) {
    return null;
  }

  const notionResponseJson = await notionResponse.json();
  const results = notionResponseJson.results;

  const simpleResults = results.map((result) => {
    return {
      title: result.properties.Name.title[0].plain_text,
      id: result.id,
    };
  });

  return context.json(simpleResults);
};
