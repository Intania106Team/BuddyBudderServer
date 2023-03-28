import { parse } from 'csv-parse';
import { readFileSync } from 'fs';

const rs = readFileSync(process.argv[0]);

const parser = parse(rs, {
  delimiter: ',',
  columns: true,
  quote: true,
  bom: true,
  trim: true,
});
console.log(parser);
