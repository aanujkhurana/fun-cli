#!/usr/bin/env node

const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.cyan('\n🎉 Welcome to life-clock installer!\n'));
console.log(chalk.yellow('This script will help you set up life-clock for daily use.'));

rl.question(chalk.green('\nEnter your birthdate (YYYY-MM-DD): '), (birthdate) => {
  // Validate birthdate format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
    console.log(chalk.red('\n❌ Invalid date format. Please use YYYY-MM-DD format.'));
    rl.close();
    return;
  }

  console.log(chalk.yellow('\nWould you like to add life-clock to your shell profile for daily reminders?'));
  rl.question(chalk.green('(y/n): '), (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      // Determine shell profile file
      const homeDir = os.homedir();
      let shellProfilePath;
      
      if (fs.existsSync(path.join(homeDir, '.zshrc'))) {
        shellProfilePath = path.join(homeDir, '.zshrc');
      } else if (fs.existsSync(path.join(homeDir, '.bashrc'))) {
        shellProfilePath = path.join(homeDir, '.bashrc');
      } else if (fs.existsSync(path.join(homeDir, '.bash_profile'))) {
        shellProfilePath = path.join(homeDir, '.bash_profile');
      } else {
        console.log(chalk.red('\n❌ Could not find a shell profile file (.zshrc, .bashrc, or .bash_profile).'));
        console.log(chalk.yellow('\nYou can manually add the following line to your shell profile:'));
        console.log(chalk.cyan(`\nlife-clock --dob ${birthdate} --daily\n`));
        rl.close();
        return;
      }

      // Add command to shell profile
      try {
        const command = `\n# life-clock daily reminder\nlife-clock --dob ${birthdate} --daily\n`;
        fs.appendFileSync(shellProfilePath, command);
        console.log(chalk.green(`\n✅ Successfully added life-clock to ${shellProfilePath}`));
        console.log(chalk.yellow('\nRestart your terminal or run the following command to see it in action:'));
        console.log(chalk.cyan(`\nsource ${shellProfilePath}\n`));
      } catch (error) {
        console.log(chalk.red(`\n❌ Error adding to shell profile: ${error.message}`));
        console.log(chalk.yellow('\nYou can manually add the following line to your shell profile:'));
        console.log(chalk.cyan(`\nlife-clock --dob ${birthdate} --daily\n`));
      }
    } else {
      console.log(chalk.yellow('\nYou can run life-clock manually with:'));
      console.log(chalk.cyan(`\nlife-clock --dob ${birthdate}\n`));
    }
    
    rl.close();
  });
});

rl.on('close', () => {
  console.log(chalk.cyan('\nThank you for installing life-clock! 🎉\n'));
});