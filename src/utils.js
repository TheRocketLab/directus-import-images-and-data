const getFileName = (response) => {
  const contentDispositionHeader = response.headers.get('Content-Disposition');
  if (contentDispositionHeader) {
    const fileNameMatch = contentDispositionHeader.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (fileNameMatch && fileNameMatch[1]) {
      const fileName = fileNameMatch[1].replace(/['"]/g, '');
      console.log('File name:', fileName);
      return fileName;
    }
  }
}

const getFileType = (response) => {
  const contentTypeHeader = response.headers.get('Content-Type');
  if (contentTypeHeader) {
    const fileType = contentTypeHeader.split('/').pop();
    console.log('File type:', fileType);
    return fileType;
  }
}

exports.getFileName = getFileName;
exports.getFileType = getFileType;