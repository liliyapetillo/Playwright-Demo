const fs = require('fs');
const path = require('path');

const resultsDir = path.resolve(__dirname, '../allure-results');
fs.mkdirSync(resultsDir, { recursive: true });

// Order matters: put suite categories first so they take precedence.
const categories = [
  {
    name: 'Suite: Contacts',
    matchedStatuses: ['failed', 'broken'],
    // Match by spec file name used as Allure suite label
    suiteNameRegex: '.*contacts\\.spec\\.ts'
  },
  {
    name: 'Suite: Auth',
    matchedStatuses: ['failed', 'broken'],
    suiteNameRegex: '.*auth\\.spec\\.ts'
  },
  {
    name: 'Suite: API',
    matchedStatuses: ['failed', 'broken'],
    suiteNameRegex: '.*api\\.spec\\.ts'
  },
  {
    name: 'Suite: E2E Smoke',
    matchedStatuses: ['failed', 'broken'],
    suiteNameRegex: '.*e2e-smoke\\.spec\\.ts'
  },
  {
    name: 'Product defects',
    matchedStatuses: ['failed'],
    messageRegex: '.*AssertionError.*|.*expect\(.*\).*|.*toContainText.*',
    traceRegex: '.*AssertionError.*|.*expect\(.*\).*'
  },
  {
    name: 'Test defects',
    matchedStatuses: ['failed', 'broken'],
    messageRegex: '.*locator.*not.*found.*|.*TypeError.*|.*ReferenceError.*|.*Cannot read property.*',
    traceRegex: '.*TypeError.*|.*ReferenceError.*|.*Cannot read property.*'
  },
  {
    name: 'Flaky tests',
    matchedStatuses: ['failed', 'broken'],
    messageRegex: '.*Timeout.*|.*Element is not visible.*|.*waiting for selector.*',
    traceRegex: '.*Timeout.*|.*waiting for selector.*'
  },
  {
    name: 'Infrastructure issues',
    matchedStatuses: ['failed', 'broken'],
    messageRegex: '.*ECONNREFUSED.*|.*ENOTFOUND.*|.*net::ERR.*|.*browser.*failed.*',
    traceRegex: '.*ECONNREFUSED.*|.*ENOTFOUND.*|.*net::ERR.*|.*browser.*failed.*'
  }
];

const target = path.join(resultsDir, 'categories.json');
fs.writeFileSync(target, JSON.stringify(categories, null, 2), 'utf8');
console.log(`Allure categories written to ${target}`);
