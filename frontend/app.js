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
        console.log("Saving question:", questionNode.statement, "=>", text);

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
                console.log("Active teacher is:", activeTeacher);

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
    console.log("RESPONSE:", response);
    let data=[];
    data=await response.json();
    console.log("DATA:", data);
    // let textInside= await response.text();
    // if(!textInside)
    // {
    //     alert("No test keys found!");
    //     return;
    // }
    // console.log("TEST KEY AYEGI");
    // console.log("RAW DATA:", data);
    // data =await JSON.parse(textInside);
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
    console.log("TEST KEYS:", testKeys);
    for( let a of testKeys )
    {
        Table+= `<tr><td> ${a}</td></tr>`;
    }
   
    // console.log("test key lenght = " , testKeys.lenght);
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
        console.log("Qno :", qno);
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
    console.log("Answer:", ans);

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

// ------------------- STUDENTS & TEACHERS ARRAYS ----------------
let students = [];
let teachers = [];

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

// ------------------- FETCH TEACHER DATA FROM BACKEND ----------------
fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/fetchdb_teacher.php')
    .then(response_teacher => response_teacher.json())
    .then(data_teacher => {
        // Populate teachers array with teacher objects
        teachers = data_teacher.map(row_teacher => new teacher(row_teacher.name, row_teacher.email, row_teacher.password));
    });

// ------------------- FETCH STUDENT DATA FROM BACKEND ----------------
fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/fetch_dbstudent.php')
    .then(response => response.json())
    .then(data => {
        // Populate students array with student objects
        students = data.map(row => new student(row.id, row.name, row.password, row.section, row.course, row.rollno));
    });

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
    console.log("COUSRSE",newcourse);
    const newrollno = document.getElementById("reg_student_roll").value.trim();

    const new_student = new student(newid, newname, newpass, newsec, newcourse, newrollno);

    // ---------------- VALIDATE REQUIRED FIELDS ----------------
    if (!newid || !newname || !newpass || !newsec || !newcourse || !newrollno) {
        alert("All fields are required! ❌");
        return;
    }

    // ---------------- VALIDATE NUMERIC STUDENT ID ----------------
    for (let i = 0; i < newid.length; i++) {
        let c = newid[i];
        if (!(c >= 0 && c <= 9)) {
            alert("Student ID must be numeric!");
            return;
        }
    }

    // ---------------- VALIDATE NAME ----------------
    for (let i = 0; i < newname.length; i++) {
        let c = newname[i];
        if (!((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == ' ')) {
            alert("Name can only contain letters and spaces!");
            return;
        }
    }

    // ---------------- VALIDATE PASSWORD LENGTH ----------------
    if (newpass.length < 6) {
        alert("Password must be at least 6 characters!");
        return;
    }

    // ---------------- VALIDATE ROLL NUMBER ----------------
    for (let i = 0; i < newrollno.length; i++) {
        let c = newrollno[i];
        if (!(c >= 0 && c <= 9)) {
            alert("Roll number must be numeric!");
            return;
        }
    }

    // ---------------- DUPLICATE STUDENT CHECK ----------------
    for (let i = 0; i < students.length; i++) {
        if (students[i].id == newid || (students[i].rollno == newrollno && students[i].section == newsec && students[i].course == newcourse)) {
            alert("REGISTRATION FAILED! Account already exists!");
            return;
        }
    }

    // ---------------- SEND STUDENT DATA TO BACKEND ----------------
    const formData = new FormData();
    formData.append('id', newid);
    formData.append('name', newname);
    formData.append('password', newpass);
    formData.append('section', newsec);
    formData.append('course', newcourse);
    formData.append('rollno', newrollno);

    await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/register_student.php', {
        method: 'POST',
        body: formData
    });

    // ---------------- UPDATE LOCAL DATA AND REDIRECT ----------------
    students.push(new_student);
    document.getElementById('student_registration_form').reset();
    saveActiveStudent(new_student);
    openPage('studentdashboard.html');
}

// ------------------- STUDENT LOGIN VALIDATION ----------------
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
        if (login_id == students[i].id && login_pass != students[i].password) {
            alert("Incorrect Password");
            return;
        } else if (login_id == students[i].id && login_pass == students[i].password) {
            saveActiveStudent(students[i]);
            openPage('studentdashboard.html');
            return;
        }
    }

    alert("Account does not exist. Please create one!");
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

    const newteacher = new teacher(teacher_fn, teacher_email, teacher_pass);

    // ---------------- VALIDATE REQUIRED FIELDS ----------------
    if (!teacher_fn || !teacher_email || !teacher_pass) {
        alert("All fields are required! ❌");
        return;
    }

    // ---------------- VALIDATE NAME ----------------
    for (let i = 0; i < teacher_fn.length; i++) {
        let c = teacher_fn[i];
        if (!((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == ' ')) {
            alert("Name can only contain letters and spaces!");
            return;
        }
    }

    // ---------------- VALIDATE PASSWORD ----------------
    if (teacher_pass.length < 6) {
        alert("Password must be at least 6 characters!");
        return;
    }

    // ---------------- DUPLICATE CHECK ----------------
    for (let i = 0; i < teachers.length; i++) {
        if (teacher_email == teachers[i].teacher_email) {
            alert("Account already exists! Please login.");
            return;
        }
    }

    // ---------------- SEND TEACHER DATA TO BACKEND ----------------
    const postform = new FormData();
    postform.append('name', teacher_fn);
    postform.append('email', teacher_email);
    postform.append('password', teacher_pass);

    await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/register_teacher.php', { method: 'POST', body: postform });

    // ---------------- UPDATE LOCAL DATA AND REDIRECT ----------------
    teachers.push(newteacher);
    document.getElementById("teacher_registration_form").reset();
    saveActiveTeacher(newteacher);
    openPage("teacherdashboard.html");
}

// ------------------- TEACHER LOGIN FUNCTION ----------------
function teacher_validate_login() {
    const login_teacher_email = document.getElementById("login_teacher_email").value.trim();
    const login_teacher_pass = document.getElementById("login_teacher_password").value.trim();

    for (let i = 0; i < teachers.length; i++) {
        if (teachers[i].teacher_email == login_teacher_email && teachers[i].teacher_password != login_teacher_pass) {
            alert("Incorrect Password");
            return;
        }

        if (teachers[i].teacher_email == login_teacher_email && teachers[i].teacher_password == login_teacher_pass) {
            saveActiveTeacher(teachers[i]);
            openPage("teacherdashboard.html");
            return;
        }
    }

    alert("Account does not exist! Register first.");
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
    let data=[];
    data=await JSON.parse(text)
    // data=await response.json();
    console.log(data);     
  
        let curr, row;
        let i;
        for (i = 0; i < data.length; i++) {
            row = data[i];
            const ques = new Question(row.q_no, row.statement, row.opt1, row.opt2, row.opt3, row.opt4, row.answer);
            
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

        // ---------------- INITIALIZE STUDENT DATA AND RESPONSE ARRAY ----------------
        activeStudent = JSON.parse(localStorage.getItem('activeStudent'));
        ans_resp = Array(i).fill(null);
        console.log("Response array length:", ans_resp.length);                  //      testing
        console.log("QUESTIONS :",Test);
        displayQuestion();
    }



// ------------------- DISPLAY CURRENT QUESTION ----------------
function displayQuestion() {
    console.log("responses : ",ans_resp);                  ///                       testing 
    let attempt = 0;
    let unattempt = 0;

    // ---------------- CALCULATE ATTEMPTED/UNATTEMPTED ----------------
    for (let i = 0; i < ans_resp.length; i++) {
        if (ans_resp[i]!=null) attempt++;
        else unattempt++;
    }

    element = document.getElementById('page');
    const index = currentquestion.qno - 1;
    const previousAnswer = ans_resp[index];

    Title = document.getElementById('keyTag');
    Title.innerHTML = `<h1>QUIZ: ${current_test_key}</h1>`;

    // ---------------- DYNAMIC HTML GENERATION FOR QUESTION ----------------
    element.innerHTML = `
    <div class="Stats">
        <p id="head"></p>
        <p id="ans">Answered: ${attempt}</p>
        <p id="unans">Unanswered: ${unattempt}</p>
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

    if (calc_marks_trigger) {
        calc_marks_trigger.addEventListener('click', function (e) {
            e.preventDefault();
            SaveResponse();
            CalculateMarks(Test);
            element.innerHTML = `<h1 id='afterSubmit'>Your responses have been submitted.</h1>`;
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

// ------------------- CALCULATE MARKS ----------------
function CalculateMarks(temp) {
    activeStudent.marks = 0;
    if (temp === null) {
        console.log("No questions available for calculation.");
        return;
    }

    for (let i = 0; i < ans_resp.length && temp !== null; i++) {
        if (ans_resp[i] && ans_resp[i] === temp.answer) activeStudent.marks++;
        temp = temp.next;
    }

    SaveMarks();
}

// ------------------- SAVE MARKS TO DATABASE ----------------
function SaveMarks() {
    const studentresultform = new FormData();
    studentresultform.append('key', current_test_key);
    studentresultform.append('name', activeStudent.name);
    studentresultform.append('id', activeStudent.id);
    studentresultform.append('section', activeStudent.section);
    studentresultform.append('course', activeStudent.course);
    studentresultform.append('rollno', activeStudent.rollno);
    studentresultform.append('marks', activeStudent.marks);

    fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/send_marks.php', { method: 'POST', body: studentresultform });
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
    await fetchResult();

    if (sorttype === "markswise") {
        quickSortMarks(studentsresult, 0, studentsresult.length - 1);
        displayResult(studentsresult);
    } else if (sorttype === "sectionwise") {
        sortedbysection = [];
        for (let i = 0; i < studentsresult.length; i++) {
            if (studentsresult[i].section === sectionslected && studentsresult[i].course === courseselected) {
                sortedbysection.push(studentsresult[i]);
            }
        }
        quickSortRollNo(sortedbysection, 0, sortedbysection.length - 1);
        displayResult(sortedbysection);
    }
}

// ------------------- FETCH RESULT DATA ----------------
async function fetchResult() {
    const form = new FormData();
    form.append('key', current_test_key);

    let response= await fetch('http://localhost/myprojects/GIT/QUIZ_PORT/server/fetch_marks.php', { method: 'POST', body: form });
    let text= await response.text();
    if(!text)
    {
        alert("No results found!");
        return;
    }
    let data=[];
    data=JSON.parse(text);
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

// ------------------- SORTING FUNCTIONS ----------------
function quickSortMarks(arr, low, high) {
    if (low < high) {
        let pi = partitionMarks(arr, low, high);
        quickSortMarks(arr, low, pi - 1);
        quickSortMarks(arr, pi + 1, high);
    }
}

function partitionMarks(arr, low, high) {
    let pivot = arr[high].marks;
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (arr[j].marks >= pivot) {  // Descending order
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

function quickSortRollNo(arr, low, high) {
    if (low < high) {
        let pi = partitionRollNo(arr, low, high);
        quickSortRollNo(arr, low, pi - 1);
        quickSortRollNo(arr, pi + 1, high);
    }
}

function partitionRollNo(arr, low, high) {
    let pivot = arr[high].rollno;
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (arr[j].rollno <= pivot) { // Ascending order
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}
