import catchRouteError from '../utils/catchRouteError.js';
import axios from 'axios';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import { firebaseApp, firebaseStorage } from '../../firebase.js';
import deleteFileFromDisk from '../utils/deleteFileFromDisk.js';

const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);

// TODO: limit size of audio file to 200ko ?
// TODO: make sure chat gpt answer isn't too big ?

// const url = await firebaseStorage
//     .file('audioFileFromAssistant/ecc831da-aac4-4901-a17b-acacf9687130.mp3')
//     .getSignedUrl({ action: 'read', expires: '2030-01-01' });

// return res.json({
//     status: 'ok',
//     url: url[0],
// });

export const askAssistant = catchRouteError(async (req, res) => {
    // Get file from disk with Multer
    const audioFileFromMulter = req.file;

    if (!audioFileFromMulter) return res.sendStatus(400);

    const filename = audioFileFromMulter.filename;
    let uid;

    // query the collection admin from firestore
    const admin = await firebaseApp
        .firestore()
        .collection('admin')
        .doc('admin')
        .get();

    if (!admin.data().on) {
        deleteFileFromDisk(filename);
        return res.sendStatus(500);
    }

    // Verify ID token from Firebase
    const token = req.headers.token;

    if (!token) {
        deleteFileFromDisk(filename);
        return res.status(401).send('Unauthorized');
    }

    try {
        const decodedToken = await firebaseApp.auth().verifyIdToken(token);
        uid = decodedToken.uid;
    } catch (err) {
        deleteFileFromDisk(filename);
        return res.status(401).send('Unauthorized');
    }

    try {
        // increment the nbRequest field in firestore for the user
        const user = await firebaseApp
            .firestore()
            .collection('users')
            .doc(uid)
            .get();

        if (user.data() && user.data().nbRequest >= 50) {
            deleteFileFromDisk(filename);
            return res.sendStatus(429);
        }

        if (!user.data()) {
            firebaseApp.firestore().collection('users').doc(uid).set({
                nbRequest: 1,
            });
        } else {
            firebaseApp
                .firestore()
                .collection('users')
                .doc(uid)
                .update({
                    nbRequest: user.data().nbRequest + 1,
                });
        }
    } catch (err) {
        console.log(
            'Error while incrementing nbRequest field in firestore',
            err
        );
    }

    // Upload uploaded audio file to Firebase Storage
    try {
        firebaseStorage.upload(`../uploadedAudioFiles/${filename}`, {
            destination: `uploadedAudioFiles/${filename}`,
            metadata: {
                contentType: 'audio/mpeg',
            },
        });
    } catch (err) {
        console.log(
            'Error while uploading audio file from user to firebase',
            err
        );
    }

    console.time('Whisper');
    const resp = await openai.createTranscription(
        // @ts-ignore
        fs.createReadStream(`../uploadedAudioFiles/${filename}`),
        'whisper-1',
        'The transcript is about OpenAI which makes technology like DALL·E, GPT-3, and ChatGPT with the hope of one day building an AGI system that benefits all of humanity',
        'json',
        0,
        'en'
    );
    console.timeEnd('Whisper');

    deleteFileFromDisk(`../uploadedAudioFiles/${filename}`);

    // Upload what user asked to firestore
    try {
        await firebaseApp
            .firestore()
            .collection('users')
            .doc(uid)
            .collection('requests')
            .add({
                text: resp.data.text,
                timestamp: new Date().getTime(),
                filename,
            });
    } catch (err) {
        console.log('Error while uploading user text in firestore', err);
    }

    // Whisper has finished processing the audio file
    // @ts-ignore
    const text = resp.data.text;

    console.time('GPT-3.5 turbo');
    // Send text to GPT
    const gptRes = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        // client should send the whole conversation history (or I save it in firestore?)
        messages: [
            {
                role: 'user',
                content: `Give me an answer to this prompt in less than 500 characters: "${text}"`,
                // content: 'Say "hello"',
            },
        ],
    });
    console.timeEnd('GPT-3.5 turbo');

    console.time('Beam Tacotron2');
    // Send GPT response to ElevenLabs
    const resTacotron = await axios.post(
        'https://beam.slai.io/rsc23',
        {
            text: gptRes.data.choices[0].message.content,
        },
        {
            headers: {
                Authorization:
                    'Basic MDdiMmY0NjU0NDg2ZjNkZWFlYjQ5N2EyNTFmMzg1NjQ6MjNjMGZkZmM3OWI1MGQwMDQ4OGUyZTI5ZTY2ZGM4OWY=',
            },
        }
    );
    console.timeEnd('Beam Tacotron2');

    const audioBuffer = Buffer.from(resTacotron.data.audio, 'base64');

    console.time('Writing audio file from assistant file to disk');
    // Save audio file from Tacotron2 to disk
    fs.writeFileSync(`../public/${filename}`, audioBuffer);
    console.timeEnd('Writing audio file from assistant file to disk');

    // Send audio file to the client
    console.log('Sending the url of the file to client...');

    try {
        // Upload audio file from ElevenLabs to Firebase Storage
        firebaseStorage.upload(`../public/${filename}`, {
            destination: `audioFileFromAssistant/${filename}`,
            metadata: {
                contentType: 'audio/mpeg',
            },
        });
    } catch (err) {
        console.log(
            'Error while uploading audio file from ElevenLabs to firebase',
            err
        );
    }

    // TODO: send the url of the file to the client from firebase
    // and delete file from disk directly
    res.send(filename);
});
