import React, { useState } from 'react';
import { createAttachedSignature, createDetachedSignature, createHash } from 'crypto-pro';
import File from './components/File';
import Certificate from './components/Certificate';
import SignatureType from './components/SignatureType';
import Hash from './components/Hash';
import Signature from './components/Signature';
import SystemInfo from './components/SystemInfo';

function App() {
  const [files, setFiles] = useState({});
  const [certificate, setCertificate] = useState(null);
  const [detachedSignature, setSignatureType] = useState(null);
  const [hash, setHash] = useState({});
  const [hashStatus, setHashStatus] = useState({});
  const [hashError, setHashError] = useState({});
  const [signature, setSignature] = useState({});
  const [signatureStatus, setSignatureStatus] = useState('Не создана');
  const [signatureError, setSignatureError] = useState({});

  const pushToObj = (presState, id, data) => {
    return {
      ...presState,
      [id]: data
    }
  }

  const setFilesOnChange = (id, file) => {
    setFiles(prevState => pushToObj(prevState, id, file));
  }

  const onSubmit = (event) => {
    event.preventDefault();

    for (let id in files) {
      createSignature(id, files[id]);
    }
  }

  async function createSignature(id, file) {
    let hash;

    setSignature({});
    setSignatureError({});

    setHash({});
    setHashError({});
    setHashStatus(prevState => pushToObj(prevState, id, 'Вычисляется...'));
//
    try {
      hash = await createHash(file);
      setHash(prevState => pushToObj(prevState, id, hash));
    } catch (error) {
      console.log(error);
      setHashError(prevState => pushToObj(prevState, id, error.message));

      return;
    }

    setHashStatus(prevState => pushToObj(prevState, id, 'Не вычислен'));
    setSignatureStatus(prevState => pushToObj(prevState, id, 'Создается...'));

    if (detachedSignature) {
      try {
        await createDetachedSignature(certificate.thumbprint, hash[id]).then(result => {
          setSignature(prevState => pushToObj(prevState, id, result));
        })

      } catch (error) {
        setSignatureError(prevState => pushToObj(prevState, id, error.message));
      }

      setSignatureStatus(prevState => pushToObj(prevState, id, 'Не создана'));

      return;
    }

    try {
      await createAttachedSignature(certificate.thumbprint, file).then(result => {
        setSignature(prevState => pushToObj(prevState, id, result));
      })
    } catch (error) {
      setSignatureError(prevState => pushToObj(prevState, id, error.message));
    }

    setSignatureStatus(prevState => pushToObj(prevState, id, 'Не создана'));
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <fieldset>
          <File onChange={setFilesOnChange} id={1} />
          <File onChange={setFilesOnChange} id={2} />
          <br/><br/>
          <Certificate onChange={setCertificate}/>

          <SignatureType onChange={setSignatureType}/>

          <br/><br/>
          <hr/>

          <button
            type="submit"
            disabled={!certificate || !files}>
            Создать подпись
          </button>
        </fieldset>
      </form>

      <fieldset style={{
        display: "flex",
        flexWrap: 'nowrap',
      }}>
        <div style={{flex: '0 1 50%', padding: '15px'}}>
          <Hash
            hash={hash[1]}
            hashStatus={hashStatus[1]}
            hashError={hashError[1]}/>

          <Signature
            signature={signature[1]}
            signatureStatus={signatureStatus[1]}
            signatureError={signatureError[1]}/>
        </div>
        <div style={{flex: '0 1 50%', padding: '15px'}}>
          <Hash
            hash={hash[2]}
            hashStatus={hashStatus[2]}
            hashError={hashError[2]}/>

          <Signature
            signature={signature[2]}
            signatureStatus={signatureStatus[2]}
            signatureError={signatureError[2]}/>
        </div>


      </fieldset>
      <p>
        Для <a href="https://www.gosuslugi.ru/pgu/eds/"
               target="_blank"
               rel="nofollow noopener noreferrer"
               title="Перейти к проверке подписи">проверки</a> нужно
        создать файл со сгенерированной подписью в кодировке UTF-8 с расширением *.sgn
        <br/>
        для отделенной подписи (или *.sig для совмещенной).
      </p>
      <fieldset>
        <SystemInfo/>
      </fieldset>
    </>
  );
}

export default App;
