#!/usr/bin/env node
/**
 * Convert X/Twitter bookmarks JSON to Markdown
 * Usage: node convert-bookmarks-to-md.js [input.json] [options]
 *
 * Options:
 *   -o, --output FILE   Output file (default: bookmarks-YYYY-MM-DD.md)
 *   --from YYYY-MM-DD   Include bookmarks from this date (inclusive)
 *   --to YYYY-MM-DD     Include bookmarks up to this date (inclusive)
 */

const fs = require('fs');
const path = require('path');

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
    output: null,
    from: null,
    to: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--from' && args[i + 1]) {
      result.from = parseUserDate(args[++i]);
    } else if (arg === '--to' && args[i + 1]) {
      result.to = parseUserDate(args[++i]);
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
  if (!fromDate && !toDate) return bookmarks;

  return bookmarks.filter(bookmark => {
    const createdAt = parseTwitterDate(bookmark.createdAt);
    if (fromDate && createdAt < fromDate) return false;
    if (toDate && createdAt > toDate) return false;
    return true;
  });
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function convertToMarkdown(bookmarks) {
  const now = new Date().toISOString().split('T')[0];
  const lines = [
    '# X Bookmarks',
    '',
    `Exported on: ${now}`,
    `Total bookmarks: ${bookmarks.length}`,
    '',
    '---',
    ''
  ];

  for (const tweet of bookmarks) {
    const authorName = tweet.author?.name || 'Unknown';
    const username = tweet.author?.username || 'unknown';
    const text = escapeMarkdown(tweet.text || '');
    const createdAt = formatDate(tweet.createdAt);
    const likes = tweet.likeCount ?? 0;
    const retweets = tweet.retweetCount ?? 0;
    const replies = tweet.replyCount ?? 0;
    const tweetUrl = `https://x.com/${username}/status/${tweet.id}`;

    lines.push(`## ${authorName} (@${username})`);
    lines.push(`**Date:** ${createdAt}`);
    lines.push('');
    lines.push(text);
    lines.push('');
    lines.push(`- Likes: ${likes} | Retweets: ${retweets} | Replies: ${replies}`);
    lines.push(`- [View tweet](${tweetUrl})`);

    // Handle quoted tweet if present
    if (tweet.quotedTweet) {
      const qt = tweet.quotedTweet;
      const qtAuthor = qt.author?.name || 'Unknown';
      const qtUsername = qt.author?.username || 'unknown';
      const qtText = escapeMarkdown(qt.text || '');
      lines.push('');
      lines.push(`> **Quoted: ${qtAuthor} (@${qtUsername})**`);
      lines.push(`> ${qtText.split('\n').join('\n> ')}`);
    }

    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Convert X/Twitter bookmarks JSON to Markdown

Usage: node convert-bookmarks-to-md.js <input.json> [options]

Options:
  -o, --output FILE   Output file (default: bookmarks-YYYY-MM-DD.md)
  --from YYYY-MM-DD   Include bookmarks from this date (inclusive)
  --to YYYY-MM-DD     Include bookmarks up to this date (inclusive)
  -h, --help          Show this help

Examples:
  node convert-bookmarks-to-md.js bookmarks.json
  node convert-bookmarks-to-md.js bookmarks.json --from 2026-01-15
  node convert-bookmarks-to-md.js bookmarks.json --from 2026-01-15 --to 2026-01-22 -o weekly.md`);
    process.exit(0);
  }

  const options = parseArgs(args);
  const inputFile = options.input || 'bookmarks.json';
  const defaultOutput = `bookmarks-${new Date().toISOString().split('T')[0]}.md`;
  const outputFile = options.output || defaultOutput;

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" not found`);
    console.error('Usage: node convert-bookmarks-to-md.js <input.json> [options]');
    process.exit(1);
  }

  try {
    const jsonContent = fs.readFileSync(inputFile, 'utf-8');
    let bookmarks = JSON.parse(jsonContent);

    if (!Array.isArray(bookmarks)) {
      console.error('Error: JSON file should contain an array of bookmarks');
      process.exit(1);
    }

    const originalCount = bookmarks.length;
    bookmarks = filterByDate(bookmarks, options.from, options.to);

    const markdown = convertToMarkdown(bookmarks);
    fs.writeFileSync(outputFile, markdown, 'utf-8');

    if (options.from || options.to) {
      console.log(`Filtered ${originalCount} → ${bookmarks.length} bookmarks`);
    }
    console.log(`Successfully converted ${bookmarks.length} bookmarks to ${outputFile}`);
  } catch (error) {
    console.error('Error processing bookmarks:', error.message);
    process.exit(1);
  }
}

main();
