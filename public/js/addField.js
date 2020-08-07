document.querySelector("#add-time").addEventListener('click', cloneField);

function cloneField() {
    console.log("cloneField")
    const newFieldContainer = document.querySelector('.schedule-item').cloneNode(true);
    const fields = newFieldContainer.querySelectorAll('input');
    fields.forEach(function(field){field = ""});
    document.querySelector('#schedule-items').appendChild(newFieldContainer);
}