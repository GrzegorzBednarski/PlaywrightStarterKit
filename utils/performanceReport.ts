import * as fs from 'fs';
import * as path from 'path';

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  RESET: '\x1b[0m',
} as const;

const TABLE_WIDTHS = {
  STATUS: 6,
  CATEGORY: 16,
  SCORE: 5,
  THRESHOLD: 9,
} as const;

const TABLE_BORDERS = {
  HORIZONTAL: '+--------+------------------+-------+-----------+',
  HEADER: '| Status | Category         | Score | Threshold |',
} as const;

interface PerformanceResult {
  actual: number;
  threshold: number;
  passed: boolean;
}

/**
 * Format category name for display (capitalize and replace dashes)
 */
function formatCategoryName(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
}

/**
 * Create a colored table row for performance result
 */
function createTableRow(category: string, result: PerformanceResult): string {
  const color = result.passed ? COLORS.GREEN : COLORS.RED;
  const status = result.passed ? 'PASS' : 'FAIL';
  const categoryName = formatCategoryName(category);
  const score = `${result.actual}%`;
  const threshold = `${result.threshold}%`;

  const statusPadded = status.padEnd(TABLE_WIDTHS.STATUS);
  const categoryPadded = categoryName.padEnd(TABLE_WIDTHS.CATEGORY);
  const scorePadded = score.padEnd(TABLE_WIDTHS.SCORE);
  const thresholdPadded = threshold.padEnd(TABLE_WIDTHS.THRESHOLD);

  return `| ${color}${statusPadded}${COLORS.RESET} | ${color}${categoryPadded}${COLORS.RESET} | ${color}${scorePadded}${COLORS.RESET} | ${color}${thresholdPadded}${COLORS.RESET} |`;
}

/**
 * Create the header message for performance test results
 */
function createHeaderMessage(url: string, hasFailed: boolean, failureCount: number): string {
  const statusIcon = hasFailed ? '❌' : '✅';
  const statusText = hasFailed ? 'FAILED' : 'PASSED';
  const issueCount = hasFailed ? ` with ${failureCount} issue(s)` : '';
  const headerColor = hasFailed ? COLORS.RED : COLORS.GREEN;

  return `\n${headerColor}${statusIcon} Performance Test ${statusText} for: ${url}${issueCount}${COLORS.RESET}`;
}

/**
 * Log performance results to console in a formatted table
 */
export function logPerformanceResults(
  url: string,
  results: Record<string, PerformanceResult>,
  hasFailed: boolean,
  failures: string[]
): void {
  console.log(createHeaderMessage(url, hasFailed, failures.length));

  console.log(`\n${TABLE_BORDERS.HORIZONTAL}`);
  console.log(TABLE_BORDERS.HEADER);
  console.log(TABLE_BORDERS.HORIZONTAL);

  Object.entries(results).forEach(([category, result]) => {
    console.log(createTableRow(category, result));
  });

  console.log(TABLE_BORDERS.HORIZONTAL);
}

/**
 * Save performance reports (HTML and JSON)
 */
export function saveReports(result: any, outputFolder: string, baseFilename: string): void {
  const folder = path.resolve(outputFolder);
  fs.mkdirSync(folder, { recursive: true });

  if (Array.isArray(result.report)) {
    const [htmlContent, jsonContent] = result.report;

    fs.writeFileSync(path.join(folder, `${baseFilename}.html`), htmlContent, 'utf-8');
    fs.writeFileSync(path.join(folder, `${baseFilename}.json`), jsonContent, 'utf-8');
  }
}

export type { PerformanceResult };
