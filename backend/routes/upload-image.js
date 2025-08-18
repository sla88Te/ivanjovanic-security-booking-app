const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { authenticateToken } = require('../authMiddleware');



const router = express.Router();

router.use(cors({
  origin: 'https://localhost:4200',
  credentials: true
}));

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('.jpg')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const targetPath = path.resolve(__dirname, '../uploads/images');
    fs.mkdirSync(targetPath, { recursive: true });
    cb(null, targetPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // već preimenovano u Angularu
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg') {
      return cb(new Error('Only .jpg files are allowed'));
    }
    cb(null, true);
  }
});

router.post('/upload-image', authenticateToken, upload.single('image'), (req, res) => {
    console.log('🔐 Authorization header:', req.headers['authorization']);
    console.log('📸 Uploaded file:', req.file);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.status(201).json({ message: 'Image uploaded successfully', filename: req.file.filename });
  const imagePath = path.resolve(__dirname, '../uploads/images');

    fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
        console.warn('⚠️ Slika nije pronađena na:', imagePath);
    } else {
        console.log('✅ Slika uspešno snimljena na:', imagePath);
    }
    });
});

console.log('✅ Upload router loaded');


module.exports = router;
