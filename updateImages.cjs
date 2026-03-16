const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\apjve\\Desktop\\Exercícios';
const workDir = 'C:\\Users\\apjve\\.gemini\\antigravity\\scratch\\Recentes\\pele-de-vidro';
const destDir = path.join(workDir, 'public', 'images', 'exercises');
const bankFile = path.join(workDir, 'src', 'data', 'exercisesBank.js');

try {
    if (!fs.existsSync(destDir)){
        fs.mkdirSync(destDir, { recursive: true });
    }

    const files = fs.readdirSync(srcDir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.png' || ext === '.jpeg' || ext === '.webp';
    });

    if (files.length === 0) {
        console.log("No images found in", srcDir);
        process.exit(1);
    }

    const newFiles = [];
    files.forEach((file, index) => {
        const ext = path.extname(file).toLowerCase();
        const newName = `ex_${index + 1}${ext}`;
        fs.copyFileSync(path.join(srcDir, file), path.join(destDir, newName));
        newFiles.push(newName);
    });

    let content = fs.readFileSync(bankFile, 'utf8');
    let i = 0;
    content = content.replace(/image:\s*(".*?"|'.*?'|`.*?`)/g, () => {
        const file = newFiles[i % newFiles.length];
        i++;
        return `image: "/images/exercises/${file}"`;
    });

    fs.writeFileSync(bankFile, content, 'utf8');
    console.log(`SUCCESS: Copied ${files.length} images and updated ${i} exercise image fields.`);
} catch (err) {
    console.error("ERROR:", err.message);
}
