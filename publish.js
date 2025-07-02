#!/usr/bin/env node

const chalk = require('chalk');
const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.cyan('\n📦 life-clock npm publish helper\n'));

// Check if user is logged in to npm
try {
  execSync('npm whoami', { stdio: 'pipe' });
  console.log(chalk.green('✅ You are logged in to npm'));
} catch (error) {
  console.log(chalk.red('❌ You are not logged in to npm'));
  console.log(chalk.yellow('Please run `npm login` first and then run this script again.'));
  process.exit(1);
}

// Read current version from package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(chalk.yellow(`\nCurrent version: ${currentVersion}`));
console.log(chalk.yellow('Choose version bump type:'));
console.log(chalk.cyan('1. Patch (1.0.0 -> 1.0.1) - Bug fixes'));
console.log(chalk.cyan('2. Minor (1.0.0 -> 1.1.0) - New features'));
console.log(chalk.cyan('3. Major (1.0.0 -> 2.0.0) - Breaking changes'));
console.log(chalk.cyan('4. Custom version'));

rl.question(chalk.green('\nEnter your choice (1-4): '), (choice) => {
  let versionArg;
  
  switch (choice) {
    case '1':
      versionArg = 'patch';
      break;
    case '2':
      versionArg = 'minor';
      break;
    case '3':
      versionArg = 'major';
      break;
    case '4':
      rl.question(chalk.green('\nEnter custom version (e.g., 1.2.3): '), (customVersion) => {
        try {
          execSync(`npm version ${customVersion} --no-git-tag-version`, { stdio: 'inherit' });
          publishPackage();
        } catch (error) {
          console.log(chalk.red(`\n❌ Error setting version: ${error.message}`));
          rl.close();
        }
      });
      return;
    default:
      console.log(chalk.red('\n❌ Invalid choice. Please run the script again.'));
      rl.close();
      return;
  }
  
  if (versionArg) {
    try {
      execSync(`npm version ${versionArg} --no-git-tag-version`, { stdio: 'inherit' });
      publishPackage();
    } catch (error) {
      console.log(chalk.red(`\n❌ Error bumping version: ${error.message}`));
      rl.close();
    }
  }
});

function publishPackage() {
  rl.question(chalk.yellow('\nReady to publish to npm? (y/n): '), (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      try {
        console.log(chalk.cyan('\n📦 Publishing to npm...'));
        execSync('npm publish', { stdio: 'inherit' });
        console.log(chalk.green('\n✅ Package published successfully!'));
      } catch (error) {
        console.log(chalk.red(`\n❌ Error publishing package: ${error.message}`));
      }
    } else {
      console.log(chalk.yellow('\n📦 Publication cancelled.'));
    }
    rl.close();
  });
}

rl.on('close', () => {
  console.log(chalk.cyan('\nThank you for using life-clock! 🎉\n'));
});