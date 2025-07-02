#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const { program } = require('commander');
const inquirer = require('inquirer');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Motivational quotes
const defaultQuotes = [
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Life is what happens when you're busy making other plans.",
  "Time is the most valuable thing a man can spend.",
  "Yesterday is history, tomorrow is a mystery, but today is a gift. That's why it's called the present.",
  "The future depends on what you do today.",
  "Don't count the days, make the days count.",
  "Life isn't about finding yourself. Life is about creating yourself.",
  "Every moment is a fresh beginning.",
  "It's not the years in your life that count. It's the life in your years.",
  "The purpose of our lives is to be happy.",
  "Make it count. Start something today."
];

// Get local quotes if available
function getLocalQuotes() {
  const dataDir = path.join(os.homedir(), '.life-clock');
  const quotesFile = path.join(dataDir, 'quotes.json');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Check if quotes file exists
  if (fs.existsSync(quotesFile)) {
    try {
      const quotesData = fs.readFileSync(quotesFile, 'utf8');
      const localQuotes = JSON.parse(quotesData);
      
      if (Array.isArray(localQuotes) && localQuotes.length > 0) {
        return localQuotes;
      }
    } catch (error) {
      console.error(chalk.yellow('Warning: Could not read local quotes file. Using default quotes.'));
    }
  }
  
  return defaultQuotes;
}

// Get random quote
function getRandomQuote() {
  const quotes = getLocalQuotes();
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Calculate age and life progress
function calculateLifeProgress(birthdate, lifeExpectancy) {
  const today = moment();
  const birth = moment(birthdate, 'YYYY-MM-DD');
  
  // Calculate exact age
  const years = today.diff(birth, 'years');
  
  // Calculate progress percentage
  const ageInDays = today.diff(moment(birthdate, 'YYYY-MM-DD'), 'days');
  const totalDays = lifeExpectancy * 365.25; // Account for leap years
  const progressPercentage = (ageInDays / totalDays) * 100;
  
  return {
    years,
    progressPercentage: Math.min(progressPercentage, 100), // Cap at 100%
    formattedPercentage: Math.min(progressPercentage, 100).toFixed(1) // Formatted with 1 decimal place
  };
}

// Generate progress bar
function generateProgressBar(percentage, width) {
  const filledWidth = Math.round((percentage / 100) * width);
  const emptyWidth = width - filledWidth;
  
  const filled = '█'.repeat(filledWidth);
  const empty = '░'.repeat(emptyWidth);
  
  return `${filled}${empty}  ${percentage.toFixed(1)}%`;
}

// Check if already shown today (for --daily option)
function hasShownToday() {
  const dataDir = path.join(os.homedir(), '.life-clock');
  const lastRunFile = path.join(dataDir, 'last-run.txt');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    return false;
  }
  
  // Check if last run file exists
  if (fs.existsSync(lastRunFile)) {
    const lastRunDate = fs.readFileSync(lastRunFile, 'utf8').trim();
    const today = moment().format('YYYY-MM-DD');
    
    // If last run was today, don't show again
    if (lastRunDate === today) {
      return true;
    }
  }
  
  // Update last run file with today's date
  fs.writeFileSync(lastRunFile, moment().format('YYYY-MM-DD'));
  return false;
}

// Display life clock
function displayLifeClock(birthdate, lifeExpectancy, barWidth) {
  const { years, progressPercentage, formattedPercentage } = calculateLifeProgress(birthdate, lifeExpectancy);
  const progressBar = generateProgressBar(progressPercentage, barWidth);
  const quote = getRandomQuote();
  
  console.log('');
  console.log(chalk.cyan(`🎉 You're ${chalk.bold(years)} years old`));
  console.log(chalk.cyan(`🧬 Estimated lifespan: ${chalk.bold(lifeExpectancy)} years`));
  console.log(chalk.cyan(`📊 Progress: ${chalk.bold(formattedPercentage)}% of life lived`));
  console.log('');
  
  // Color the progress bar based on percentage
  let coloredBar;
  if (progressPercentage < 25) {
    coloredBar = chalk.green(progressBar);
  } else if (progressPercentage < 50) {
    coloredBar = chalk.blue(progressBar);
  } else if (progressPercentage < 75) {
    coloredBar = chalk.yellow(progressBar);
  } else {
    coloredBar = chalk.red(progressBar);
  }
  
  console.log(coloredBar);
  console.log('');
  
  console.log(chalk.magenta(`💡 ${chalk.italic(quote)}`));
  console.log('');
}

// Add a quote to local quotes file
function addQuote(quote) {
  if (!quote || quote.trim() === '') {
    console.log(chalk.red('Error: Quote cannot be empty'));
    return false;
  }
  
  const dataDir = path.join(os.homedir(), '.life-clock');
  const quotesFile = path.join(dataDir, 'quotes.json');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Get existing quotes or create new array
  let quotes = [];
  if (fs.existsSync(quotesFile)) {
    try {
      const quotesData = fs.readFileSync(quotesFile, 'utf8');
      quotes = JSON.parse(quotesData);
      
      if (!Array.isArray(quotes)) {
        quotes = [];
      }
    } catch (error) {
      console.error(chalk.yellow('Warning: Could not read local quotes file. Creating new file.'));
    }
  }
  
  // Add new quote if it doesn't already exist
  if (!quotes.includes(quote.trim())) {
    quotes.push(quote.trim());
    
    try {
      fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2), 'utf8');
      console.log(chalk.green('Quote added successfully!'));
      return true;
    } catch (error) {
      console.error(chalk.red('Error: Could not save quote'), error);
      return false;
    }
  } else {
    console.log(chalk.yellow('This quote already exists in your collection.'));
    return false;
  }
}

// List all quotes in the local quotes file
function listQuotes() {
  const quotes = getLocalQuotes();
  
  console.log(chalk.cyan('\n📚 Your Motivational Quotes Collection:\n'));
  
  if (quotes.length === 0) {
    console.log(chalk.yellow('No quotes found. Add some with --add-quote "Your quote here"'));
  } else {
    quotes.forEach((quote, index) => {
      console.log(chalk.white(`${index + 1}. ${chalk.italic(quote)}`));
    });
  }
  
  console.log(''); // Empty line at the end
}

// Reset quotes collection to defaults
function resetQuotes() {
  const dataDir = path.join(os.homedir(), '.life-clock');
  const quotesFile = path.join(dataDir, 'quotes.json');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  try {
    // Delete the quotes file if it exists
    if (fs.existsSync(quotesFile)) {
      fs.unlinkSync(quotesFile);
    }
    
    console.log(chalk.green('\n✅ Quotes collection has been reset to defaults\n'));
    return true;
  } catch (error) {
    console.error(chalk.red('\n❌ Error: Could not reset quotes collection'), error);
    return false;
  }
}

// Set up command line options
program
  .version('1.0.0')
  .description('A CLI tool that visualizes your life progress based on birthdate')
  .option('-b, --birthdate <date>', 'Your birthdate in YYYY-MM-DD format')
  .option('-d, --dob <date>', 'Your date of birth in YYYY-MM-DD format (alias for --birthdate)')
  .option('-e, --expectancy <years>', 'Life expectancy in years', 79)
  .option('-w, --width <characters>', 'Width of the progress bar', 30)
  .option('--daily', 'Show only once per day (great for .bashrc)')
  .option('--add-quote <quote>', 'Add a custom motivational quote to your collection')
  .option('--list-quotes', 'List all quotes in your collection')
  .option('--reset-quotes', 'Reset quotes collection to default quotes')
  .parse(process.argv);

const options = program.opts();

// If birthdate is not provided, prompt for it
async function main() {
  const options = program.opts();
  
  // Handle quote-related commands first
  if (options.addQuote) {
    addQuote(options.addQuote);
    return;
  }
  
  if (options.listQuotes) {
    listQuotes();
    return;
  }
  
  if (options.resetQuotes) {
    resetQuotes();
    return;
  }
  
  // Check if already shown today when --daily is used
  if (options.daily && hasShownToday()) {
    // Skip showing if already shown today
    return;
  }
  
  // Get birthdate from either --birthdate or --dob option
  let birthdate = options.birthdate || options.dob;
  let lifeExpectancy = parseInt(options.expectancy);
  let barWidth = parseInt(options.width);
  
  // Validate life expectancy and bar width
  if (isNaN(lifeExpectancy) || lifeExpectancy <= 0) {
    lifeExpectancy = 79; // Default
  }
  
  if (isNaN(barWidth) || barWidth <= 0) {
    barWidth = 30; // Default
  }
  
  // If birthdate not provided, prompt for it
  if (!birthdate) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'birthdate',
        message: 'Enter your birthdate (YYYY-MM-DD):',
        validate: function(input) {
          if (!moment(input, 'YYYY-MM-DD', true).isValid()) {
            return 'Please enter a valid date in YYYY-MM-DD format';
          }
          return true;
        }
      }
    ]);
    
    birthdate = answers.birthdate;
  } else {
    // Validate provided birthdate
    if (!moment(birthdate, 'YYYY-MM-DD', true).isValid()) {
      console.log(chalk.red('Error: Please provide a valid birthdate in YYYY-MM-DD format'));
      process.exit(1);
    }
  }
  
  // Display the life clock
  displayLifeClock(birthdate, lifeExpectancy, barWidth);
}

main().catch(err => {
  console.error(chalk.red('An error occurred:'), err);
  process.exit(1);
});