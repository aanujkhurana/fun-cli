# life-clock

A simple CLI tool that visualizes the progress of your life based on your birthdate — with a clean progress bar and motivational insights. It's a fun and reflective way to stay mindful of time.

Whether you're planning your next big project or just need a gentle reminder to live intentionally, life-clock turns your terminal into a philosophical time tracker.

## ✨ Features

- 🔢 Calculates exact age in years
- 🟦 Displays life progress bar (customizable width)
- 📅 Assumes average life expectancy (default 79 years, override with flag)
- 💡 Shows random motivational quote (with support for custom quotes)
- 🔄 Option to show only once per day (perfect for .bashrc or .zshrc)

## 📦 Installation

```bash
# Install globally
npm install -g life-clock

# Or run directly with npx
npx life-clock
```

## 🚀 Usage

```bash
# Basic usage (will prompt for birthdate)
life-clock

# Provide birthdate directly (two equivalent options)
life-clock --birthdate 1990-01-01
life-clock --dob 1990-01-01

# Customize life expectancy (default: 79)
life-clock --dob 1990-01-01 --expectancy 85

# Customize progress bar width (default: 30)
life-clock --dob 1990-01-01 --width 40

# Show only once per day (great for .bashrc or .zshrc)
life-clock --dob 1990-01-01 --daily

# Add a custom motivational quote
life-clock --add-quote "Every day is a new opportunity to change your life."

# List all your saved quotes
life-clock --list-quotes
```

## 🔧 Options

```
-b, --birthdate <date>       Your birthdate in YYYY-MM-DD format
-d, --dob <date>             Your date of birth in YYYY-MM-DD format (alias for --birthdate)
-e, --expectancy <years>     Life expectancy in years (default: 79)
-w, --width <characters>     Width of the progress bar (default: 30)
--daily                      Show only once per day (great for .bashrc or .zshrc)
--add-quote <quote>          Add a custom motivational quote to your collection
--list-quotes                List all quotes in your collection
-V, --version                Output the version number
-h, --help                   Display help for command
```

## 📸 Screenshot

```
🎉 You're 29 years old
🧬 Estimated lifespan: 79 years
📊 Progress: 36.7% of life lived

███████████░░░░░░░░░░░░░░░░░░  36.7%

💡 Make it count. Start something today.
```

## 🔄 Daily Reminder

Add to your shell profile for a daily reminder of life's progress:

```bash
# Add to your .bashrc, .zshrc, or equivalent
life-clock --dob 1995-06-15 --daily
```

## 💬 Custom Quotes

You can add your own motivational quotes to personalize your experience:

```bash
# Add a custom quote
life-clock --add-quote "Your time is limited, don't waste it living someone else's life."

# View all your quotes
life-clock --list-quotes
```

Your quotes are stored in `~/.life-clock/quotes.json` and will be randomly displayed each time you run the tool.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

ISC
