// ---------------- OPEN NEW PAGE FUNCTION ----------------
function openPage(url) {
    window.location.href = url;
}
let current_test_key='';
let Test = null;
let currentquestion=null;
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
    marks=0;
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


async function loadtest(Test) {
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
        for(let i=0 ;i<data.length;i++)
        {   
            row=data[i];
            const ques= new Question(row.id, row.statement , row.opt1 , row.opt2 , row.opt3  , row.opt4 , row.answer ); 
            if(Test==null)
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
        displayQuestion();
    });
    // .catch(error =>
    // {
    //     console.error("Error",error);
    // });
}

function displayQuestion() 
{   
    console.log("THIS IS IN CURRNT QUES\n");
    console.log(currentquestion);
    element=document.getElementById('page');
    // preventDefault();
    element.innerHTML=`
    <div id = "question">
    <div id="statement"> ${currentquestion.qno}${currentquestion.statement}</div>
    <label><input class  = "option"  name="response" id="A" type="radio" >${currentquestion.optionA} <div></div></label><br>
    <label><input class  = "option"  name="response" id="B" type="radio" >${currentquestion.optionB }<div></div></label><br>
    <label><input class  = "option"  name="response" id="C" type="radio" >${currentquestion.optionC }<div></div></label><br>
    <label><input class  = "option"  name="response" id="D" type="radio" >${currentquestion.optionD }<div></div></label><br>
    <button id="previous_button">Previous</button>
    <button id="next_button" >Next</button>
    <button id="endTest"> Submit</button>
    </div>
      `;
      nextbttn=document.getElementById('next_button');
    if(nextbttn)
    {
        nextbttn.addEventListener('click',function(e){
            e.preventDefault();
            if(currentquestion.next)
            {
                currentquestion=currentquestion.next;
            }
            else{
                alert("LAST QUESTION");
            }
            displayQuestion();
        });
    }

    previousbttn=document.getElementById('previous_button');
        if(previousbttn){
        previousbttn.addEventListener('click',function(e){
        e.preventDefault();
        if(!currentquestion.prev)
        {
            alert("1st Question !");
        }
        else{
            
            currentquestion=currentquestion.prev;
            displayQuestion();
            }
        });
    }
}
    
// TEST DISPLAY NHI HORA HAI console pe hor ahai

// function nextQuestion()
// {
//     currentquestion=currentquestion.next;
// }
// function previousQuestion()
// {
//     currentquestion=currentquestion.prev;
// }

/* */
arr=[]             // student array after fetching the marks from database;
sectionArr = [];// global array 
function sortBySection(arr, section) {
    // Step 1: Collect students of that section
    
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].section === section) {
            sectionArr[count] = arr[i];
            count++;
        }
    }

    // Step 2: Sort sectionArr by roll number ascending
    quickSort(sectionArr, 0, sectionArr.length - 1, "rollno", "asc");
}


function quickSort(arr, low, high, key, order) {
    if (low < high) {
        let pi = partition(arr, low, high, key, order);
        quickSort(arr, low, pi - 1, key, order);
        quickSort(arr, pi + 1, high, key, order);
    }
}

function partition(arr, low, high, key, order) {
    let pivot = arr[high][key];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        let condition = (order === "desc") ? (arr[j][key] >= pivot) : (arr[j][key] <= pivot);
        if (condition) {
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

