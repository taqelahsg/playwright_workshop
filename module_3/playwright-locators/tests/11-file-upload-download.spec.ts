import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('File Upload and Download Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test.describe('File Upload', () => {

    test('should upload a single file', async ({ page }) => {
      const fileInput = page.locator('#file-upload');
      const fileInfo = page.locator('#file-info');

      const testFilePath = path.join(__dirname, 'test-files', 'sample.txt');

      fs.mkdirSync(path.join(__dirname, 'test-files'), { recursive: true });
      fs.writeFileSync(testFilePath, 'This is a test file for upload');

      await fileInput.setInputFiles(testFilePath);

      await expect(fileInfo).toContainText('sample.txt');
      await expect(fileInfo).toContainText('KB');
      await expect(fileInfo).toContainText('text/plain');

      fs.unlinkSync(testFilePath);
    });

    test('should upload multiple files', async ({ page }) => {
      const fileInput = page.locator('#file-upload-multiple');
      const fileInfo = page.locator('#file-info');

      const testDir = path.join(__dirname, 'test-files');
      fs.mkdirSync(testDir, { recursive: true });

      const file1Path = path.join(testDir, 'file1.txt');
      const file2Path = path.join(testDir, 'file2.txt');

      fs.writeFileSync(file1Path, 'First test file');
      fs.writeFileSync(file2Path, 'Second test file');

      await fileInput.setInputFiles([file1Path, file2Path]);

      await expect(fileInfo).toBeVisible();

      fs.unlinkSync(file1Path);
      fs.unlinkSync(file2Path);
    });

    test('should upload a file using buffer', async ({ page }) => {
      const fileInput = page.locator('#file-upload');
      const fileInfo = page.locator('#file-info');

      await fileInput.setInputFiles({
        name: 'test-buffer.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('This is test content from buffer')
      });

      await expect(fileInfo).toContainText('test-buffer.txt');
      await expect(fileInfo).toContainText('text/plain');
    });

    test('should clear uploaded file', async ({ page }) => {
      const fileInput = page.locator('#file-upload');
      const fileInfo = page.locator('#file-info');

      await fileInput.setInputFiles({
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Test content')
      });

      await expect(fileInfo).toContainText('test.txt');

      await fileInput.setInputFiles([]);

      const inputValue = await fileInput.inputValue();
      expect(inputValue).toBe('');
    });

    test('should upload different file types', async ({ page }) => {
      const fileInput = page.locator('#file-upload');
      const fileInfo = page.locator('#file-info');

      await fileInput.setInputFiles({
        name: 'test.json',
        mimeType: 'application/json',
        buffer: Buffer.from('{"test": "data"}')
      });

      await expect(fileInfo).toContainText('test.json');
      await expect(fileInfo).toContainText('application/json');
    });
  });

  test.describe('File Download', () => {

    test('should download text file', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');

      await page.locator('#btn-download-txt').click();

      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('test-file.txt');

      const filePath = path.join(__dirname, 'downloads', download.suggestedFilename());
      fs.mkdirSync(path.join(__dirname, 'downloads'), { recursive: true });
      await download.saveAs(filePath);

      expect(fs.existsSync(filePath)).toBeTruthy();
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('test');

      fs.unlinkSync(filePath);
    });

    test('should download CSV file', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');

      await page.locator('#btn-download-csv').click();

      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('test-data.csv');

      const filePath = path.join(__dirname, 'downloads', download.suggestedFilename());
      fs.mkdirSync(path.join(__dirname, 'downloads'), { recursive: true });
      await download.saveAs(filePath);

      expect(fs.existsSync(filePath)).toBeTruthy();
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('Name');
      expect(content).toContain('Age');
      expect(content).toContain('Email');

      fs.unlinkSync(filePath);
    });

    test('should download JSON file', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');

      await page.locator('#btn-download-json').click();

      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('test-data.json');

      const filePath = path.join(__dirname, 'downloads', download.suggestedFilename());
      fs.mkdirSync(path.join(__dirname, 'downloads'), { recursive: true });
      await download.saveAs(filePath);

      expect(fs.existsSync(filePath)).toBeTruthy();
      const content = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(content);

      expect(Array.isArray(jsonData.users)).toBeTruthy();
      expect(jsonData.users.length).toBeGreaterThan(0);

      fs.unlinkSync(filePath);
    });

    test('should verify download without saving', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');

      await page.locator('#btn-download-txt').click();

      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('test-file.txt');

      const stream = await download.createReadStream();
      expect(stream).not.toBeNull();
    });

    test('should download all file types sequentially', async ({ page }) => {
      const downloadsDir = path.join(__dirname, 'downloads');
      fs.mkdirSync(downloadsDir, { recursive: true });

      const fileTypes = [
        { buttonId: '#btn-download-txt', expectedFile: 'test-file.txt' },
        { buttonId: '#btn-download-csv', expectedFile: 'test-data.csv' },
        { buttonId: '#btn-download-json', expectedFile: 'test-data.json' }
      ];

      for (const fileType of fileTypes) {
        const downloadPromise = page.waitForEvent('download');
        await page.locator(fileType.buttonId).click();
        const download = await downloadPromise;

        expect(download.suggestedFilename()).toBe(fileType.expectedFile);

        const filePath = path.join(downloadsDir, download.suggestedFilename());
        await download.saveAs(filePath);
        expect(fs.existsSync(filePath)).toBeTruthy();

        fs.unlinkSync(filePath);
      }
    });
  });

  test.describe('Combined Upload and Download', () => {

    test('should upload a file and then download files', async ({ page }) => {
      const fileInput = page.locator('#file-upload');
      const fileInfo = page.locator('#file-info');

      await fileInput.setInputFiles({
        name: 'upload-test.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Upload test content')
      });

      await expect(fileInfo).toContainText('upload-test.txt');

      const downloadPromise = page.waitForEvent('download');
      await page.locator('#btn-download-txt').click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('test-file.txt');
    });
  });

  test.afterAll(async () => {
    const testFilesDir = path.join(__dirname, 'test-files');
    const downloadsDir = path.join(__dirname, 'downloads');

    if (fs.existsSync(testFilesDir)) {
      fs.rmSync(testFilesDir, { recursive: true, force: true });
    }
    if (fs.existsSync(downloadsDir)) {
      fs.rmSync(downloadsDir, { recursive: true, force: true });
    }
  });
});
