const load = () => {
    fetch('https://greasyfork.org/en/scripts/396798-mspfa-extras',{cache:'no-store'}).then((r)=>{
        if (r.ok){
            return r.text().then(r => {
                const page = document.createElement('div');
                page.innerHTML = r;
                document.querySelector('#install-button').value = 'Install version ' + page.querySelectorAll('.script-show-version')[1].textContent;
                document.querySelector('.total-installs').textContent = 'Total installs: ' + page.querySelectorAll('.script-show-total-installs')[1].textContent;
            });
        } else {
            console.warn('shit!');
        }
    });
}