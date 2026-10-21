import Link from "next/link";

export default function NotFound() {
  return (
    <div className="success">
      <div>
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <Link href="/shop" className="btn">Back to the collection</Link>
      </div>
    </div>
  );
}
