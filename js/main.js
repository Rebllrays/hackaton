// account login 
// show modal login 
let registerUserModalBtn =document.querySelector("#registerUser-modal");
let loginUserModalBtn = document.querySelector("#loginUser-modal");
let registerUserModalBlock = document.querySelector("#registerUser-block");
let loginUserModalBlock = document.querySelector("#loginUser-block");
let registerUserBtn = document.querySelector("#registerUser-btn");
let loginUserBtn = document.querySelector("#loginUser-btn");
let logoutUserBtn = document.querySelector("#logoutUser-btn");
let closeRegisterModalBtn =document.querySelector(".btn-close");

// console.log(registerUserModalBtn, loginUserModalBtn, registerUserModalBlock, loginUserModalBlock, registerUserBtn, loginUserBtn,logoutUserBtn);

registerUserModalBtn.addEventListener('click', () => {
    registerUserModalBlock.setAttribute('style', 'display: flex !important');
    registerUserBtn.setAttribute('style', 'display: flex !important');
    loginUserModalBlock.setAttribute('style', 'display: none !important');
    loginUserBtn.setAttribute('style', 'display: none !important');
});

loginUserModalBtn.addEventListener('click', () => {
    registerUserModalBlock.setAttribute('style', 'display: none !important');
    registerUserBtn.setAttribute('style', 'display: none !important');
    loginUserModalBlock.setAttribute('style', 'display: flex !important');
    loginUserBtn.setAttribute('style', 'display: flex !important');
});

// register logic
const USERS_API = "http://localhost:8006/users";

// inputs group 
let usernameInp = document.querySelector("#reg-username");
let ageInp = document.querySelector("#reg-age");
let passwordInp = document.querySelector("#reg-password");
let passwordConfirmInp = document.querySelector("#reg-passwordConfirm");
let isAdminInp = document.querySelector('#isAdmin');
// console.log(usernameInp, ageInp, passwordInp, passwordConfirmInp, isAdminInp);

async function checkUniqueUsername(username) {
    let res = await fetch(USERS_API);
    let users = await res.json();
    // console.log(users);
    return users.some(item => item.username === username);
};
// checkUniqueUsername();

async function registerUser() {
    if(
        !usernameInp.value.trim() ||
        !ageInp.value.trim() ||
        !passwordInp.value.trim() ||
        !passwordConfirmInp.value.trim()
    ) {
        alert('Some inputs are empty!');
        return;
    }

    let uniqueUsername = await checkUniqueUsername(usernameInp.value);
    if(uniqueUsername) {
        alert('User with this username already exists');
        return;
    }

    if(passwordInp.value !== passwordConfirmInp.value) {
        alert("Passwords don't match!");
        return;
    };

    let userObj = {
        username: usernameInp.value,
        age: ageInp.value,
        password: passwordInp.value,
        isAdmin: isAdminInp.checked
    };
    // console.log(userObj);\

    fetch(USERS_API, {

        method: "POST",
        body: JSON.stringify(userObj),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    console.log("OK!");

    usernameInp.value ="";
    ageInp.value ="";
    passwordInp.value ="";
    passwordConfirmInp.value ="";
    isAdmin.checked =false;

    closeRegisterModalBtn.click();
};

registerUserBtn.addEventListener('click', registerUser);


// login logic 
let showUsername = document.querySelector("#showUsername");

function checkLoginLogoutStatus() {
    let user = localStorage.getItem("user");
    if(!user) {
        loginUserModalBtn.parentNode.style.display = "block";
        logoutUserBtn.parentNode.style.display ="none";
        showUsername.innerText ="No User";
    } else {
        loginUserModalBtn.parentNode.style.display = "none";
        logoutUserBtn.parentNode.style.display ="block";
        showUsername.innerText = JSON.parse(user).username;
    };
    showAdminPanel();
};
checkLoginLogoutStatus();
// localStorage.setItem('user', JSON.stringify({username: "Jack", isAdmin: true}));- for check

let loginUsernameInp = document.querySelector("#login-username");
let loginPasswordInp = document.querySelector("#login-password");

function checkUserInUsers(username, users) {
    return users.some(item => item.username === username);
}

function checkUserPassword(user, password) {
    return user.password === password;
};

function setUserToStorage(username, isAdmin) {
    localStorage.setItem("user", JSON.stringify({
        username, 
        isAdmin
    }));
}

async function loginUser() {
    if(
        !loginUsernameInp.value.trim() ||
        !loginPasswordInp.value.trim()
    ) {
        alert("Some inputs are empty!");
        return;
    };

    let res = await fetch(USERS_API);
    let users = await res.json();

    if(!checkUserInUsers(loginUsernameInp.value, users)) {
        alert("User not found!");
        return;
    };

    let userObj = users.find(item => item.username === loginUsernameInp.value);

    if(!checkUserPassword(userObj, loginPasswordInp.value)) {
        alert("Wrong password!");
        return;
    };

    setUserToStorage(userObj.username, userObj.isAdmin);

    loginUsernameInp.value = "";
    loginPasswordInp.value = "";

    checkLoginLogoutStatus();
    closeRegisterModalBtn.click();

    render();
};

loginUserBtn.addEventListener("click", loginUser);

// logout logic 
logoutUserBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    checkLoginLogoutStatus();
    render();
});

// product logic 
// create
function checkUserForProductCreate() {
    let user = JSON.parse(localStorage.getItem('user'));
    if(user) return user.isAdmin;
    return false;
}

function showAdminPanel() {
    let adminPanel =document.querySelector("#admin-panel");
    if(!checkUserForProductCreate()) {
        adminPanel.setAttribute("style", "display: none !important;");
    } else {
        adminPanel.setAttribute("style", "display: flex !important;");
    };
};

let studentName = document.querySelector("#student-name");
let studentPhoneNumber = document.querySelector("#student-phone");
let studentWeekKpi = document.querySelector("#kpi-week");
let studentMonthKpi = document.querySelector("#kpi-month");
let studentImg = document.querySelector('#student-image');

const STUDENTS_API = "http://localhost:8006/students";
async function createStudent() {
    if(
        !studentImg.value.trim() ||
        !studentName.value.trim() ||
        !studentPhoneNumber.value.trim() ||
        !studentWeekKpi.value.trim() ||
        !studentMonthKpi.value.trim() 
    ) {
        alert("Some inputs are empty!");
        return;
    };

    let studentObj = {
        fullname: studentName.value,
        image: studentImg.value,
        phone: studentPhoneNumber.value,
        weekKpi: studentWeekKpi.value,
        monthKpi: studentMonthKpi.value,
    };


    await fetch(STUDENTS_API, {
        method:"POST",
        body: JSON.stringify(studentObj),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    studentName.value = "";
    studentImg.value = '';
    studentPhoneNumber.value = "";
    studentWeekKpi.value = "";
    studentMonthKpi.value = "";

    render();
};

let addStudentBtn = document.querySelector(".add-student-btn");
addStudentBtn.addEventListener('click', createStudent);

// read
let currentPage =1;
let search ="";


async function render() {
    let studentsList = document.querySelector("#students-list");
    studentsList.innerHTML = "";
    let requestAPI = `${STUDENTS_API}?q=${search}&_page=${currentPage}&_limit=3`;

    let res = await fetch(requestAPI);
    let students = await res.json();

    students.forEach(item => {
        studentsList.innerHTML += `        
        <div class="card m-5" style="width: 18rem;">
        <img src="${item.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Username: ${item.fullname}</h5>
                <p class="card-text">Phone: ${item.phone}</p>
                <p class="card-text">KPI for week: ${item.weekKpi}</p>
                <p class="card-text">KPI for month: ${item.monthKpi}</p>
                ${checkUserForProductCreate() ? `
                <a href="#" class="btn btn-dark btn-edit" id="edit-${item.id}">Edit</a>
                <a href="#" class="btn btn-danger btn-delete" id ="del-${item.id}">Delete</a>
                `: ""}             
            </div>
      </div>`;
    }) ;

    if(students.length === 0) return;
    addDeleteEvent();
    addEditEvent();
};
render();

// delete 
async function deleteProduct(e) {
    // console.log("OK!");
    let studentId = e.target.id.split("-")[1];
    // console.log(studentId);
    await fetch(`${STUDENTS_API}/${studentId}`, {
        method: "DELETE"
    });
    render();
};


function addDeleteEvent() {
    let deleteStudentBtn = document.querySelectorAll(".btn-delete");
    deleteStudentBtn.forEach(item => item.addEventListener("click", deleteProduct));
};

// update 
let saveChangesBtn = document.querySelector(".save-student-btn");
function checkCreateAndSaveBtn() {
    if(saveChangesBtn.id) {
        addStudentBtn.setAttribute("style", "display: none;");
        saveChangesBtn.setAttribute("style", "display: block;");
    } else {
        addStudentBtn.setAttribute("style", "display: block;");
        saveChangesBtn.setAttribute("style", "display: none;");
    }
}
checkCreateAndSaveBtn();

async function addStudentDataToForm(e) {
    let studentId = e.target.id.split("-")[1];
    let res = await fetch(`${STUDENTS_API}/${studentId}`);
    let studentObj = await res.json();

    studentName.value = studentObj.fullname;
    studentPhoneNumber.value = studentObj.phone;
    studentWeekKpi.value = studentObj.weekKpi;
    studentMonthKpi.value = studentObj.monthKpi;
    studentImg.value = studentObj.image;

    saveChangesBtn.setAttribute("id", studentObj.id);

    checkCreateAndSaveBtn();
    render();
};

function addEditEvent() {
    let editStudentBtn = document.querySelectorAll(".btn-edit");
    editStudentBtn.forEach(item => item.addEventListener("click", addStudentDataToForm));
}

async function saveChanges(e) {
    let updatedStudentObj = {
        id: e.target.id,
        fullname:studentName.value,
        image:studentImg.value,
        phone:studentPhoneNumber.value,
        weekKpi:studentWeekKpi.value,
        month:studentMonthKpi.value,
    };

    await fetch(`${STUDENTS_API}/${e.target.id}`, {
        method: "PUT",
        body:JSON.stringify(updatedStudentObj),
        headers: {
            "Content-Type":"application/json;charset=utf-8"
        }
    });

    studentName.value ="";
    studentImg.value ="";
    studentPhoneNumber.value ="";
    studentWeekKpi.value ="";
    studentMonthKpi.value ="";

    saveChangesBtn.removeAttribute("id");
    checkCreateAndSaveBtn();
    render();
};
saveChangesBtn.addEventListener("click", saveChanges);

//search
let searchInp = document.querySelector("#search-inp");
searchInp.addEventListener("input", () => {
    search = searchInp.value;
    currentPage=1;
    render();
});

let prevPageBtn =document.querySelector("#prev-page-btn");
let nextPageBtn =document.querySelector("#next-page-btn");

async function getPagesCount() {
    let res = await fetch(`${STUDENTS_API}`);
    let students = await res.json();
    let pagesCount = +Math.ceil(students.length/2);
    console.log(pagesCount,  typeof pagesCount);
    return pagesCount;
};


async function checkPages() {
    let maxPagesNum = await getPagesCount();
    if(currentPage ===1) {
        prevPageBtn.setAttribute("style", "display:none;");
        nextPageBtn.setAttribute("style", "display:block;");
    } else if(currentPage === maxPagesNum) {
        prevPageBtn.setAttribute("style", "display:block;");
        nextPageBtn.setAttribute("style", "display:none;");
    } else {
        prevPageBtn.setAttribute("style", "display:block;");
        nextPageBtn.setAttribute("style", "display:block;");
    }
};
checkPages();

prevPageBtn.addEventListener("click", () => {
    currentPage--;
    checkPages();
    render();
});

nextPageBtn.addEventListener("click", () => {
    currentPage++;
    checkPages();
    render();
});


