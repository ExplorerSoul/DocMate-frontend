import DocumentCard from "./DocumentCard"; // ✅ Import added
import "../css/DocumentList.css";

export default function DocumentList({ documents, onVerify }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4">
      {documents.length === 0 ? (
        <p className="text-gray-500">No documents uploaded yet.</p>
        ) : (
          documents.map((doc) => (
            <DocumentCard key={doc.hash} document={doc} onVerify={onVerify} />
          ))
      )}

    </div>
  );
}
