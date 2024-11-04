function Formatter(original: string): string[] {
    const lines = original.split('\n');
    console.log(lines);

    let sections: string[] = [];
    let currentSection: string = "";

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check for section separator
        if (line.trim() === '---') {
            if (currentSection) {
                sections.push(currentSection);
                currentSection = "";
            }
            continue;
        }

        // Check for empty line
        if (line.trim() === '') {
            if (currentSection) {
                currentSection += '<p>&nbsp;</p>';
            }
            continue;
        }

        // Check for h3
        if (line.startsWith('### ')) {
            currentSection += `<h3>${line.replace('###', '').trim()}</h3>`;
            continue;
        }
        // Check for h2
        if (line.startsWith('## ')) {
            currentSection += `<h2>${line.replace('##', '').trim()}</h2>`;
            continue;
        }
        // Check for h1
        if (line.startsWith('# ')) {
            currentSection += `<h1>${line.replace('#', '').trim()}</h1>`;
            continue;
        }



        // Apply bold syntax (**text**)
        let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

        // Apply italic syntax (*text*)
        processedLine = processedLine.replace(/\*(.*?)\*/g, '<i>$1</i>');

        // Add the processed line to the current section
        currentSection += `<p>${processedLine}</p>`;
    }

    // Add the last section to the sections array
    if (currentSection) {
        sections.push(currentSection);
    }

    return sections;
}

export default Formatter;