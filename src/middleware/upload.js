import fs from 'fs';
import path from 'path';
import multer from 'multer';

const store = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdir(path, { recursive: true }, function (err) {
            if (err) return cb(err);
            cb(null, "uploads/photos");
        });
    },
    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('_');
        cb(null, name + '-' + Date.now());
    }
});

export const upload = multer({
    storage: store,
    limits: {
        // No limits (You can adjust these values based on your requirements)
        fileSize: undefined,
    },
}).single('file');
