import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../../../public");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 3, //3 MBs
    },
}).single("img");

export { upload };
