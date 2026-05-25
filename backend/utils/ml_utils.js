const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const runLungInference = (imagePath) => {
    return new Promise((resolve, reject) => {

        // ✅ Try venv python first, fall back to system python
        const venvPython = path.join(__dirname, '../ml/venv/Scripts/python.exe');
        const pythonExecutable = fs.existsSync(venvPython) ? venvPython : 'python';

        const scriptPath = path.join(__dirname, '../ml/inference.py');
        const modelPath = path.join(__dirname, '../ml/lung_model.h5');

        // ✅ Check all required files exist before spawning
        if (!fs.existsSync(scriptPath)) {
            return reject(new Error(`inference.py not found at: ${scriptPath}`));
        }
        if (!fs.existsSync(modelPath)) {
            return reject(new Error(`lung_model.h5 not found at: ${modelPath}`));
        }
        if (!fs.existsSync(imagePath)) {
            return reject(new Error(`Image not found at: ${imagePath}`));
        }

        console.log("Running Python:", pythonExecutable);
        console.log("Script:", scriptPath);
        console.log("Model:", modelPath);
        console.log("Image:", imagePath);

        const pythonProcess = spawn(pythonExecutable, [scriptPath, imagePath, modelPath]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
            console.log("Python stderr:", data.toString()); // ✅ Log warnings
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python exited with code ${code}. Error: ${errorString}`);
                return reject(new Error(errorString || `Python exited with code ${code}`));
            }
            try {
                const lines = dataString.trim().split('\n');
                const lastLine = lines[lines.length - 1];
                const result = JSON.parse(lastLine);
                if (result.error) {
                    return reject(new Error(result.error));
                }
                resolve(result);
            } catch (err) {
                console.error("Failed to parse result. Raw output:", dataString);
                reject(new Error("Failed to parse prediction results: " + err.message));
            }
        });
    });
};

module.exports = { runLungInference };