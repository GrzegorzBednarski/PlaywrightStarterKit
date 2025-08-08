const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { execSync } = require('child_process');
const {
  environments,
  testTypes,
  testGroups,
  grepGroups,
  grepExclude,
  reportPath,
} = require('../config/testRunnerConfig');

function runTests(args) {
  const { envKey, testTypeKey, grepKey, isUI, hasHelp, hasReport } = parseArgs(args);

  if (hasHelp) {
    showHelp(environments, testTypes, testGroups, grepGroups);
    process.exit(0);
  }

  if (hasReport) {
    const resolvedReportPath = path.resolve(reportPath);
    const reportIndexPath = path.join(resolvedReportPath, 'index.html');

    if (!fs.existsSync(reportIndexPath)) {
      console.error(`❌ Report not found at: ${reportIndexPath}\n`);
      console.log(
        '⚠️ Make sure you have run the tests and generated the report before opening it.'
      );
      console.log(
        '⚠️ Also verify that the "reportPath" is correctly configured in "config/testRunnerConfig.js"\n'
      );
      process.exit(1);
    }

    execSync(`npx playwright show-report ${resolvedReportPath}`, { stdio: 'inherit' });
    process.exit(0);
  }

  if (!envKey && !testTypeKey && !grepKey && !isUI) {
    console.log('No valid parameters detected.\n');
    showHelp(environments, testTypes, testGroups, grepGroups);
    process.exit(0);
  }

  if (isUI) {
    if (!envKey) {
      console.error('❌ Missing valid environment for UI mode.\n');
      listAvailable('env', environments);
      process.exit(1);
    }

    const envConfig = loadEnvironment(envKey);
    const command = `npx playwright test --ui --project=${envConfig.project}`;
    execSync(command, { stdio: 'inherit' });
    process.exit(0);
  }

  if (grepKey && testTypeKey) {
    console.error('❌ You cannot combine grepGroup with testType.\n');
    console.log('⚠️ Use either a test type/group or a grepGroup, not both.\n');
    process.exit(1);
  }

  if ((testTypeKey || grepKey) && !envKey) {
    console.error('❌ Missing environment.\n');
    listAvailable('env', environments);
    process.exit(1);
  }

  if (envKey && !testTypeKey && !grepKey) {
    console.error('❌ Missing test type or grepGroup.\n');
    listAvailable('testType', { ...testTypes, ...testGroups });
    listAvailableGrepGroups(grepGroups);
    process.exit(1);
  }

  const envConfig = loadEnvironment(envKey);
  const isVisual = testTypeKey === 'visual';
  const isGrouped = testGroups.hasOwnProperty(testTypeKey);
  const isGrepGroup = Object.values(grepGroups).includes(grepKey);

  if (grepKey && !isGrepGroup) {
    console.error(`❌ Unknown grepGroup pattern "${grepKey}"\n`);
    listAvailableGrepGroups(grepGroups);
    process.exit(1);
  }

  let testPaths = [];

  if (isGrepGroup) {
    const globalExclude = grepExclude || [];
    for (const [type, paths] of Object.entries(testTypes)) {
      if (globalExclude.includes(type)) continue;
      testPaths.push(...paths);
    }
  } else if (isGrouped) {
    for (const type of testGroups[testTypeKey]) {
      const paths = testTypes[type];
      if (!paths) {
        console.error(`❌ Unknown test type "${type}" in group "${testTypeKey}"`);
        process.exit(1);
      }
      testPaths.push(...paths);
    }
  } else {
    testPaths = testTypes[testTypeKey];
  }

  const label = testTypeKey || `grep:${grepKey}`;
  console.log(`✅ Running tests of type [${label}] on environment [${envKey}]\n`);

  if (isGrouped) {
    console.log(
      `⚠️ Test type [${testTypeKey}] is a group containing: ${testGroups[testTypeKey].join(', ')}\n`
    );
  }

  if (isGrepGroup) {
    const rawGrep = grepKey;
    const escapedGrep = escapeGrepPattern(rawGrep);
    console.log(`✅ Searching for tests matching pattern: ${rawGrep}`);
    if (Array.isArray(grepExclude) && grepExclude.length > 0) {
      console.log(`⚠️ Globally excluded test types: ${grepExclude.join(', ')}\n`);
    }
    process.env.ENV = envConfig.env;
    process.env.PERCY_TOKEN = process.env.PERCY_TOKEN || '';
    process.env.PERCY_BRANCH = process.env.PERCY_BRANCH || '';
    if (isVisual) validatePercyEnv();
    runPlaywrightTests(testPaths, envConfig, label, isVisual, escapedGrep);
    return;
  }

  process.env.ENV = envConfig.env;
  process.env.PERCY_TOKEN = process.env.PERCY_TOKEN || '';
  process.env.PERCY_BRANCH = process.env.PERCY_BRANCH || '';

  if (isVisual) {
    validatePercyEnv();
  }

  runPlaywrightTests(testPaths, envConfig, testTypeKey, isVisual);
}

function parseArgs(args) {
  const allTestTypes = { ...testTypes, ...testGroups };
  const grepKey = args.find(arg => arg.startsWith('grep:'))?.replace('grep:', '');
  return {
    envKey: args.find(arg => Object.keys(environments).includes(arg)),
    testTypeKey: args.find(arg => Object.keys(allTestTypes).includes(arg)),
    grepKey,
    isUI: args.includes('open'),
    hasHelp: args.includes('help'),
    hasReport: args.includes('report'),
  };
}

function escapeGrepPattern(pattern) {
  return pattern.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function loadEnvironment(envKey) {
  const envConfig = environments[envKey];
  const envFilePath = path.resolve(__dirname, `../env/.env.${envConfig.env}`);

  if (!fs.existsSync(envFilePath)) {
    console.error(`❌ Missing environment file: .env.${envConfig.env}`);
    process.exit(1);
  }

  delete process.env.PERCY_TOKEN;
  delete process.env.PERCY_BRANCH;

  dotenv.config({ path: envFilePath, quiet: true });
  return envConfig;
}

function validatePercyEnv() {
  if (!process.env.PERCY_TOKEN) {
    console.error('❌ Missing PERCY_TOKEN in .env file or variable is empty\n');
    process.exit(1);
  }

  if (!process.env.PERCY_BRANCH) {
    console.error('❌ Missing PERCY_BRANCH in .env file or variable is empty\n');
    process.exit(1);
  }
}

function runPlaywrightTests(testPaths, envConfig, label, isVisual, grepPattern = null) {
  const workersFlag = label === 'performance' ? '--workers=1' : '';
  const joinedPaths = testPaths.map(p => `"${p}"`).join(' ');
  const grepFlag = grepPattern ? `--grep="${grepPattern}"` : '';
  const baseCommand = `playwright test ${joinedPaths} ${grepFlag} --project=${envConfig.project} ${workersFlag}`;
  const command = isVisual ? `npx percy exec -- ${baseCommand}` : `npx ${baseCommand}`;

  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    process.exit(1);
  }
}

function showHelp(environments, testTypes, testGroups, grepGroups) {
  console.log('✅ Usage examples:\n');
  console.log('  npm run pw:test help               → shows help');
  console.log('  npm run pw:test report             → opens test report');
  console.log('  npm run pw:test [env] open         → launches UI mode for selected environment');
  console.log(
    '  npm run pw:test [env] [testType]   → runs tests of given type or group on selected environment'
  );
  console.log(
    '  npm run pw:test [env] [grepGroup]  → runs tests matching grepGroup pattern (e.g. grep:[smoke])\n'
  );

  listAvailable('env', environments);
  listAvailable('testType', { ...testTypes, ...testGroups });
  listAvailableGrepGroups(grepGroups);

  console.log('⚠️ Notes:');
  console.log('  - grepGroup refers to a tag in the test title, like [smoke] or [sanity]');
  console.log('  - grep groups automatically escape special characters');
  console.log('  - grepGroup cannot be combined with testType — use one or the other\n');
}

function listAvailable(label, items) {
  console.log(`✅ Available values for [${label}]:`);
  Object.keys(items).forEach(key => console.log(`  - ${key}`));
  console.log();
}

function listAvailableGrepGroups(grepGroups) {
  console.log('✅ Available values for [grepGroup]:');
  Object.values(grepGroups).forEach(pattern => {
    console.log(`  - grep:${pattern}`);
  });
  console.log();
}

module.exports = { runTests };
