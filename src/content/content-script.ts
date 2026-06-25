import type { PageElement, ElementDescriptor, Message } from '../types';

// 提取页面信息
function extractPageInfo(): string {
  const interactiveElements = findInteractiveElements();
  const pageStructure = {
    url: window.location.href,
    title: document.title,
    elementCount: interactiveElements.length,
    elements: interactiveElements.slice(0, 50).map(el => ({
      id: el.id,
      tag: el.tag,
      type: el.type,
      text: el.text?.substring(0, 100),
      placeholder: el.placeholder,
      href: el.href,
      selector: el.selector,
    })),
  };

  return JSON.stringify(pageStructure, null, 2);
}

// 查找可交互元素
function findInteractiveElements(): PageElement[] {
  const elements: PageElement[] = [];
  const interactiveSelectors = [
    'a[href]',
    'button',
    'input',
    'textarea',
    'select',
    '[role="button"]',
    '[role="link"]',
    '[onclick]',
    '[contenteditable="true"]',
  ];

  const nodes = document.querySelectorAll(interactiveSelectors.join(','));

  nodes.forEach((node, index) => {
    const element = node as HTMLElement;
    const rect = element.getBoundingClientRect();

    // 过滤不可见元素
    if (rect.width === 0 || rect.height === 0 ||
        window.getComputedStyle(element).display === 'none' ||
        window.getComputedStyle(element).visibility === 'hidden') {
      return;
    }

    const selector = generateSelector(element);
    const xpath = generateXPath(element);

    elements.push({
      id: `element-${index}`,
      tag: element.tagName.toLowerCase(),
      type: element.getAttribute('type') || undefined,
      text: element.textContent?.trim().substring(0, 100) || undefined,
      value: (element as HTMLInputElement).value || undefined,
      placeholder: element.getAttribute('placeholder') || undefined,
      href: (element as HTMLAnchorElement).href || undefined,
      selector,
      xpath,
      isInteractive: true,
      boundingBox: rect,
      attributes: getRelevantAttributes(element),
    });
  });

  return elements;
}

// 生成CSS选择器
function generateSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${element.id}`;
  }

  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    if (current.className) {
      const classes = Array.from(current.classList)
        .filter(c => c && !/^[0-9]/.test(c))
        .slice(0, 2);
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }

    path.unshift(selector);
    current = current.parentElement;

    if (path.length >= 3) break;
  }

  return path.join(' > ');
}

// 生成XPath
function generateXPath(element: HTMLElement): string {
  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }

  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    const tag = current.tagName.toLowerCase();
    const siblings = Array.from(current.parentElement?.children || [])
      .filter(el => el.tagName === current!.tagName);

    const index = siblings.indexOf(current) + 1;
    path.unshift(siblings.length > 1 ? `${tag}[${index}]` : tag);
    current = current.parentElement;

    if (path.length >= 3) break;
  }

  return '//' + path.join('/');
}

// 获取相关属性
function getRelevantAttributes(element: HTMLElement): Record<string, string> {
  const attrs: Record<string, string> = {};
  const relevantAttrs = ['name', 'class', 'id', 'type', 'placeholder', 'aria-label', 'title'];

  relevantAttrs.forEach(attr => {
    const value = element.getAttribute(attr);
    if (value) attrs[attr] = value;
  });

  return attrs;
}

// 执行动作
async function executeAction(action: string, target: ElementDescriptor, value?: string): Promise<string> {
  const element = findElement(target);

  if (!element) {
    throw new Error(`找不到目标元素: ${JSON.stringify(target)}`);
  }

  // 高亮元素
  highlightElement(element);

  switch (action) {
    case 'click':
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(300);
      element.click();
      return '点击成功';

    case 'input':
      if (!value) throw new Error('input动作需要提供value');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(300);
      (element as HTMLInputElement).value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return `输入成功: ${value}`;

    case 'extract':
      return element.textContent?.trim() || element.getAttribute('value') || '';

    case 'scroll':
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return '滚动成功';

    default:
      throw new Error(`未知动作类型: ${action}`);
  }
}

// 查找元素
function findElement(target: ElementDescriptor): HTMLElement | null {
  if (target.selector) {
    return document.querySelector(target.selector);
  }

  if (target.xpath) {
    const result = document.evaluate(
      target.xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    return result.singleNodeValue as HTMLElement;
  }

  if (target.text) {
    const elements = Array.from(document.querySelectorAll('*'));
    return elements.find(el =>
      el.textContent?.trim().includes(target.text!)
    ) as HTMLElement || null;
  }

  return null;
}

// 高亮元素
function highlightElement(element: HTMLElement) {
  const originalOutline = element.style.outline;
  element.style.outline = '3px solid #ff6b6b';

  setTimeout(() => {
    element.style.outline = originalOutline;
  }, 1000);
}

// 工具函数：延迟
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 监听来自background的消息
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  const handleMessage = async () => {
    try {
      switch (message.type) {
        case 'GET_PAGE_INFO':
          return { success: true, data: extractPageInfo() };

        case 'EXECUTE_ACTION':
          const { action, target, value } = message.payload;
          const result = await executeAction(action, target, value);
          return { success: true, data: result };

        default:
          return { success: false, error: '未知消息类型' };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  handleMessage().then(sendResponse);
  return true; // 保持消息通道开放
});

console.log('Browser Agent Assistant content script loaded');
