'use strict';

const addProjects = () => {
    const table = document.getElementById('projects');

    console.log(table);
    
    const projectBody = document.getElementById('p-body');

    for (let i = 0; i < projects.length; i++) {
        let project = projects[i];

        // Add break
        let newBreak = document.createElement('tr');
        newBreak.style.height = '10px';
        projectBody.appendChild(newBreak);


        let titleAndImage = document.createElement('tr');
        titleAndImage.id = `title-${i}`;

        projectBody.appendChild(titleAndImage);

        // Add title
        let titleLink = document.createElement('a');
        titleLink.textContent = project.name;
        titleLink.href = project.link;

        let newTitle = document.createElement('th');
        newTitle.appendChild(titleLink);
        newTitle.className = 'project-title';

        titleAndImage.appendChild(newTitle);

        // Add image
        let image = document.createElement('img');

        image.src = project.img;
        
        let newImage = document.createElement('td');
        newImage.rowSpan = '2';
        newImage.style.width = '128px';
        newImage.style.height = '128px';
        newImage.appendChild(image);

        titleAndImage = document.getElementById(`title-${i}`);

        titleAndImage.appendChild(newImage);

        // Add desc
        let newDesc = document.createElement('td');
        newDesc.textContent = project.desc;
        let newRow = document.createElement('tr');
        newRow.appendChild(newDesc);

        projectBody.appendChild(newRow);
    }
}

const projects = [
    {
        name: "Card Creator/Calculator",
        link: "https://seymourschlong.github.io/captcha",
        desc: "A tool that allows you to easily create your own CAPTCHA Card, or calculate the result of two cards with the calculator using the same methods from Homestuck.",
        img: "https://seymourschlong.github.io/images/captchacard-icon.png"
    },
    {
        name: "Minesweeper",
        link: "https://seymourschlong.github.io/minesweeper",
        desc: "Oh you think you're good at minesweeper?",
        img: "https://seymourschlong.github.io/images/mine-icon.png"
    },
    {
        name: "Vibe",
        link: "https://seymourschlong.github.io/vibe",
        desc: "Get some cool animations to dance to your music! Input a bpm, or tap to sync it, and change the picture when you want.",
        img: "https://seymourschlong.github.io/images/vibe-icon.gif"
    },
    {
        name: "Weedalien",
        link: "https://seymourschlong.github.io/weedalien",
        desc: "Make that alien spin!!",
        img: "https://seymourschlong.github.io/images/weed-icon.png"
    }
];

window.onload = () => addProjects();