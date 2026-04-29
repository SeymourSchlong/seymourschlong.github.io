const load = () => {
    const grid = document.querySelector('#grid');
    const xSliders = document.querySelectorAll('#movement, #speech');
    const ySliders = document.querySelectorAll('#energy, #thinking');
    const marker = document.querySelector('#marker');

    [...document.querySelectorAll('input[type="range"]')].forEach(slider => {
        slider.addEventListener('input', () => {
            updateMarker();
        })
    });

    const updateMarker = () => {
        let xValue = xSliders[0].valueAsNumber + xSliders[1].valueAsNumber;
        let yValue = ySliders[0].valueAsNumber + ySliders[1].valueAsNumber;

        yValue = 16 - yValue;

        const gridX = Math.floor(xValue / 4);
        const gridY = Math.floor(yValue / 4);

        [...grid.querySelectorAll('div')].forEach((cell, i) => {
            cell.classList.remove('highlight');
            if (i === gridY * 4 + gridX) {
                cell.classList.add('highlight');
            }
        });
    }
}