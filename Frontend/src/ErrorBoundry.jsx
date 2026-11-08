import { Component } from "react";

// Shows the real error on screen instead of a blank white page.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, color: "#000", background: "#fff", fontFamily: "sans-serif" }}>
          <h1 style={{ fontSize: 24 }}>Something went wrong</h1>
          <pre style={{ whiteSpace: "pre-wrap", color: "#b00020" }}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}