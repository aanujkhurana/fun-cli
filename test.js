#!/usr/bin/env node

// Simple test script for life-clock
const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.cyan('\n🧪 Testing life-clock...\n'));

try {
  // Test help command
  console.log(chalk.yellow('Testing help command:'));
  execSync('node index.js --help', { stdio: 'inherit' });
  console.log(chalk.green('✅ Help command works!\n'));

  // Test with DOB
  console.log(chalk.yellow('Testing with DOB:'));
  execSync('node index.js --dob 1995-06-15', { stdio: 'inherit' });
  console.log(chalk.green('✅ DOB parameter works!\n'));

  // Test with custom width
  console.log(chalk.yellow('Testing with custom width:'));
  execSync('node index.js --dob 1995-06-15 --width 20', { stdio: 'inherit' });
  console.log(chalk.green('✅ Width parameter works!\n'));

  // Test with custom expectancy
  console.log(chalk.yellow('Testing with custom expectancy:'));
  execSync('node index.js --dob 1995-06-15 --expectancy 90', { stdio: 'inherit' });
  console.log(chalk.green('✅ Expectancy parameter works!\n'));

  console.log(chalk.cyan('🎉 All tests passed! The package is ready for publication.\n'));
} catch (error) {
  console.error(chalk.red('❌ Test failed:'), error);
  process.exit(1);
}