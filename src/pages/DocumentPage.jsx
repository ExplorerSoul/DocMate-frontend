// pages/DocumentPage.jsx
import UploadDocumentForm from "../components/UploadDocumentForm";
import "../css/DocumentPage.css";

export default function DocumentPage({ onUpload }) {
  return (
    <div>
      <h1>Upload Document</h1>
      <UploadDocumentForm onUpload={onUpload} />
    </div>
  );
}
