import * as fs from 'fs';
import * as path from 'path';
import { AxeResults, Result } from 'axe-core';

interface ReportFields {
  impact?: boolean;
  id?: boolean;
  description?: boolean;
  help?: boolean;
  helpUrl?: boolean;
  nodes?: boolean;
  [key: string]: boolean | undefined;
}

interface ReportConsoleOptions extends ReportFields {}

export interface AccessibilityConfig {
  tags: string[];
  ignoredRules: Record<string, boolean>;
  reportConsole: ReportConsoleOptions;
  reportsOutputFolder: string;
}

type FilteredViolation = {
  [key: string]: unknown;
  nodes?: number | string[];
  url?: string;
};

export function generateAccessibilityReport(
  results: AxeResults,
  config: AccessibilityConfig,
  url?: string
): void {
  if (config.reportConsole) {
    logToConsole(results.violations, config.reportConsole, url);
  }

  const defaultJsonFields: ReportFields = {
    impact: true,
    id: true,
    description: true,
    help: true,
    helpUrl: true,
    nodes: true,
  };

  saveJsonReport(results.violations, defaultJsonFields, config.reportsOutputFolder, true, url);
}

function logToConsole(violations: Result[], options: ReportFields, url?: string): void {
  if (violations.length === 0) {
    return;
  }

  const filtered = violations
    .map(v => filterViolation(v, options, 'console'))
    .sort((a, b) => {
      const impactOrder = ['critical', 'serious', 'moderate', 'minor'];
      const aImpact = typeof a.impact === 'string' ? a.impact : '';
      const bImpact = typeof b.impact === 'string' ? b.impact : '';
      return impactOrder.indexOf(aImpact) - impactOrder.indexOf(bImpact);
    });
  if (url) {
    console.log(`URL: ${url}`);
  }
  console.table(filtered);
}

function saveJsonReport(
  violations: Result[],
  fields: ReportFields,
  outputFolder: string,
  includeTimestamp?: boolean,
  url?: string
): void {
  const filtered = violations.map(v => {
    const base = filterViolation(v, fields, 'json');
    return url ? { ...base, url } : base;
  });

  const report: Record<string, unknown> = {
    violations: filtered,
  };

  if (includeTimestamp) {
    report.timestamp = new Date().toISOString();
  }

  const folder = path.resolve(outputFolder);
  fs.mkdirSync(folder, { recursive: true });

  const filename = includeTimestamp
    ? `accessibility-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    : 'accessibility-report.json';

  const filePath = path.join(folder, filename);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8');
}

function filterViolation(
  violation: Result,
  options: ReportFields,
  mode: 'console' | 'json'
): FilteredViolation {
  const filtered: FilteredViolation = {};

  for (const key in options) {
    if (options[key] && key in violation) {
      if (key === 'nodes') {
        filtered.nodes =
          mode === 'console'
            ? violation.nodes.length
            : violation.nodes.flatMap(
                node => node.target.filter(t => typeof t === 'string') as string[]
              );
      } else {
        filtered[key] = (violation as unknown as Record<string, unknown>)[key];
      }
    }
  }

  return filtered;
}

export type StructuredViolation = {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  pages: {
    url: string;
    nodes: string[];
  }[];
};

export function transformViolations(rawViolations: any[]): StructuredViolation[] {
  const grouped = new Map<string, StructuredViolation>();

  for (const v of rawViolations) {
    const key = v.id;
    const url = v.url ?? 'unknown';
    const nodes = Array.isArray(v.nodes) ? v.nodes : [];

    if (!grouped.has(key)) {
      grouped.set(key, {
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        tags: v.tags,
        pages: [],
      });
    }

    const entry = grouped.get(key)!;

    const existingPage = entry.pages.find(p => p.url === url);
    if (existingPage) {
      existingPage.nodes.push(...nodes);
    } else {
      entry.pages.push({ url, nodes });
    }
  }

  return Array.from(grouped.values()).sort((a, b) => {
    const impactOrder = ['critical', 'serious', 'moderate', 'minor'];
    return impactOrder.indexOf(a.impact) - impactOrder.indexOf(b.impact);
  });
}

export function generateMarkdownReport(
  structuredViolations: StructuredViolation[],
  outputFolder: string
): void {
  let markdown = `# Accessibility Report\n\n`;

  if (structuredViolations.length === 0) {
    markdown += `## ✅ No accessibility violations found!\n\n`;
    markdown += `Great job! All pages passed accessibility testing.\n\n`;
  } else {
    markdown += `## Summary\n\n`;

    const impactCounts = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    };

    structuredViolations.forEach(v => {
      if (v.impact in impactCounts) {
        impactCounts[v.impact as keyof typeof impactCounts]++;
      }
    });

    const totalPages = new Set(structuredViolations.flatMap(v => v.pages.map(p => p.url))).size;

    markdown += `| Metric | Count |\n`;
    markdown += `|--------|-------|\n`;
    markdown += `| **Total Issues** | ${structuredViolations.length} |\n`;
    markdown += `| **Pages Affected** | ${totalPages} |\n`;
    markdown += `| 🔴 Critical | ${impactCounts.critical} |\n`;
    markdown += `| 🟠 Serious | ${impactCounts.serious} |\n`;
    markdown += `| 🟡 Moderate | ${impactCounts.moderate} |\n`;
    markdown += `| 🟢 Minor | ${impactCounts.minor} |\n\n`;

    markdown += `---\n\n`;

    for (const violation of structuredViolations) {
      const impactEmoji =
        {
          critical: '🔴',
          serious: '🟠',
          moderate: '🟡',
          minor: '🟢',
        }[violation.impact] || '⚪';

      markdown += `> ### ${impactEmoji} ${violation.id}\n`;
      markdown += `> ${violation.description}\n\n`;

      markdown += `**How to fix:** ${violation.help}\n\n`;
      markdown += `**Documentation:** [${violation.helpUrl}](${violation.helpUrl})\n\n`;

      if (violation.tags && violation.tags.length > 0) {
        markdown += `**Tags:** ${violation.tags.join(', ')}\n\n`;
      }

      markdown += `**Pages Affected (${violation.pages.length}) - with nested selectors:**\n\n`;

      for (const page of violation.pages) {
        markdown += `<details>\n`;
        markdown += `<summary><strong>🔍 ${page.url}</strong> (${page.nodes.length} element${page.nodes.length !== 1 ? 's' : ''})</summary>\n\n`;

        if (page.nodes.length > 0) {
          markdown += `**CSS Selectors:**\n`;
          page.nodes.forEach(node => {
            markdown += `- \`${node}\`\n`;
          });
        }

        markdown += `\n</details>\n\n`;
      }

      markdown += `---\n\n`;
    }
  }

  markdown += `*Generated on ${new Date().toLocaleString()}*\n`;

  const filePath = path.join(outputFolder, 'accessibility-report.md');
  fs.writeFileSync(filePath, markdown, 'utf-8');
}

export function deduplicateViolations(violations: any[]): any[] {
  const seen = new Set<string>();
  const result: any[] = [];

  for (const v of violations) {
    const key = `${v.id}-${v.nodes
      .map((n: any) => (Array.isArray(n.target) ? n.target.join(',') : ''))
      .join('|')}`;

    if (!seen.has(key)) {
      seen.add(key);
      result.push(v);
    }
  }

  return result;
}

export function mergeAccessibilityReports(
  reportsDir: string,
  outputFile: string,
  includeTimestamp?: boolean
): void {
  if (!fs.existsSync(reportsDir)) return;

  const files = fs
    .readdirSync(reportsDir)
    .filter(f => f.endsWith('.json') && f !== 'accessibility-report.json');

  const allViolations: any[] = [];

  for (const file of files) {
    const filePath = path.join(reportsDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(content);
      if (json.violations) {
        allViolations.push(...json.violations);
      }
    } catch (err) {
      console.warn(`Error reading file ${file}:`, err);
    }
  }

  const uniqueViolations = deduplicateViolations(allViolations);
  const structured = transformViolations(uniqueViolations);

  const finalReport = {
    violations: structured,
    timestamp: includeTimestamp ? new Date().toISOString() : undefined,
  };

  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(finalReport, null, 2), 'utf-8');

  generateMarkdownReport(structured, reportsDir);

  for (const file of files) {
    const filePath = path.join(reportsDir, file);
    try {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up temporary file: ${file}`);
    } catch (err) {
      console.warn(`Error removing temporary file ${file}:`, err);
    }
  }
}
