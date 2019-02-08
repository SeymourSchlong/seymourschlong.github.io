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
        name: "WLD",
        link: "https://github.com/SeymourSchlong/WLD",
        desc: "A digital recreation of the classic puzzle named \"Klotski\".",
        img: "https://seymourschlong.github.io/images/wld-icon.png"
    },
    {
        name: "Game & Watch - Ball",
        link: "https://github.com/SeymourSchlong/Ball",
        desc: "My attempt at recreating the first Game & Watch game: Ball.",
        img: "https://seymourschlong.github.io/images/ball-icon.png"
    },
    {
        name: "Frogger",
        link: "https://github.com/SeymourSchlong/Frogger",
        desc: "A recreation of the classic game Frogger.",
        img: "https://seymourschlong.github.io/images/frogger-icon.png"
    },
    {
        name: "Number Guessing Game",
        link: "https://github.com/SeymourSchlong/Guessing_Game",
        desc: "A guessing game which uses an excessive amount of 3D smileys.",
        img: "https://seymourschlong.github.io/images/guess-icon.png"
    },
    {
        name: "Breakout",
        link: "https://github.com/SeymourSchlong/Breakout",
        desc: "A pathetic attempt at recreating Breakout.",
        img: "https://seymourschlong.github.io/images/breakout-icon.png"
    },
    {
        name: "Pong",
        link: "https://github.com/SeymourSchlong/Pong",
        desc: "An equally pathetic attempt at recreating Pong.",
        img: "https://seymourschlong.github.io/images/pong-icon.png"
    }
];

window.onload = () => addProjects();