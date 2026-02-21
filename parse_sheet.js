const fs = require('fs');

// Load shared strings
const ssXml = fs.readFileSync('d:/Repo/WWM/xlsx_extracted/xl/sharedStrings.xml', 'utf8');
const ssMatches = ssXml.match(/<si>[\s\S]*?<\/si>/g) || [];
const ss = ssMatches.map((si) => {
  const texts = si.match(/<t[^>]*>([^<]*)<\/t>/g) || [];
  return texts.map(t => t.replace(/<\/?t[^>]*>/g, '')).join('');
});

// Load Nameless sheet (sheet1.xml)
const sheetXml = fs.readFileSync('d:/Repo/WWM/xlsx_extracted/xl/worksheets/sheet1.xml', 'utf8');
const rows = sheetXml.match(/<row[^>]*>[\s\S]*?<\/row>/g) || [];

rows.forEach(row => {
  const rMatch = row.match(/r="(\d+)"/);
  const rowNum = rMatch ? rMatch[1] : '?';
  const cells = row.match(/<c[^>]*>[\s\S]*?<\/c>/g) || [];
  const vals = cells.map(c => {
    const addrMatch = c.match(/r="([A-Z]+\d+)"/);
    const addr = addrMatch ? addrMatch[1] : '?';
    const tMatch = c.match(/t="([^"]*)"/);
    const isShared = tMatch && tMatch[1] === 's';
    const vMatch = c.match(/<v>([^<]*)<\/v>/);
    const val = vMatch ? vMatch[1] : '';
    if (isShared && val !== '') return addr + ':' + ss[parseInt(val)];
    return addr + ':' + val;
  }).filter(v => v.indexOf(':') !== -1 && v.split(':')[1] !== '');
  if (vals.length > 0) console.log('Row ' + rowNum + ': ' + vals.join(' | '));
});
