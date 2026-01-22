#!/usr/bin/env node
/**
 * Filter X/Twitter bookmarks JSON by date range
 * Usage: node filter-bookmarks.js <input.json> [options]
 *
 * Options:
 *   --from YYYY-MM-DD   Include bookmarks from this date (inclusive)
 *   --to YYYY-MM-DD     Include bookmarks up to this date (inclusive)
 *   -o, --output FILE   Output file (default: stdout)
 */

const fs = require('fs');

function parseTwitterDate(dateStr) {
    // Twitter format: "Tue Jan 20 16:01:16 +0000 2026"
    return new Date(dateStr);
}

function parseUserDate(dateStr) {
    // User format: YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function parseArgs(args) {
    const result = {
        input: null,
        from: null,
        to: null,
        output: null
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--from' && args[i + 1]) {
            result.from = parseUserDate(args[++i]);
        } else if (arg === '--to' && args[i + 1]) {
            result.to = parseUserDate(args[++i]);
            // Set to end of day for inclusive filtering
            result.to.setHours(23, 59, 59, 999);
        } else if ((arg === '-o' || arg === '--output') && args[i + 1]) {
            result.output = args[++i];
        } else if (!arg.startsWith('-') && !result.input) {
            result.input = arg;
        }
    }

    return result;
}

function filterByDate(bookmarks, fromDate, toDate) {
    return bookmarks.filter(bookmark => {
        const createdAt = parseTwitterDate(bookmark.createdAt);

        if (fromDate && createdAt < fromDate) return false;
        if (toDate && createdAt > toDate) return false;

        return true;
    });
}

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`Filter X/Twitter bookmarks by date range

Usage: node filter-bookmarks.js <input.json> [options]

Options:
  --from YYYY-MM-DD   Include bookmarks from this date (inclusive)
  --to YYYY-MM-DD     Include bookmarks up to this date (inclusive)
  -o, --output FILE   Output to file (default: stdout)
  -h, --help          Show this help

Examples:
  node filter-bookmarks.js bookmarks.json --from 2026-01-15
  node filter-bookmarks.js bookmarks.json --from 2026-01-15 --to 2026-01-22
  node filter-bookmarks.js bookmarks.json --to 2026-01-20 -o filtered.json`);
        process.exit(0);
    }

    const options = parseArgs(args);

    if (!options.input) {
        console.error('Error: Input file required');
        process.exit(1);
    }

    if (!fs.existsSync(options.input)) {
        console.error(`Error: Input file "${options.input}" not found`);
        process.exit(1);
    }

    if (!options.from && !options.to) {
        console.error('Error: At least one of --from or --to is required');
        process.exit(1);
    }

    try {
        const jsonContent = fs.readFileSync(options.input, 'utf-8');
        const bookmarks = JSON.parse(jsonContent);

        if (!Array.isArray(bookmarks)) {
            console.error('Error: JSON file should contain an array of bookmarks');
            process.exit(1);
        }

        const filtered = filterByDate(bookmarks, options.from, options.to);
        const output = JSON.stringify(filtered, null, 2);

        if (options.output) {
            fs.writeFileSync(options.output, output, 'utf-8');
            console.error(`Filtered ${bookmarks.length} → ${filtered.length} bookmarks`);
            console.error(`Output written to ${options.output}`);
        } else {
            console.log(output);
            console.error(`\nFiltered ${bookmarks.length} → ${filtered.length} bookmarks`);
        }
    } catch (error) {
        console.error('Error processing bookmarks:', error.message);
        process.exit(1);
    }
}

main();
