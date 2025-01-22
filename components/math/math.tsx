import React, { useMemo } from "react"
import KaTeX from "katex"

export type ErrorRenderer = (error: Error) => React.ReactNode

export interface MathComponentPropsWithMath {
  math: string
  children?: React.ReactNode
  errorColor?: string
  renderError?: ErrorRenderer
}

export interface MathComponentPropsWithChildren {
  math?: string
  children: React.ReactNode
  errorColor?: string
  renderError?: ErrorRenderer
}

export type MathComponentProps =
  | MathComponentPropsWithMath
  | MathComponentPropsWithChildren

interface InternalComponentProps {
  html: string
}

const createMathComponent = (
  Component: React.FC<InternalComponentProps>,
  { displayMode }: { displayMode: boolean }
): React.FC<MathComponentProps> => {
  const MathComponent: React.FC<MathComponentProps> = ({
    children,
    errorColor,
    math,
    renderError,
  }) => {
    const formula = math ?? children

    const { html, error } = useMemo(() => {
      try {
        const html = KaTeX.renderToString(String(formula), {
          displayMode,
          errorColor,
          throwOnError: !!renderError,
        })

        return { html, error: undefined }
      } catch (error) {
        if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
          return { html: "", error: error as Error }
        }
        throw error
      }
    }, [formula, errorColor, renderError])

    if (error) {
      return renderError ? (
        renderError(error)
      ) : (
        <Component html={`${error.message}`} />
      )
    }

    return <Component html={html} />
  }

  return MathComponent
}

const InternalBlockMath: React.FC<InternalComponentProps> = ({ html }) => {
  return (
    <div data-testid="react-katex" dangerouslySetInnerHTML={{ __html: html }} />
  )
}

const InternalInlineMath: React.FC<InternalComponentProps> = ({ html }) => {
  return (
    <span
      data-testid="react-katex"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export const BlockMath = createMathComponent(InternalBlockMath, {
  displayMode: true,
})
export const InlineMath = createMathComponent(InternalInlineMath, {
  displayMode: false,
})
