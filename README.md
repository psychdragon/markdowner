# Markdowner: Simple Markdown Viewer with AI Prompting

Markdowner is a web-based application built with React that allows you to view, edit, and generate markdown content. It features a simple interface for uploading local markdown files, an editor for making changes, a download option, and integration with the DeepSeek-Reasoner AI for generating markdown based on your prompts.

## Features

*   **Markdown Viewing:** Upload and display markdown files rendered as HTML.
*   **In-Browser Editing:** Edit markdown content directly within the application.
*   **Download Functionality:** Download your markdown content (including edited or AI-generated content) as a `.md` file.
*   **DeepSeek-Reasoner AI Integration:** Generate markdown content by providing prompts to the DeepSeek-Reasoner AI.
*   **API Key Management:** Securely store your DeepSeek-Reasoner API key in your browser's local storage via a dedicated settings page.

## Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js) or Yarn

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/psychdragon/markdowner.git
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd markdowner
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or if you use yarn
    # yarn install
    ```
4.  **Start the development server:**
    ```bash
    npm start
    # or if you use yarn
    # yarn start
    ```
    This will open the application in your default web browser at `http://localhost:3000`.

## Usage

1.  **Upload Markdown:** Click on "Upload Markdown File" to select a local `.md` file. The content will be displayed in the viewer.
2.  **Edit Markdown:** If a markdown file is loaded, an "Edit" button will appear. Click it to switch to an editable text area. Make your changes and click "Save" to update the preview.
    *   **Note:** The "Save" button only updates the content within the application. To save changes to a file, use the "Download" button.
3.  **Download Markdown:** Click the "Download" button to save the current markdown content (either uploaded, edited, or AI-generated) to your local machine.
4.  **DeepSeek-Reasoner AI Prompting:**
    *   Click "Show Settings" to open the API settings.
    *   Enter your DeepSeek-Reasoner API Key and click "Save API Key". Your key will be stored securely in your browser's local storage.
    *   In the "Generate Markdown with AI" section, enter a prompt (e.g., "Write a short story about a robot learning to love").
    *   Click "Generate Markdown". The AI-generated content will replace the current markdown in the viewer.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [your_email@example.com] (Replace with your actual email)
Project Link: [https://github.com/psychdragon/markdowner](https://github.com/psychdragon/markdowner)