import React, {useCallback, useState} from 'react';

function File({onChange, id}) {
  const [file, setFile] = useState('');

  function readFileAsString(files) {
    if (files.length === 0) {
      console.log('No file is selected');
      return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
      setFile(event.target.result);
      onChange(id, event.target.result);
    };
    reader.readAsText(files[0]);
  }


  function onFileChange(event) {
    readFileAsString(event.target.files);
  }

  useCallback(() => onChange(id, file), [id, file]);

  return (
    <>
      <br/>
      <br/>
      <label htmlFor="message">Подписываемый файл: *</label>

      <br/>

      <input
        type={'file'}
        id={'file' + id}
        name="message"
        placeholder="Выберите файл"
        onChange={onFileChange}
      />
    </>
  );
}

export default File;
