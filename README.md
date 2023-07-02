# AI Voice Assistant

AI Voice Assistant is a state-of-the-art application enabling user interaction with OpenAI's ChatGPT. The responses are then audibly delivered via ElevenLabs 9a, a highly realistic text-to-speech engine. The project is a fusion of multiple technologies including ExpressJS and React Native, offering a seamless, conversational experience that closely emulates human interaction.

## Getting Started

These instructions will guide you through getting a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following software installed on your local development machine:

- Node.js
- npm (Node Package Manager)
- React Native CLI

You will also need API keys for:

- OpenAI GPT-3
- ElevenLabs 9a 

### Installation Steps

1. Clone the repository
  git clone https://github.com/Kevin-Andries/ai-voice-assistant

2. Navigate to the project directory
  cd ai-voice-assistant

3. Install NPM packages
   npm install

4. Create a `.env` file in the root of your project and insert your API keys:
  OPENAI_API_KEY='Your OpenAI Key'
  ELEVENLABS_API_KEY='Your ElevenLabs Key'


5. Run the app (iOS)
  npx react-native run-ios


Or run the app (Android)
  npx react-native run-android


## Usage

Launch the app on your emulator or device. You will encounter an intuitive interface where you can type your queries or commands. Press the 'Send' button to submit your request. The application interacts with the OpenAI GPT-3 model to provide a response, which is then converted into speech via the ElevenLabs 9a engine.

## Contributing

Your contributions are greatly appreciated. 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Enjoy your interactions with your new AI voice assistant!

Please note: This application utilizes OpenAI's GPT-3 model and ElevenLabs 9a engine. You must comply with all terms and conditions of these services.
