import "../css/DocumentCard.css";

export default function DocumentCard({ document, onVerify }) {
  if (!document) return null;

  return (
    <div className="border p-4 rounded-xl shadow bg-white hover:shadow-md transition duration-200">
      <h3 className="text-lg font-semibold mb-1">{document.title || "Untitled Document"}</h3>
      
      <p className="text-sm text-gray-600 break-all">
        <strong>Hash:</strong> {document.hash?.slice(0, 20)}...
      </p>

      {document.url && (
        <a
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-2 text-blue-600 underline"
        >
          View on IPFS
        </a>
      )}

      <button
        onClick={() => onVerify(document)}
        className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
      >
        Verify
      </button>
    </div>
  );
}
