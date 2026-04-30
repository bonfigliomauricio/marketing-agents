process.env.NODE_PATH = 'C:/dev/marketing-agents/node_modules';
require('module').Module._initPaths();

require('dotenv').config();
const { tavily } = require('@tavily/core');

const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const query = getArg('--query');
const topic = getArg('--topic') || 'general';
const maxResults = parseInt(getArg('--max_results') || '5', 10);

if (!query) {
  console.error('Usage: node tavily-search.js --query "your query" [--topic general|news] [--max_results 5]');
  process.exit(1);
}

if (!process.env.TAVILY_API_KEY) {
  console.error('Error: TAVILY_API_KEY environment variable not set.');
  process.exit(1);
}

async function main() {
  const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

  const response = await client.search(query, {
    topic,
    maxResults,
    includeAnswer: true,
  });

  console.log(JSON.stringify(response, null, 2));
}

main().catch((err) => {
  console.error('Tavily search failed:', err.message);
  process.exit(1);
});
