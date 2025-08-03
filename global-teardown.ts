import * as path from 'path';
import accessibilityConfig from './config/accessibilityConfig';
import { mergeAccessibilityReports } from './utils/accessibilityReport';

const reportsDir = path.resolve(accessibilityConfig.reportsOutputFolder);
const outputFile = path.join(reportsDir, 'accessibility-report.json');

export default async function globalTeardown() {
  mergeAccessibilityReports(reportsDir, outputFile, true);
}
