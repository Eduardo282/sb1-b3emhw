import { useState } from 'react';
import { Image, FileText, Film, FileSpreadsheet, FileIcon, Download } from 'lucide-react';
import { FileItem } from '../App';

interface FileGalleryProps {
  files: FileItem[];
  onDelete: (id: string) => void; // Added onDelete prop
}

function FileGallery({ files, onDelete }: FileGalleryProps) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image')) return <Image className="h-8 w-8 text-blue-500" />;
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes('video')) return <Film className="h-8 w-8 text-purple-500" />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    return <FileIcon className="h-8 w-8 text-gray-500" />;
  };

  const renderFilePreview = (file: FileItem) => {
    if (file.type.startsWith('image')) {
      return <img src={file.url} alt={file.name} className="max-w-full max-h-[70vh] object-contain" />;
    } else if (file.type.includes('video')) {
      return (
        <video controls className="max-w-full max-h-[70vh]">
          <source src={file.url} type={file.type} />
          Tu navegador no soporta la reproducción de videos.
        </video>
      );
    } else if (file.type.includes('pdf')) {
      return (
        <iframe
          src={`${file.url}#toolbar=0`}
          className="w-full h-[70vh]"
          title={file.name}
        >
          Tu navegador no soporta la visualización de PDFs.
        </iframe>
      );
    } else {
      return <p className="text-center">Vista previa no disponible para este tipo de archivo.</p>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-8 patriaBold">
        Galería de Archivos Culturales
      </h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        {files.length === 0 ? (
          <p className="text-gray-500 text-center notoSansMedium">
            No hay archivos subidos aún.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="border border-slate-400 rounded-lg p-4 flex flex-col items-center"
              >
                <div className="mb-2">{getFileIcon(file.type)}</div>
                <p className="text-center notoSansMedium truncate w-full">
                  {file.name}
                </p>
                {file.type.startsWith("image") && (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="mt-2 w-full h-32 object-cover rounded cursor-pointer"
                    onClick={() => setSelectedFile(file)}
                  />
                )}
                {!file.type.startsWith("image") && (
                  <button
                    onClick={() => setSelectedFile(file)}
                    className="mt-2 notoSansRegular text-gray-500 hover:text-gray-700"
                  >
                    Ver archivo
                  </button>
                )}
                <a
                  href={file.url}
                  download={file.name}
                  className="mt-2 flex items-center notoSansRegular text-amber-700 hover:text-amber-900"
                >
                  <Download className="h-4 w-4 mr-1" /> Descargar
                </a>
                <button
                  onClick={() => onDelete(file.id)}
                  className="mt-2 notoSansLightItalic text-red-400 hover:text-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-min">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="notoSansMedium">{selectedFile.name}</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="notoSansRegular text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>
            {renderFilePreview(selectedFile)}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileGallery;
