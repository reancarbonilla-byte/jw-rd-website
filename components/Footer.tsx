export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border/50 bg-surface py-8"
      role="contentinfo"
    >
      <div className="container-custom text-center text-sm text-textMuted">
        <p>Copyright © {year} J.W. Research & Development</p>
      </div>
    </footer>
  );
}
