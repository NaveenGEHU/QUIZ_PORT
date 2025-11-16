// ---------------- NAVIGATION FUNCTION ----------------
// Redirects the user to the specified URL
function openPage(url) {
    window.location.href = url;
}


// ---------------- GLOBAL VARIABLES ----------------
let current_test_key = ''; // Stores the active test key
let Test = null;           // Linked list head for test questions
let currentquestion = null;// Pointer to the currently displayed question
let activeStudent;         // Stores the currently active student object
let activeTeacher;         // Stores the currently active teacher object
let ans_resp = [];         // Array to track student's answers
let testKeys = [];         // GLOBAL TEST KEYS ARRAY
let studentsresult = [];   // Stores the fetched results for display and download

//---------------------------- SAVING TEST QUESTIONS ----------------------------

async function savetest() {
    let questionNode = Test;
    while (questionNode != null) {
        // Prepare question data for backend submission
        const questionData = new FormData();
        questionData.append('key', current_test_key);
        questionData.append('statement', questionNode.statement);
        questionData.append('opt1', questionNode.optionA);
        questionData.append('opt2', questionNode.optionB);
        questionData.append('opt3', questionNode.optionC);
        questionData.append('opt4', questionNode.optionD);
        questionData.append('answer', questionNode.answer);
        
        // Submit question to backend
        const res = await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/create_test.php', {
            method: 'Post',
            body: questionData
        });

        const text = await res.text();

        questionNode = questionNode.next;
    }
}

// ---------------- SAVE ACTIVE STUDENT & TEACHER ----------------
function saveActiveStudent(a) {
    activeStudent = a;
    localStorage.setItem('activeStudent', JSON.stringify(activeStudent));
}

function saveActiveTeacher(a) {
    activeTeacher = a;
    localStorage.setItem('activeTeacher', JSON.stringify(activeTeacher));
}

//----------------------- TEST CREATION EVENT LISTENER -------------------------
const stop = document.getElementById("create_test_button");
if (window.location.pathname.includes("testcreatingpage.html") && Test ) {
  AskUserBeforeReload();
}
if (stop) {
        stop.addEventListener("click", function (e) {
        e.preventDefault();
        if (!Test) {
            alert("Error! Test can't be empty. Add questions to create a test.");
        } else {
           
            prev = document.getElementById('createquestion_container');
            prev.style.display = 'none';
            element = document.getElementById('container');
            element.style.display = 'block';
            element.innerHTML = `
            <h1>CREATE TEST KEY</h1>
            <form id ="createTestKey">
            <label for="testkey">Enter an identification key for the test</label><br>
            <input type="text" id="testkey" placeholder="eg. English test 1" required><br>
            <button type="submit" id="confirm_button">Confirm</button>
        </form> `;

        const test_key_trigger = document.getElementById('createTestKey');
        if (test_key_trigger) {
            test_key_trigger.addEventListener('submit', async function (e) {
                e.preventDefault();

                // Set current test key and save all questions
                current_test_key = document.getElementById('testkey').value.trim();
                await savetest();

                activeTeacher = JSON.parse(localStorage.getItem('activeTeacher'));

                // Send test key mapping to backend
                const testkeyform = new FormData();
                testkeyform.append('test_created', current_test_key);
                testkeyform.append('teacher_email', activeTeacher.teacher_email);

                await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/map_test_key.php', {
                    method: 'Post', 
                    body: testkeyform
                });

                alert("Test saved successfully!");
                openPage('teacherdashboard.html');
              
            });
        }
        }
    });
}



// ------------------- DISPLAY TEST KEYS ----------------
async function showTestKeys() {    //------------------------------------TO BE COMPLETED
    activeTeacher = JSON.parse(localStorage.getItem('activeTeacher'));
    const teacheremail = new FormData();
    teacheremail.append('teacher_email', activeTeacher.teacher_email);

    // Fetch all test keys for the logged-in teacher
    let response = await fetch("http://localhost/myprojects/GIT/QUIZ_PORT/server/getTestKeys.php", {
        method: 'Post',
        body: teacheremail
    });
    let parsed = await response.json();
    if (!parsed.success) {
        alert(parsed.message);
        return;
    }
    let data = parsed.test_keys;
    for (let i = 0; i < data.length; i++) {
        testKeys[i] = data[i].test_created;
    }


}

// --------------------------Render test keys table--------------------------
const TestKeyData =  document.getElementById('TestKeyBox');
if(TestKeyData){
    showTestKeys().then( ()=>{
    let Table= `
    <table class="key-table">
    <thead>
    <tr id="key-head">
        <th>Name of Test</th>
    </tr>
    </thead>
    <tbody>
    `;
    for( let a of testKeys )
    {
        Table+= `<tr><td> ${a}</td></tr>`;
    }

    Table+= `</tbody></table>`;
    TestKeyData.innerHTML=Table;
    });
}

// ------------------- COUNT QUESTIONS ----------------
function QuestionNo() {
    let qno = 1;
    let curr = Test;
    while (curr != null) {
        qno++;
        curr = curr.next;
    }

    const element = document.getElementById('qno');
    if (element) {
        element.innerHTML = `${qno}`;
    }
}

// ------------------- ADD QUESTION EVENT LISTENER ----------------
const addQuestion = document.getElementById("add_question_form");
if (addQuestion) {
    addQuestion.addEventListener('submit', function (e) {
        e.preventDefault();
        addquestion();        
    });
}

// ------------------- ADD NEW QUESTION ----------------
function addquestion() {
    const statement = document.getElementById("question").value;
    const opt1 = document.getElementById("opt1").value;
    const opt2 = document.getElementById("opt2").value;
    const opt3 = document.getElementById("opt3").value;
    const opt4 = document.getElementById("opt4").value;
    const corr = document.getElementsByName("correct_answer");
    let ans = '';

    // Determine selected answer
    for (let a = 0; a < corr.length; a++) {
        if (corr[a].checked == true) {
            ans = corr[a].value;
            break;
        }
    }

    // If first question, initialize Test linked list
    if (!Test) {
        Test = new Question("", statement, opt1, opt2, opt3, opt4, ans);
        QuestionNo();
        document.getElementById("add_question_form").reset();
        return;
    }

    // Append question at end of linked list
    let last = Test;
    while (last.next != null) {
        last = last.next;
    }
    last.next = new Question("", statement, opt1, opt2, opt3, opt4, ans);
    last.next.prev = last;

    QuestionNo();
    document.getElementById("add_question_form").reset();
}

// ------------------- QUESTION CLASS ----------------
class Question {
    qno = "";
    statement = "";
    optionA = "";
    optionB = "";
    optionC = "";
    optionD = "";
    answer = "";
    next = null;
    prev = null;

    constructor(qno = "", statement, optionA, optionB, optionC, optionD, answer) {
        this.qno = qno;
        this.statement = statement;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.answer = answer;
    }
}

// ------------------- TEACHER CLASS ----------------
class teacher {
    full_name;
    teacher_email;
    teacher_password;

    constructor(full_name, teacher_email, teacher_password) {
        this.full_name = full_name;
        this.teacher_email = teacher_email;
        this.teacher_password = teacher_password;
    }
}

// ------------------- STUDENT CLASS ----------------
class student {
    id;
    name;
    password;
    section;
    course;
    rollno;
    marks;

    constructor(id, name, password, section, course, rollno) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.section = section;
        this.course = course;
        this.rollno = rollno;
    }
}

// ------------------- REGISTER EVENT LISTENERS ----------------
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
    });
}
// ------------------- REGISTER STUDENT FUNCTION ----------------
async function registerStudent() {
    const newid = document.getElementById("reg_student_id").value.trim();
    const newname = document.getElementById("reg_student_name").value.trim();
    const newpass = document.getElementById("reg_student_password").value.trim();
    const newsec = document.getElementById("reg_student_section").value.trim();
    const newcourse = document.getElementById("reg_student_course").value.trim();
    const newrollno = document.getElementById("reg_student_roll").value.trim();

    // ---------------- VALIDATION ----------------
    if (newid === '' || newname === '' || newpass === '' || newsec === '' || newcourse === '' || newrollno === '') {
        alert('All fields are required!');
        return;
    }
    // ---------------- ADDITIONAL VALIDATION (C-style) ----------------
    if (isNaN(newid)) {
        alert('Student ID must be numeric!');
        return;
    }
    for (let i = 0; i < newname.length; i++) {
        let ch = newname[i];
        if (!((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || ch === ' ')) {
            alert('Name can only contain letters and spaces!');
            return;
        }
    }
    if (newpass.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
    }
    if (isNaN(newrollno)) {
        alert('Roll number must be numeric!');
        return;
    }

    // ---------------- SEND STUDENT DATA TO BACKEND AS JSON ----------------
    const data = new student(newid, newname, newpass, newsec, newcourse, newrollno);

    const response = await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/register_student.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
        // ---------------- CREATE STUDENT OBJECT AND REDIRECT ----------------
        const new_student = new student(newid, newname, newpass, newsec, newcourse, newrollno);
        document.getElementById('student_registration_form').reset();
        saveActiveStudent(new_student);
        openPage('studentdashboard.html');
    } else {
        alert(result.message);
    }
}

// ------------------- STUDENT LOGIN VALIDATION ----------------
const studentlogin = document.querySelector('#student_login_form');
if (studentlogin) {
    studentlogin.addEventListener('submit', function (e) {
        e.preventDefault();
        student_validate_login();
    });
}

async function student_validate_login() {
    const login_id = document.getElementById('student_id').value.trim();
    const login_pass = document.getElementById('student_password').value.trim();

    // ---------------- VALIDATION ----------------
    if (login_id === '' || login_pass === '') {
        alert('ID and password are required.');
        return;
    }

    // ---------------- SEND LOGIN DATA TO BACKEND AS JSON ----------------
    const data=new student(login_id,"",login_pass);

    const response = await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/fetch_dbstudent.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
        const studentData = result.user;
        const studentObj = new student(studentData.id, studentData.name, studentData.password, studentData.section, studentData.course, studentData.rollno);
        saveActiveStudent(studentObj);
        openPage('studentdashboard.html');
    } else {
        alert(result.message);
    }
}

// ------------------- TEACHER LOGIN VALIDATION ----------------
const event_login_teacher = document.querySelector('#teacher_login_form');
if (event_login_teacher) {
    event_login_teacher.addEventListener('submit', function (e) {
        e.preventDefault();
        teacher_validate_login();
    });
}

// ------------------- TEACHER REGISTRATION FUNCTION ----------------
async function teacher_register() {
    const teacher_fn = document.getElementById("teacher_fullname").value.trim();
    const teacher_email = document.getElementById("teacher_email").value.trim();
    const teacher_pass = document.getElementById("teacher_password").value.trim();

    // ---------------- SEND TEACHER DATA TO BACKEND AS JSON ----------------
    const data = {
        name: teacher_fn,
        email: teacher_email,
        password: teacher_pass
    };

    const response = await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/register_teacher.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();

    if (result.success) {
        // ---------------- CREATE TEACHER OBJECT AND REDIRECT ----------------
        const newteacher = new teacher(teacher_fn, teacher_email, teacher_pass);
        document.getElementById("teacher_registration_form").reset();
        saveActiveTeacher(newteacher);
        openPage("teacherdashboard.html");
    } else {
        alert(result.message);
    }
}

// ------------------- TEACHER LOGIN FUNCTION ----------------
async function teacher_validate_login() {
    const login_teacher_email = document.getElementById("login_teacher_email").value.trim();
    const login_teacher_pass = document.getElementById("login_teacher_password").value.trim();

    // ---------------- SEND LOGIN DATA TO BACKEND AS JSON ----------------
    const data= new teacher("",login_teacher_email,login_teacher_pass);
    const response = await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/fetchdb_teacher.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
        const teacherData = result.user;
        const teacherObj = new teacher(teacherData.name, teacherData.email, teacherData.password);
        saveActiveTeacher(teacherObj);
        openPage("teacherdashboard.html");
    } else {
        alert(result.message);
    }
}
// ------------------- START TEST EVENT ----------------
const startTest = document.getElementById('student_test_taking');
if (startTest) {  // ----------------------------YAHA PE SELCET DRWAER TO  SELCET THE TESTS
    startTest.addEventListener('submit', async function (e) {
        e.preventDefault();

        current_test_key = document.getElementById('testkey').value.trim();

        // ---------------- VALIDATE TEST KEY ----------------
        if (current_test_key === "") {
            alert("Test key cannot be empty!");
            return;
        }



        // ---------------- LOAD TEST DATA FROM BACKEND ----------------
        await loadtest();
        displayQuestion();
    });
}



// ------------------- LOAD TEST QUESTIONS ----------------

async function loadtest() {
    element = document.getElementById('student_test_taking');
    const key = new FormData();
    key.append('key', current_test_key);
    let response=await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/fetch_question.php', {
        method: 'POST',
        body: key
    });
    let text= await response.text();
    if (!text) {
    alert("Enter correct test key ! ");
    return;
}
    let parsed = JSON.parse(text);
    if (!parsed.success) {
        alert(parsed.message);
        return;
    }
    let data = parsed.questions;

        let curr, row;
        let i;
        for (i = 0; i < data.length; i++) {
            row = data[i];
            const ques = new Question(row.q_no, row.statement, row.opt1, row.opt2, row.opt3, row.opt4, ""); // No answer sent

            // ---------------- BUILD LINKED LIST OF QUESTIONS ----------------
            if (Test === null) {
                Test = ques;
                curr = Test;
            } else {
                curr.next = ques;
                curr.next.prev = curr;
                curr = curr.next;
            }
        }

        currentquestion = Test;

        // ---------------- COUNT QUESTIONS ----------------
        let questionCount = 0;
        let temp = Test;
        while (temp != null) {
            questionCount++;
            temp = temp.next;
        }

        // ---------------- INITIALIZE ANSWER ARRAY ----------------
        ans_resp = new Array(questionCount).fill(null);
    }



// ------------------- DISPLAY CURRENT QUESTION ----------------
function displayQuestion() {
    let attempt = 0;
    let unattempt = 0;
// ----------------------------------------- CALCULATE ATTEMPTED/UNATTEMPTED ----------------------------------
    for (let i = 0; i < ans_resp.length; i++) {
        if (ans_resp[i]!=null) attempt++;
        else unattempt++;
    }
    element = document.getElementById('page');
    const index = currentquestion.qno - 1;
    const previousAnswer = ans_resp[index];

    Title = document.getElementById('keyTag');
    Title.innerHTML = `<h1>QUIZ   :   ${current_test_key}</h1>`;

    // ------------------------- BUILD QUESTION NAVIGATION ------------------------------
    let navHtml = '<div id="questionNav"><h3>Questions</h3>';
    for (let i = 0; i < 50; i++) {
    // for (let i = 0; i < ans_resp.length; i++) {
        const isAnswered = ans_resp[i] !== null;
        navHtml += `<button class="nav-button ${isAnswered ? 'answered' : 'unanswered'}" data-qno="${i + 1}">${i + 1}</button>`;
    }
    navHtml += '</div>';

    // ---------------- DYNAMIC HTML GENERATION FOR QUESTION ----------------
    element.innerHTML = `
    ${navHtml}
    <div class="Stats">
        <p id="head"></p>
        <p >🟩Answered: ${attempt}<br>🟥Unanswered: ${unattempt}</p>
    </div>
    <div id="question">
        <div id="statement">${currentquestion.qno}) ${currentquestion.statement}</div>
        <div class="option"><label class="opt_text"><input class="option" name="response_answer" value='A' type="radio" ${previousAnswer === 'A' ? 'checked' : ''} required>${currentquestion.optionA}</label></div>
        <div class="option"><label class="opt_text"><input class="option" name="response_answer" value='B' type="radio" ${previousAnswer === 'B' ? 'checked' : ''} required>${currentquestion.optionB}</label></div>
        <div class="option"><label class="opt_text"><input class="option" name="response_answer" value='C' type="radio" ${previousAnswer === 'C' ? 'checked' : ''} required>${currentquestion.optionC}</label></div>
        <div class="option"><label class="opt_text"><input class="option" name="response_answer" value='D' type="radio" ${previousAnswer === 'D' ? 'checked' : ''} required>${currentquestion.optionD}</label></div>
        <button class="allbutton" id="previous_button">Previous</button>
        <button class="allbutton" id="next_button">Next</button>
        <button class="allbutton" id="endTest">Submit</button>
    </div>
    `;

    // ---------------- BUTTON EVENT HANDLERS ----------------
    const nextbttn = document.getElementById('next_button');
    const previousbttn = document.getElementById('previous_button');
    const calc_marks_trigger = document.getElementById('endTest');
    const navButtons = document.querySelectorAll('.nav-button');

    // ---------------- NAVIGATION BUTTON EVENT HANDLERS ----------------
    navButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            SaveResponse();
            const qno = parseInt(this.getAttribute('data-qno'));
            jumpToQuestion(qno);
        });
    });

    //----------------Confirm user choice -------------

    if (calc_marks_trigger) {
        calc_marks_trigger.addEventListener('click', function (e) {
        e.preventDefault();
        let confirmToSubmit= confirm("Note: No more attemps will be provide \nAre you sure to submit your test ! ");
        if(!confirmToSubmit)
        {
            return;
        }
            SaveResponse();
            submitTest();
        });
    }

    if (nextbttn) {
        nextbttn.addEventListener('click', function (e) {
            e.preventDefault();
            SaveResponse();
            nextQuestion();
        });
    }

    if (previousbttn) {
        previousbttn.addEventListener('click', function (e) {
            e.preventDefault();
            SaveResponse();
            previousQuestion();
        });
    }


}



// ------------------- SAVE CURRENT RESPONSE ----------------
function SaveResponse() {
    let index = currentquestion.qno - 1;
    const allOptions = document.getElementsByName('response_answer');
    for (let a = 0; a < allOptions.length; a++) {
        if (allOptions[a].checked) {
            ans_resp[index] = allOptions[a].value;
            break;
        }
    }
}

// ------------------- NAVIGATION ----------------
function nextQuestion() {
    if (currentquestion.next) currentquestion = currentquestion.next;
    else alert("LAST QUESTION!");
            displayQuestion();

}

function previousQuestion() {
    if (!currentquestion.prev) alert("FIRST QUESTION!");
    else currentquestion = currentquestion.prev;
            displayQuestion();

}

function jumpToQuestion(qno) {
    let temp = Test;
    while (temp != null) {
        if (temp.qno == qno) {
            currentquestion = temp;
            break;
        }
        temp = temp.next;
    }
    displayQuestion();
}

// ------------------- SUBMIT TEST ----------------
async function submitTest() {
    const responses = {};
    for (let i = 0; i < ans_resp.length; i++) {
        responses[i + 1] = ans_resp[i]; // q_no starts from 1
    }
    activeStudent=JSON.parse(localStorage.getItem('activeStudent'));
    console.log(activeStudent);
    const formData = new FormData();
    formData.append('key', current_test_key);
    formData.append('responses', JSON.stringify(responses));
    formData.append('student_id', activeStudent.id);
    formData.append('student_name', activeStudent.name);
    formData.append('student_section', activeStudent.section);
    formData.append('student_course', activeStudent.course);
    formData.append('student_rollno', activeStudent.rollno);

    const response = await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/submit_test.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.success) {
        alert(`Test submitted successfully! Your marks: ${result.marks}`);
        openPage('studentdashboard.html');
    } else {
        alert('Failed to submit test: ' + result.message);
    }
}
function AskUserBeforeReload()
{
    window.addEventListener('beforeunload', (e) => {
    if (1) {
        e.preventDefault();
        e.returnValue = ''; // triggers browser native dialog
    }
    });
}


// ------------------- SORT AND DISPLAY RESULTS ----------------
const result_trigger = document.getElementById('result');
if (result_trigger) {
    result_trigger.addEventListener('submit', function (e) {
        e.preventDefault();

        const testkey = document.getElementById('testkey').value.trim();
        const sorttype = document.getElementById('sortingDrawer').value;
        const sectionslected = document.getElementById('section').value.trim();
        const courseselected = document.getElementById('course').value.trim();

        if (testkey === "") {
            alert("No test key found!");
            return;
        }

        current_test_key = testkey;

        if (sorttype === "") {
            alert("A sorting method must be selected!");
            return;
        }

        if (sorttype === "sectionwise" && (courseselected === "" || sectionslected === "")) {
            alert("Section and course fields cannot be empty for sectionwise sorting.");
            return;
        }

        sortAndDisplay(sorttype, sectionslected, courseselected);
    });
}

// ------------------- SORT AND DISPLAY LOGIC ----------------
async function sortAndDisplay(sorttype, sectionslected, courseselected) {
    await fetchResult(sorttype, sectionslected, courseselected);
    AskUserBeforeReload();
    displayResult(studentsresult);
}

// ------------------- FETCH RESULT DATA ----------------
async function fetchResult(sorttype, sectionslected, courseselected) {
    const form = new FormData();
    form.append('key', current_test_key);
    form.append('sorttype', sorttype);
    form.append('section', sectionslected);
    form.append('course', courseselected);

    let response= await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/fetch_marks.php', { method: 'POST', body: form });
    let text= await response.text();
    if(!text)
    {
        alert("No results found!");
        return;
    }
    let parsed = JSON.parse(text);
    if (!parsed.success) {
        alert(parsed.message);
        return;
    }
    let data = parsed.results;
    studentsresult = [];
    for (let i = 0; i < data.length; i++) {
        studentsresult.push(data[i]);
        studentsresult[i].rollno = Number(String(studentsresult[i].rollno).trim());
        studentsresult[i].marks = Number(String(studentsresult[i].marks).trim()) ;
    }

}

// ------------------- DISPLAY RESULT TABLE ----------------
function displayResult(arr) {
    const page = document.getElementById('viewpage');
    let table = `
    <h1 id="tablehead">Score: ${current_test_key}</h1>
    <table class="styled-table">
        <thead>
            <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Section</th>
                <th>Course</th>
                <th>Class Roll No</th>
                <th>Marks</th>
            </tr>
        </thead>
        <tbody>`;

    for (let i = 0; i < arr.length; i++) {
        table += `
        <tr>
            <td>${arr[i].id}</td>
            <td>${arr[i].name}</td>
            <td>${arr[i].section}</td>
            <td>${arr[i].course}</td>
            <td>${arr[i].rollno}</td>
            <td>${arr[i].marks}</td>
        </tr>`;
    }

    table += `</tbody></table>`;
    page.innerHTML = table;
}

// // ------------------- DOWNLOAD CSV FUNCTION ----------------
// function downloadCSV(data, testKey) {
//     if (data.length === 0) {
//         alert("No data to download!");
//         return;
//     }

//     // Create CSV header
//     let csvContent = "Student ID,Name,Section,Course,Class Roll No,Marks\n";

//     // Add data rows
//     data.forEach(row => {
//         csvContent += `"${row.id}","${row.name}","${row.section}","${row.course}",${row.rollno},${row.marks}\n`;
//     });

//     // Create blob and download
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", `${testKey}_results.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// }


