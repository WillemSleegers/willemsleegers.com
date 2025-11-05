/**
 * Replaces HTML 'class' attributes with 'className' for React compatibility
 */
export function replaceClassWithClassName(htmlString: string) {
  return htmlString.replace(
    /<([a-z][a-z0-9]*)\b([^>]*?)\bclass=(?=(?:[^"]*"[^"]*")*[^"]*$)/gi,
    "<$1$2className="
  )
}
