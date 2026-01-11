import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * CSV Helper Utilities
 *
 * Functions to load and parse CSV files for test data
 */

export interface CsvOptions {
  columns?: boolean;
  skip_empty_lines?: boolean;
  cast?: boolean;
}

/**
 * Load CSV data from a file
 *
 * @param filePath - Relative path to CSV file from project root
 * @returns Array of parsed records
 */
export function loadCsvData<T = any>(filePath: string, options?: CsvOptions): T[] {
  const fullPath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`CSV file not found: ${fullPath}`);
  }

  const content = fs.readFileSync(fullPath, 'utf-8');

  const defaultOptions: CsvOptions = {
    columns: true,
    skip_empty_lines: true,
    cast: true,
    ...options,
  };

  try {
    return parse(content, defaultOptions);
  } catch (error) {
    throw new Error(`Failed to parse CSV file ${filePath}: ${error}`);
  }
}

/**
 * Load multiple CSV files
 *
 * @param filePaths - Array of CSV file paths
 * @returns Object with file names as keys and parsed data as values
 */
export function loadMultipleCsvFiles<T = any>(filePaths: string[]): Record<string, T[]> {
  const result: Record<string, T[]> = {};

  for (const filePath of filePaths) {
    const fileName = path.basename(filePath, path.extname(filePath));
    result[fileName] = loadCsvData<T>(filePath);
  }

  return result;
}

/**
 * Filter CSV data based on a predicate function
 *
 * @param data - Array of CSV records
 * @param predicate - Filter function
 * @returns Filtered array
 */
export function filterCsvData<T>(data: T[], predicate: (item: T) => boolean): T[] {
  return data.filter(predicate);
}

/**
 * Transform CSV data using a mapper function
 *
 * @param data - Array of CSV records
 * @param mapper - Transform function
 * @returns Transformed array
 */
export function transformCsvData<T, U>(data: T[], mapper: (item: T) => U): U[] {
  return data.map(mapper);
}
