import fs from 'fs';

export default function deleteFileFromDisk(filename) {
    fs.unlink(`../uploadedAudioFiles/${filename}`, (err) => {
        if (err) {
            console.log('Error while deleting file', err);
        }
    });
}
