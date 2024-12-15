import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Configura el almacenamiento de los archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Destination:', join(__dirname, 'uploads'));
    cb(null, join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log('Filename:', filename);
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.array('files'), (req, res) => {
  console.log('Files:', req.files);
  const files = req.files.map(file => ({
    id: file.filename,
    name: file.originalname,
    type: file.mimetype,
    url: `http://localhost:5000/uploads/${file.filename}`,
  }));
  res.status(200).json({ files });
});

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
