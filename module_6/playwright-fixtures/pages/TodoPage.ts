import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly todoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.todoInput = page.locator('.new-todo');
    this.todoItems = page.locator('.todo-list li');
    this.todoCount = page.locator('.todo-count');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTodo(text: string) {
    await this.todoInput.fill(text);
    await this.todoInput.press('Enter');
  }

  async removeTodo(text: string) {
    const todo = this.todoItems.filter({ hasText: text });
    await todo.hover();
    await todo.locator('.destroy').click();
  }

  async toggleTodo(text: string) {
    const todo = this.todoItems.filter({ hasText: text });
    await todo.locator('.toggle').click();
  }

  async removeAll() {
    // Clear all todos by clicking destroy button on each
    const count = await this.todoItems.count();
    for (let i = 0; i < count; i++) {
      await this.todoItems.first().hover();
      await this.todoItems.first().locator('.destroy').click();
    }
  }

  getTodoByText(text: string): Locator {
    return this.todoItems.filter({ hasText: text });
  }

  async getTodoCount(): Promise<number> {
    return await this.todoItems.count();
  }
}
