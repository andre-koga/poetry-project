function Formatter(document: Document, original: string): HTMLElement[] {
    const lines = original.split('\n');

    let result: HTMLElement[] = [];
    let currentSection: HTMLElement = document.createElement('section');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // if --- we want to create a new section in the result
        if (line.trim() === "---") {
            result.push(currentSection);
            currentSection = document.createElement('section');
            continue;
        }

        // if the line is empty, we have a break
        else if (line.trim() === "") {
            currentSection.appendChild(document.createElement('br'));
            continue;
        }

        // if the line is a title
        if (line.startsWith("# ")) {
            const title = document.createElement('h1');
            title.innerText = line.replace("#", "").trim();
            currentSection.appendChild(title);
            continue;
        }
        else if (line.startsWith("## ")) {
            const title = document.createElement('h2');
            title.innerText = line.replace("##", "").trim();
            currentSection.appendChild(title);
            continue;
        }
        else if (line.startsWith("### ")) {
            const title = document.createElement('h3');
            title.innerText = line.replace("###", "").trim();
            currentSection.appendChild(title);
            continue;
        }

        // if the line is a list
        if (line.startsWith("- ")) {
            const item = document.createElement('li');
            item.innerText = line.replace("-", "").trim();
            currentSection.appendChild(item);
        }

        // if bold, make only the text between the ** bold
        if (line.includes("***")) {
            const parts = line.split("***");
            const bold = document.createElement('b');
            const italic = document.createElement('i');
            italic.innerText = parts[1];
            bold.appendChild(italic);
            currentSection.appendChild(bold);
        }
        else if (line.includes("**")) {
            const parts = line.split("**");
            const bold = document.createElement('b');
            bold.innerText = parts[1];
            currentSection.appendChild(bold);
        }
        else if (line.includes("*")) {
            const parts = line.split("*");
            const italic = document.createElement('i');
            italic.innerText = parts[1];
            currentSection.appendChild(italic);
        }

        // if it's a normal line
        else {
            const paragraph = document.createElement('p');
            paragraph.innerText = line;
            currentSection.appendChild(paragraph);
        }
    }

    // add the last section
    result.push(currentSection);

    return result;
}

export default Formatter;