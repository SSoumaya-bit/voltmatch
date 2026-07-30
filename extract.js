const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\ef5ce75a-cc8b-482d-bf7f-574e09d31622\\.system_generated\\logs\\transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('"type":"USER_INPUT"') && line.includes('Dyness Tower T7')) {
      const obj = JSON.parse(line);
      console.log(obj.content);
      return;
    }
  }
}
processLineByLine();
