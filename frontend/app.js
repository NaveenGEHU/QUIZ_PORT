// ---------------- OPEN NEW PAGE FUNCTION ----------------
function openPage(url) {
    window.location.href = url;
}
// let resss
let current_test_key='';
let Test = null;
let currentquestion=null;
let activeStudent;
let ans_resp=[];

//---------------------------- getting ending of the test creation trigger------------------------------------------------


 async function savetest() {
    while (Test != null) {
        // console.log(Test.statement,Test.optionA,Test.optionB,Test.optionC,Test.optionD,Test.answer);
        const questionData = new FormData();
        questionData.append('key', current_test_key);
        questionData.append('statement', Test.statement);
        questionData.append('opt1', Test.optionA);
        questionData.append('opt2', Test.optionB);
        questionData.append('opt3', Test.optionC);
        questionData.append('opt4', Test.optionD);
        questionData.append('answer', Test.answer);

        await fetch('http://localhost/myprojects/GIT/PBL_DS/server/create_test.php',
            {
                method: 'Post', body: questionData
            });
        Test = Test.next;
    }
}

function saveActiveStudent(a)
{
    activeStudent=a;
    localStorage.setItem('activeStudent',JSON.stringify(activeStudent));
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
        Test = new Question("",statement, opt1, opt2, opt3, opt4, ans);
        return;
    }
    let last = Test;
    while (last.next != null) {
        last = last.next;
    }
    last.next = new Question("",statement, opt1, opt2, opt3, opt4, ans);
    last.next.prev = last;
    document.getElementById("add_question_form").reset();
}
let students = [];
let teachers = [];

//--------------------------Question Class------------------------------
class Question {
    qno="";
    statement = "";
    optionA = "";
    optionB = "";
    optionC = "";
    optionD = "";
    answer = "";
    next = null;
    prev = null;
    constructor(qno="",statement, optionA, optionB, optionC, optionD, answer) {
        this.qno=qno;
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
    marks;
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


fetch('http://localhost/myprojects/GIT/PBL_DS/server/fetchdb_teacher.php')
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
fetch('http://localhost/myprojects/GIT/PBL_DS/server/fetch_dbstudent.php')   // ✅ fixed path
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

// const studentbutton=document.getElementById("student_button");
// if(studentbutton)
// {
//     studentbutton.addEventListener('oncl')
// }

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
    fetch('http://localhost/myprojects/GIT/PBL_DS/server/register_student.php', {   // ✅ fixed path
        method: 'POST',
        body: formData
    });
        // .then(res => res.text())
        // .then(result => {
        //     alert(result);

            students.push(new_student);
            document.getElementById('student_registration_form').reset();
            saveActiveStudent(new_student);
            openPage('studentdashboard.html');
        // })
        // .catch(err => console.error('Error:', err));
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
            saveActiveStudent(students[i]);
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
    fetch('http://localhost/myprojects/GIT/PBL_DS/server/register_teacher.php', { method: 'POST', body: postform })
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


//---------------------------------------------------- LOADING THE TEST---------------------------------------------------------------------- 

const startTest=document.getElementById('student_test_taking');
if(startTest)
{                                                               // ADD INNER HTML HERE TO EDIT AND STYLR QUESTION APPERARANCE
startTest.addEventListener('submit',function(e)
{   
    e.preventDefault();
    current_test_key=document.getElementById('testkey').value.trim();
    if(current_test_key)
        { 
            loadtest(Test);
        }
});
}


async function loadtest() {
    element=document.getElementById('student_test_taking');
    key=new FormData();
    key.append('key',current_test_key);
    await fetch('http://localhost/myprojects/GIT/PBL_DS/server/fetch_question.php'
        ,{method:'Post',body:key}
    )
    .then(response => {
        // if(!response.ok)
        // {
        //     throw new Error(response.statusText);
        // }
        // console.log(response.json());
        return response.json();
    })
    .then( data=>
    {
        // console.log(data);
        let curr,row;
        let i;
        for( i=0 ;i<data.length;i++)
        {   
            row=data[i];
            const ques= new Question(row.id, row.statement , row.opt1 , row.opt2 , row.opt3  , row.opt4 , row.answer ); 
            if(Test===null)
            {
                Test=ques;
                curr=Test;
            }
            else{
                curr.next=new Question(row.id ,row.statement,row.opt1,row.opt2,row.opt3,row.opt4,row.answer);
                curr.next.prev=curr;
                curr=curr.next;
            }
        }
        currentquestion=Test;
        activeStudent=JSON.parse(localStorage.getItem('activeStudent'));
        ans_resp=Array(i).fill(null);
        console.log("LEMGHT OF ARRAY OF NASWER :",ans_resp.length);
        console.log("ARRAY  content  :",ans_resp);
        console.log("Student her is:",activeStudent);
        displayQuestion();
    });
    // .catch(error =>
    // {
    //     console.error("Error",error);
    // });
}
// let responses=[];
function displayQuestion() 
{   
    console.log("THIS IS IN CURRNT QUES\n");
    console.log(currentquestion);
    element=document.getElementById('page');
    // preventDefault();
    element.innerHTML=`
    <div id = "question">
    <div id="statement"> ${currentquestion.qno} ) ${currentquestion.statement}</div>
    <label><input class  = "option"  name="response_answer" value ='A'  type="radio" required >${currentquestion.optionA} <div></div></label><br>
    <label><input class  = "option"  name="response_answer" value ='B'  type="radio" required>${currentquestion.optionB }<div></div></label><br>
    <label><input class  = "option"  name="response_answer" value ='C'  type="radio" required>${currentquestion.optionC }<div></div></label><br>
    <label><input class  = "option"  name="response_answer" value ='D'  type="radio" required>${currentquestion.optionD }<div></div></label><br>
    <button id="previous_button">Previous</button>
    <button id="next_button" >Next</button>
    <button id="endTest"> Submit</button>
    </div>
      `;
      //--------------------------------END TEST TRIGGEER---------------------
    calc_marks_trigger =document.getElementById('endTest');
    if(calc_marks_trigger)
    {
        
        calc_marks_trigger.addEventListener('click',function(e)
        {
            e.preventDefault();
            SaveResponse();
            CalculateMarks(Test);
            element.innerHTML=`
                <h1> TEST HAS BEEN SUBMITTED</h1><br>
                <h2> Your Score :${activeStudent.marks}</h2>
            `;
            return;   
        });
    }
    nextbttn=document.getElementById('next_button');
    if(nextbttn)
    {
        nextbttn.addEventListener('click',function(e){
            e.preventDefault();
            SaveResponse();
            nextQuestion();
            displayQuestion();
        });
    }

    previousbttn=document.getElementById('previous_button');
        if(previousbttn){
        previousbttn.addEventListener('click',function(e){
            e.preventDefault();
            SaveResponse();
            previousQuestion();
            displayQuestion();
            });
        }
    
}

function CalculateMarks(temp)
{   activeStudent.marks=0;
    if(temp===null)
    {
        console.log("NO QUESTIONS HERE");
    }
    for(let i=0 ;i<ans_resp.length && temp!==null ;i++)
    {
        if((ans_resp[i]) && ans_resp[i]===temp.answer)
        {
            activeStudent.marks=activeStudent.marks+1;
        }
        temp=temp.next;
    }
    console.log("Marks of this student is ",activeStudent.marks); /// delet
    console.log("Answr array insde aray ",ans_resp);                            //delte
    SaveMarks();
}

function SaveMarks()
{
    const studentresultform= new FormData();
    studentresultform.append('key',current_test_key);
    studentresultform.append('name',activeStudent.name);
    studentresultform.append('id',activeStudent.id);
    studentresultform.append('section',activeStudent.section);
    studentresultform.append('course',activeStudent.course);
    studentresultform.append('rollno',activeStudent.rollno);
    studentresultform.append('marks',activeStudent.marks);
    fetch('http://localhost/myprojects/GIT/PBL_DS/server/send_marks.php',{method:'Post',body:studentresultform});
}

function nextQuestion()
{
    
    if(currentquestion.next)
            {
                currentquestion=currentquestion.next;
            }
            else{
                alert("LAST QUESTION");
            }
}
function previousQuestion()
{
     if(!currentquestion.prev)
        {
            alert("1st Question !");
        }
        else{
            currentquestion=currentquestion.prev;
        }
}
function SaveResponse()
{
    let index= currentquestion.qno-1;
    allOptions= document.getElementsByName('response_answer');
    for(let a=0;a<allOptions.length;a++)
    {
        if(allOptions[a].checked  == true)
        {
            ans_resp[index]=allOptions[a].value;
            break;
        }
    }
}

const result_trigger=document.getElementById('result');
if(result_trigger)
{
    result_trigger.addEventListener('submit',function(e){
    e.preventDefault();
    const testkey=document.getElementById('testkey').value.trim();
    const sorttype=document.getElementById('sortingDrawer').value;
    const sectionslected=document.getElementById('section').value.trim();
    const courseselected=document.getElementById('course').value.trim();
    if(testkey =='')
    {
        alert("No test key found!");
        return;
    }
    current_test_key=testkey;
    if(sorttype==='')
    {
         alert("A sorting method must be selcted!");
         return;
    }
    if ( sorttype==="sectionwise" && (courseselected==='' || sectionslected===''   ))
    {
        alert("section and couse feild cant be empty is also required");
        return;
    } 
    sortAndDisplay(sorttype, sectionslected, courseselected);
    });
}

async function sortAndDisplay(sorttype, sectionslected, courseselected)
{
    await fetchResult();
    if(sorttype=="markswise")
    {
        quickSortMarks(studentsresult,0,studentsresult.length-1);
        console.log("Sorted by marks:",studentsresult );
        displayResult(studentsresult);
    }
    else if(sorttype=="sectionwise")
    {
        sortedbysection = [];
        for (let i = 0; i < studentsresult.length; i++) {
            if (studentsresult[i].section === sectionslected && studentsresult[i].course === courseselected) {
                sortedbysection.push(studentsresult[i]);
            }
        }
        quickSortRollNo(sortedbysection, 0, sortedbysection.length - 1);
        console.log("Sorted by section and rollno:", sortedbysection);
        displayResult(sortedbysection);
    }
}
let studentsresult=[];
let sortedbymarks=[];
let sortedbysection=[];
function displayResult(arr)
{
    console.log("Inside display :",arr);
    page=document.getElementById('fullpage');
    let table=`
    <h1></h1>
    <table class="styled-table" >
    <thead>
        <tr>
            <th> Student id </th>
            <th> Name </th>
            <th> Section </th>
            <th> Course </th>
            <th> Class Roll no </th>
            <th> Marks </th>
        </tr>
    </thead>
    <tbody>`;
    for(let i=0; i<arr.length ;i++)
    {
    table+=`
    <tr>
        <td>${arr[i].id}</td>
        <td>${arr[i].name}</td>
        <td>${arr[i].section}</td>
        <td>${arr[i].course}</td>
        <td>${arr[i].rollno}</td>
        <td>${arr[i].marks}</td>
    </tr>
    `;
    }
    table+=`</tbody></table>`;
    page.innerHTML=table;

}



async function fetchResult()
{   
    const form=new FormData();
    form.append('key',current_test_key);
    await fetch('http://localhost/myprojects/GIT/PBL_DS/server/fetch_marks.php',{method:'Post',body:form})
    .then(
        response=>{
            return response.json();
        })
        .then(data=>{
        console.log("RaR Data :",data);
        studentsresult=[];
        for(let i=0;i<data.length;i++)
        {
            studentsresult.push(data[i]);
        }
    });
}
/*  .then(response => {
        // if(!response.ok)
        // {
        //     throw new Error(response.statusText);
        // }
        // console.log(response.json());
        return response.json(); */

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
        if (arr[j].marks >= pivot) {  // descending
            i++;
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

// ----------------- QuickSort for rollno -----------------
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
        if (arr[j].rollno <= pivot) { // ascending
            i++;
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}








/* */
// function sortBySection(arr, section) {
//     // Step 1: Collect students of that section
    
//     let count = 0;
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i].section === section) {
//             sectionArr[count] = arr[i];
//             count++;
//         }
//     }

//     // Step 2: Sort sectionArr by roll number ascending
//     quickSort(sectionArr, 0, sectionArr.length - 1, "rollno", "asc");
// }


// function quickSort(arr, low, high, key, order) {
//     if (low < high) {
//         let pi = partition(arr, low, high, key, order);
//         quickSort(arr, low, pi - 1, key, order);
//         quickSort(arr, pi + 1, high, key, order);
//     }
// }

// function partition(arr, low, high, key, order) {
//     let pivot = arr[high][key];
//     let i = low - 1;
//     for (let j = low; j <= high - 1; j++) {
//         let condition = (order === "desc") ? (arr[j][key] >= pivot) : (arr[j][key] <= pivot);
//         if (condition) {
//             i++;
//             let temp = arr[i];
//             arr[i] = arr[j];
//             arr[j] = temp;
//         }
//     }
//     let temp = arr[i + 1];
//     arr[i + 1] = arr[high];
//     arr[high] = temp;
//     return i + 1;
// }

