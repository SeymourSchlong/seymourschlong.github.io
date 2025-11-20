let saveInfo = {};

const onFileLoad = (data) => {
    data = data.replace('\x00', '');
    saveInfo = JSON.parse(data);
    saveInfo[0].A_Goal = 1;
    document.querySelector('#container').style.display = '';
}

const makeSave = (data) => {
    const saveText = JSON.stringify(data);
    return saveText;
}

const load = () => {
    const uploadSave = document.querySelector('#upload-save');
    const submitSave = document.querySelector('#submit-save');

    uploadSave.addEventListener('change', () => {
        submitSave.disabled = false;
    });

    submitSave.addEventListener('click', () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            onFileLoad(e.target.result);
        }
        reader.readAsText(uploadSave.files[0]);

        document.querySelector('#saveLink').download = uploadSave.files[0].name;
    });

    const saveButton = document.querySelector('#saveButton');
    const saveLink = document.querySelector('#saveLink');

    saveLink.addEventListener('click', () => {
        const blob = new Blob([makeSave(saveInfo)], { type: 'text/plain' });

        saveLink.href = URL.createObjectURL(blob);
    });
}