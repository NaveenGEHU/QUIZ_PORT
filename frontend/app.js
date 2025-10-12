// ---------------- OPEN NEW PAGE FUNCTION ----------------
function openPage(url) {
    window.location.href = url;
}
let current_test_key='';
//---------------------------- getting ending of the test creation trigger------------------------------------------------


 function savetest() {
    while (Test != null) {
        console.log(Test.statement,Test.optionA,Test.optionB,Test.optionC,Test.optionD,Test.answer);
        const questionData = new FormData();
        questionData.append('key', current_test_key);
        questionData.append('statement', Test.statement);
        questionData.append('opt1', Test.optionA);
        questionData.append('opt2', Test.optionB);
        questionData.append('opt3', Test.optionC);
        questionData.append('opt4', Test.optionD);
        questionData.append('answer', Test.answer);

         fetch('http://localhost/myprojects/Quiz_creating_and_sorting_platfrom/server/create_test.php',
            {
                method: 'Post', body: questionData
            });
        Test = Test.next;
    }
}




//-----------------------Creating test----------------------------------
const stop = document.getElementById("create_test_button");
if (stop) {
    stop.addEventListener("click", function (e) {
        e.preventDefault();
        if (!Test) {
            alert("Error ! Test can't be empty add questions to create a test ");
        }
        else {
            element=document.getElementById('createquestion_container');
            element.innerHTML=`
            <h1>CREATE TEST KEY</h1>
            <form id ="createTestKey">
            <label for="testkey">Enter to make an identification for test</label><br>
            <input type="text" id="testkey" placeholder="eg. English test 1" required><br>
            <button type="submit" id="confirm_button">Confirm </button>
        </form> `
    const test_key_trigger = document.getElementById('createTestKey');
    if (test_key_trigger) {
    test_key_trigger.addEventListener('submit', function (e) {
        e.preventDefault();
        current_test_key = document.getElementById('testkey').value.trim();
        savetest();
        openPage('teacherdashboard.html');
    });
    }
        }
    }
    );
}





const addQuestion = document.getElementById("add_question_form");
if (addQuestion) {
    addQuestion.addEventListener('submit', function (e) {
        e.preventDefault();
        addquestion();
    });
}

function addquestion() {
    const statement = document.getElementById("question").value;
    const opt1 = document.getElementById("opt1").value;
    const opt2 = document.getElementById("opt2").value;
    const opt3 = document.getElementById("opt3").value;
    const opt4 = document.getElementById("opt4").value;
    const ans = document.getElementById("correct_opt").value;
    if (!Test) {
        Test = new Question(statement, opt1, opt2, opt3, opt4, ans);
        return;
    }
    let last = Test;
    while (last.next != null) {
        last = last.next;
    }
    last.next = new Question(statement, opt1, opt2, opt3, opt4, ans);
    last.next.prev = last;
    document.getElementById("add_question_form").reset();
}
let students = [];
let teachers = [];

let Test = null;
//--------------------------Question Class------------------------------
class Question {
    statement = "";
    optionA = "";
    optionB = "";
    optionC = "";
    optionD = "";
    answer = "";
    next = null;
    prev = null;
    constructor(statement, optionA, optionB, optionC, optionD, answer) {
        this.statement = statement;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.answer = answer;
    }
};












// -------------------------Teacher Class----------------------
class teacher {
    full_name;
    teacher_email;
    teacher_password;
    constructor(full_name, teacher_email, teacher_password) {
        this.full_name = full_name;
        this.teacher_email = teacher_email;
        this.teacher_password = teacher_password;
    }

};

// ---------------- STUDENT CLASS ----------------
class student {
    id;
    name;
    password;
    section;
    course;
    rollno;
    constructor(id, name, password, section, course, rollno) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.section = section;
        this.course = course;
        this.rollno = rollno;
    }
};

//----------------------FETCHING TEACHER DATA-----------------------------------------------------------


fetch('http://localhost/myprojects/Quiz_creating_and_sorting_platfrom/server/fetchdb_teacher.php')
    .then(response_teacher => {
        if (!response_teacher.ok) {
            throw new Error("UNABLE TO FETCH DATA FROM DATABASE" + response.statusText);
        }
        return response_teacher.json();
    })
    .then(data_teacher => {
        // console.log("Raw data from PHP:", data_teacher);
        teachers = data_teacher.map(row_teacher => new teacher(row_teacher.name, row_teacher.email, row_teacher.password));
    }
    )
    .catch(error_teacher => {
        console.error("Error fetching data:", error_teacher);
    }
    );

// ---------------- FETCH STUDENT DATA FROM DATABASE ----------------
fetch('http://localhost/myprojects/Quiz_creating_and_sorting_platfrom/server/fetch_dbstudent.php')   // ✅ fixed path
    .then(response => {
        if (!response.ok) {
            throw new Error("UNABLE TO FETCH DATA FROM DATABASE" + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // console.log("Raw data from PHP:", data);

        students = data.map(row => new student(row.id, row.name, row.password, row.section, row.course, row.rollno));
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    }
    );
// ---------------- ADD EVENT LISTENER ----------------
const studentregister = document.querySelector('#student_registration_form');
if (studentregister) {
    studentregister.addEventListener('submit', function (e) {
        e.preventDefault();
        registerStudent();
    });
}

const event_teacher_register = document.querySelector('#teacher_registration_form');
if (event_teacher_register) {
    event_teacher_register.addEventListener('submit', function (e) {
        e.preventDefault();
        teacher_register();
    }
    );
}
// ---------------- REGISTER STUDENT FUNCTION ----------------
function registerStudent() {
    const newid = document.getElementById("reg_student_id").value.trim();
    const newname = document.getElementById("reg_student_name").value.trim();
    const newpass = document.getElementById("reg_student_password").value.trim();
    const newsec = document.getElementById("reg_student_section").value.trim();
    const newcourse = document.getElementById("reg_student_course").value.trim();
    const newrollno = document.getElementById("reg_student_roll").value.trim();

    const new_student = new student(newid, newname, newpass, newsec, newcourse, newrollno);

    // Check duplicates in local JS array
    for (let i = 0; i < students.length; i++) {
        if (students[i].id == newid || (students[i].rollno == newrollno && students[i].section == newsec && students[i].course == newcourse)) {
            alert("❌ REGISTRATION FAILED: ACCOUNT ALREADY EXISTS!");
            return;
        }
    }

    // Prepare FormData to send to backend
    const formData = new FormData();
    formData.append('id', newid);
    formData.append('name', newname);
    formData.append('password', newpass);
    formData.append('section', newsec);
    formData.append('course', newcourse);
    formData.append('rollno', newrollno);

    // Send data to PHP
    fetch('http://localhost/myprojects/Quiz_creating_and_sorting_platfrom/server/register_student.php', {   // ✅ fixed path
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then(result => {
            alert(result);

            students.push(new_student);
            document.getElementById('student_registration_form').reset();
            openPage('studentdashboard.html');
        })
        .catch(err => console.error('Error:', err));
}

// ---------------- LOGIN VALIDATION ----------------

const studentlogin = document.querySelector('#student_login_form');
if (studentlogin) {
    studentlogin.addEventListener('submit', function (e) {
        e.preventDefault();
        student_validate_login();
    });
}
function student_validate_login() {
    let login_id = document.getElementById('student_id').value.trim();
    let login_pass = document.getElementById('student_password').value.trim();
    for (let i = 0; i < students.length; i++) {
        if (login_id == students[i].id && login_pass == students[i].password) {
            openPage('studentdashboard.html');
            return;
        }
    }
    alert("Account doesnot exist create one!");

}


const event_login_teacher = document.querySelector('#teacher_login_form');
if (event_login_teacher) {
    event_login_teacher.addEventListener('submit', function (e) {
        e.preventDefault();
        teacher_validate_login();
    });
}

// ---------------- TEACHER REGISTER FUNCTIONS ----------------
function teacher_register() {
    const teacher_fn = document.getElementById("teacher_fullname").value.trim();
    const teacher_email = document.getElementById("teacher_email").value.trim();
    const teacher_pass = document.getElementById("teacher_password").value.trim();
    const newteacher = new teacher(teacher_fn, teacher_email, teacher_pass);
    for (let i = 0; i < teachers.length; i++) {
        if (teacher_email == teachers[i].teacher_email) {
            alert("ACCOUNT ALREADY EXITS! : PLEASE LOGIN ");
            return;
        }
    }
    const postform = new FormData(); // creating form to send at backend
    postform.append('name', teacher_fn);
    postform.append('email', teacher_email);
    postform.append('password', teacher_pass);
    //SENDING TO PHP
    fetch('http://localhost/myprojects/Quiz_creating_and_sorting_platfrom/server/register_teacher.php', { method: 'POST', body: postform })
        .then(res_reg_teacher => res_reg_teacher.text())
        .then(res_reg_teacher => {
            alert(res_reg_teacher);
            teachers.push(newteacher);
            document.getElementById("teacher_registration_form").reset();
            openPage("teacherdashboard.html");
        })
        .catch(error_for_teacher => console.error("ERROR", error_for_teacher));
}


function teacher_validate_login() {
    const login_teacher_eamil = document.getElementById("login_teacher_email").value.trim();
    const login_teacher_pass = document.getElementById("login_teacher_password").value.trim();
    for (let i = 0; i < teachers.length; i++) {
        if (teachers[i].teacher_email == login_teacher_eamil && teachers[i].teacher_password == login_teacher_pass) {
            openPage("teacherdashboard.html");
            return;
        }
    }
    alert(" ACCOUNT DOESN'T EXIT ! REGISTER FIRST ");
}
// console.log(teachers[i]);

const startTest=document.getElementById('student_test_taking');
if(startTest)
{
startTest.addEventListener('submit',function(e)
{   
    e.preventDefault();
    current_test_key=document.getElementById.value.trim();
    loadtest();
}
 ) ;
}


function loadtest() {
    element=document.getElementById('student_test_taking');
    key=new FormData();
    key.append('key',current_test_key);
    fetch('http://localhost/myprojects/Quiz_creating_and_sorting_platfrom/server/fetch_question.php'
        ,{method:'Post',body:key}
        // Currently key is send at backend to check if the table exite -   ------->>>>. fetch quesion;
    );    element.innerHTML=`
    <div id = "taking_test_container">
    <input class  = "option" type="radio" ><div></div><br>
    <input class  = "option" type="radio" ><div></div><br>
    <input class  = "option" type="radio" ><div></div><br>
    <input class  = "option" type="radio" ><div></div><br>
    <button id="previous_button" >Previous</button>
    <button id="next_button" >Next</button>
</div>`
 }
function loadresult() { }
function sortbysection() { sortbymarks(); }
function sortbymarks() { }

/* */