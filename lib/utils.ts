import React from 'react';

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function replaceClassWithClassName(htmlString: string) {
  return htmlString.replace(/<([a-z][a-z0-9]*)\b([^>]*?)\bclass=(?=(?:[^"]*"[^"]*")*[^"]*$)/gi, '<$1$2className=');
}

// Type definitions
interface MarkdownProps {
  children?: React.ReactNode;
  href?: string;
  [key: string]: unknown;
}

interface MarkdownElement extends React.ReactElement {
  type: string;
  props: MarkdownProps;
}

type MarkdownSyntax = {
  [key: string]: [string, string];
};

const MARKDOWN_SYNTAX_MAP: MarkdownSyntax = {
  em: ['_', '_'],
  strong: ['**', '**'],
  del: ['~~', '~~'],
  code: ['`', '`'],
  a: ['[', '](${href})'],
  h1: ['# ', '\n'],
  h2: ['## ', '\n'],
  h3: ['### ', '\n'],
  h4: ['#### ', '\n'],
  h5: ['##### ', '\n'],
  h6: ['###### ', '\n'],
  blockquote: ['> ', '\n'],
  hr: ['---\n', ''],
  br: ['\n', ''],
  p: ['', '\n\n'],
  li: ['- ', '\n'],
  pre: ['```\n', '\n```\n'],
};

// Type guard to check if a value is a MarkdownElement
function isMarkdownElement(node: React.ReactNode): node is MarkdownElement {
  return (
    React.isValidElement(node) &&
    typeof node.type === 'string' &&
    typeof node.props === 'object'
  );
}

/**
 * Reconstructs original Markdown syntax from React elements produced by markdown-to-jsx
 */
export const reconstructMarkdown = (node: React.ReactNode): string => {
  if (node === null || node === undefined) {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return node.toString();
  }

  if (Array.isArray(node)) {
    return node.map(reconstructMarkdown).join('');
  }

  if (isMarkdownElement(node)) {
    const { type, props } = node;

    // Handle special cases
    if (type === 'a' && props.href) {
      const [prefix, suffix] = MARKDOWN_SYNTAX_MAP[type];
      return `${prefix}${reconstructMarkdown(props.children)}${suffix.replace('${href}', props.href)}`;
    }

    if (type in MARKDOWN_SYNTAX_MAP) {
      const [prefix, suffix] = MARKDOWN_SYNTAX_MAP[type];
      return `${prefix}${reconstructMarkdown(props.children)}${suffix}`;
    }

    // Recursively process children for unknown elements
    return reconstructMarkdown(props.children);
  }

  return '';
};