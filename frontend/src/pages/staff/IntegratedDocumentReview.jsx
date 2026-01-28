import { useState, useEffect } from 'react';
import { staffAPI } from '../../services/api';

function StaffDocumentReview() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await staffAPI.getDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (docId) => {
    try {
      await staffAPI.verifyDocument(docId);
      fetchDocuments();
      alert('Document verified successfully');
    } catch (error) {
      alert('Failed to verify document');
    }
  };

  const handleReject = async (docId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await staffAPI.rejectDocument(docId, reason);
      fetchDocuments();
      alert('Document rejected');
    } catch (error) {
      alert('Failed to reject document');
    }
  };

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Document Review</h2>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Pending Documents</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Application</th>
                  <th>Parent</th>
                  <th>Document Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map(doc => (
                    <tr key={doc.id}>
                      <td>{doc.id}</td>
                      <td>#{doc.application?.id}</td>
                      <td>{doc.application?.parent?.fullName}</td>
                      <td>{doc.documentType}</td>
                      <td>
                        <span className={`badge bg-${
                          doc.status === 'VERIFIED' ? 'success' : 
                          doc.status === 'REJECTED' ? 'danger' : 'warning'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td>
                        {doc.status === 'PENDING' && (
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleVerify(doc.id)}
                            >
                              Verify
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleReject(doc.id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No documents to review</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDocumentReview;
