import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

/** ルートで捕捉されていない例外があったときに白画面にならないようにする */
export class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[RootErrorBoundary]', error, info.componentStack)
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          style={{
            fontFamily: 'system-ui, sans-serif',
            padding: '2rem',
            maxWidth: '42rem',
            margin: '0 auto',
          }}
        >
          <h1 style={{ fontSize: '1.25rem' }}>画面の表示中にエラーが発生しました</h1>
          <p style={{ color: '#64748b', marginTop: '1rem' }}>
            ブラウザの開発者ツール（Console）に詳細が出ていないか確認してください。
          </p>
          <pre
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#f1f5f9',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.875rem',
            }}
          >
            {this.state.error.message}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
