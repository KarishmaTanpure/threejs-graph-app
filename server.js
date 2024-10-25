const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();


app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });


app.post('/upload-xlsx', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
