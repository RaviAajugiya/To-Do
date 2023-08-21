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

let list = [];
let active = [];
let completed = [];


const emptyList = noData.hidden = false;
todoInput.hidden = true

// document.querySelector('body').addEventListener('click', () => {
//     todoInput.removeEventListener('click', searchList);
//     // console.log('removed');
// })

const updateUI = (e, obj = list) => {
    console.log('ui');
    if (obj.length == 0) {
        noData.hidden = false;
    } else {
        noData.hidden = true;
    }

    obj.forEach((curr, i) => {
        curr.id = i + 1
    })

    console.log(e?.target.id);


    switch (e?.target.id) {
        case 'activebtn':
            main.innerHTML = '';
            obj.forEach((curr, i) => {
                let html = `
                    <div class="listContainer">
                    <div>
                        <input type="checkbox" id="list${curr.id}" name="list${curr.id}" class="list">
                        <label for="list${curr.id}">${curr.task}</label>
                    </div>
                    <div>
                        <img id="edit" src="Icon/edit.png" alt="">
                        <img src="Icon/backspace-arrow.png" alt="">
                    </div>
                    </div>`

                if(curr.active){
                    main.insertAdjacentHTML('afterbegin', html);
                }
            })
        break;

        case 'completebtn':
            main.innerHTML = '';
            obj.forEach((curr, i) => {
                let html = `
                    <div class="listContainer">
                    <div>
                        <input type="checkbox" id="list${curr.id}" name="list${curr.id}" class="list">
                        <label for="list${curr.id}">${curr.task}</label>
                    </div>
                    <div>
                        <img id="edit" src="Icon/edit.png" alt="">
                        <img src="Icon/backspace-arrow.png" alt="">
                    </div>
                    </div>`
                if(!curr.active){
                    main.insertAdjacentHTML('afterbegin', html);
                }
            })
        break;

        default:
            main.innerHTML = '';
            obj.forEach((curr, i) => {
                let html = `
                    <div class="listContainer">
                    <div>
                        <input type="checkbox" id="list${curr.id}" name="list${curr.id}" class="list">
                        <label for="list${curr.id}">${curr.task}</label>
                    </div>
                    <div>
                        <img id="edit" src="Icon/edit.png" alt="">
                        <img src="Icon/backspace-arrow.png" alt="">
                    </div>
                    </div>`
                main.insertAdjacentHTML('afterbegin', html);
            })
        break;
    }


    listElement = document.querySelectorAll('.list');

    listElement.forEach((curr) => {
        curr.addEventListener('change', () => {
            list.find((item) => item.id == curr.id.slice(-1)).toggle();
        })
    })

    obj.forEach(li => {
        li.toggle = function () {
            this.active = !this.active;
        }
        if (!li.active) {
            document.querySelector(`#list${li.id}`).checked = true;
        }
    })
}

const checkExist = (search) => {
    let arrObj = [];
    // console.log('check',search);

    list.forEach((curr) => {
        arrObj.push(Object.values(curr));
    })
    // console.log(arrObj.flat());
    // console.log(arrObj.flat().includes(search));
    return arrObj.flat().includes(search)
}

//add functionalaity
const addList = (e) => {
    if (e.key === 'Enter' && todoInput.value.trim() != '' && !checkExist(todoInput.value.trim())) {
        list.push({
            task: `${todoInput.value.trim()}`,
            active: true,
            completed: false
        });
        // console.log(list);
        todoInput.value = '';
        updateUI(undefined);
        noData.hidden = true;
    }
}

const addHandler = () => {
    todoInput.removeEventListener('keyup', searchHandler);
    noData.hidden = true;
    todoInput.hidden = false;
    updateUI(undefined);
    todoInput.focus();
    todoInput.addEventListener('keyup', addList);
}
add.addEventListener('click', addHandler);


const searchHandler = (e) => {
    if (e.key === 'Enter' && checkExist(todoInput.value.trim())) {
        updateUI(undefined, [{
            task: `${todoInput.value.trim()}`
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
            updateUI(undefined);
            list.forEach((curr, i) => {
                document.querySelector(`#list${curr.id}`).checked = false;
                curr.active = true
                curr.completed = false
            })

            break;

        case 'select':
            updateUI(undefined);
            list.forEach((curr) => {
                document.querySelector(`#list${curr.id}`).checked = true;
                curr.completed = true
                curr.active = false
            })
            break;
    }

}

select.addEventListener('change', selectionHandler);

const sortHandler = () => {
    let mixList = list.map((curr) => Number(curr.task) || curr.task);
    let numList = mixList.filter((curr) => typeof (curr) == 'number').sort((a, b) => b - a);
    let strList = mixList.filter((curr) => typeof (curr) == 'string').sort();
    let sortedList = [...numList, ...strList].map(curr => {
        return {
            id: 'temp',
            task: curr,
            active: true,
            completed: false
        }
    });

    let sortType = sort.value;
    switch (sortType) {
        case 'A-Z':
            updateUI(undefined, sortedList.reverse());
            break;
        case 'Z-A':
            updateUI(undefined, sortedList);
            break;
        case 'newest':
            updateUI(undefined, list)
            break;
        case 'oldest':
            updateUI(undefined, list.slice().reverse())
            break;
    }
}
sort.addEventListener('change', sortHandler);



// const activeHandler = () => {
//     list.forEach((curr) => {
//         if(document.querySelector(`#list${curr.id}`).checked){
//             console.log(curr.id);
//             curr.active = false;
//             curr.completed = true;
//         }
//     })
//     active = list.filter(curr => curr.active)
//     updateUI(active)
// }

// activeBtn.addEventListener('click', activeHandler);

// const completeHandler = () => {
//     list.forEach((curr) => {
//         if(document.querySelector(`#list${curr.id}`).checked){
//             console.log(curr.id);
//             curr.active = false;
//             curr.completed = true;
//         }
//     })
//     completed = list.filter(curr => !curr.active)
//     updateUI(completed)
// }

// completeBtn.addEventListener('click', completeHandler);

// const allHandler = () => {
//     updateUI();
// }

// allBtn.addEventListener('click', allHandler);

allBtn.addEventListener('click', updateUI);
activeBtn.addEventListener('click', updateUI);
completeBtn.addEventListener('click', updateUI);
