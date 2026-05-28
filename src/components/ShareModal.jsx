import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { Copy, Download, X } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, surveyId, surveyTitle }) => {
  const shareUrl = `${window.location.origin}/survey/${surveyId}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link başarıyla kopyalandı!', {
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${surveyTitle || 'survey'}_qrcode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Anketi Paylaş</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <div className="share-section">
            <label>Anket Linki</label>
            <div className="copy-group">
              <input type="text" value={shareUrl} readOnly />
              <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px' }} onClick={handleCopy}><Copy size={15} /> Kopyala</button>
            </div>
          </div>

          <div className="qr-section">
            <label>QR Kod</label>
            <div className="qr-box">
              <QRCodeSVG 
                id="qr-code-svg"
                value={shareUrl} 
                size={180}
                level={"H"}
                includeMargin={true}
              />
            </div>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={downloadQR}>
              <Download size={16} /> QR Kodu İndir (.png)
            </button>
          </div>
        </div>

        <style jsx="true">{`
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: fadeIn 0.2s ease; }
          .modal-content { max-width: 450px; width: 90%; padding: 2rem; position: relative; animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
          
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

          .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
          .modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 800; }
          .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }

          .share-section { margin-bottom: 2rem; }
          .share-section label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.75rem; text-transform: uppercase; }
          
          .copy-group { display: flex; gap: 0.5rem; background: var(--bg-main); padding: 0.5rem; border-radius: 12px; border: 1px solid var(--border); }
          .copy-group input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.9rem; color: var(--text-main); padding-left: 0.5rem; }


          .qr-section { text-align: center; }
          .qr-section label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 1rem; text-transform: uppercase; text-align: left; }
          .qr-box { background: white; padding: 1rem; display: inline-block; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1rem; }
          

        `}</style>
      </div>
    </div>
  );
};

export default ShareModal;
