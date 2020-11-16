import React from 'react';

function Signature({signature, signatureStatus, signatureError}) {
  return (
    <>
      <label htmlFor="signature">Подпись (PKCS7):</label>

      <br/>

      <textarea
        id="signature"
        rows="30"
        style={{width: '100%'}}
        value={signature}
        placeholder={signatureStatus}
        readOnly/>

      <pre>{signatureError || null}</pre>
    </>
  )
}

export default Signature;
