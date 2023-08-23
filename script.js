const todoInput = document.querySelector('#todo');
const add = document.querySelector('#add')
const search = document.querySelector('#search')

const allBtn = document.querySelector('#allbtn');
const activeBtn = document.querySelector('#activebtn');
const completeBtn = document.querySelector('#completebtn');

const edit = document.querySelector('#edit');
const noData = document.querySelector('h3');
const main = document.querySelector('.main');

const select = document.getElementById('select');
const sort = document.getElementById('sort');
let listElement;
let listEdit;
let listDelete;

let list = [];
let active = [];
let completed = [];

let arr;


const emptyList = noData.hidden = false;
todoInput.hidden = true



const updateUI = (e, obj = list) => {
    arr = obj
    updateUI.currList = obj;
    // console.log('ui', obj);
    if (obj.length == 0) {
        noData.hidden = false;
    } else {
        noData.hidden = true;
    }

    obj.forEach((curr, i) => {
        curr.id = i + 1
    })

    // console.log(e?.target.id);
    main.innerHTML = '';
    let html;
    obj.forEach((curr, i) => {
        html = `<div class="listContainer">
                    <div class="left">
                        <input type="checkbox" id="list${curr.id}" name="list${curr.id}" class="list">
                        <label id="label${curr.id}" for="list${curr.id}">${curr.task}</label>
                        <input hidden type="text" id="areaedit${curr.id}" class="areaedit">
                    </div>
                    <div class="right">
                        <img id="edit${curr.id}" class="edit" src="Icon/edit.png" alt="">
                        <img id="delete${curr.id}" class="delete" src="Icon/backspace-arrow.png" alt="">
                    </div>
                </div>`

        main.insertAdjacentHTML('afterbegin', html);
    })

    listElement = document.querySelectorAll('.list');

    listEdit = document.querySelectorAll('.edit');
    listEdit.forEach((li) => {
        li.addEventListener('click', editHandle)
    })

    listDelete = document.querySelectorAll('.delete');
    listDelete.forEach((li) => {
        li.addEventListener('click', delHandle)
    })
    

    obj.forEach(li => {
        li.toggle = function () {
            this.active = !this.active;
        }
        if (!li.active) {
            console.log(li.id, document.querySelector(`#list${li.id}`));
            document.querySelector(`#list${li.id}`).checked = true;
        }
    })

    listElement.forEach((curr) => {
        curr.addEventListener('change', () => {
            list.find((item) => item.id == curr.id.slice(-1)).toggle();
        })
    })
}


const sortHandler = () => {
    let listCopy = arr.slice();
        listCopy.sort((a, b) => {
            if (!isNaN(a.task) && !isNaN(b.task)) {
                return parseInt(a.task) - parseInt(b.task);
            }
            if (!isNaN(a.task)) {
                return -1;
            }
            if (!isNaN(b.task)) {
                return 1;
            }
            return a.task.localeCompare(b.task);
        });
    console.log('lc',listCopy);
    console.log('li',arr);

    let listtime = arr.slice();
        listtime.sort((a, b) => {
            if (!isNaN(a.time) && !isNaN(b.time)) {
                return parseInt(a.time) - parseInt(b.time);
            }
            if (!isNaN(a.time)) {
                return -1;
            }
            if (!isNaN(b.time)) {
                return 1;
            }
            return a.time.localeCompare(b.time);
        });

        console.log('obj', updateUI.currList);
        console.log('listtime',listtime);

    let sortType = sort.value;
    switch (sortType) {
        case 'A-Z':
            updateUI(undefined, listCopy.reverse());
            break;
        case 'Z-A':
            updateUI(undefined, listCopy);
            break;

        case 'newest':
            updateUI(undefined, listtime)
            break;
        case 'oldest':
            updateUI(undefined, listtime.slice().reverse())
            break;
    }
}
sort.addEventListener('change', sortHandler);


const editHandle = (e) => {
    let editid = e.target.id.slice(-1);
    let editInput = document.querySelector(`#area${e.target.id}`);
    editInput.hidden = false;
    editInput.focus();

    let labeledit = document.querySelector(`#label${e.target.id.slice(-1)}`);
    labeledit.hidden = true;
    console.log('editinp', editInput);

    editInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            labeledit.hidden = false;
            list.find((item) => item.id == editid).task = labeledit.textContent = editInput.value;
            editInput.hidden = true;
        }
    })
}

const delHandle = (e) => {
    let delId = e.target.id.slice(-1)
    console.log(delId);
    console.log(list.findIndex((item) => item.id == delId));
    list.splice(list.findIndex((item) => item.id == delId), 1);
    updateUI(undefined)

}

const checkExist = (search) => {
    let arrObj = [];
    list.forEach((curr) => {
        arrObj.push(Object.values(curr));
    })
    return arrObj.flat().includes(search)
}

//add functionalaity
let counter = 0;
const addList = (e) => {
    if (e.key === 'Enter' && todoInput.value.trim() != '' && !checkExist(todoInput.value.trim())) {
        counter++;
        // console.log(counter);
        list.push({
            task: `${todoInput.value.trim()}`,
            active: true,
            time: counter
        });

        // console.log(list);
        todoInput.value = '';
        updateUI(undefined, activeFind());
        noData.hidden = true;

    }
}

const addHandler = () => {
    todoInput.removeEventListener('keyup', searchHandler);
    noData.hidden = true;
    todoInput.hidden = false;
    todoInput.focus();
    updateUI(undefined, activeFind());
    todoInput.addEventListener('keyup', addList);
}
add.addEventListener('click', addHandler);


const searchHandler = (e) => {
    if (e.key === 'Enter' && checkExist(todoInput.value.trim())) {
        updateUI(undefined, [{
            task: `${todoInput.value.trim()}`,
            active: true,
            completed: false
        }]);
    } else if (e.key === 'Enter' && !list.includes(todoInput.value.trim())) {
        todoInput.value = '';
        updateUI(undefined, []);
    } else if (e.key === 'Enter' || todoInput.value.trim() == '') {
        updateUI(undefined);
    }
}

const searchList = () => {
    todoInput.removeEventListener('keyup', addList);
    todoInput.focus();
    todoInput.addEventListener('keyup', searchHandler);
}

search.addEventListener('click', searchList);


let del;
const selectionHandler = () => {
    console.log(list);
    switch (select.value) {
        case 'delete':
            del = list.filter(curr => document.querySelector(`#list${curr.id}`).checked);
            console.log('del', del);
            console.log('l', list);
            list = list.filter(item => !del.some(d => d.id === item.id));
            updateUI(undefined)
            break;

        case 'unselect':
            console.log(list);
            list.forEach((curr, i) => {
                document.querySelector(`#list${curr.id}`).checked = false;
                curr.active = true;
                console.log("unsel");
            })

            break;

        case 'select':
            list.forEach((curr) => {
                document.querySelector(`#list${curr.id}`).checked = true;
                curr.active = false
            })
            break;
    }


}

select.addEventListener('change', selectionHandler);

let activeFind = () => {
    return list.filter(curr => curr.active);
}

allBtn.addEventListener('click', updateUI);
activeBtn.addEventListener('click', () => {
    console.log('act', active);
    updateUI(undefined, activeFind());
});

completeBtn.addEventListener('click', () => {
    completed = list.filter(curr => !curr.active)
    console.log('comp', completed);
    updateUI(undefined, completed);
});




        // listtime.sort((a, b) => {
        //     if (!isNaN(a.time) && !isNaN(b.time)) {
        //         return parseInt(a.key) - parseInt(b.time);
        //     }
        //     if (!isNaN(a.time)) {
        //         return -1;
        //     }
        //     if (!isNaN(b.time)) {
        //         return 1;
        //     }
        //     return a.time.localeCompare(b.time);
        // });

        // console.log(listtime);


// let listCopy = [
//     {task: '5'},
//     {task: 'zds'},
//     {task: 'ewr'},
//     {task: 'as5'},
//     {task: '35'}
// ];

// let li = listCopy;
// console.log(listCopy);
//         li.sort((a, b) => {
//             if (!isNaN(a.task) && !isNaN(b.task)) {
//                 return parseInt(a.task) - parseInt(b.task);
//             }
//             if (!isNaN(a.task)) {
//                 return -1;
//             }
//             if (!isNaN(b.task)) {
//                 return 1;
//             }
//             return a.task.localeCompare(b.task);
//         });
//     console.log('lc',li);

function selectButton(clickedButton) {
    // Reset the background color of all buttons
    var buttons=document.querySelectorAll('.button');

    buttons.forEach(function(button) {
            button.style.backgroundColor= '#0076ff';
        });

    // Set the background color of the clicked button to white
    clickedButton.style.backgroundColor='white';
}
function selectBtn(clickedButton) {
    // Reset the background color of all buttons
    var btns=document.querySelectorAll('.btn');

    btns.forEach(function(button) {
            button.style.backgroundColor= '#0076ff';
        });

    // Set the background color of the clicked button to white
    clickedButton.style.backgroundColor='white';
}